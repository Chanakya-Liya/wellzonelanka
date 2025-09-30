import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

// GET - Fetch all exercises
export async function GET(request: NextRequest) {
  try {
    const exercises = await firebaseDataService.getAllExercises();
    
    return NextResponse.json({
      success: true,
      exercises: exercises
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch exercises'
    }, { status: 500 });
  }
}

// POST - Add new exercise
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseName, description, difficulty, duration, target, image, trackUrl, url } = body;

    // Validate required fields
    if (!exerciseName || !description || !difficulty || !duration) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: exerciseName, description, difficulty, duration'
      }, { status: 400 });
    }

    const exerciseData = {
      exerciseName,
      description,
      difficulty,
      duration,
      target: Array.isArray(target) ? target : [],
      image: image || '',
      trackUrl: trackUrl || '',
      url: url || ''
    };

    const exerciseId = await firebaseDataService.addExercise(exerciseData);
    
    return NextResponse.json({
      success: true,
      exerciseId: exerciseId,
      message: 'Exercise added successfully'
    });
  } catch (error) {
    console.error('Error adding exercise:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add exercise'
    }, { status: 500 });
  }
}

// PUT - Update exercise
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId, ...updateData } = body;

    if (!exerciseId) {
      return NextResponse.json({
        success: false,
        error: 'Exercise ID is required'
      }, { status: 400 });
    }

    await firebaseDataService.updateExercise(exerciseId, updateData);
    
    return NextResponse.json({
      success: true,
      message: 'Exercise updated successfully'
    });
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update exercise'
    }, { status: 500 });
  }
}

// DELETE - Delete exercise
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({
        success: false,
        error: 'Exercise ID is required'
      }, { status: 400 });
    }

    await firebaseDataService.deleteExercise(exerciseId);
    
    return NextResponse.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete exercise'
    }, { status: 500 });
  }
}