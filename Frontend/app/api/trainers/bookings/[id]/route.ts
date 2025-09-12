import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  addDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Booking {
  id: string;
  trainerId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// Get bookings for a trainer
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id;
    console.log('Fetching bookings for trainer:', trainerId);

    // Get all bookings for this trainer
    const q = query(
      collection(db, 'bookings'), 
      where('trainerId', '==', trainerId)
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      } as Booking);
    });

    console.log(`Found ${bookings.length} bookings for trainer ${trainerId}`);

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

// Create a new booking
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id;
    const body = await request.json();
    const { clientName, clientEmail, date, time } = body;

    console.log('Creating booking for trainer:', trainerId, { date, time });

    // Validate required fields
    if (!clientName || !clientEmail || !date || !time) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if the slot is already booked
    const existingBookingQuery = query(
      collection(db, 'bookings'),
      where('trainerId', '==', trainerId),
      where('date', '==', date),
      where('time', '==', time),
      where('status', '!=', 'cancelled')
    );

    const existingBookings = await getDocs(existingBookingQuery);
    
    if (!existingBookings.empty) {
      return NextResponse.json({
        success: false,
        message: 'This time slot is already booked'
      }, { status: 400 });
    }

    // Create new booking
    const bookingData = {
      trainerId,
      clientName,
      clientEmail,
      date,
      time,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'bookings'), bookingData);

    console.log('Booking created successfully:', docRef.id);

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: docRef.id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}