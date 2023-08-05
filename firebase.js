// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_JC7XViB4WaBN24yFmT2MMyPmI7LouCs",
  authDomain: "whatstat-90e21.firebaseapp.com",
  projectId: "whatstat-90e21",
  storageBucket: "whatstat-90e21.appspot.com",
  messagingSenderId: "327677023745",
  appId: "1:327677023745:web:98ca7f49baf168f0cfd200",
  measurementId: "G-YRX1SZ6P9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);