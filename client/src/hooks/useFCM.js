import { useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

const VAPID_KEY = 'BJtgt4fymRokqBFA_gQetzbGmvD4k4-YOAyosJtrGKIRI297hcH6qXfR_66mA4U24HIJN6_XwPQ99zaLqnefHLE'

/**
 * Safely initializes Firebase Cloud Messaging.
 * If Firebase is unavailable or not supported, silently skips — app will NOT crash.
 */
export function useFCM() {
  useEffect(() => {
    const initFCM = async () => {
      try {
        // Check browser support
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return

        // Dynamically import firebase to avoid SSR / build issues
        const { isSupported, getToken, onMessage, getMessaging } = await import('firebase/messaging')
        const { default: app } = await import('../firebase')

        const supported = await isSupported()
        if (!supported) return

        const msgInstance = getMessaging(app)

        // Request permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        // Get FCM token
        const token = await getToken(msgInstance, { vapidKey: VAPID_KEY })
        if (!token) return

        console.log('FCM Token ready')

        // Save token to backend (fire-and-forget)
        axios.post(`${API_BASE_URL}/notifications/fcm-token`, { token }).catch(() => {})

        // Handle foreground notifications
        const unsubscribe = onMessage(msgInstance, (payload) => {
          const { title, body } = payload.notification || {}
          if (Notification.permission === 'granted') {
            new Notification(title || 'Arlinjai Paradise', {
              body: body || 'You have a new notification.',
              icon: '/Elegant monogram with seaside emblem.webp',
            })
          }
        })

        return unsubscribe
      } catch (err) {
        // Silent fail — never crash the app
        console.warn('FCM init skipped:', err.message)
      }
    }

    let cleanup
    initFCM().then((unsub) => { cleanup = unsub })
    return () => { if (cleanup) cleanup() }
  }, [])
}
