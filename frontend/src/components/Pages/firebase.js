// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLb5_QbCdXDBkcTwSbfKIrGkOdQyWeoOE",
  authDomain: "tedtalks-1d656.firebaseapp.com",
  projectId: "tedtalks-1d656",
  storageBucket: "tedtalks-1d656.firebasestorage.app",
  messagingSenderId: "954506680806",
  appId: "1:954506680806:web:69de695c2e6418da0b1e27",
  measurementId: "G-945WSN5GRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export default app;