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
      console.log('DEBUG: Private Key Length:', serviceAccountObj.private_key.length)
      console.log('DEBUG: Starts with header:', serviceAccountObj.private_key.startsWith('-----BEGIN PRIVATE KEY-----'))
      console.log('DEBUG: Ends with footer:', serviceAccountObj.private_key.trim().endsWith('-----END PRIVATE KEY-----'))
      console.log('DEBUG: Contains real newlines:', serviceAccountObj.private_key.includes('\n'))
      console.log('DEBUG: Contains escaped newlines:', serviceAccountObj.private_key.includes('\\n'))
      
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
