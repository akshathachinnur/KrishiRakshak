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
  getDoc,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DiagnosisRecord, CropPlanRecord, ChatMessage, DiseaseReport, FarmProfile } from '../types';
import { INITIAL_DEMO_REPORTS, DEFAULT_TEST_FARM } from './geoUtils';


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
        foliarLesionPercent: typeof data.foliarLesionPercent === 'number' ? data.foliarLesionPercent : (data.status === 'optimal' ? 0 : data.status === 'critical' ? 75 : 30),
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

// ==========================================
// Farm Profile & Location Management
// ==========================================
export const saveFarmProfileToCloud = async (userId: string, profile: FarmProfile): Promise<void> => {
  try {
    const profileDocRef = doc(db, 'users', userId, 'profile', 'farm');
    await setDoc(profileDocRef, {
      ...profile,
      updatedAt: serverTimestamp(),
      clientTimestamp: Date.now()
    }, { merge: true });

    // Also persist in localStorage for instant offline access
    localStorage.setItem(`krishi_farm_profile_${userId}`, JSON.stringify(profile));
  } catch (err) {
    console.warn('Could not save farm profile to Firestore, saving to local storage:', err);
    localStorage.setItem(`krishi_farm_profile_${userId}`, JSON.stringify(profile));
  }
};

export const subscribeToFarmProfile = (
  userId: string,
  callback: (profile: FarmProfile | null) => void
) => {
  // First check local storage for instant initial paint
  const local = localStorage.getItem(`krishi_farm_profile_${userId}`);
  if (local) {
    try {
      callback(JSON.parse(local));
    } catch (_) {}
  }

  const profileDocRef = doc(db, 'users', userId, 'profile', 'farm');
  return onSnapshot(profileDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const profile: FarmProfile = {
        farmName: data.farmName || 'Registered Farm',
        crop: data.crop || 'Mixed Crops',
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        updatedAt: data.clientTimestamp || Date.now()
      };
      localStorage.setItem(`krishi_farm_profile_${userId}`, JSON.stringify(profile));
      callback(profile);
    } else if (!local) {
      callback(null);
    }
  }, (err) => {
    console.warn('Firestore subscription error (farm profile):', err);
    if (local) {
      try {
        callback(JSON.parse(local));
      } catch (_) {}
    }
  });
};

// ==========================================
// Disease Surveillance & Hotspot Reports
// ==========================================
export const saveDiseaseReportToCloud = async (
  report: Omit<DiseaseReport, 'id'>
): Promise<string> => {
  try {
    const collRef = collection(db, 'disease_reports');
    const docRef = await addDoc(collRef, {
      ...report,
      createdAt: serverTimestamp(),
      clientTimestamp: Date.now()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Could not save disease report to Firestore (offline fallback):', err);
    // Offline local persistence for resilience
    const localReports: DiseaseReport[] = JSON.parse(
      localStorage.getItem('krishi_local_disease_reports') || '[]'
    );
    const newReport: DiseaseReport = {
      ...report,
      id: `local-${Date.now()}`
    };
    localReports.unshift(newReport);
    localStorage.setItem('krishi_local_disease_reports', JSON.stringify(localReports));
    return newReport.id!;
  }
};

export const subscribeToDiseaseReports = (
  callback: (reports: DiseaseReport[]) => void
) => {
  const collRef = collection(db, 'disease_reports');
  const q = query(collRef, orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const cloudReports: DiseaseReport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        cloudReports.push({
          id: docSnap.id,
          farmerId: data.farmerId || 'anonymous',
          farmerName: data.farmerName,
          crop: data.crop || 'Crop',
          disease: data.disease || 'Unknown Pathology',
          scientificName: data.scientificName,
          confidence: data.confidence || 90,
          severity: data.severity || 'medium',
          latitude: data.latitude,
          longitude: data.longitude,
          locationName: data.locationName,
          imageUrl: data.imageUrl,
          reportedAt: data.clientTimestamp || (data.createdAt ? (data.createdAt as Timestamp).toMillis() : Date.now()),
          source: data.source || 'leaf_scan',
          status: data.status || 'ai_detected',
          precautions: data.precautions || [],
          warning: data.warning
        });
      }
    });

    // Merge with any offline local reports + initial demo reports for comprehensive coverage
    const localReports: DiseaseReport[] = JSON.parse(
      localStorage.getItem('krishi_local_disease_reports') || '[]'
    );
    
    // Combine and deduplicate
    const combined = [...localReports, ...cloudReports];
    if (combined.length === 0) {
      // Seed with initial realistic demo reports if Firestore collection is fresh
      callback(INITIAL_DEMO_REPORTS);
    } else {
      // Combine demo reports if not present
      const demoToAdd = INITIAL_DEMO_REPORTS.filter(
        d => !combined.some(c => c.disease === d.disease && Math.abs(c.latitude - d.latitude) < 0.001)
      );
      callback([...combined, ...demoToAdd]);
    }
  }, (err) => {
    console.warn('Firestore subscription error (disease reports, using demo seed):', err);
    const localReports: DiseaseReport[] = JSON.parse(
      localStorage.getItem('krishi_local_disease_reports') || '[]'
    );
    callback([...localReports, ...INITIAL_DEMO_REPORTS]);
  });
};

