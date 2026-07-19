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
      // 1. Strip headers, footers and all whitespace/newlines
      const keyBody = serviceAccountObj.private_key
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s+/g, '') // removes \r, \n, spaces, tabs
        .trim();
      
      // 2. Break base64 string into 64-character chunks
      console.log('DEBUG: keyBody length:', keyBody.length)
      const chunks = keyBody.match(/.{1,64}/g);
      
      if (!chunks) {
        throw new Error('Private key body is empty or invalid base64');
      }
      
      // 3. Reconstruct clean PEM format with standard newlines
      serviceAccountObj.private_key = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;
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
