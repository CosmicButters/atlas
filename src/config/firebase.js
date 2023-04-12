import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyACvNLl5xtNPmprTYcw5rOWP-qwBc0NOig",
    authDomain: "atlas-519b5.firebaseapp.com",
    projectId: "atlas-519b5",
    storageBucket: "atlas-519b5.appspot.com",
    messagingSenderId: "222221597236",
    appId: "1:222221597236:web:556b53a91302d70de82861",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

console.log("Firebase initialized");
