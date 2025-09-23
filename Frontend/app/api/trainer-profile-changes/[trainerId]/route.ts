import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Get pending changes for a specific trainer
export async function GET(
  request: NextRequest,
  { params }: { params: { trainerId: string } }
) {
  try {
    const { trainerId } = await params;
    console.log('🔍 Fetching pending changes for trainer:', trainerId);

    if (!trainerId) {
      console.log('❌ No trainer ID provided');
      return NextResponse.json(
        { success: false, error: 'Trainer ID is required' },
        { status: 400 }
      );
    }

    // Query pending changes for this trainer (simplified query to avoid index requirement)
    const q = query(
      collection(db, 'pending-changes'),
      where('trainerId', '==', trainerId)
    );

    console.log('📊 Executing query for pending changes...');
    const querySnapshot = await getDocs(q);
    console.log('📊 Query snapshot size:', querySnapshot.size);
    
    const pendingChanges: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📋 Document data:', data);
      
      // Only include trainer profile changes
      if (data.changeType === 'trainerProfile') {
        // Convert Firestore timestamps to strings
        const submittedAt = data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt;
        const reviewedAt = data.reviewedAt?.toDate?.()?.toISOString() || data.reviewedAt;

        pendingChanges.push({
          id: doc.id,
          ...data,
          submittedAt,
          reviewedAt
        });
      }
    });

    // Sort by submitted date (newest first)
    pendingChanges.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    console.log('✅ Found pending changes:', pendingChanges.length);
    return NextResponse.json({
      success: true,
      data: pendingChanges
    });

  } catch (error) {
    console.error('❌ Error fetching pending changes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending changes' },
      { status: 500 }
    );
  }
}