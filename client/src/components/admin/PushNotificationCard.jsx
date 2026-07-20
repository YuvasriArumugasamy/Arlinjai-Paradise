import { useState, useEffect } from 'react'
import { FaBell } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { authAxios } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'

const VAPID_KEY = 'BJtgt4fymRokqBFA_gQetzbGmvD4k4-YOAyosJtrGKIRI297hcH6qXfR_66mA4U24HIJN6_XwPQ99zaLqnefHLE'

export default function PushNotificationCard() {
  const [permission, setPermission] = useState('default')
  const [loading, setLoading] = useState(false)

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    } else {
      setPermission('unsupported')
    }
  }

  useEffect(() => {
    checkPermission()
  }, [])

  const handleEnableAlerts = async () => {
    if (!('Notification' in window)) {
      toast.error('Push notifications are not supported in this browser.')
      return
    }

    try {
      setLoading(true)
      const res = await Notification.requestPermission()
      setPermission(res)

      if (res === 'granted') {
        toast.success('Push notifications enabled successfully!')

        // Attempt to register FCM token with backend
        try {
          if ('serviceWorker' in navigator) {
            const { isSupported, getToken, getMessaging } = await import('firebase/messaging')
            const { default: app } = await import('../../firebase')
            const supported = await isSupported()
            if (supported) {
              const msgInstance = getMessaging(app)
              const token = await getToken(msgInstance, { vapidKey: VAPID_KEY })
              if (token) {
                await axios.post(`${API_BASE_URL}/notifications/fcm-token`, { token })
                console.log('FCM Token registered after manual permission request')
              }
            }
          }
        } catch (fcmErr) {
          console.warn('FCM token registration info:', fcmErr?.message || fcmErr)
        }
      } else if (res === 'denied') {
        toast.error('Notification permission was denied. Please update your browser settings to allow notifications.')
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err)
      toast.error('Failed to request notification permission')
    } finally {
      setLoading(false)
    }
  }

  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      toast.error('Push notifications are not supported in this browser.')
      return
    }

    let currentPerm = Notification.permission
    if (currentPerm !== 'granted') {
      currentPerm = await Notification.requestPermission()
      setPermission(currentPerm)
    }

    if (currentPerm !== 'granted') {
      toast.error('Please click "Enable Alerts" to allow notifications first.')
      return
    }

    try {
      setLoading(true)

      const title = '🔔 Test Notification'
      const options = {
        body: 'Arlinjai Paradise: Push notifications are working perfectly on this device!',
        icon: '/favicon.ico',
        tag: 'test-notification-' + Date.now(),
      }

      // Fire native browser notification
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready
          if (registration && registration.showNotification) {
            await registration.showNotification(title, options)
          } else {
            new Notification(title, options)
          }
        } catch {
          new Notification(title, options)
        }
      } else {
        new Notification(title, options)
      }

      // Trigger server push notification test if available
      try {
        await authAxios.post(`${API_BASE_URL}/notifications/send`, {
          title: '🔔 Push Notification Test',
          body: 'This is a test notification from Arlinjai Paradise admin panel.',
        })
      } catch (backendErr) {
        console.warn('Backend notification send result:', backendErr?.response?.data || backendErr?.message)
      }

      toast.success('Test notification triggered!')
    } catch (err) {
      console.error('Test notification error:', err)
      toast.error('Failed to trigger test notification: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const getStatusDisplay = () => {
    switch (permission) {
      case 'granted':
        return <span className="font-bold text-emerald-600">Granted</span>
      case 'denied':
        return <span className="font-bold text-[#D32F2F]">Denied</span>
      case 'default':
        return <span className="font-bold text-amber-600">Default (Prompt)</span>
      default:
        return <span className="font-bold text-gray-500">Not Supported</span>
    }
  }

  return (
    <div className="bg-[#EBF5FB] border border-[#D0E8F9] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2.5 text-[#0C1E3C]">
          <FaBell className="text-[#0084C7] text-xl flex-shrink-0" />
          <h3 className="font-playfair font-bold text-lg sm:text-xl text-[#0C1E3C]">
            Push Notifications
          </h3>
        </div>
        <p className="font-poppins text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Receive instant alerts on this device when a new booking is requested or paid.
        </p>
        <div className="font-poppins text-xs sm:text-sm pt-1">
          <span className="text-slate-700 font-medium">Status: </span>
          {getStatusDisplay()}
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
        <button
          onClick={handleEnableAlerts}
          disabled={loading || permission === 'granted'}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-poppins font-medium text-xs sm:text-sm text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-2
            ${permission === 'granted'
              ? 'bg-slate-400 cursor-not-allowed opacity-80'
              : 'bg-[#0084C7] hover:bg-[#0073B0] active:scale-95'
            }`}
        >
          {permission === 'granted' ? 'Alerts Enabled' : 'Enable Alerts'}
        </button>

        <button
          onClick={handleTestNotification}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-poppins font-medium text-xs sm:text-sm text-white bg-[#22AD4E] hover:bg-[#1C9643] active:scale-95 shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🔔</span> Test Notification
        </button>
      </div>
    </div>
  )
}
