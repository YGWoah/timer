// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Load config from Vite environment variables (VITE_*)
// Create a `.env.local` with these values (see .env.example)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
}

// Warn when required values are missing — helpful for local dev
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    // eslint-disable-next-line no-console
    console.warn('[firebase] Some Firebase env variables are missing. Create a .env.local with the VITE_FIREBASE_* keys.')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig as Record<string, string>)

export const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export const db = getFirestore(app)

export function signInWithGoogle() {
    return signInWithPopup(auth, provider)
}

export function signOutCurrentUser() {
    return signOut(auth)
}

export default app
