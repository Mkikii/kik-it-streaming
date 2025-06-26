// /firebase/auth.js
import { getAuth } from "firebase/auth";
import app from "./firebase-config.js";

const auth = getAuth(app);

// Authentication functions
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  return signOut(auth);
};