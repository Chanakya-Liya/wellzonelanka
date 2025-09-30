import { NextRequest, NextResponse } from 'next/server';
import { 
  addSuccessStory, 
  getApprovedSuccessStories, 
  getAllSuccessStories,
  getPendingSuccessStories,
  getUserSuccessStories,
  updateSuccessStory,
  deleteSuccessStory,
  approveSuccessStory
} from '@/lib/services/successStoriesService';

// GET - Fetch success stories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const approved = searchParams.get('approved');
    const admin = searchParams.get('admin');

    let stories: any[] = [];

    if (admin === 'true') {
      // Admin: Get all stories for admin review
      const pending = searchParams.get('pending');
      if (pending === 'true') {
        stories = await getPendingSuccessStories();
      } else {
        stories = await getAllSuccessStories();
      }
    } else if (userId) {
      // Get user's own stories
      stories = await getUserSuccessStories(userId);
    } else if (approved !== 'false') {
      // Default: Get approved stories for public display
      stories = await getApprovedSuccessStories();
    }

    console.log(`Success stories API: Returning ${stories.length} stories`);
    console.log('Complete Stories Data:', stories.map(s => ({ 
      id: s.id, 
      userName: s.userName, 
      achievement: s.achievement,
      story: s.story,
      rating: s.rating,
      isApproved: s.isApproved 
    })));

    return NextResponse.json({
      success: true,
      stories
    });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch success stories' },
      { status: 500 }
    );
  }
}

// POST - Add new success story
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, profileImage, achievement, story, rating } = body;

    // Validate required fields
    if (!userId || !userName || !userEmail || !achievement || !story || rating === undefined) {
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

    const storyData = {
      userId,
      userName,
      userEmail,
      profileImage: profileImage || '/assets/default-avatar.png',
      achievement,
      story,
      rating: Number(rating)
    };

    const storyId = await addSuccessStory(storyData);

    return NextResponse.json({
      success: true,
      message: 'Success story submitted successfully! It will appear on the website after admin approval.',
      storyId
    });
  } catch (error) {
    console.error('Error adding success story:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add success story' },
      { status: 500 }
    );
  }
}

// PUT - Update success story
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyId, updates, action } = body;

    if (!storyId) {
      return NextResponse.json(
        { success: false, message: 'Story ID is required' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Admin approval
      await approveSuccessStory(storyId);
      return NextResponse.json({
        success: true,
        message: 'Success story approved'
      });
    } else {
      // Regular update
      if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
        return NextResponse.json(
          { success: false, message: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }

      await updateSuccessStory(storyId, updates);
      return NextResponse.json({
        success: true,
        message: 'Success story updated'
      });
    }
  } catch (error) {
    console.error('Error updating success story:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update success story' },
      { status: 500 }
    );
  }
}

// DELETE - Delete success story
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');

    if (!storyId) {
      return NextResponse.json(
        { success: false, message: 'Story ID is required' },
        { status: 400 }
      );
    }

    await deleteSuccessStory(storyId);

    return NextResponse.json({
      success: true,
      message: 'Success story deleted'
    });
  } catch (error) {
    console.error('Error deleting success story:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete success story' },
      { status: 500 }
    );
  }
}