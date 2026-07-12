import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaReply, FaTrash, FaEnvelope, FaEnvelopeOpen, FaTimes, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'

export default function NotificationsPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMode, setFilterMode] = useState('month')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')

  const fetchMessages = async () => {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/contact`, { headers })
      if (res.data.success) {
        setMessages(res.data.contacts || [])
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const markRead = async (id) => {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    try {
      const res = await axios.get(`${API_BASE_URL}/contact/${id}`, { headers })
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: 'read' } : m))
        )
      }
    } catch (err) {
      console.error('Failed to mark read:', err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    try {
      const res = await axios.delete(`${API_BASE_URL}/contact/${id}`, { headers })
      if (res.data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id))
        if (selectedMessage?._id === id) setSelectedMessage(null)
        toast.success('Message deleted')
      }
    } catch (err) {
      toast.error('Failed to delete message')
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty')
      return
    }
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    try {
      const res = await axios.post(
        `${API_BASE_URL}/contact/${selectedMessage._id}/reply`,
        { replyText },
        { headers }
      )
      if (res.data.success) {
        toast.success(`Reply sent to ${selectedMessage.email}`)
        setReplyText('')
        setSelectedMessage(null)
        fetchMessages()
      }
    } catch (err) {
      toast.error('Failed to send reply')
    }
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const filtered = messages.filter((b) => {
    return filterMode === 'all' || new Date(b.createdAt) >= startOfMonth
  })

  const unread = filtered.filter((m) => m.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Notifications & Messages</h2>
          <p className="font-poppins text-sm text-gray-500">
            {unread} unread · {filtered.length} total messages
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Calendar dropdown filter */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <FaCalendarAlt className="text-slate-400 mr-2.5" size={14} />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="appearance-none bg-transparent font-poppins font-semibold text-sm text-slate-700 outline-none pr-6 cursor-pointer border-none p-0"
            >
              <option value="month">Month View</option>
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            {filtered.map((msg, i) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (msg.status === 'new') markRead(msg._id)
                }}
                className={`bg-white rounded-xl p-4 shadow-card cursor-pointer border-2 transition-all
                  ${selectedMessage?._id === msg._id ? 'border-gold' : 'border-transparent'}
                  hover:border-gold hover:border-opacity-50`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {msg.status === 'new' ? (
                        <FaEnvelope size={12} className="text-gold flex-shrink-0" />
                      ) : (
                        <FaEnvelopeOpen size={12} className="text-gray-400 flex-shrink-0" />
                      )}
                      <p className={`font-poppins text-sm truncate ${msg.status === 'new' ? 'font-semibold text-navy' : 'text-gray-700'}`}>
                        {msg.name}
                      </p>
                    </div>
                    <p className={`font-poppins text-xs truncate ${msg.status === 'new' ? 'text-navy font-medium' : 'text-gray-600'}`}>
                      {msg.subject}
                    </p>
                    <p className="font-poppins text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {msg.status === 'new' && (
                      <span className="w-2.5 h-2.5 bg-gold rounded-full flex-shrink-0" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(msg._id)
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <FaEnvelopeOpen size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="font-poppins text-gray-400 text-sm">No notifications</p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-card p-6 space-y-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-playfair font-bold text-navy text-lg">{selectedMessage.subject}</h3>
                    <p className="font-poppins text-xs text-gray-400 mt-1">
                      {new Date(selectedMessage.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-navy">
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Sender Info */}
                <div className="flex gap-4 p-4 bg-lightbg rounded-lg">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center 
                                 text-white font-bold font-poppins text-sm flex-shrink-0">
                    {selectedMessage.name ? selectedMessage.name[0].toUpperCase() : 'N'}
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {[
                      { label: 'Name', value: selectedMessage.name },
                      { label: 'Email', value: selectedMessage.email },
                      { label: 'Phone', value: selectedMessage.phone },
                      { label: 'Type', value: selectedMessage.inquiryType || 'General Inquiry' },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="font-poppins text-xs text-gray-400">{item.label}</p>
                        <p className="font-poppins text-sm text-navy font-medium break-all">{item.value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="font-poppins text-sm font-medium text-gray-700 mb-2">Message:</p>
                  <p className="font-poppins text-sm text-gray-600 leading-relaxed bg-lightbg p-4 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply */}
                <div>
                  <p className="font-poppins text-sm font-medium text-gray-700 mb-2">Reply:</p>
                  {selectedMessage.reply ? (
                    <div className="bg-gold/5 border border-gold/10 p-4 rounded-lg">
                      <p className="font-poppins text-xs text-gold font-semibold mb-1">
                        Reply Sent ({new Date(selectedMessage.reply.sentAt).toLocaleString('en-IN')})
                      </p>
                      <p className="font-poppins text-sm text-gray-700">{selectedMessage.reply.text}</p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        placeholder="Type your reply here..."
                        className="input-field resize-none text-sm"
                      />
                      <div className="flex gap-3 mt-3">
                        <button onClick={handleReply} className="btn-gold flex items-center gap-2 px-6 py-2.5 text-sm">
                          <FaReply size={12} /> Send Reply
                        </button>
                        {selectedMessage.phone && (
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="btn-outline-gold px-6 py-2.5 text-sm flex items-center justify-center"
                          >
                            Call Back
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-card p-12 text-center">
                <FaEnvelopeOpen size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="font-playfair text-xl text-navy mb-2">Select a notification</p>
                <p className="font-poppins text-sm text-gray-500">Click on a notification from the left list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
