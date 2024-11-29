import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPhcgINXXAjfHoEFdFFD7C0vBd4zJ4RFE",
  authDomain: "blog-store-b9ec7.firebaseapp.com",
  projectId: "blog-store-b9ec7",
  storageBucket: "blog-store-b9ec7.appspot.com",
  messagingSenderId: "155530404759",
  appId: "1:155530404759:web:54fc3a5cfd0e1ad1a71ad2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const imageDb = getStorage(app);
