import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

// Do NOT import `firebase/messaging` at module load — that module
// assumes browser APIs and can crash during build/SSR. Consumers
// should dynamically import messaging when needed (see `useFCM`).
export default app

// Helper if a consumer wants a safe messaging instance.
export async function getSafeMessaging() {
  try {
    const { isSupported, getMessaging } = await import('firebase/messaging')
    const supported = await isSupported()
    if (!supported) return null
    return getMessaging(app)
  } catch (err) {
    return null
  }
}
