import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD1NiGkzuKgXm_7Goj7UrIwqtP6OcrFwn0",
  authDomain: "mizan-money-app.firebaseapp.com",
  projectId: "mizan-money-app",
  storageBucket: "mizan-money-app.firebasestorage.app",
  messagingSenderId: "295810463616",
  appId: "1:295810463616:web:7a719106cfe72889637365",
  measurementId: "G-P97WJP3EJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
