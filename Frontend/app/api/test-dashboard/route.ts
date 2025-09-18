import { NextResponse } from 'next/server';
import { getDoctorAppointmentStats, getDoctorUpcomingAppointments } from '@/lib/services/appointmentService';

export async function GET() {
  try {
    const testDoctorId = 'eNRqpc8os8MBgoBe9vKi';
    
    console.log('🧪 Testing dashboard data with doctorId:', testDoctorId);
    
    // Get dashboard stats
    const stats = await getDoctorAppointmentStats(testDoctorId);
    console.log('📊 Dashboard stats:', stats);
    
    // Get upcoming appointments
    const upcomingAppointments = await getDoctorUpcomingAppointments(testDoctorId);
    console.log('📅 Upcoming appointments:', upcomingAppointments);

    return NextResponse.json({
      success: true,
      doctorId: testDoctorId,
      stats: stats,
      upcomingAppointments: upcomingAppointments.map(apt => ({
        id: apt.id,
        date: apt.date,
        time: apt.time,
        serviceType: apt.serviceType,
        patientName: `${apt.userfirstname} ${apt.userlastname}`,
        patientEmail: apt.userEmail
      })),
      upcomingCount: upcomingAppointments.length,
      currentDate: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('❌ Test dashboard error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}