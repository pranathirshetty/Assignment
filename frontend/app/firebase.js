// 🔥 Firebase core
import { initializeApp } from "firebase/app";

// 🔥 Firebase Auth (THIS WAS MISSING)
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBMOyYGz_9g83jWbNKY0w7F8REqDP8jIAQ",
  authDomain: "hungry-hut-f6291.firebaseapp.com",
  projectId: "hungry-hut-f6291",
  storageBucket: "hungry-hut-f6291.appspot.com",
  messagingSenderId: "40632436772",
  appId: "1:40632436772:web:91a46afe5a7942c972f0b1",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ INIT AUTH (THIS LINE IS IMPORTANT)
export const auth = getAuth(app);

// ✅ SIGN UP
export async function createAccount(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  localStorage.setItem("loggedIn", "true");
  return userCredential.user;
}

// ✅ LOGIN
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  localStorage.setItem("loggedIn", "true");
  return userCredential.user;
}

// ✅ LOGOUT (YOU ASKED FOR IT 😌)
export function logout() {
  localStorage.removeItem("loggedIn");
}
