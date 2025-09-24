import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

// GET - Fetch all users for admin
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching all users for admin...');

    const allUsers = await firebaseDataService.getAllUsers();
    console.log(`Found ${allUsers.length} total users in database`);

    // Separate users by role
    const users = allUsers.filter(user => user.role === 'user');
    const doctors = allUsers.filter(user => user.role === 'doctor');
    const trainers = allUsers.filter(user => user.role === 'trainer');

    // Further separate by approval status
    const approvedDoctors = doctors.filter(user => user.isApproved);
    const pendingDoctors = doctors.filter(user => !user.isApproved);
    const approvedTrainers = trainers.filter(user => user.isApproved);
    const pendingTrainers = trainers.filter(user => !user.isApproved);

    return NextResponse.json({
      success: true,
      data: {
        users: users,
        doctors: {
          all: doctors,
          approved: approvedDoctors,
          pending: pendingDoctors
        },
        trainers: {
          all: trainers,
          approved: approvedTrainers,
          pending: pendingTrainers
        }
      },
      stats: {
        totalUsers: allUsers.length,
        regularUsers: users.length,
        doctors: {
          total: doctors.length,
          approved: approvedDoctors.length,
          pending: pendingDoctors.length
        },
        trainers: {
          total: trainers.length,
          approved: approvedTrainers.length,
          pending: pendingTrainers.length
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users for admin:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update user approval/suspension status
export async function PUT(request: NextRequest) {
  try {
    const { userId, isApproved } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Update user approval status
    await firebaseDataService.updateUser(userId, { isApproved });

    const actionText = isApproved ? 'approved' : 'suspended';
    console.log(`User ${actionText}:`, userId);

    return NextResponse.json({
      success: true,
      message: `User ${actionText} successfully`
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating user approval status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}