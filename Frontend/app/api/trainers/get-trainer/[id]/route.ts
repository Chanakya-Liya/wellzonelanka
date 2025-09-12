import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id;
    console.log('Fetching trainer with ID:', trainerId);

    // Get trainer by ID from Firebase
    const trainer = await firebaseDataService.getUserById(trainerId);
    
    if (!trainer) {
      return NextResponse.json({
        success: false,
        message: 'Trainer not found'
      }, { status: 404 });
    }

    // Verify the user is a trainer and approved
    if (trainer.role !== 'trainer') {
      return NextResponse.json({
        success: false,
        message: 'User is not a trainer'
      }, { status: 400 });
    }

    if (!trainer.isApproved) {
      return NextResponse.json({
        success: false,
        message: 'Trainer is not approved'
      }, { status: 403 });
    }

    console.log('Found trainer:', { id: trainer.id, name: `${trainer.firstName} ${trainer.lastName}` });

    return NextResponse.json({
      success: true,
      trainer: trainer
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainer:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trainer',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}