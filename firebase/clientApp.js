// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = process.env.FIREBASE_CONFIG;

// Initialize Firebase
// we need to avoid nextjs rendering/ initializing the app on both the client side and serverside. Nextjs throws an error if that happens

// for Nextjs ssr renders first then client side,
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
