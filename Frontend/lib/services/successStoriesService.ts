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

export interface SuccessStory {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  profileImage: string;
  achievement: string;
  story: string;
  rating: number;
  isApproved: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION_NAME = 'successStories';

// Add a new success story
export const addSuccessStory = async (story: Omit<SuccessStory, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>): Promise<string> => {
  try {
    const storyData = {
      ...story,
      isApproved: false, // Stories need admin approval
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), storyData);
    console.log('Success story added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding success story:', error);
    throw error;
  }
};

// Get all approved success stories
export const getApprovedSuccessStories = async (): Promise<SuccessStory[]> => {
  try {
    // First get all documents to debug
    const allDocsQuery = query(collection(db, COLLECTION_NAME));
    const allDocsSnapshot = await getDocs(allDocsQuery);
    
    console.log('All success stories documents:');
    allDocsSnapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Document data:', doc.data());
    });
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isApproved', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const stories: SuccessStory[] = [];
    
    querySnapshot.forEach((doc) => {
      console.log('Approved story found:', doc.id, doc.data());
      stories.push({
        id: doc.id,
        ...doc.data()
      } as SuccessStory);
    });
    
    console.log('Total approved stories found:', stories.length);
    
    // Sort by createdAt in JavaScript instead of Firestore
    stories.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    
    return stories;
  } catch (error) {
    console.error('Error fetching approved success stories:', error);
    throw error;
  }
};

// Get all success stories (for admin)
export const getAllSuccessStories = async (): Promise<SuccessStory[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const stories: SuccessStory[] = [];
    
    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data()
      } as SuccessStory);
    });
    
    // Sort by createdAt in JavaScript instead of Firestore
    stories.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    
    return stories;
  } catch (error) {
    console.error('Error fetching all success stories:', error);
    throw error;
  }
};

// Get pending success stories (for admin review)
export const getPendingSuccessStories = async (): Promise<SuccessStory[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isApproved', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const stories: SuccessStory[] = [];
    
    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data()
      } as SuccessStory);
    });
    
    // Sort by createdAt in JavaScript instead of Firestore
    stories.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    
    return stories;
  } catch (error) {
    console.error('Error fetching pending success stories:', error);
    throw error;
  }
};

// Get user's own success stories
export const getUserSuccessStories = async (userId: string): Promise<SuccessStory[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const stories: SuccessStory[] = [];
    
    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data()
      } as SuccessStory);
    });
    
    // Sort by createdAt in JavaScript instead of Firestore
    stories.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
    
    return stories;
  } catch (error) {
    console.error('Error fetching user success stories:', error);
    throw error;
  }
};

// Update a success story
export const updateSuccessStory = async (storyId: string, updates: Partial<SuccessStory>): Promise<void> => {
  try {
    const storyRef = doc(db, COLLECTION_NAME, storyId);
    await updateDoc(storyRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Success story updated:', storyId);
  } catch (error) {
    console.error('Error updating success story:', error);
    throw error;
  }
};

// Delete a success story
export const deleteSuccessStory = async (storyId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, storyId));
    console.log('Success story deleted:', storyId);
  } catch (error) {
    console.error('Error deleting success story:', error);
    throw error;
  }
};

// Approve a success story (admin only)
export const approveSuccessStory = async (storyId: string): Promise<void> => {
  try {
    const storyRef = doc(db, COLLECTION_NAME, storyId);
    await updateDoc(storyRef, {
      isApproved: true,
      updatedAt: serverTimestamp()
    });
    console.log('Success story approved:', storyId);
  } catch (error) {
    console.error('Error approving success story:', error);
    throw error;
  }
};