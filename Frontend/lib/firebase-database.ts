// Firebase Firestore database service
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'trainer' | 'doctor';
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
  createdAt: string;
  isApproved: boolean;
}

class FirebaseDataService {
  private usersCollection = 'users';

  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'trainer' | 'doctor';
    licenseNumber?: string;
    experience?: number;
    specialization?: string;
  }): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user document
      const userDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        passwordHash,
        role: userData.role,
        ...(userData.licenseNumber && { licenseNumber: userData.licenseNumber }),
        ...(userData.experience && { experience: userData.experience }),
        ...(userData.specialization && { specialization: userData.specialization }),
        createdAt: new Date().toISOString(),
        isApproved: userData.role === 'user' // Auto-approve regular users
      };

      // Add document to Firestore with retry logic
      let docRef;
      let retries = 3;
      
      while (retries > 0) {
        try {
          docRef = await addDoc(collection(db, this.usersCollection), userDoc);
          break;
        } catch (error: any) {
          retries--;
          if (error.code === 'unavailable' && retries > 0) {
            console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }
          throw error;
        }
      }
      
      if (!docRef) {
        throw new Error('Failed to create user after multiple attempts');
      }
      
      const newUser: User = {
        id: docRef.id,
        ...userDoc
      };

      console.log('User saved to Firebase:', { id: newUser.id, email: newUser.email, role: newUser.role });
      return newUser;

    } catch (error) {
      console.error('Error creating user in Firebase:', error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      
      if (!user) {
        console.log('User not found in Firebase:', email);
        return null;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return null;
      }

      console.log('User authenticated successfully from Firebase:', { id: user.id, email: user.email });
      return user;

    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      let retries = 3;
      
      while (retries > 0) {
        try {
          const q = query(
            collection(db, this.usersCollection), 
            where('email', '==', email)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            return null;
          }

          const userDoc = querySnapshot.docs[0];
          return {
            id: userDoc.id,
            ...userDoc.data()
          } as User;
        } catch (error: any) {
          retries--;
          if (error.code === 'unavailable' && retries > 0) {
            console.log(`Firestore unavailable, retrying getUserByEmail... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw error;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(email);
      return !!user;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.usersCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as User;

    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, this.usersCollection, userId);
      await updateDoc(docRef, updateData);
      console.log('User updated in Firebase:', userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.usersCollection, userId);
      await deleteDoc(docRef);
      console.log('User deleted from Firebase:', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      let retries = 3;
      
      while (retries > 0) {
        try {
          const querySnapshot = await getDocs(collection(db, this.usersCollection));
          const users: User[] = [];
          
          querySnapshot.forEach((doc) => {
            users.push({
              id: doc.id,
              ...doc.data()
            } as User);
          });

          return users;
        } catch (error: any) {
          retries--;
          if (error.code === 'unavailable' && retries > 0) {
            console.log(`Firestore unavailable, retrying getAllUsers... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw error;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getUsersByRole(role: 'user' | 'trainer' | 'doctor'): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.usersCollection), 
        where('role', '==', role)
      );
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        } as User);
      });

      return users;
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  async approveUser(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, { isApproved: true });
      console.log('User approved:', userId);
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }
}

export const firebaseDataService = new FirebaseDataService();