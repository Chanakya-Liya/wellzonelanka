import { NextRequest, NextResponse } from 'next/server';
import { createAppointment, AppointmentData } from '@/lib/services/appointmentService';

// Create a test appointment for debugging
export async function POST(request: NextRequest) {
  try {
    const testAppointment: AppointmentData = {
      date: "2025-09-17", // Today's date
      serviceType: "Consultation",
      time: "10:00 AM",
      doctorId: "eNRqpc8os8MBgoBe9vKi", // The doctor ID from our logs
      doctorName: "Dr. Anjitha Sahashya", 
      userEmail: "test.patient@gmail.com",
      userId: "user_test_123",
      userfirstname: "Test",
      userlastname: "Patient",
      userphonenumber: "0771234567",
      useradress: "123 Test Street, Colombo",
      userdescription: "Regular checkup appointment for testing",
      status: "Confirmed"
    };

    console.log('Creating test appointment:', testAppointment);
    const appointmentId = await createAppointment(testAppointment);
    
    return NextResponse.json({
      success: true,
      message: 'Test appointment created successfully',
      appointmentId: appointmentId,
      appointmentData: testAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating test appointment:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create test appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get all appointments for debugging
export async function GET() {
  try {
    const { getAllAppointments } = await import('@/lib/services/appointmentService');
    const appointments = await getAllAppointments();
    
    return NextResponse.json({
      success: true,
      appointments: appointments,
      count: appointments.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}