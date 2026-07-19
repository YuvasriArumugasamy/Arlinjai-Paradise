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
      let key = serviceAccountObj.private_key
      // Convert double escaped newlines to real newlines (common in Render environment variables)
      key = key.replace(/\\n/g, '\n')
      
      // If it doesn't have standard newlines, rebuild it in PEM format
      if (!key.includes('\n') || key.split('\n').length < 3) {
        const body = key
          .replace('-----BEGIN PRIVATE KEY-----', '')
          .replace('-----END PRIVATE KEY-----', '')
          .replace(/\s+/g, '')
          .trim()
        const chunks = body.match(/.{1,64}/g)
        if (chunks) {
          key = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`
        }
      }
      
      serviceAccountObj.private_key = key
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountObj),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'arlinjai-paradise.firebasestorage.app',
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
