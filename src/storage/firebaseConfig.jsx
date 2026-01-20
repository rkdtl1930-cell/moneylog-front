import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWDxkFUme878Qj62oR5HgPR8M-XQZR72U",
  authDomain: "myreactproject01-e7f4a.firebaseapp.com",
  databaseURL: "https://myreactproject01-e7f4a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myreactproject01-e7f4a",
  storageBucket: "myreactproject01-e7f4a.firebasestorage.app",
  messagingSenderId: "657804898140",
  appId: "1:657804898140:web:566465aaa6129149bb5b99",
  measurementId: "G-QBT1KJ1CT7"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);

export { storage, auth };