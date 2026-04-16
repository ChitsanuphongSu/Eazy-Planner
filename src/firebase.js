import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmfMwrhGRBKbTN25iRmQWJ0FpDXPAakTI",
  authDomain: "antigravity-planner-ac6a7.firebaseapp.com",
  projectId: "antigravity-planner-ac6a7",
  storageBucket: "antigravity-planner-ac6a7.firebasestorage.app",
  messagingSenderId: "38522680456",
  appId: "1:38522680456:web:3ed2ca16350686aa0f5b3d",
  measurementId: "G-C99HQ4JQQ7" // Optional: remove if you don't use analytics
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
