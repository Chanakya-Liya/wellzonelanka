import { NextRequest, NextResponse } from 'next/server';
import { addTrainerReview, TrainerReviewData } from '@/lib/services/trainerReviewService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { trainerId, rating, comment, clientName } = body;
    
    if (!trainerId || !rating || !comment || !clientName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: trainerId, rating, comment, clientName'
      }, { status: 400 });
    }
    
    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }
    
    // Validate comment length
    if (comment.trim().length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Comment must be at least 10 characters long'
      }, { status: 400 });
    }
    
    if (comment.trim().length > 500) {
      return NextResponse.json({
        success: false,
        error: 'Comment must be less than 500 characters'
      }, { status: 400 });
    }
    
    // Validate client name
    if (clientName.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Client name must be at least 2 characters long'
      }, { status: 400 });
    }
    
    const reviewData: TrainerReviewData = {
      trainerId: trainerId.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      clientName: clientName.trim(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };
    
    const reviewId = await addTrainerReview(reviewData);
    
    return NextResponse.json({
      success: true,
      reviewId,
      message: 'Trainer review added successfully'
    });
    
  } catch (error) {
    console.error('Error in trainer reviews API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add trainer review'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainerId');
    
    if (!trainerId) {
      return NextResponse.json({
        success: false,
        error: 'trainerId parameter is required'
      }, { status: 400 });
    }
    
    const { getTrainerReviews } = await import('@/lib/services/trainerReviewService');
    const reviews = await getTrainerReviews(trainerId);
    
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length
    });
    
  } catch (error) {
    console.error('Error fetching trainer reviews:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch trainer reviews'
    }, { status: 500 });
  }
}