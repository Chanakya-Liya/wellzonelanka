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

export interface TrainerReview {
  id: string;
  trainerId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
}

export interface TrainerReviewData {
  trainerId: string;
  rating: number;
  comment: string;
  clientName: string;
  date: string;
}

// Add a new trainer review
export async function addTrainerReview(reviewData: TrainerReviewData): Promise<string> {
  try {
    const reviewsRef = collection(db, 'trainerReviews');
    
    const review = {
      ...reviewData,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(reviewsRef, review);
    
    // Update trainer's average rating
    await updateTrainerRating(reviewData.trainerId);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding trainer review:', error);
    throw new Error('Failed to add trainer review');
  }
}

// Get reviews for a specific trainer
export async function getTrainerReviews(trainerId: string): Promise<TrainerReview[]> {
  try {
    console.log('Fetching reviews for trainerId:', trainerId);
    const reviewsRef = collection(db, 'trainerReviews');
    
    // Simplified query without orderBy to avoid index requirements
    const q = query(
      reviewsRef,
      where('trainerId', '==', trainerId)
    );
    
    const snapshot = await getDocs(q);
    const reviews: TrainerReview[] = [];
    
    snapshot.forEach((doc) => {
      console.log('Trainer review document:', doc.id, doc.data());
      reviews.push({
        id: doc.id,
        ...doc.data()
      } as TrainerReview);
    });
    
    // Sort reviews by createdAt on client side
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('Total trainer reviews found:', reviews.length);
    return reviews;
  } catch (error) {
    console.error('Error fetching trainer reviews:', error);
    // Return empty array instead of throwing to avoid breaking the app
    return [];
  }
}

// Update trainer's average rating
async function updateTrainerRating(trainerId: string): Promise<void> {
  try {
    // Get all reviews for this trainer
    const reviews = await getTrainerReviews(trainerId);
    
    if (reviews.length === 0) return;
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    
    // Update trainer document with new rating and review count
    const trainerRef = doc(db, 'users', trainerId);
    await updateDoc(trainerRef, {
      rating: averageRating,
      reviewCount: reviews.length,
      lastUpdated: new Date().toISOString()
    });
    
    console.log(`Updated trainer ${trainerId} rating to ${averageRating} from ${reviews.length} reviews`);
  } catch (error) {
    console.error('Error updating trainer rating:', error);
    // Don't throw here as the review was already saved successfully
  }
}

// Get review statistics for a trainer
export async function getTrainerReviewStats(trainerId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}> {
  try {
    const reviews = await getTrainerReviews(trainerId);
    
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
    console.error('Error getting trainer review stats:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
}