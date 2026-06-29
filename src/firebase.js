import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_0UId-fxh4_ZQies-PiCSHLnOilkRXjQ",
  authDomain: "truvish-otp.firebaseapp.com",
  projectId: "truvish-otp",
  storageBucket: "truvish-otp.firebasestorage.app",
  messagingSenderId: "375412031048",
  appId: "1:375412031048:web:68114567a497bb0d83227d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);