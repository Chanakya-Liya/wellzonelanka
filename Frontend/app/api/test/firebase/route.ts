import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Try to read reviews collection
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    
    const allReviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('All reviews in database:', allReviews);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      totalReviews: allReviews.length,
      reviews: allReviews,
      firebaseConnected: true
    });
    
  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Firebase connection failed',
      firebaseConnected: false
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { doctorId, patientName, rating, comment } = await request.json();
    
    const reviewsRef = collection(db, 'reviews');
    const newReview = {
      doctorId: doctorId || 'eNRqpc8os8MBgoBe9vKi',
      patientName: patientName || 'Test User',
      rating: rating || 5,
      comment: comment || 'Test review from API',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(reviewsRef, newReview);
    
    return NextResponse.json({
      success: true,
      message: 'Test review added successfully',
      reviewId: docRef.id,
      review: newReview
    });
    
  } catch (error) {
    console.error('Error adding test review:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add test review'
    }, { status: 500 });
  }
}