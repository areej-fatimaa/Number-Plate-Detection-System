import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const emailJsConfig = {
  userId: "LKOkd2n2csKMNKOEW", // User ID from Email.js
  serviceId: "service_wsypetg", // Service ID
  templateId: "template_bgu53nn", // Template ID
};

const firebaseConfig = {
  apiKey: "AIzaSyBBYnunTLqpZcMFA3HNCvdAtJZuWkbxj6g",
  authDomain: "automated-number-plate.firebaseapp.com",
  projectId: "automated-number-plate",
  storageBucket: "automated-number-plate.firebasestorage.app",
  messagingSenderId: "508136746108",
  appId: "1:508136746108:web:d6a8688340c2f8b958adf9",
  measurementId: "G-JWBEJJ5EN4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  
export const firestore = getFirestore(app);