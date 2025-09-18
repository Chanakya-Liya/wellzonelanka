import { NextRequest, NextResponse } from 'next/server';
import { addReview, ReviewData } from '@/lib/services/reviewService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { doctorId, rating, comment, patientName } = body;
    
    if (!doctorId || !rating || !comment || !patientName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: doctorId, rating, comment, patientName'
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
    
    // Validate patient name
    if (patientName.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Patient name must be at least 2 characters long'
      }, { status: 400 });
    }
    
    const reviewData: ReviewData = {
      doctorId: doctorId.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      patientName: patientName.trim(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };
    
    const reviewId = await addReview(reviewData);
    
    return NextResponse.json({
      success: true,
      reviewId,
      message: 'Review added successfully'
    });
    
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add review'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    
    if (!doctorId) {
      return NextResponse.json({
        success: false,
        error: 'doctorId parameter is required'
      }, { status: 400 });
    }
    
    const { getDoctorReviews } = await import('@/lib/services/reviewService');
    const reviews = await getDoctorReviews(doctorId);
    
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviews'
    }, { status: 500 });
  }
}