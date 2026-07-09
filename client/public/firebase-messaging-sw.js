// Firebase Cloud Messaging Service Worker
// Must be served at /firebase-messaging-sw.js (public folder)
// NOTE: Service workers cannot access Vite env vars — values are hardcoded here.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:            'AIzaSyBBUGL7SGHCU1iYZGxsUdLaEfgHadYK0c0',
  authDomain:        'arlinjai-paradise.firebaseapp.com',
  projectId:         'arlinjai-paradise',
  storageBucket:     'arlinjai-paradise.firebasestorage.app',
  messagingSenderId: '844337819116',
  appId:             '1:844337819116:web:9dc79e4855335f5436a4c9',
})

const messaging = firebase.messaging()

// Handle background notifications (tab not active / app closed)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload)

  const { title, body, icon } = payload.notification || {}

  self.registration.showNotification(title || 'Arlinjai Paradise', {
    body:  body  || 'You have a new notification.',
    icon:  icon  || '/Elegant monogram with seaside emblem.webp',
    badge: '/Elegant monogram with seaside emblem.webp',
    data:  payload.data || {},
  })
})
