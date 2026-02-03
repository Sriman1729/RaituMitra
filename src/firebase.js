// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABRjioyxafMXaXZVfQn5LlwPudQysB2xg",
  authDomain: "agriassistdashboard.firebaseapp.com",
  projectId: "agriassistdashboard",
  storageBucket: "agriassistdashboard.appspot.com", // ✅ fixed "sstorageBucket" typo
  messagingSenderId: "1083756635791",
  appId: "1:1083756635791:web:5266c7ceb70724a505f2fa",
  measurementId: "G-0VT1847EF3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export commonly used services
export const auth = getAuth(app);
export const db = getFirestore(app);
