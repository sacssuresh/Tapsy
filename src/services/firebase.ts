import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration
 * All values must be provided via environment variables prefixed with EXPO_PUBLIC_
 * Set these in your .env file for local development or in EAS Build secrets for production
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let db;
let isConfigured = false;

// Check if Firebase config has all required values from environment variables
const hasValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain &&
  firebaseConfig.projectId && 
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

try {
  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isConfigured = true;
  } else {
    console.warn('Firebase not configured: Missing required EXPO_PUBLIC_FIREBASE_* environment variables. Please set them in your .env file or EAS Build secrets.');
  }
} catch (error) {
  console.warn('Firebase initialization error:', error);
  // Firebase will be disabled if config is invalid
}

export { db, isConfigured };
export default app;

