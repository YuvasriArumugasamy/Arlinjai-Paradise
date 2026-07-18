const admin = require('firebase-admin')

let initialized = false

const initFirebase = () => {
  if (initialized) return admin

  // Requires FIREBASE_SERVICE_ACCOUNT_JSON env var
  // Set this to the JSON string from your Firebase service account key
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (!serviceAccount) {
    console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_JSON not set — push notifications disabled.')
    return null
  }

  try {
    const serviceAccountObj = JSON.parse(serviceAccount)
    if (serviceAccountObj.private_key) {
      serviceAccountObj.private_key = serviceAccountObj.private_key.replace(/\\n/g, '\n')
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountObj),
    })
    initialized = true
    console.log('✅ Firebase Admin SDK initialized')
  } catch (err) {
    console.error('❌ Firebase Admin init failed:', err.message)
    return null
  }

  return admin
}

module.exports = { initFirebase, admin }
