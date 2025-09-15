import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching trainers from Firebase...');

    // Get all users and filter for trainers
    const allUsers = await firebaseDataService.getAllUsers();
    console.log(`Total users in database: ${allUsers.length}`);
    
    // Filter for trainers only
    const trainers = allUsers.filter(user => user.role === 'trainer');
    console.log(`Found ${trainers.length} trainers in database`);
    
    // Filter only approved trainers
    const approvedTrainers = trainers.filter(trainer => trainer.isApproved);
    console.log(`Found ${approvedTrainers.length} approved trainers`);

    return NextResponse.json({
      success: true,
      trainers: approvedTrainers,
      count: approvedTrainers.length,
      debug: {
        totalUsers: allUsers.length,
        totalTrainers: trainers.length,
        approvedTrainers: approvedTrainers.length
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainers:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trainers',
      trainers: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}