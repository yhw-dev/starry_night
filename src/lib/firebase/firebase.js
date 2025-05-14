// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFndnFafVysVKPOpKpjf-1MmyvCHVe5PE",
  authDomain: "starry-night-8f28c.firebaseapp.com",
  projectId: "starry-night-8f28c",
  storageBucket: "starry-night-8f28c.firebasestorage.app",
  messagingSenderId: "379717652242",
  appId: "1:379717652242:web:1f382c6d45366d1a342dcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 인증관련
export const auth = getAuth(app);

// 데이터 베이스 관련
export const db = getFirestore(app);

//구글 인증 관련
export const googleProvider = new GoogleAuthProvider()