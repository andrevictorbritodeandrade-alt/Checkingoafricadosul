
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseInitialized = false;

const isValidConfig = (config: any) => {
  return config.apiKey && config.apiKey !== "undefined" && config.projectId;
};

if (isValidConfig(firebaseConfig)) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseInitialized = true;
    console.log("[Firebase] Inicializado com sucesso.");
  } catch (error) {
    console.error("[Firebase] Falha na inicialização:", error);
  }
}

const USER_ID = "andre_marcelly_sa_2026";

export type SyncStatus = 'saving' | 'saved' | 'offline' | 'online' | 'error' | 'syncing';

export const notifySyncStatus = (status: SyncStatus) => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

export const syncDataToCloud = async (collectionName: string, data: any) => {
  if (!navigator.onLine || !isFirebaseInitialized || !db) return;
  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, USER_ID), {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    notifySyncStatus('saved');
  } catch (e) {
    console.error(`[Firebase] Erro ao salvar ${collectionName}:`, e);
    notifySyncStatus('error');
  }
};

// Nova função para escutar mudanças em tempo real com tratamento de erro e "não encontrado"
export const subscribeToCloudData = (collectionName: string, callback: (data: any) => void) => {
  if (!isFirebaseInitialized || !db) {
    // Se não inicializado, avisa o componente imediatamente que não há dados na nuvem
    setTimeout(() => callback(null), 10);
    return () => {};
  }
  
  const docRef = doc(db, collectionName, USER_ID);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      notifySyncStatus('syncing');
      callback(docSnap.data());
      setTimeout(() => notifySyncStatus('saved'), 1000);
    } else {
      // Documento ainda não existe no Firestore
      callback(null);
    }
  }, (error) => {
    console.error(`[Firebase] Erro no listener de ${collectionName}:`, error);
    callback(null); // Em caso de erro, libera o carregamento da UI
  });
};

export const loadDataFromCloud = async (collectionName: string): Promise<any> => {
  if (!isFirebaseInitialized || !db || !navigator.onLine) return null;
  try {
    const docSnap = await getDoc(doc(db, collectionName, USER_ID));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    return null;
  }
};

export { db, auth };
