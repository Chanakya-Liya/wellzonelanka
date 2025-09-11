// Development Firebase configuration with better error handling
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth, connectAuthEmulator } from "firebase/auth";
import { Firestore, getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { FirebaseStorage, getStorage, connectStorageEmulator } from "firebase/storage";

const isDevelopment = process.env.NODE_ENV === 'development';

// For development, use Firebase emulators if API key is invalid
const useEmulators = isDevelopment && (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length < 30);

// Minimal config for emulators
const firebaseConfig = useEmulators ? {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id"
} : {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  if (useEmulators) {
    console.log('🔧 Using Firebase emulators for development');
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Connect to emulators in development if using demo config
if (useEmulators && typeof window !== "undefined") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
  } catch (error) {
    console.log("Emulators already connected or not available");
  }
}

export default app;