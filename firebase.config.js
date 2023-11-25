// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,connectAuthEmulator } from "firebase/auth";
import { getFirestore ,connectFirestoreEmulator} from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
 const FIREBASE_APP = initializeApp(firebaseConfig);
 const FIRESTORE_DB = getFirestore(FIREBASE_APP);
 const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// // if(location.hostname==='localhost'){
//   connectAuthEmulator(FIREBASE_AUTH,'http://localhost:4000/auth')
//   connectFirestoreEmulator(FIRESTORE_DB,'localhost',4000)
// // }

export {FIREBASE_APP,FIRESTORE_DB,FIREBASE_AUTH}

