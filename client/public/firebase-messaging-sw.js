// Firebase Cloud Messaging Service Worker
// This file MUST be in the /public root (served at /firebase-messaging-sw.js)

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

// NOTE: These values must match your Firebase project config exactly.
// Service workers cannot read Vite env vars, so hardcode them here.
firebase.initializeApp({
  apiKey:            'REPLACE_WITH_YOUR_API_KEY',
  authDomain:        'REPLACE_WITH_YOUR_AUTH_DOMAIN',
  projectId:         'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket:     'REPLACE_WITH_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_YOUR_SENDER_ID',
  appId:             'REPLACE_WITH_YOUR_APP_ID',
})

const messaging = firebase.messaging()

// Handle background notifications (when app tab is not active)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background notification received:', payload)

  const { title, body, icon } = payload.notification || {}

  self.registration.showNotification(title || 'Arlinjai Paradise', {
    body:  body  || 'You have a new notification.',
    icon:  icon  || '/Elegant monogram with seaside emblem.png',
    badge: '/Elegant monogram with seaside emblem.png',
    data:  payload.data || {},
  })
})
