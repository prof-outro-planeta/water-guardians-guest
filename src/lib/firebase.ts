import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const hasRequiredConfig =
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId;
    if (!hasRequiredConfig) {
      throw new Error(
        "Firebase: variáveis de ambiente não configuradas. Verifique VITE_FIREBASE_* no .env"
      );
    }
    app = initializeApp(firebaseConfig);
  }
  return app;
}

/**
 * Retorna a instância do Firebase App (inicializa na primeira chamada).
 */
export function getApp(): FirebaseApp {
  return getFirebaseApp();
}

/**
 * Retorna o Auth do Firebase (Authentication).
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

/**
 * Retorna o Firestore (banco de dados).
 */
export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

/**
 * Retorna o Analytics (inicializado apenas no browser e se suportado).
 * Use em componentes que precisam de analytics.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (analytics) return analytics;
  const supported = await isSupported();
  if (supported) {
    analytics = getAnalytics(getFirebaseApp());
    return analytics;
  }
  return null;
}
