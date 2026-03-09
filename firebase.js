// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrhicE_wx2tVltAH-nWlkzQxDeVt-nhaY",
  authDomain: "resq-3c69e.firebaseapp.com",
  projectId: "resq-3c69e",
  storageBucket: "resq-3c69e.firebasestorage.app",
  messagingSenderId: "1096107960292",
  appId: "1:1096107960292:web:5495ae3d98e72b83fd49f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
