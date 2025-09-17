import { NextResponse } from 'next/server';
import { getDoctorPatients } from '@/lib/services/appointmentService';

export async function GET() {
  try {
    const testDoctorId = 'eNRqpc8os8MBgoBe9vKi';
    
    console.log('🧪 Testing patient service with doctorId:', testDoctorId);
    
    // Get patients data
    const patientsData = await getDoctorPatients(testDoctorId);

    console.log('👥 Patients data loaded:');
    patientsData.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.patientName} (${patient.email}) - ${patient.totalAppointments} appointments`);
    });

    return NextResponse.json({
      success: true,
      totalPatients: patientsData.length,
      patients: patientsData.map(patient => ({
        id: patient.id,
        name: patient.patientName,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        age: patient.age,
        lastVisit: patient.lastVisit,
        nextAppointment: patient.nextAppointment,
        totalAppointments: patient.totalAppointments,
        status: patient.status,
        medicalConditions: patient.medicalConditions,
        appointments: patient.appointments.map((apt: any) => ({
          date: apt.date,
          time: apt.time,
          serviceType: apt.serviceType,
          description: apt.description
        }))
      }))
    });
  } catch (error) {
    console.error('❌ Test patients error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}