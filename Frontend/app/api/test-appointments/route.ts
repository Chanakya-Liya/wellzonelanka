import { NextRequest, NextResponse } from 'next/server';
import { getDoctorAppointments, getDoctorPastAppointments, getAllAppointments } from '@/lib/services/appointmentService';

// Test appointment fetching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    
    console.log('🔍 Testing appointment fetch for doctorId:', doctorId);
    
    // Test 1: Get all appointments
    console.log('📋 Getting all appointments...');
    const allAppointments = await getAllAppointments();
    console.log('📋 All appointments:', allAppointments);
    
    // Test 2: Get specific doctor appointments if doctorId provided
    let doctorAppointments: any[] = [];
    let pastAppointments: any[] = [];
    if (doctorId) {
      console.log('🩺 Getting appointments for doctor:', doctorId);
      doctorAppointments = await getDoctorAppointments(doctorId);
      console.log('🩺 Doctor appointments:', doctorAppointments);
      
      console.log('⏰ Getting PAST appointments for doctor:', doctorId);
      pastAppointments = await getDoctorPastAppointments(doctorId);
      console.log('⏰ Past appointments:', pastAppointments);
    }
    
    return NextResponse.json({
      success: true,
      allAppointments: allAppointments,
      allCount: allAppointments.length,
      doctorAppointments: doctorAppointments,
      doctorCount: doctorAppointments.length,
      pastAppointments: pastAppointments,
      pastCount: pastAppointments.length,
      requestedDoctorId: doctorId,
      currentDate: new Date().toISOString().split('T')[0]
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error testing appointments:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to test appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}