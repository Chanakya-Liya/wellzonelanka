import { NextResponse } from 'next/server';
import { getDoctorProfile, getDoctorPendingChanges } from '@/lib/services/appointmentService';

export async function GET() {
  try {
    const testDoctorId = 'eNRqpc8os8MBgoBe9vKi';
    
    console.log('🧪 Testing doctor profile service with doctorId:', testDoctorId);
    
    // Get doctor profile
    const doctorProfile = await getDoctorProfile(testDoctorId);
    console.log('👨‍⚕️ Doctor profile:', doctorProfile);
    
    // Get pending changes
    const pendingChanges = await getDoctorPendingChanges(testDoctorId);
    console.log('📋 Pending changes:', pendingChanges);

    return NextResponse.json({
      success: true,
      doctorId: testDoctorId,
      profile: doctorProfile,
      pendingChanges: pendingChanges,
      pendingChangesCount: pendingChanges.length
    });
  } catch (error) {
    console.error('❌ Test doctor profile error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}