// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCiAeQUws0MGTd68V8Og3or4s6C5yP8KZ8",
  authDomain: "vue-login-95ea8.firebaseapp.com",
  projectId: "vue-login-95ea8",
  storageBucket: "vue-login-95ea8.appspot.com",
  messagingSenderId: "190760846153",
  appId: "1:190760846153:web:33d579b369744c43cad098",
  measurementId: "G-4LVXH0X1SL",
  databaseURL: "https://vue-login-95ea8-default-rtdb.europe-west1.firebasedatabase.app/",
};

const firestoreConfig = {
  apiKey: "AIzaSyBt0Vl_SsNbO3-qXld_Dadal50uEGDKcTI",
  authDomain: "social-network-c6c0f.firebaseapp.com",
  projectId: "social-network-c6c0f",
  storageBucket: "social-network-c6c0f.appspot.com",
  messagingSenderId: "1080204576792",
  appId: "1:1080204576792:web:ae6162023e075813771b6d"
};


// const firebaseConfig = {
//   apiKey: "AIzaSyBt0Vl_SsNbO3-qXld_Dadal50uEGDKcTI",
//   authDomain: "social-network-c6c0f.firebaseapp.com",
//   projectId: "social-network-c6c0f",
//   storageBucket: "social-network-c6c0f.appspot.com",
//   messagingSenderId: "1080204576792",
//   appId: "1:1080204576792:web:6a06b64ff2546b30771b6d"
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig, 'main');
const firestoreApp = initializeApp(firestoreConfig, 'chat');

export const db = getDatabase(app);
export const storage = getStorage(app)
export const firestoreDB = getFirestore(firestoreApp)
export const auth = getAuth(app);

export default {db, auth, firestoreDB}