import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

// GET - Fetch all doctors for admin
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching doctors for admin...');

    const doctorUsers = await firebaseDataService.getUsersByRole('doctor');
    console.log(`Found ${doctorUsers.length} doctors in database`);

    // Separate by approval status
    const approved = doctorUsers.filter(user => user.isApproved);
    const pending = doctorUsers.filter(user => !user.isApproved);

    return NextResponse.json({
      success: true,
      data: {
        all: doctorUsers,
        approved: approved,
        pending: pending
      },
      stats: {
        total: doctorUsers.length,
        approved: approved.length,
        pending: pending.length
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching doctors for admin:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch doctors',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update doctor approval status
export async function PUT(request: NextRequest) {
  try {
    const { doctorId, isApproved } = await request.json();

    if (!doctorId) {
      return NextResponse.json({
        success: false,
        error: 'Doctor ID is required'
      }, { status: 400 });
    }

    await firebaseDataService.updateUser(doctorId, { isApproved });

    return NextResponse.json({
      success: true,
      message: `Doctor ${isApproved ? 'approved' : 'declined'} successfully`
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating doctor approval status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update doctor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}