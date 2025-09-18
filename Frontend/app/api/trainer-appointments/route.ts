import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract data from request body
    const {
      trainerId,
      trainerName,
      userId,
      userEmail,
      userfirstname,
      userlastname,
      userphonenumber,
      useradress,
      userdescription,
      date,
      time,
      serviceType = "Personal Training",
      status = "Confirmed"
    } = body;

    // Validate required fields
    if (!trainerId || !trainerName || !userId || !userEmail || !userfirstname || !userlastname || !date || !time) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    console.log('Creating trainer appointment:', {
      trainerId,
      trainerName,
      userId,
      userEmail,
      date,
      time
    });

    // Create appointment document
    const appointmentData = {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      date: date, // Format: "2025-09-18"
      doctorId: trainerId, // Using trainerId as doctorId for consistency
      doctorName: trainerName, // Using trainerName as doctorName
      serviceType: serviceType,
      status: status,
      time: time, // Format: "5:00PM"
      userEmail: userEmail,
      userId: userId,
      useradress: useradress || '',
      userdescription: userdescription || '',
      userfirstname: userfirstname,
      userlastname: userlastname,
      userphonenumber: userphonenumber || ''
    };

    // Add to trainers-appointment collection
    const docRef = await addDoc(collection(db, 'trainers-appointment'), appointmentData);
    
    console.log('Trainer appointment created successfully with ID:', docRef.id);

    return NextResponse.json({
      success: true,
      appointmentId: docRef.id,
      message: 'Trainer appointment created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating trainer appointment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create trainer appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainerId');
    const userId = searchParams.get('userId');

    console.log('Fetching trainer appointments with params:', { trainerId, userId });

    // For now, just return success - you can implement fetching logic later if needed
    return NextResponse.json({
      success: true,
      message: 'Trainer appointments API is working',
      params: { trainerId, userId }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainer appointments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trainer appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}