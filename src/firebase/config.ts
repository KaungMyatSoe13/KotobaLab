// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- add Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_ofLVU0x5kDmeMCWqvZF3laIuzKWaDiA",
  authDomain: "kotabalab-79d0b.firebaseapp.com",
  projectId: "kotabalab-79d0b",
  storageBucket: "kotabalab-79d0b.appspot.com",
  messagingSenderId: "783757396699",
  appId: "1:783757396699:web:9efe3afe7ffadafcdd9afe",
  measurementId: "G-VJT6Z5ZGHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);
