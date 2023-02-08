import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIo7DoweV2X7UabTZIDTtVgDzo2Gti-QU",
  authDomain: "bg-removal-app.firebaseapp.com",
  projectId: "bg-removal-app",
  storageBucket: "bg-removal-app.appspot.com",
  messagingSenderId: "529324623515",
  appId: "1:529324623515:web:6e5942b20e3cb04677683e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
