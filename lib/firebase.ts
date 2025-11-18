import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Uses environment variables if available, otherwise falls back to provided values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBq8p7f-0gokiALj6DlBsF-l3lunEUw7Sk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "playitloud-1e8fe.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "playitloud-1e8fe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "playitloud-1e8fe.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "547064693002",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:547064693002:web:bc750b0c3ec51153c53af3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4PDMHWGK48"
};

// Initialize Firebase (only on client side)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Initialize Firebase App
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Analytics (only in browser)
  analytics = getAnalytics(app);

  // Initialize Auth
  auth = getAuth(app);

  // Initialize Firestore
  db = getFirestore(app);

  // Initialize Storage
  storage = getStorage(app);
}

export { app, analytics, auth, db, storage };
export default app;

