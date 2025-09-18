import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    console.log('Checking all reviews in database...');
    
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    
    const allReviews: any[] = [];
    snapshot.forEach((doc) => {
      allReviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Total reviews found:', allReviews.length);
    
    return NextResponse.json({
      success: true,
      totalReviews: allReviews.length,
      reviews: allReviews
    });
    
  } catch (error) {
    console.error('Error checking all reviews:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check reviews'
    }, { status: 500 });
  }
}