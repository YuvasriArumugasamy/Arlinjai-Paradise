import { useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../constants'

const VAPID_KEY = 'BJtgt4fymRokqBFA_gQetzbGmvD4k4-YOAyosJtrGKIRI297hcH6qXfR_66mA4U24HIJN6_XwPQ99zaLqnefHLE'

const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch (e) {
    console.warn('Audio chime error:', e)
  }
}

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
          
          // Play audio bell chime
          playNotificationSound()

          // Fire OS native notification (top of mobile / desktop)
          if (Notification.permission === 'granted') {
            new Notification(title || '🔔 New Booking Received!', {
              body: body || 'You have received a new booking.',
              icon: '/Elegant monogram with seaside emblem.webp',
            })
          }

          // Top banner notification inside website (WhatsApp / Instagram style)
          toast((t) => (
            <div className="flex items-start gap-3 p-1 font-poppins">
              <div className="text-2xl flex-shrink-0">🔔</div>
              <div>
                <h4 className="font-bold text-[#0C1E3C] text-sm">{title || 'New Booking Received!'}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{body || 'A new booking has been placed.'}</p>
              </div>
            </div>
          ), {
            duration: 7000,
            position: 'top-center',
            style: {
              background: '#ffffff',
              borderLeft: '5px solid #C9A227',
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
              borderRadius: '14px',
              padding: '14px 18px',
            }
          })
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
