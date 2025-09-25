import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

// GET - Fetch all trainers for admin
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching trainers for admin...');

    const trainerUsers = await firebaseDataService.getUsersByRole('trainer');
    console.log(`Found ${trainerUsers.length} trainers in database`);

    // Separate by approval status
    const approved = trainerUsers.filter(user => user.isApproved);
    const pending = trainerUsers.filter(user => !user.isApproved);

    return NextResponse.json({
      success: true,
      data: {
        all: trainerUsers,
        approved: approved,
        pending: pending
      },
      stats: {
        total: trainerUsers.length,
        approved: approved.length,
        pending: pending.length
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainers for admin:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trainers',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update trainer approval status
export async function PUT(request: NextRequest) {
  try {
    const { trainerId, isApproved } = await request.json();

    if (!trainerId) {
      return NextResponse.json({
        success: false,
        error: 'Trainer ID is required'
      }, { status: 400 });
    }

    await firebaseDataService.updateUser(trainerId, { isApproved });

    return NextResponse.json({
      success: true,
      message: `Trainer ${isApproved ? 'approved' : 'declined'} successfully`
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating trainer approval status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update trainer',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}