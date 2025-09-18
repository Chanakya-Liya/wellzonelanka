import { NextResponse } from 'next/server';
import { getDoctorAppointments } from '@/lib/services/appointmentService';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST() {
  try {
    const testDoctorId = 'eNRqpc8os8MBgoBe9vKi';
    
    console.log('🔄 Starting date migration for existing appointments...');
    
    // Get all appointments for the test doctor
    const appointments = await getDoctorAppointments(testDoctorId);
    
    const migrationResults = [];
    
    for (const appointment of appointments) {
      try {
        const originalDate = appointment.date;
        
        // Check if date looks like it might be affected by timezone issue
        // If the date parsing creates a different local date, we need to fix it
        const parsedDate = new Date(originalDate + 'T00:00:00');
        const localDateString = parsedDate.getFullYear() + '-' + 
                               String(parsedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(parsedDate.getDate()).padStart(2, '0');
        
        if (originalDate !== localDateString && originalDate.includes('-')) {
          // This appointment might have the timezone issue
          console.log(`🔧 Fixing appointment ${appointment.id}: ${originalDate} -> ${localDateString}`);
          
          // Update the appointment date in Firebase
          const appointmentRef = doc(db, 'appointments', appointment.id);
          await updateDoc(appointmentRef, {
            date: localDateString
          });
          
          migrationResults.push({
            id: appointment.id,
            patient: `${appointment.userfirstname} ${appointment.userlastname}`,
            oldDate: originalDate,
            newDate: localDateString,
            status: 'updated'
          });
        } else {
          migrationResults.push({
            id: appointment.id,
            patient: `${appointment.userfirstname} ${appointment.userlastname}`,
            date: originalDate,
            status: 'no_change_needed'
          });
        }
      } catch (error) {
        migrationResults.push({
          id: appointment.id,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Date migration completed',
      totalAppointments: appointments.length,
      migrationResults: migrationResults,
      summary: {
        updated: migrationResults.filter(r => r.status === 'updated').length,
        noChangeNeeded: migrationResults.filter(r => r.status === 'no_change_needed').length,
        errors: migrationResults.filter(r => r.status === 'error').length
      }
    });
  } catch (error) {
    console.error('❌ Date migration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}