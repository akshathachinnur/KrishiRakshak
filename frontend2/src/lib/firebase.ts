import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DiagnosisRecord, CropPlanRecord, ChatMessage } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Firestore with specific databaseId from config
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const loginAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error: any) {
    console.error('Anonymous Sign In Error:', error);
    throw error;
  }
};

export const logOutUser = async () => {
  return signOut(auth);
};

// Real-Time Database Helpers for Crop Health & Telemetry Data
export const saveDiagnosisToCloud = async (userId: string, data: Omit<DiagnosisRecord, 'id' | 'timestamp'>) => {
  try {
    const collRef = collection(db, 'users', userId, 'diagnoses');
    const docRef = await addDoc(collRef, {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      clientTimestamp: Date.now()
    });

    // Also optionally write an alert to public diagnoses if critical
    if (data.status === 'critical') {
      try {
        const publicColl = collection(db, 'public_diagnoses');
        await addDoc(publicColl, {
          diseaseName: data.diseaseName,
          cropName: data.cropName,
          status: data.status,
          userId,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        // Non-fatal if public rules restrict
      }
    }

    return docRef.id;
  } catch (err) {
    console.error('Failed to save diagnosis to Firestore:', err);
    throw err;
  }
};

export const subscribeToDiagnoses = (userId: string, callback: (records: DiagnosisRecord[]) => void) => {
  const collRef = collection(db, 'users', userId, 'diagnoses');
  const q = query(collRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const list: DiagnosisRecord[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        userId: data.userId || userId,
        cropName: data.cropName,
        diseaseName: data.diseaseName,
        scientificName: data.scientificName || '',
        confidence: data.confidence || 0,
        status: data.status || 'warning',
        description: data.description || '',
        organicTreatment: data.organicTreatment || '',
        chemicalTreatment: data.chemicalTreatment || '',
        imageUrl: data.imageUrl,
        timestamp: data.clientTimestamp || (data.createdAt ? (data.createdAt as Timestamp).toMillis() : Date.now()),
        fieldName: data.fieldName || 'Main Field Sector A',
      });
    });
    callback(list);
  }, (err) => {
    console.warn('Firestore subscription error (diagnoses):', err);
    // Fallback: empty or local list
  });
};

export const deleteDiagnosisRecord = async (userId: string, recordId: string) => {
  const docRef = doc(db, 'users', userId, 'diagnoses', recordId);
  return deleteDoc(docRef);
};

// Crop Plan Synchronization
export const saveCropPlanToCloud = async (userId: string, plan: Omit<CropPlanRecord, 'id' | 'timestamp'>) => {
  const collRef = collection(db, 'users', userId, 'crop_plans');
  const docRef = await addDoc(collRef, {
    ...plan,
    userId,
    createdAt: serverTimestamp(),
    clientTimestamp: Date.now()
  });
  return docRef.id;
};

export const subscribeToCropPlans = (userId: string, callback: (plans: CropPlanRecord[]) => void) => {
  const collRef = collection(db, 'users', userId, 'crop_plans');
  const q = query(collRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const list: CropPlanRecord[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        userId: data.userId || userId,
        cropName: data.cropName,
        metrics: data.metrics,
        yieldEstimate: data.yieldEstimate,
        netMargin: data.netMargin,
        timestamp: data.clientTimestamp || Date.now(),
        regionPreset: data.regionPreset,
      });
    });
    callback(list);
  }, (err) => {
    console.warn('Firestore subscription error (crop plans):', err);
  });
};
