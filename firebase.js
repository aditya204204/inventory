// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkyZSU6xX86YtY2JCyo2GOgSGU35Ji6wk",
  authDomain: "inventory-management-49a5c.firebaseapp.com",
  projectId: "inventory-management-49a5c",
  storageBucket: "inventory-management-49a5c.appspot.com",
  messagingSenderId: "939512797204",
  appId: "1:939512797204:web:7dd498c0d7c42834d96f01",
  measurementId: "G-5LMQJ5E04E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}