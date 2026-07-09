import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaReply, FaTrash, FaEnvelope, FaEnvelopeOpen, FaTimes, FaSync } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [replying, setReplying] = useState(false)

  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/contact`, { headers })
      const mapped = (res.data.contacts || []).map((c) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone || '—',
        subject: c.subject || 'No Subject',
        message: c.message,
        type: c.inquiryType || 'General',
        read: c.status !== 'new',
        createdAt: c.createdAt,
        status: c.status,
      }))
      setMessages(mapped)
    } catch {
      toast.error('Could not load messages. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const markRead = async (id) => {
    try {
      await axios.get(`${API_BASE_URL}/contact/${id}`, { headers })
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
    } catch {
      // Mark read locally even if API fails
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/contact/${id}`, { headers })
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
      toast.success('Message deleted')
    } catch {
      // Delete locally if API fails
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
      toast.success('Message deleted')
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) { toast.error('Reply cannot be empty'); return }
    setReplying(true)
    try {
      await axios.post(
        `${API_BASE_URL}/contact/${selectedMessage.id}/reply`,
        { replyText },
        { headers }
      )
      toast.success(`Reply sent to ${selectedMessage.email}`)
      // Mark as replied locally
      setMessages((prev) =>
        prev.map((m) => m.id === selectedMessage.id ? { ...m, status: 'replied', read: true } : m)
      )
    } catch {
      toast.error('Could not send reply via email. Server may be offline.')
    } finally {
      setReplying(false)
      setReplyText('')
      setSelectedMessage(null)
    }
  }

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Messages</h2>
          <p className="font-poppins text-sm text-gray-500">
            {unread} unread · {messages.length} total
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 text-gold hover:text-gold/80 font-poppins text-sm transition-colors"
        >
          <FaSync size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <svg className="animate-spin h-5 w-5 text-gold mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="font-poppins text-sm text-gray-400">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <FaEnvelopeOpen size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="font-poppins text-gray-400 text-sm font-medium">No messages yet</p>
              <p className="font-poppins text-gray-300 text-xs mt-1">
                Messages from the Contact page will appear here
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setSelectedMessage(msg); markRead(msg.id) }}
                className={`bg-white rounded-xl p-4 shadow-card cursor-pointer border-2 transition-all
                  ${selectedMessage?.id === msg.id ? 'border-gold' : 'border-transparent'}
                  hover:border-gold hover:border-opacity-50`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.read ? (
                        <FaEnvelope size={12} className="text-gold flex-shrink-0" />
                      ) : (
                        <FaEnvelopeOpen size={12} className="text-gray-400 flex-shrink-0" />
                      )}
                      <p className={`font-poppins text-sm truncate ${!msg.read ? 'font-semibold text-navy' : 'text-gray-700'}`}>
                        {msg.name}
                      </p>
                    </div>
                    <p className={`font-poppins text-xs truncate ${!msg.read ? 'text-navy font-medium' : 'text-gray-600'}`}>
                      {msg.subject}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-poppins text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                      </p>
                      {msg.status === 'replied' && (
                        <span className="font-poppins text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {!msg.read && <span className="w-2.5 h-2.5 bg-gold rounded-full flex-shrink-0" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
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
                  {(selectedMessage.name || '?')[0].toUpperCase()}
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {[
                    { label: 'Name', value: selectedMessage.name },
                    { label: 'Email', value: selectedMessage.email },
                    { label: 'Phone', value: selectedMessage.phone },
                    { label: 'Type', value: selectedMessage.type },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="font-poppins text-xs text-gray-400">{item.label}</p>
                      <p className="font-poppins text-sm text-navy font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="font-poppins text-sm font-medium text-gray-700 mb-2">Message:</p>
                <p className="font-poppins text-sm text-gray-600 leading-relaxed bg-lightbg p-4 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Reply */}
              <div>
                <p className="font-poppins text-sm font-medium text-gray-700 mb-2">Reply:</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Type your reply here..."
                  className="input-field resize-none"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleReply}
                    disabled={replying}
                    className="btn-gold flex items-center gap-2 px-6 py-2.5 disabled:opacity-60"
                  >
                    {replying ? (
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <FaReply size={12} />
                    )}
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="btn-outline-gold px-6 py-2.5"
                  >
                    Call Back
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-card p-12 text-center">
              <FaEnvelopeOpen size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="font-playfair text-xl text-navy mb-2">Select a message</p>
              <p className="font-poppins text-sm text-gray-500">Click on a message from the left to view it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
