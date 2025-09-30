import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ doctorId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const resolvedParams = await params;
    const doctorId = resolvedParams.doctorId;

    if (!doctorId) {
      return NextResponse.json({
        success: false,
        error: 'Doctor ID is required'
      }, { status: 400 });
    }

    console.log('Fetching appointments for doctor:', doctorId, 'on date:', date);

    const appointmentsRef = collection(db, 'appointments');
    let appointmentQuery;

    if (date) {
      // Fetch appointments for specific date
      appointmentQuery = query(
        appointmentsRef,
        where('doctorId', '==', doctorId),
        where('date', '==', date),
        where('status', '==', 'Confirmed')
      );
    } else {
      // Fetch all confirmed appointments for doctor
      appointmentQuery = query(
        appointmentsRef,
        where('doctorId', '==', doctorId),
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
        doctorName: data.doctorName || 'Dr. ' + (data.doctor || 'Unknown'),
        serviceType: data.serviceType || 'Medical Consultation'
      });
    });

    console.log(`Found ${appointments.length} appointments for doctor ${doctorId}`);

    return NextResponse.json({
      success: true,
      appointments,
      count: appointments.length
    });

  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch doctor appointments'
    }, { status: 500 });
  }
}