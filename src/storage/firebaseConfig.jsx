import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'insert your API',
  authDomain: 'myreactproject01-e7f4a.firebaseapp.com',
  databaseURL: 'https://myreactproject01-e7f4a-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'insert your ID',
  storageBucket: 'myreactproject01-e7f4a.firebasestorage.app',
  messagingSenderId: 'insert your ID',
  appId: 'insert your ID',
  measurementId: 'insert your ID',
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);

export { storage, auth };
