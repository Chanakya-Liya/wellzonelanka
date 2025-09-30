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
  role: 'user' | 'trainer' | 'doctor' | 'admin';
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
  createdAt: string;
  isApproved: boolean;
  status?: 'active' | 'suspended' | 'pending'; // Track user status
  // File upload fields
  certificationFiles?: string[]; // Array of file URLs
  documentFiles?: string[]; // Additional documents
  profileImage?: string; // Profile image URL
}

interface Appointment {
  id?: string;
  date: string;
  doctorId: string;
  doctorName: string;
  serviceType: string;
  status: string;
  time: string;
  updatedAt: any;
  userEmail: string;
  userId: string;
  useradress: string;
  userdescription: string;
  userfirstname: string;
  userlastname: string;
  userphonenumber: string;
}

interface TrainerAppointment {
  id?: string;
  createdAt: any;
  date: string;
  doctorId: string;
  doctorName: string;
  serviceType: string;
  status: string;
  time: string;
  updatedAt: any;
  userEmail: string;
  userId: string;
  useradress: string;
  userdescription: string;
  userfirstname: string;
  userlastname: string;
  userphonenumber: string;
}

class FirebaseDataService {
  private usersCollection = 'users';

  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'trainer' | 'doctor' | 'admin';
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
        isApproved: userData.role === 'user' || userData.role === 'admin', // Auto-approve regular users and admins
        status: (userData.role === 'user' || userData.role === 'admin' ? 'active' : 'pending') as 'active' | 'suspended' | 'pending' // Set initial status
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

  async getUsersByRole(role: 'user' | 'trainer' | 'doctor' | 'admin'): Promise<User[]> {
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
      await this.updateUser(userId, { 
        isApproved: true, 
        status: 'active' as 'active' | 'suspended' | 'pending' 
      });
      console.log('User approved:', userId);
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }

  async suspendUser(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, { 
        isApproved: false, 
        status: 'suspended' as 'active' | 'suspended' | 'pending' 
      });
      console.log('User suspended:', userId);
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  }

  // Appointment management methods
  async getUserAppointments(userEmail: string): Promise<Appointment[]> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      const appointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      
      return appointments;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  }

  async getUserTrainerAppointments(userEmail: string): Promise<TrainerAppointment[]> {
    try {
      const trainerAppointmentsRef = collection(db, 'trainers-appointment');
      const q = query(trainerAppointmentsRef, where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      const trainerAppointments: TrainerAppointment[] = [];
      querySnapshot.forEach((doc) => {
        trainerAppointments.push({ id: doc.id, ...doc.data() } as TrainerAppointment);
      });
      
      return trainerAppointments;
    } catch (error) {
      console.error('Error fetching user trainer appointments:', error);
      throw error;
    }
  }

  async getAllUserAppointments(userEmail: string): Promise<{
    appointments: Appointment[];
    trainerAppointments: TrainerAppointment[];
  }> {
    try {
      const [appointments, trainerAppointments] = await Promise.all([
        this.getUserAppointments(userEmail),
        this.getUserTrainerAppointments(userEmail)
      ]);

      return {
        appointments,
        trainerAppointments
      };
    } catch (error) {
      console.error('Error fetching all user appointments:', error);
      throw error;
    }
  }

  // Enhanced user profile update with additional fields
  async updateUserProfile(userId: string, updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
  }): Promise<void> {
    try {
      const docRef = doc(db, this.usersCollection, userId);
      const updatePayload: any = {};
      
      if (updateData.firstName) updatePayload.firstName = updateData.firstName;
      if (updateData.lastName) updatePayload.lastName = updateData.lastName;
      if (updateData.email) updatePayload.email = updateData.email;
      if (updateData.phone) updatePayload.phone = updateData.phone;
      if (updateData.bio) updatePayload.bio = updateData.bio;
      
      await updateDoc(docRef, updatePayload);
      console.log('User profile updated in Firebase:', userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Exercise management functions
  async getAllExercises(): Promise<any[]> {
    try {
      let retries = 3;
      
      while (retries > 0) {
        try {
          const exercisesRef = collection(db, 'exercises');
          const exercisesSnapshot = await getDocs(exercisesRef);
          const exercises: any[] = [];
          
          exercisesSnapshot.forEach((doc) => {
            exercises.push({
              id: doc.id,
              ...doc.data()
            });
          });

          // Sort exercises by document ID (001, 002, etc.)
          exercises.sort((a, b) => a.id.localeCompare(b.id));
          
          return exercises;
        } catch (error: any) {
          retries--;
          if (error.code === 'unavailable' && retries > 0) {
            console.log(`Firestore unavailable, retrying getAllExercises... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw error;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  async addExercise(exerciseData: {
    exerciseName: string;
    description: string;
    difficulty: string;
    duration: string;
    target: string[];
    image?: string;
    trackUrl?: string;
    url?: string;
  }): Promise<string> {
    try {
      // Get the next document ID by finding the highest numbered document
      const exercisesRef = collection(db, 'exercises');
      const exercisesSnapshot = await getDocs(exercisesRef);
      
      let maxNumber = 0;
      exercisesSnapshot.forEach(doc => {
        const docId = doc.id;
        const number = parseInt(docId);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });

      // Generate next document ID (001, 002, etc.)
      const nextNumber = maxNumber + 1;
      const nextDocId = nextNumber.toString().padStart(3, '0');

      // Add the exercise with the generated ID and match the schema structure
      const exerciseRef = doc(db, 'exercises', nextDocId);
      await setDoc(exerciseRef, {
        exerciseId: nextDocId,
        exerciseName: exerciseData.exerciseName,
        description: exerciseData.description,
        difficulty: exerciseData.difficulty,
        duration: exerciseData.duration,
        target: exerciseData.target || [],
        image: exerciseData.image || '',
        trackUrl: exerciseData.trackUrl || '',
        url: exerciseData.url || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Exercise added to Firebase with ID:', nextDocId);
      return nextDocId;
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  }

  async updateExercise(exerciseId: string, exerciseData: any): Promise<void> {
    try {
      const exerciseRef = doc(db, 'exercises', exerciseId);
      await updateDoc(exerciseRef, {
        ...exerciseData,
        updatedAt: new Date().toISOString()
      });
      console.log('Exercise updated in Firebase:', exerciseId);
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    try {
      const exerciseRef = doc(db, 'exercises', exerciseId);
      await deleteDoc(exerciseRef);
      console.log('Exercise deleted from Firebase:', exerciseId);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }

  async getExerciseById(exerciseId: string): Promise<any | null> {
    try {
      const exerciseRef = doc(db, 'exercises', exerciseId);
      const exerciseSnap = await getDoc(exerciseRef);

      if (!exerciseSnap.exists()) {
        return null;
      }

      return {
        id: exerciseSnap.id,
        ...exerciseSnap.data()
      };
    } catch (error) {
      console.error('Error getting exercise by ID:', error);
      return null;
    }
  }
}

export const firebaseDataService = new FirebaseDataService();