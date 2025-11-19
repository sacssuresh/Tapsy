import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAC6NedahjvftUxVFGI7QzaMim6ve1-M-M',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tapsy-86d66.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'tapsy-86d66',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tapsy-86d66.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '248726784780',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:248726784780:web:c5966c379d6fdaa9fdd729',
};

// Initialize Firebase
let app;
let db;
let isConfigured = false;

// Check if Firebase config has real values (not placeholders)
const hasValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your-api-key' &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'your-project-id';

try {
  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isConfigured = true;
  } else {
    console.warn('Firebase not configured: Using placeholder values. Please set EXPO_PUBLIC_FIREBASE_* environment variables.');
  }
} catch (error) {
  console.warn('Firebase initialization error:', error);
  // Firebase will be disabled if config is invalid
}

export { db, isConfigured };
export default app;

