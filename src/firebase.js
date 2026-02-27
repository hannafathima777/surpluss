import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";   

const firebaseConfig = {
  apiKey: "AIzaSyB4IQwY7A6DvkW6vf4CDq-ZmU0jrVLXTLo",
  authDomain: "surplus-saver-f0b75.firebaseapp.com",
  projectId: "surplus-saver-f0b75",
  storageBucket: "surplus-saver-f0b75.firebasestorage.app",
  messagingSenderId: "799073850801",
  appId: "1:799073850801:web:8e28107dc1d4259c7fd990"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);   