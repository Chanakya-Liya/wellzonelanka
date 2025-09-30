import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  profileImage?: string;
  review: string;
  rating: number;
  isApproved: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION_NAME = 'reviews';

// Add a new review
export const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>): Promise<string> => {
  try {
    const reviewData = {
      ...review,
      isApproved: false, // Reviews need admin approval
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), reviewData);
    console.log('Review added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Get all approved reviews for public display
export const getApprovedReviews = async (): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isApproved', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      } as Review);
    });
    
    // Sort by createdAt in JavaScript
    reviews.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    throw error;
  }
};

// Get all reviews (for admin)
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    console.log('🔍 [SERVICE] Fetching all reviews from collection:', COLLECTION_NAME);
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('🔍 [SERVICE] Raw document data:', data);
      
      // Handle different data structures - map fields appropriately
      const normalizedReview = {
        id: doc.id,
        userId: data.userId || data.patientId || 'unknown',
        userName: data.userName || data.patientName || 'Anonymous',
        userEmail: data.userEmail || data.email || 'no-email@example.com',
        profileImage: data.profileImage || '/assets/default-avatar.png',
        review: data.review || data.comment || data.message || '',
        rating: data.rating || 5,
        isApproved: data.isApproved !== undefined ? data.isApproved : true,
        createdAt: data.createdAt || data.date || new Date(),
        updatedAt: data.updatedAt || data.date || new Date()
      };
      
      console.log('🔍 [SERVICE] Normalized review:', normalizedReview);
      reviews.push(normalizedReview as Review);
    });
    
    console.log('🔍 [SERVICE] Total reviews found:', reviews.length);
    
    // Sort by createdAt in JavaScript
    reviews.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      if (typeof a.createdAt === 'string' || typeof b.createdAt === 'string') {
        return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
      }
      return (b.createdAt as any).seconds - (a.createdAt as any).seconds;
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

// Get user's own reviews
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      } as Review);
    });
    
    // Sort by createdAt in JavaScript
    reviews.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId: string, updates: Partial<Review>): Promise<void> => {
  try {
    const reviewRef = doc(db, COLLECTION_NAME, reviewId);
    await updateDoc(reviewRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Review updated:', reviewId);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, reviewId));
    console.log('Review deleted:', reviewId);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Approve a review (admin only)
export const approveReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, COLLECTION_NAME, reviewId);
    await updateDoc(reviewRef, {
      isApproved: true,
      updatedAt: serverTimestamp()
    });
    console.log('Review approved:', reviewId);
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

// Reject/Decline a review (admin only)
export const rejectReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, COLLECTION_NAME, reviewId);
    await updateDoc(reviewRef, {
      isApproved: false,
      updatedAt: serverTimestamp()
    });
    console.log('Review rejected:', reviewId);
  } catch (error) {
    console.error('Error rejecting review:', error);
    throw error;
  }
};