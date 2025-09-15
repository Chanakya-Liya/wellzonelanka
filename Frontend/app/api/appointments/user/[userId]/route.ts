import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get appointments for a specific user
export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    console.log('Fetching appointments for user:', userId);

    let appointments: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get appointments from the appointments collection
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          appointments.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Also check legacy bookings collection
        const legacyRef = collection(db, 'bookings');
        const legacyQuery = query(
          legacyRef,
          where('clientEmail', '==', userId) // In case userId is email
        );

        try {
          const legacySnapshot = await getDocs(legacyQuery);
          legacySnapshot.forEach((doc) => {
            const legacyData = doc.data();
            // Convert legacy format to new format
            const exists = appointments.some(apt => 
              apt.date === legacyData.date && 
              apt.time === legacyData.time &&
              apt.trainerId === legacyData.trainerId
            );

            if (!exists) {
              appointments.push({
                id: doc.id,
                userId: userId,
                userName: legacyData.clientName,
                userEmail: legacyData.clientEmail,
                trainerId: legacyData.trainerId,
                trainerName: legacyData.trainerName || 'Unknown Trainer',
                date: legacyData.date,
                time: legacyData.time,
                status: legacyData.status || 'pending',
                createdAt: legacyData.createdAt,
                isLegacy: true
              });
            }
          });
        } catch (legacyError) {
          console.log('Legacy bookings query failed (non-critical):', legacyError);
        }

        break; // Success, exit retry loop

      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // Handle index errors gracefully
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          console.log('Index not available, trying simpler query...');
          
          // Try without orderBy
          const simpleQuery = query(
            collection(db, 'appointments'),
            where('userId', '==', userId)
          );
          
          const simpleSnapshot = await getDocs(simpleQuery);
          simpleSnapshot.forEach((doc) => {
            appointments.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Sort in memory
          appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        }
        
        throw error;
      }
    }

    console.log(`Found ${appointments.length} appointments for user ${userId}`);

    return NextResponse.json({
      success: true,
      appointments: appointments
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user appointments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle POST requests for filtered appointments
export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { trainerId } = body;

    console.log('Fetching filtered appointments for user:', userId, 'trainer:', trainerId);

    let appointments: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get appointments filtered by trainer
        const appointmentsRef = collection(db, 'appointments');
        let q;
        
        if (trainerId) {
          q = query(
            appointmentsRef,
            where('userId', '==', userId),
            where('trainerId', '==', trainerId)
          );
        } else {
          q = query(
            appointmentsRef,
            where('userId', '==', userId)
          );
        }

        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          appointments.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Sort by creation date (newest first)
        appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        break; // Success, exit retry loop

      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // Handle index errors
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          console.log('Index not available, using simpler query...');
          
          // Get all user appointments and filter in memory
          const simpleQuery = query(
            collection(db, 'appointments'),
            where('userId', '==', userId)
          );
          
          const simpleSnapshot = await getDocs(simpleQuery);
          simpleSnapshot.forEach((doc) => {
            const data = doc.data();
            if (!trainerId || data.trainerId === trainerId) {
              appointments.push({
                id: doc.id,
                ...data
              });
            }
          });
          
          // Sort in memory
          appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        }
        
        throw error;
      }
    }

    console.log(`Found ${appointments.length} filtered appointments`);

    return NextResponse.json({
      success: true,
      appointments: appointments
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching filtered appointments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}