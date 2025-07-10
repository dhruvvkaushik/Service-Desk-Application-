import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA51tsxhe5XdV-LR3D6Z-IAA14nbXXTFRI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "service-desk-78255.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "service-desk-78255",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "service-desk-78255.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "505237250317",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:505237250317:web:ffab2590dd35561c83d044",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2KSKX4RCXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app; 