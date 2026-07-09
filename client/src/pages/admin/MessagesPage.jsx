import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaReply, FaTrash, FaEnvelope, FaEnvelopeOpen, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'

const MOCK_MESSAGES = [];

export default function MessagesPage() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')

  const markRead = (id) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
  }

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selectedMessage?.id === id) setSelectedMessage(null)
    toast.success('Message deleted')
  }

  const handleReply = () => {
    if (!replyText.trim()) { toast.error('Reply cannot be empty'); return }
    toast.success(`Reply sent to ${selectedMessage.email}`)
    setReplyText('')
    setSelectedMessage(null)
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
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
                  <p className="font-poppins text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                  </p>
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
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <FaEnvelopeOpen size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="font-poppins text-gray-400 text-sm">No messages</p>
            </div>
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
                  {selectedMessage.name[0]}
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
                <p className="font-poppins text-sm text-gray-600 leading-relaxed bg-lightbg p-4 rounded-lg">
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
                  <button onClick={handleReply} className="btn-gold flex items-center gap-2 px-6 py-2.5">
                    <FaReply size={12} /> Send Reply
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
