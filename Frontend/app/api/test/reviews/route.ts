import { NextRequest, NextResponse } from 'next/server';
import { getDoctorReviews } from '@/lib/services/reviewService';

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
    
    console.log('Testing reviews for doctor ID:', doctorId);
    
    const reviews = await getDoctorReviews(doctorId);
    
    console.log('Found reviews:', reviews);
    
    return NextResponse.json({
      success: true,
      doctorId,
      reviews,
      count: reviews.length,
      message: `Found ${reviews.length} reviews for doctor ${doctorId}`
    });
    
  } catch (error) {
    console.error('Error in test reviews API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviews'
    }, { status: 500 });
  }
}