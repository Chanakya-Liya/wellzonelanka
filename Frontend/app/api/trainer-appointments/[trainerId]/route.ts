import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Trainer appointment schema based on doctor appointments
interface TrainerAppointment {
  id?: string;
  createdAt: any; // Firebase timestamp
  updatedAt: any; // Firebase timestamp
  date: string; // "2025-09-17"
  time: string; // "12:00PM"
  trainerId: string;
  trainerName: string;
  sessionType: string; // "Personal Training", "Strength Training", etc.
  status: string; // "Confirmed", "Pending", "Cancelled", "Completed"
  userId: string;
  userEmail: string;
  userfirstname: string;
  userlastname: string;
  userphonenumber: string;
  useradress: string;
  userdescription: string;
  duration?: string; // "60 min", "45 min", etc.
  location?: string; // "Gym Floor A", "Weight Room", etc.
  goals?: string; // Client fitness goals
  clientAge?: number;
  paymentAmount?: number;
  paymentStatus?: string; // "paid", "pending", "failed"
}

// GET - Fetch all appointments for a specific trainer
export async function GET(request: NextRequest, { params }: { params: Promise<{ trainerId: string }> }) {
  try {
    const { trainerId } = await params;
    console.log('Fetching appointments for trainer:', trainerId);

    let appointments: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get trainer appointments from the trainers-appointment collection (note: hyphen not underscore)
        const appointmentsRef = collection(db, 'trainers-appointment');
        const q = query(
          appointmentsRef,
          where('doctorId', '==', trainerId), // Note: using doctorId as it stores trainerId in your schema
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          appointments.push({
            id: doc.id,
            ...doc.data()
          });
        });

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
            collection(db, 'trainers-appointment'),
            where('doctorId', '==', trainerId) // Note: using doctorId as it stores trainerId in your schema
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

    console.log(`Found ${appointments.length} appointments for trainer ${trainerId}`);

    return NextResponse.json({
      success: true,
      appointments: appointments
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainer appointments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create a new trainer appointment
export async function POST(request: NextRequest, { params }: { params: Promise<{ trainerId: string }> }) {
  try {
    const { trainerId } = await params;
    const body = await request.json();
    
    console.log('Creating appointment for trainer:', trainerId);

    // Validate required fields
    const requiredFields = ['date', 'time', 'sessionType', 'userId', 'userEmail', 'userfirstname', 'userlastname', 'userphonenumber', 'useradress'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          message: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    const appointmentData: TrainerAppointment = {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      date: body.date,
      time: body.time,
      trainerId: trainerId,
      trainerName: body.trainerName || 'Unknown Trainer',
      sessionType: body.sessionType,
      status: body.status || 'Pending',
      userId: body.userId,
      userEmail: body.userEmail,
      userfirstname: body.userfirstname,
      userlastname: body.userlastname,
      userphonenumber: body.userphonenumber,
      useradress: body.useradress,
      userdescription: body.userdescription || '',
      duration: body.duration || '60 min',
      location: body.location || 'TBD',
      goals: body.goals || '',
      clientAge: body.clientAge || null,
      paymentAmount: body.paymentAmount || 0,
      paymentStatus: body.paymentStatus || 'pending'
    };

    let retries = 3;
    let docRef;

    while (retries > 0) {
      try {
        docRef = await addDoc(collection(db, 'trainer_appointments'), appointmentData);
        break;
      } catch (error: any) {
        retries--;
        if (error.code === 'unavailable' && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    if (!docRef) {
      throw new Error('Failed to create appointment after multiple attempts');
    }

    console.log('Trainer appointment created:', docRef.id);

    return NextResponse.json({
      success: true,
      appointmentId: docRef.id,
      message: 'Appointment created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating trainer appointment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update an existing trainer appointment
export async function PUT(request: NextRequest, { params }: { params: Promise<{ trainerId: string }> }) {
  try {
    const { trainerId } = await params;
    const body = await request.json();
    const { appointmentId, ...updateData } = body;

    if (!appointmentId) {
      return NextResponse.json({
        success: false,
        message: 'Appointment ID is required for updates'
      }, { status: 400 });
    }

    console.log('Updating appointment:', appointmentId, 'for trainer:', trainerId);
    console.log('Update data:', updateData);

    // Add updatedAt timestamp
    const updatedAppointmentData = {
      ...updateData,
      updatedAt: serverTimestamp()
    };

    console.log('Final update data:', updatedAppointmentData);

    let retries = 3;

    while (retries > 0) {
      try {
        const docRef = doc(db, 'trainers-appointment', appointmentId); // Fixed: use correct collection name
        await updateDoc(docRef, updatedAppointmentData);
        break;
      } catch (error: any) {
        retries--;
        if (error.code === 'unavailable' && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    console.log('Trainer appointment updated:', appointmentId);

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating trainer appointment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete a trainer appointment
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ trainerId: string }> }) {
  try {
    const { trainerId } = await params;
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json({
        success: false,
        message: 'Appointment ID is required for deletion'
      }, { status: 400 });
    }

    console.log('Deleting appointment:', appointmentId, 'for trainer:', trainerId);

    let retries = 3;

    while (retries > 0) {
      try {
        const docRef = doc(db, 'trainer_appointments', appointmentId);
        await deleteDoc(docRef);
        break;
      } catch (error: any) {
        retries--;
        if (error.code === 'unavailable' && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    console.log('Trainer appointment deleted:', appointmentId);

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting trainer appointment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}