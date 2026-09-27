import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
// Note: When custom firestoreDatabaseId is provided in config, getFirestore uses it if supported
const configWithDb = firebaseConfig as Record<string, string | undefined>;
export const db = configWithDb.firestoreDatabaseId && configWithDb.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, configWithDb.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Cloud Storage for images, diagrams, and PDF notes
export const storage = getStorage(app);

export default app;
