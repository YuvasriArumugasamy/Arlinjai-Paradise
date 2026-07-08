import { useEffect } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '../firebase'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

const VAPID_KEY = 'BJtgt4fymRokqBFA_gQetzbGmvD4k4-YOAyosJtrGKIRI297hcH6qXfR_66mA4U24HIJN6_XwPQ99zaLqnefHLE'

/**
 * Requests notification permission, gets FCM token,
 * saves it to backend, and listens for foreground messages.
 */
export function useFCM() {
  useEffect(() => {
    const initFCM = async () => {
      try {
        // 1. Request permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          console.log('Notification permission denied.')
          return
        }

        // 2. Get FCM token
        const token = await getToken(messaging, { vapidKey: VAPID_KEY })
        if (!token) {
          console.warn('No FCM token received.')
          return
        }

        console.log('FCM Token:', token)

        // 3. Save token to backend
        await axios.post(`${API_BASE_URL}/notifications/fcm-token`, { token })

      } catch (err) {
        console.error('FCM init error:', err)
      }
    }

    initFCM()

    // 4. Handle foreground notifications (when tab is active)
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FCM] Foreground message:', payload)
      const { title, body } = payload.notification || {}

      // Show a native browser notification even when tab is open
      if (Notification.permission === 'granted') {
        new Notification(title || 'Arlinjai Paradise', {
          body:  body || 'You have a new notification.',
          icon:  '/Elegant monogram with seaside emblem.png',
        })
      }
    })

    return () => unsubscribe()
  }, [])
}
