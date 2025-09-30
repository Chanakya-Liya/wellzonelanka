import { NextRequest, NextResponse } from 'next/server';
import { 
  addReview, 
  getApprovedReviews, 
  getAllReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview
} from '@/lib/services/reviewsService';

// GET - Fetch reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const approved = searchParams.get('approved');
    const admin = searchParams.get('admin');

    let reviews: any[] = [];

    if (admin === 'true') {
      // Admin: Get all reviews
      reviews = await getAllReviews();
    } else if (userId) {
      // Get user's own reviews
      reviews = await getUserReviews(userId);
    } else if (approved !== 'false') {
      // Default: Get approved reviews for public display
      reviews = await getApprovedReviews();
    }

    console.log(`Site Reviews API: Returning ${reviews.length} reviews`);
    console.log('Reviews:', reviews.map(r => ({ id: r.id, userName: r.userName, isApproved: r.isApproved })));

    return NextResponse.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching site reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Add new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, profileImage, review, rating } = body;

    // Validate required fields
    if (!userId || !userName || !userEmail || !review || rating === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const reviewData = {
      userId,
      userName,
      userEmail,
      profileImage: profileImage || '/assets/default-avatar.png',
      review,
      rating: Number(rating)
    };

    const reviewId = await addReview(reviewData);

    return NextResponse.json({
      success: true,
      message: 'Review submitted for approval',
      reviewId
    });
  } catch (error) {
    console.error('Error adding site review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add review' },
      { status: 500 }
    );
  }
}

// PUT - Update review or approve/reject
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, updates, action } = body;

    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Admin approval
      await approveReview(reviewId);
      return NextResponse.json({
        success: true,
        message: 'Review approved'
      });
    } else if (action === 'reject') {
      // Admin rejection
      await rejectReview(reviewId);
      return NextResponse.json({
        success: true,
        message: 'Review rejected'
      });
    } else {
      // Regular update
      if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
        return NextResponse.json(
          { success: false, message: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }

      await updateReview(reviewId, updates);
      return NextResponse.json({
        success: true,
        message: 'Review updated'
      });
    }
  } catch (error) {
    console.error('Error updating site review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    await deleteReview(reviewId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    console.error('Error deleting site review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
}