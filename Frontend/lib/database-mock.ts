// Temporary fix for database service
import { auth as firebaseAuth } from '@/lib/firebase';

// Mock database service for development
export const dbService = {
  async emailExists(email: string): Promise<boolean> {
    // For development, we'll skip the database check
    // and let Firebase Auth handle duplicate email validation
    return false;
  },

  async createUserProfile(uid: string, userData: any): Promise<void> {
    // For development, we'll just log the user data
    console.log('User profile data:', { uid, userData });
    // In production, this would save to Firestore
  },

  async getUserByEmail(email: string): Promise<any> {
    throw new Error('Not implemented in mock service');
  }
};