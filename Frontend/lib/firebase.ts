// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Function to get Firebase config with better error handling
function getFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Check if we're in development and log config status
  console.log('Firebase config check:', {
    hasApiKey: !!config.apiKey,
    hasAuthDomain: !!config.authDomain,
    hasProjectId: !!config.projectId,
    projectId: config.projectId
  });

  // Only validate in production or when we have at least the essential vars
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required Firebase environment variables in production');
    } else {
      console.warn('Firebase environment variables not fully loaded yet, using fallback config');
      // Return a fallback config for development
      return {
        apiKey: "AIzaSyDbARzitiY2mHlYL0tvTgvLJjN4QBCzNXc",
        authDomain: "wellzonelankcom.firebaseapp.com",
        projectId: "wellzonelankcom",
        storageBucket: "wellzonelankcom.appspot.com",
        messagingSenderId: "597186379285",
        appId: "1:597186379285:web:e58a19b4c910b07b25d81c",
        measurementId: "G-PM3CWZ1PSG"
      };
    }
  }

  return config;
}

// Get Firebase configuration
const firebaseConfig = getFirebaseConfig();

// Prevent re-initialization in Next.js
let app: FirebaseApp;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Analytics (only in browser)
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
