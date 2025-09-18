import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Review {
  id: string;
  doctorId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
}

export interface ReviewData {
  doctorId: string;
  rating: number;
  comment: string;
  patientName: string;
  date: string;
}

// Add a new review
export async function addReview(reviewData: ReviewData): Promise<string> {
  try {
    const reviewsRef = collection(db, 'reviews');
    
    const review = {
      ...reviewData,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(reviewsRef, review);
    
    // Update doctor's average rating
    await updateDoctorRating(reviewData.doctorId);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw new Error('Failed to add review');
  }
}

// Get reviews for a specific doctor
export async function getDoctorReviews(doctorId: string): Promise<Review[]> {
  try {
    console.log('Fetching reviews for doctorId:', doctorId);
    const reviewsRef = collection(db, 'reviews');
    
    // Simplified query without orderBy to avoid index requirements
    const q = query(
      reviewsRef,
      where('doctorId', '==', doctorId)
    );
    
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    snapshot.forEach((doc) => {
      console.log('Review document:', doc.id, doc.data());
      reviews.push({
        id: doc.id,
        ...doc.data()
      } as Review);
    });
    
    // Sort reviews by createdAt on client side
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('Total reviews found:', reviews.length);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return empty array instead of throwing to avoid breaking the app
    return [];
  }
}

// Update doctor's average rating
async function updateDoctorRating(doctorId: string): Promise<void> {
  try {
    // Get all reviews for this doctor
    const reviews = await getDoctorReviews(doctorId);
    
    if (reviews.length === 0) return;
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    
    // Update doctor document with new rating and review count
    const doctorRef = doc(db, 'users', doctorId);
    await updateDoc(doctorRef, {
      rating: averageRating,
      reviewCount: reviews.length,
      lastUpdated: new Date().toISOString()
    });
    
    console.log(`Updated doctor ${doctorId} rating to ${averageRating} from ${reviews.length} reviews`);
  } catch (error) {
    console.error('Error updating doctor rating:', error);
    // Don't throw here as the review was already saved successfully
  }
}

// Get review statistics for a doctor
export async function getDoctorReviewStats(doctorId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}> {
  try {
    const reviews = await getDoctorReviews(doctorId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    
    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });
    
    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
}