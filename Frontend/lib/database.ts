// lib/database.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';

// User types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'trainer' | 'doctor';
  createdAt: any;
  updatedAt: any;
  isVerified?: boolean;
  profileComplete?: boolean;
}

export interface TrainerProfile extends UserProfile {
  role: 'trainer';
  licenseNumber: string;
  experience: number;
  specialization: string;
  isApproved?: boolean;
  approvedAt?: any;
  approvedBy?: string;
}

export interface DoctorProfile extends UserProfile {
  role: 'doctor';
  licenseNumber: string;
  experience: number;
  specialization: string;
  isApproved?: boolean;
  approvedAt?: any;
  approvedBy?: string;
}

// Database service class
export class DatabaseService {
  private static instance: DatabaseService;
  
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Create user profile
  async createUserProfile(
    userId: string, 
    userData: Omit<UserProfile | TrainerProfile | DoctorProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const profileData = {
        id: userId,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileComplete: true,
        isVerified: userData.role === 'user', // Users are auto-verified, professionals need approval
        ...(userData.role !== 'user' && { isApproved: false })
      };

      await setDoc(userRef, profileData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  // Get user profile by ID
  async getUserProfile(userId: string): Promise<UserProfile | TrainerProfile | DoctorProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile | TrainerProfile | DoctorProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  // Get user profile by email
  async getUserByEmail(email: string): Promise<UserProfile | TrainerProfile | DoctorProfile | null> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.data() as UserProfile | TrainerProfile | DoctorProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user by email');
    }
  }

  // Update user profile
  async updateUserProfile(
    userId: string, 
    updates: Partial<UserProfile | TrainerProfile | DoctorProfile>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  // Get all trainers
  async getTrainers(): Promise<TrainerProfile[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'trainer'), where('isApproved', '==', true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as TrainerProfile);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      throw new Error('Failed to fetch trainers');
    }
  }

  // Get all doctors
  async getDoctors(): Promise<DoctorProfile[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'doctor'), where('isApproved', '==', true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as DoctorProfile);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }
  }

  // Get pending approvals (for admin)
  async getPendingApprovals(): Promise<(TrainerProfile | DoctorProfile)[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('role', 'in', ['trainer', 'doctor']), 
        where('isApproved', '==', false)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as TrainerProfile | DoctorProfile);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw new Error('Failed to fetch pending approvals');
    }
  }

  // Approve professional (trainer/doctor)
  async approveProfessional(userId: string, approvedBy: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isApproved: true,
        isVerified: true,
        approvedAt: serverTimestamp(),
        approvedBy: approvedBy,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error approving professional:', error);
      throw new Error('Failed to approve professional');
    }
  }

  // Delete user profile
  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw new Error('Failed to delete user profile');
    }
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(email);
      return user !== null;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  // Save password reset token (you might want to use a separate collection for tokens)
  async savePasswordResetToken(email: string, token: string, expiresAt: Date): Promise<void> {
    try {
      const tokenRef = doc(db, 'passwordResets', token);
      await setDoc(tokenRef, {
        email,
        token,
        expiresAt,
        createdAt: serverTimestamp(),
        used: false
      });
    } catch (error) {
      console.error('Error saving password reset token:', error);
      throw new Error('Failed to save password reset token');
    }
  }

  // Verify password reset token
  async verifyPasswordResetToken(token: string): Promise<{ email: string; valid: boolean }> {
    try {
      const tokenRef = doc(db, 'passwordResets', token);
      const tokenSnap = await getDoc(tokenRef);
      
      if (!tokenSnap.exists()) {
        return { email: '', valid: false };
      }
      
      const tokenData = tokenSnap.data();
      const now = new Date();
      const expiresAt = tokenData.expiresAt.toDate();
      
      if (now > expiresAt || tokenData.used) {
        return { email: tokenData.email, valid: false };
      }
      
      return { email: tokenData.email, valid: true };
    } catch (error) {
      console.error('Error verifying password reset token:', error);
      return { email: '', valid: false };
    }
  }

  // Mark password reset token as used
  async markTokenAsUsed(token: string): Promise<void> {
    try {
      const tokenRef = doc(db, 'passwordResets', token);
      await updateDoc(tokenRef, {
        used: true,
        usedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking token as used:', error);
      throw new Error('Failed to mark token as used');
    }
  }
}

// Export singleton instance
export const dbService = DatabaseService.getInstance();