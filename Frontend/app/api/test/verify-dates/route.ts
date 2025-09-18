import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getTodayString, formatDateToString } from '@/lib/utils/dateUtils';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DATE VERIFICATION TEST ===');
    
    // Get today's date using our utility
    const todayString = getTodayString();
    console.log('Today (getTodayString):', todayString);
    console.log('Today (new Date):', new Date().toLocaleDateString());
    console.log('Today (ISO):', new Date().toISOString().split('T')[0]);
    
    // Get all appointments for doctor 'doctor1'
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', 'doctor1'),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    console.log('Found', appointments.length, 'appointments for doctor1');
    
    // Analyze each appointment
    const analysis = appointments.map(apt => {
      const dateStr = apt.date;
      const convertedDate = new Date(dateStr);
      
      return {
        id: apt.id,
        originalDate: dateStr,
        convertedToDate: convertedDate.toLocaleDateString(),
        convertedToISO: convertedDate.toISOString().split('T')[0],
        formattedWithUtils: formatDateToString(convertedDate),
        isToday: dateStr === todayString,
        userInfo: `${apt.userfirstname} ${apt.userlastname}`,
        serviceType: apt.serviceType
      };
    });
    
    return NextResponse.json({
      success: true,
      todayString,
      totalAppointments: appointments.length,
      analysis,
      summary: {
        appointmentsToday: analysis.filter(a => a.isToday).length,
        appointmentsPast: analysis.filter(a => a.originalDate < todayString).length,
        appointmentsFuture: analysis.filter(a => a.originalDate > todayString).length
      }
    });
    
  } catch (error) {
    console.error('Error in date verification:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}