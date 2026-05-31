import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB_0UId-fxh4_ZQies-PiCSHLnOilkRXjQ",
  authDomain: "truvish-otp.firebaseapp.com",
  projectId: "truvish-otp",
  storageBucket: "truvish-otp.firebasestorage.app",
  messagingSenderId: "375412031048",
  appId: "1:375412031048:web:68114567a497bb0d83227d",
  measurementId: "G-TZG4SLMBWC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ AUTH EXPORT (THIS WAS MISSING)
export const auth = getAuth(app);

// Analytics (optional)
export const analytics = getAnalytics(app);