# 🔔 Notification System - Complete Setup Guide

## 📋 Environment Variables Guide

### 🖥️ SERVER (.env file)

Create `server/.env` file with these variables:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/your-database-name

# Firebase Admin SDK Service Account
# Get from: Firebase Console > Project Settings > Service Accounts > Generate Private Key
# Copy the ENTIRE JSON and paste as ONE LINE
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com","client_id":"123456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk"}

# Firebase Storage Bucket
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app

# Server Port (optional)
PORT=5000
```

---

### 💻 CLIENT (.env file)

Create `client/.env` file with these variables:

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Firebase Web App Config
# Get from: Firebase Console > Project Settings > Your apps > SDK setup and configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# Firebase VAPID Key (Web Push Certificate)
# Get from: Firebase Console > Project Settings > Cloud Messaging > Web Push certificates > Generate key pair
VITE_FIREBASE_VAPID_KEY=BJtxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔥 Firebase Console - Step by Step

### Step 1: Get Firebase Web Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new)
3. Click ⚙️ (Settings) > Project Settings
4. Scroll down to "Your apps"
5. Click "</>" (Web app icon) if not created
6. Copy all values:
   - `apiKey` → VITE_FIREBASE_API_KEY
   - `authDomain` → VITE_FIREBASE_AUTH_DOMAIN
   - `projectId` → VITE_FIREBASE_PROJECT_ID
   - `storageBucket` → VITE_FIREBASE_STORAGE_BUCKET
   - `messagingSenderId` → VITE_FIREBASE_MESSAGING_SENDER_ID
   - `appId` → VITE_FIREBASE_APP_ID

### Step 2: Get Service Account JSON (Server)

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Open the file and copy **entire content**
5. Minify it to one line (remove line breaks)
6. Paste in `FIREBASE_SERVICE_ACCOUNT_JSON`

**Example:**
```json
{"type":"service_account","project_id":"arlinjai-paradise",...}
```

### Step 3: Generate VAPID Key

1. Go to Project Settings > Cloud Messaging
2. Scroll to "Web Push certificates"
3. Click "Generate key pair"
4. Copy the key value → VITE_FIREBASE_VAPID_KEY

### Step 4: Edit Service Worker Config

**File:** `client/public/firebase-messaging-sw.js`

Replace these values with your Firebase config:

```javascript
firebase.initializeApp({
  apiKey:            'YOUR_API_KEY',          // Same as VITE_FIREBASE_API_KEY
  authDomain:        'your-project.firebaseapp.com',
  projectId:         'your-project',
  storageBucket:     'your-project.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID',
})
```

**⚠️ Important:** Service workers cannot access .env variables, so you must hardcode these values!

---

## 📁 All Files You Need

### Server Files (5 files):
```
server/
├── models/
│   ├── FcmToken.js              ✅ Already exists in your project
│   └── Notification.js          ✅ Already exists in your project
├── config/
│   └── firebase.js              ✅ Already exists in your project
├── controllers/
│   └── notificationController.js ✅ Already exists in your project
└── routes/
    └── notificationRoutes.js    ✅ Already exists in your project
```

### Client Files (4 files):
```
client/
├── src/
│   ├── firebase.js              ✅ Already exists in your project
│   ├── hooks/
│   │   └── useFCM.jsx           ✅ Already exists in your project
│   └── components/
│       └── admin/
│           └── PushNotificationCard.jsx ✅ Already exists in your project
└── public/
    └── firebase-messaging-sw.js ✅ Already exists in your project
```

---

## 🚀 Copy Files to New Project

### Method 1: Manual Copy (Simple)

1. **Create folders** in your new project
2. **Copy files** one by one from ARLINJAI PARADISE
3. **Create .env files** using the examples above
4. **Edit firebase-messaging-sw.js** with your config

### Method 2: Use Markdown File

All code is in `NOTIFICATION_SYSTEM_REUSABLE_CODE.md` file.

Just copy-paste from there!

---

## ✅ Quick Checklist

### Server Setup:
- [ ] Copy 5 server files
- [ ] Create `.env` file
- [ ] Add `FIREBASE_SERVICE_ACCOUNT_JSON`
- [ ] Add `FIREBASE_STORAGE_BUCKET`
- [ ] Add `MONGO_URI`
- [ ] Run `npm install`
- [ ] Import routes in `server.js`
- [ ] Call `initFirebase()` on startup

### Client Setup:
- [ ] Copy 4 client files
- [ ] Create `.env` file
- [ ] Add all 7 Firebase variables
- [ ] Edit `firebase-messaging-sw.js` with config
- [ ] Run `npm install`
- [ ] Add `useFCM()` in `App.jsx`
- [ ] Import `<PushNotificationCard />` in admin page

### Firebase Setup:
- [ ] Create Firebase project
- [ ] Enable Cloud Messaging
- [ ] Get web app config (7 values)
- [ ] Download service account JSON
- [ ] Generate VAPID key

---

## 🧪 Testing

1. Start server: `cd server && npm start`
2. Start client: `cd client && npm run dev`
3. Open http://localhost:5173
4. Click "Enable Alerts"
5. Click "Test Notification"
6. Check for:
   - ✅ Browser notification
   - ✅ Sound effect
   - ✅ Toast message

---

## 💡 Integration Example

```javascript
// In any controller (e.g., orderController.js)
const { sendEventNotification } = require('./notificationController')

// When new order is created
await sendEventNotification({
  title: '🛒 New Order Received',
  message: `Order #${order.id} from ${customer.name}`,
  type: 'booking',
  link: `/admin/orders/${order.id}`,
  data: {
    orderId: order.id,
    amount: order.total
  }
})
```

---

## 🔒 Security Notes

- ❌ Never commit `.env` files
- ❌ Never share service account JSON
- ✅ Add `.env` to `.gitignore`
- ✅ Use HTTPS in production
- ✅ Protect admin routes with auth middleware

---

## 📞 Troubleshooting

### No notifications received?
1. Check browser console for errors
2. Verify Firebase config in service worker
3. Check if VAPID key is correct
4. Ensure HTTPS (or localhost)

### "Firebase not initialized" error?
1. Check server console
2. Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON
3. Check if Firebase Admin SDK is installed

### Service worker not registering?
1. Must be at `/firebase-messaging-sw.js` (public folder)
2. Check browser DevTools > Application > Service Workers
3. Ensure HTTPS or localhost

---

**Ready to use! 🎉**

For full code reference, check: `NOTIFICATION_SYSTEM_REUSABLE_CODE.md`
