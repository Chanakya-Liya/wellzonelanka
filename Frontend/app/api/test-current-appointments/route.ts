import { NextResponse } from 'next/server';
import { getDoctorAppointments } from '@/lib/services/appointmentService';
import { formatDateToString, getTodayString } from '@/lib/utils/dateUtils';

export async function GET() {
  try {
    const testDoctorId = 'eNRqpc8os8MBgoBe9vKi';
    
    console.log('🧪 Testing current appointments and date display...');
    
    // Get all appointments for the test doctor
    const appointments = await getDoctorAppointments(testDoctorId);
    
    const todayString = getTodayString();
    console.log('📅 Today string:', todayString);
    
    const appointmentAnalysis = appointments.map(apt => {
      const originalDate = apt.date;
      
      // Test old method (problematic)
      let oldMethodDate = 'N/A';
      try {
        oldMethodDate = new Date(apt.date).toLocaleDateString();
      } catch (e) {
        oldMethodDate = 'Error';
      }
      
      // Compare with today
      const isToday = apt.date === todayString;
      const isPast = apt.date < todayString;
      const isFuture = apt.date > todayString;
      
      return {
        id: apt.id,
        patient: `${apt.userfirstname} ${apt.userlastname}`,
        originalDate: originalDate,
        oldMethodDisplay: oldMethodDate,
        directDisplay: apt.date,
        category: isToday ? 'TODAY' : isPast ? 'PAST' : 'FUTURE',
        isToday,
        isPast,
        isFuture
      };
    });

    return NextResponse.json({
      success: true,
      todayString: todayString,
      currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      totalAppointments: appointments.length,
      appointmentAnalysis: appointmentAnalysis,
      summary: {
        today: appointmentAnalysis.filter(apt => apt.isToday).length,
        past: appointmentAnalysis.filter(apt => apt.isPast).length,
        future: appointmentAnalysis.filter(apt => apt.isFuture).length
      }
    });
  } catch (error) {
    console.error('❌ Test current appointments error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}