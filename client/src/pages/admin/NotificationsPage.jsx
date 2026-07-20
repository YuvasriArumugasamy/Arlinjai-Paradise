import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTrash, FaBell, FaEnvelopeOpen, FaTimes, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authAxios } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'
import PushNotificationCard from '../../components/admin/PushNotificationCard'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMode, setFilterMode] = useState('month')
  const [selectedNotification, setSelectedNotification] = useState(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await authAxios.get(`${API_BASE_URL}/notifications?limit=100`)
      if (res.data.success) setNotifications(res.data.notifications || [])
    } catch (err) {
      console.error('Failed to fetch notifications:', err?.response || err)
      const msg = err?.response?.data?.message || err.message || 'Unable to load notifications'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markRead = async (id) => {
    try {
      const res = await authAxios.patch(`${API_BASE_URL}/notifications/${id}/read`)
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)))
        if (selectedNotification?._id === id) setSelectedNotification((prev) => ({ ...prev, read: true }))
      }
    } catch (err) {
      console.error('Failed to mark read:', err?.response || err)
      const msg = err?.response?.data?.message || 'Unable to mark notification read'
      toast.error(msg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return
    try {
      const res = await authAxios.delete(`${API_BASE_URL}/notifications/${id}`)
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id))
        if (selectedNotification?._id === id) setSelectedNotification(null)
        toast.success('Notification deleted')
      }
    } catch (err) {
      console.error('Failed to delete notification:', err?.response || err)
      const msg = err?.response?.data?.message || 'Failed to delete notification'
      toast.error(msg)
    }
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const filtered = notifications.filter((notification) => {
    if (filterMode === 'all') return true
    return new Date(notification.createdAt) >= startOfMonth
  })

  const unreadCount = filtered.filter((notification) => !notification.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Admin Notifications</h2>
          <p className="font-poppins text-sm text-gray-500">
            {unreadCount} unread · {filtered.length} notifications
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <FaCalendarAlt className="text-slate-400 mr-2.5" size={14} />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="appearance-none bg-transparent font-poppins font-semibold text-sm text-slate-700 outline-none pr-6 cursor-pointer border-none p-0"
            >
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <PushNotificationCard />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {filtered.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedNotification(notification)
                  if (!notification.read) markRead(notification._id)
                }}
                className={`bg-white rounded-xl p-4 shadow-card cursor-pointer border-2 transition-all
                  ${selectedNotification?._id === notification._id ? 'border-gold' : 'border-transparent'}
                  hover:border-gold hover:border-opacity-50`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBell
                        size={14}
                        className={notification.read ? 'text-gray-400' : 'text-gold'}
                      />
                      <p className={`font-poppins text-sm truncate ${notification.read ? 'text-gray-600' : 'text-navy font-semibold'}`}>
                        {notification.title}
                      </p>
                    </div>
                    <p className="font-poppins text-xs text-gray-500 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-semibold uppercase ${notification.read ? 'text-gray-400' : 'text-gold'}`}>
                      {notification.type || 'system'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(notification._id)
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>{new Date(notification.createdAt).toLocaleDateString('en-IN')}</span>
                  {!notification.read && <span className="w-2.5 h-2.5 bg-gold rounded-full" />}
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <FaEnvelopeOpen size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="font-poppins text-gray-400 text-sm">No notifications found</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedNotification ? (
              <motion.div
                key={selectedNotification._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-card p-6 space-y-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-playfair font-bold text-navy text-lg">{selectedNotification.title}</h3>
                    <p className="font-poppins text-xs text-gray-400 mt-1">
                      {new Date(selectedNotification.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-400 hover:text-navy"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="px-3 py-2 rounded-full bg-slate-100">Type: {selectedNotification.type || 'system'}</span>
                  <span className="px-3 py-2 rounded-full bg-slate-100">
                    Status: {selectedNotification.read ? 'Read' : 'Unread'}
                  </span>
                  {selectedNotification.link && (
                    <a
                      href={selectedNotification.link}
                      className="px-3 py-2 rounded-full bg-slate-100 text-blue-600"
                    >
                      View details
                    </a>
                  )}
                </div>

                <div className="bg-lightbg rounded-xl p-5">
                  <p className="font-poppins text-sm leading-relaxed text-gray-700">
                    {selectedNotification.message}
                  </p>
                </div>

                {selectedNotification.data && Object.keys(selectedNotification.data).length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="font-poppins text-xs text-gray-500 mb-2">Additional data</p>
                    <pre className="text-xs text-slate-700 overflow-x-auto">{JSON.stringify(selectedNotification.data, null, 2)}</pre>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-card p-12 text-center">
                <FaEnvelopeOpen size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="font-playfair text-xl text-navy mb-2">Select a notification</p>
                <p className="font-poppins text-sm text-gray-500">Select a notification to view full details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
