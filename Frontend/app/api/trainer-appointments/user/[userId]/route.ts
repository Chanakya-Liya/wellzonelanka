import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const resolvedParams = await params;
    const userId = resolvedParams.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    console.log('Fetching trainer appointments for user:', userId, 'on date:', date);

    const trainerAppointmentsRef = collection(db, 'trainerAppointments');
    let appointmentQuery;

    if (date) {
      // Fetch appointments for specific date
      appointmentQuery = query(
        trainerAppointmentsRef,
        where('userId', '==', userId),
        where('date', '==', date),
        where('status', '==', 'Confirmed')
      );
    } else {
      // Fetch all confirmed appointments for user
      appointmentQuery = query(
        trainerAppointmentsRef,
        where('userId', '==', userId),
        where('status', '==', 'Confirmed')
      );
    }

    const snapshot = await getDocs(appointmentQuery);
    const appointments: any[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        ...data,
        // Standardize the appointment data
        trainerName: data.trainerName || data.trainerfirstname + ' ' + data.trainerlastname,
        serviceType: data.serviceType || 'Personal Training'
      });
    });

    console.log(`Found ${appointments.length} trainer appointments for user ${userId}`);

    return NextResponse.json({
      success: true,
      appointments,
      count: appointments.length
    });

  } catch (error) {
    console.error('Error fetching user trainer appointments:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch trainer appointments'
    }, { status: 500 });
  }
}