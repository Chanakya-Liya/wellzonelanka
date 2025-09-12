import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BookingRequest {
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  userId?: string;
  trainerName?: string;
  serviceType?: string;
  notes?: string;
}

// Create a new booking
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: trainerId } = await params;
    const body: BookingRequest = await request.json();
    
    const { 
      clientName, 
      clientEmail, 
      date, 
      time, 
      userId = `user_${Date.now()}`,
      trainerName = 'Selected Trainer',
      serviceType = 'Personal Training Session',
      notes = ''
    } = body;

    console.log('Creating booking for trainer:', trainerId, { date, time });

    // Validate required fields
    if (!clientName || !clientEmail || !date || !time) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: clientName, clientEmail, date, time'
      }, { status: 400 });
    }

    // Try to validate trainer exists (non-blocking)
    let trainer = null;
    try {
      console.log('Looking for trainer with ID:', trainerId);
      const trainerDoc = await getDoc(doc(db, 'trainers', trainerId));
      
      if (trainerDoc.exists()) {
        trainer = { id: trainerDoc.id, ...trainerDoc.data() };
        console.log('Found trainer via direct lookup:', { id: trainer.id });
      } else {
        // Try alternative lookup
        const trainersQuery = query(
          collection(db, 'trainers'),
          where('id', '==', trainerId)
        );
        const trainersSnapshot = await getDocs(trainersQuery);
        
        if (!trainersSnapshot.empty) {
          const trainerData = trainersSnapshot.docs[0];
          trainer = { id: trainerData.id, ...trainerData.data() };
          console.log('Found trainer via query:', { id: trainer.id });
        } else {
          console.log('Trainer not found, but proceeding with booking');
          trainer = { id: trainerId, name: trainerName };
        }
      }
    } catch (error) {
      console.error('Error fetching trainer (non-critical):', error);
      // Proceed with booking anyway
      trainer = { id: trainerId, name: trainerName };
    }

    // Check for existing bookings with simplified query
    console.log('Checking for existing bookings...');
    
    let existingBookings: any[] = [];
    let retries = 3;
    
    while (retries > 0) {
      try {
        // Simple query to avoid index requirements
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('trainerId', '==', trainerId),
          where('date', '==', date)
        );
        
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          // Filter in memory to avoid complex indexes
          if (booking.time === time && booking.status !== 'cancelled') {
            existingBookings.push({
              id: doc.id,
              ...booking
            });
          }
        });

        break; // Success, exit retry loop
      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // If it's an index error, proceed without checking (first booking)
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          console.log('Index not available, proceeding with booking (likely first booking for this trainer/date)');
          existingBookings = [];
          break;
        }
        
        throw error;
      }
    }

    if (existingBookings.length > 0) {
      console.log('Existing booking found:', existingBookings[0]);
      return NextResponse.json({
        success: false,
        message: 'This time slot is already booked. Please choose a different time.'
      }, { status: 409 });
    }

    console.log('No existing bookings found, proceeding with booking creation...');

    // Create appointment in appointments collection
    const appointmentData = {
      userId,
      userName: clientName,
      userEmail: clientEmail,
      trainerId,
      trainerName,
      date,
      time,
      serviceType,
      notes,
      status: 'pending' as const,
      createdAt: Timestamp.now().toDate().toISOString()
    };

    let appointmentRef;
    retries = 3;
    
    while (retries > 0) {
      try {
        appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);
        break;
      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying appointment creation... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    console.log('Appointment created successfully with ID:', appointmentRef?.id);

    // Also create legacy booking for backward compatibility
    const legacyBookingData = {
      trainerId,
      clientName,
      clientEmail,
      date,
      time,
      status: 'pending' as const,
      createdAt: Timestamp.now().toDate().toISOString()
    };

    try {
      const legacyRef = await addDoc(collection(db, 'bookings'), legacyBookingData);
      console.log('Legacy booking created with ID:', legacyRef.id);
    } catch (error) {
      console.warn('Failed to create legacy booking (non-critical):', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      appointmentId: appointmentRef?.id,
      appointment: {
        id: appointmentRef?.id,
        ...appointmentData
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating appointment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get bookings for a trainer (legacy support)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: trainerId } = await params;
    
    let bookings: any[] = [];
    let retries = 3;
    
    while (retries > 0) {
      try {
        // Get from appointments collection
        const appointmentsQuery = query(
          collection(db, 'appointments'), 
          where('trainerId', '==', trainerId)
        );
        
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        appointmentsSnapshot.forEach((doc) => {
          bookings.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Also get legacy bookings
        const legacyQuery = query(
          collection(db, 'bookings'), 
          where('trainerId', '==', trainerId)
        );
        
        const legacySnapshot = await getDocs(legacyQuery);
        
        legacySnapshot.forEach((doc) => {
          // Add legacy bookings if not already in appointments
          const legacyBooking = doc.data();
          const exists = bookings.some(b => 
            b.date === legacyBooking.date && 
            b.time === legacyBooking.time &&
            b.clientEmail === legacyBooking.clientEmail
          );
          
          if (!exists) {
            bookings.push({
              id: doc.id,
              ...legacyBooking,
              userName: legacyBooking.clientName,
              userEmail: legacyBooking.clientEmail,
              isLegacy: true
            });
          }
        });

        break; // Success
      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    // Sort by creation date
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      bookings: bookings
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}