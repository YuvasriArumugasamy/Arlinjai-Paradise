import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch, FaCheckCircle, FaClock, FaTimesCircle,
  FaBed, FaCalendarAlt, FaUsers, FaPhoneAlt, FaPrint,
  FaStar, FaWhatsapp, FaArrowRight
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Breadcrumb from '../components/common/Breadcrumb'
import { HOTEL_INFO, API_BASE_URL } from '../constants'
import axios from 'axios'

// Dummy fallback for demo (when backend not running)
const DEMO_BOOKINGS = [
  {
    bookingId: 'AP000001',
    status: 'confirmed',
    guest: { name: 'Demo Guest', phone: '9876543210', email: 'demo@example.com' },
    roomSnapshot: { name: 'Deluxe AC Room', price: 2500 },
    checkIn: new Date(Date.now() + 86400000 * 2).toISOString(),
    checkOut: new Date(Date.now() + 86400000 * 4).toISOString(),
    nights: 2,
    guests: 2,
    pricing: { finalAmount: 5000 },
    createdAt: new Date().toISOString(),
    paymentMethod: 'pay_at_hotel',
  },
]

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     color: '#f59e0b', bg: '#fef3c7', icon: FaClock },
  confirmed:  { label: 'Confirmed',   color: '#10b981', bg: '#d1fae5', icon: FaCheckCircle },
  'checked-in':  { label: 'Checked In',  color: '#3b82f6', bg: '#dbeafe', icon: FaCheckCircle },
  'checked-out': { label: 'Checked Out', color: '#6b7280', bg: '#f3f4f6', icon: FaCheckCircle },
  cancelled:  { label: 'Cancelled',   color: '#ef4444', bg: '#fee2e2', icon: FaTimesCircle },
}

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

const fmtTime = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) + ' (12:00 PM)'

export default function ManageBookingPage() {
  const [bookingIdInput, setBookingIdInput] = useState('')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Star rating state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const handleFind = async () => {
    const id = bookingIdInput.trim().toUpperCase()
    if (!id) { toast.error('Please enter your Booking ID'); return }

    setLoading(true)
    setNotFound(false)
    setBooking(null)
    setReviewSubmitted(false)
    setRating(0)
    setReviewText('')

    try {
      const res = await axios.get(`${API_BASE_URL}/bookings/${id}`)
      setBooking(res.data.booking)
    } catch {
      // Try demo fallback
      const demo = DEMO_BOOKINGS.find((b) => b.bookingId === id)
      if (demo) { setBooking(demo) }
      else { setNotFound(true) }
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReviewSubmit = async () => {
    if (!rating) { toast.error('Please select a star rating'); return }
    try {
      await axios.post(`${API_BASE_URL}/reviews`, {
        name: booking.guest.name,
        rating,
        comment: reviewText,
        roomType: booking.roomSnapshot?.name,
      })
    } catch {}
    setReviewSubmitted(true)
    toast.success('Thank you for your review!')
  }

  const nights = booking
    ? Math.max(1, Math.floor((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000))
    : 0

  const gst = booking ? Math.round((booking.pricing?.finalAmount || 0) * 0.12) : 0
  const baseAmount = booking ? (booking.pricing?.finalAmount || 0) : 0
  const totalWithGst = baseAmount + gst

  const statusCfg = booking ? (STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending) : null
  const StatusIcon = statusCfg?.icon || FaClock

  return (
    <div className="min-h-screen bg-lightbg">

      {/* Hero Header */}
      <div
        className="relative py-24 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #08111F 0%, #0d1e35 60%, #08111F 100%)',
        }}
      >
        {/* Gold bottom line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #C9A227, transparent)',
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-poppins text-gold uppercase tracking-widest text-xs font-semibold mb-3"
          >
            Manage Your Stay
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Manage{' '}
            <span className="italic font-normal text-gold">Booking</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-poppins text-gray-400 text-sm max-w-md mx-auto"
          >
            Enter your Booking ID to track status, view details, or print your receipt.
          </motion.p>
          <div className="flex justify-center mt-5">
            <Breadcrumb items={[{ label: 'Manage Booking', path: '/manage-booking' }]} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={14} />
              <input
                type="text"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFind()}
                placeholder="Paste your Booking ID here..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg font-poppins text-sm
                           focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <button
              onClick={handleFind}
              disabled={loading}
              className="btn-gold px-6 py-3 text-sm font-semibold whitespace-nowrap flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : <FaSearch size={13} />}
              Find Booking
            </button>
          </div>
          <p className="font-poppins text-xs text-gray-400 mt-2">
            Your Booking ID was shown after submitting your booking request. It looks like:{' '}
            <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">AP000001</span>
          </p>
        </motion.div>

        {/* Not Found */}
        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-5 text-center"
            >
              <FaTimesCircle className="text-red-400 mx-auto mb-2" size={28} />
              <p className="font-poppins font-semibold text-red-600">Booking Not Found</p>
              <p className="font-poppins text-xs text-red-400 mt-1">
                Please check your Booking ID and try again. Contact us if you need help.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Details */}
        <AnimatePresence>
          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Status Banner */}
              <div
                className="rounded-xl p-4 flex items-center gap-3 border"
                style={{
                  background: statusCfg?.bg,
                  borderColor: statusCfg?.color + '44',
                }}
              >
                <StatusIcon size={22} style={{ color: statusCfg?.color, flexShrink: 0 }} />
                <div>
                  <p className="font-poppins font-bold text-sm" style={{ color: statusCfg?.color }}>
                    {statusCfg?.label}
                  </p>
                  <p className="font-poppins text-xs text-gray-500">
                    {booking.status === 'confirmed'
                      ? 'Your booking has been confirmed! Please show your Booking ID at reception.'
                      : booking.status === 'pending'
                      ? 'Your booking is pending confirmation. We will contact you shortly.'
                      : booking.status === 'checked-in'
                      ? 'Welcome! You are currently checked in.'
                      : booking.status === 'checked-out'
                      ? 'Thank you for staying with us!'
                      : booking.status === 'cancelled'
                      ? 'This booking has been cancelled.'
                      : ''}
                  </p>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-xl shadow-card overflow-hidden print-card">

                {/* Booking ID Header */}
                <div className="bg-navy px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider">Booking ID</p>
                    <p className="font-playfair text-xl font-bold text-gold">{booking.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins text-xs text-gray-400">Arlinjai Paradise</p>
                    <p className="font-poppins text-xs text-gray-500">Kanyakumari</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Guest + Room */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1">Guest Name</p>
                      <p className="font-poppins font-semibold text-navy text-sm">{booking.guest?.name}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaPhoneAlt size={9} /> Phone
                      </p>
                      <p className="font-poppins font-semibold text-navy text-sm">{booking.guest?.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaBed size={9} /> Room Type
                      </p>
                      <p className="font-poppins font-semibold text-navy text-sm">{booking.roomSnapshot?.name}</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaCalendarAlt size={9} /> Check In
                      </p>
                      <p className="font-poppins font-semibold text-navy text-sm">{fmtTime(booking.checkIn)}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaCalendarAlt size={9} /> Check Out
                      </p>
                      <p className="font-poppins font-semibold text-navy text-sm">
                        {new Date(booking.checkOut).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })} (11:00 AM)
                      </p>
                    </div>
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1">Nights</p>
                      <p className="font-poppins font-semibold text-navy text-sm">{booking.nights || nights}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaUsers size={9} /> Rooms × Guests
                      </p>
                      <p className="font-poppins font-semibold text-navy text-sm">1 × {booking.guests}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1">Booked On</p>
                      <p className="font-poppins font-semibold text-navy text-sm">{fmt(booking.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                      <p className="font-poppins font-semibold text-navy text-sm capitalize">
                        {booking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel' : booking.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Pricing */}
                  <div className="space-y-2 font-poppins text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Room Charges ({booking.nights || nights} Night{nights > 1 ? 's' : ''})</span>
                      <span>₹{baseAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>GST (12%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                      <span className="text-navy">Total Amount</span>
                      <span className="text-gold">₹{totalWithGst.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Print Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 bg-navy text-white
                               font-poppins font-semibold text-sm py-3 rounded-lg hover:bg-navy/90
                               transition-colors"
                  >
                    <FaPrint size={13} /> Save / Print Receipt
                  </button>
                </div>
              </div>

              {/* Rate Your Stay */}
              {(booking.status === 'confirmed' || booking.status === 'checked-out') && (
                <div className="bg-white rounded-xl shadow-card p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <FaStar className="text-gold" size={16} />
                    <h3 className="font-playfair font-bold text-navy text-lg">Rate Your Stay</h3>
                  </div>
                  <p className="font-poppins text-xs text-gray-500 mb-4">
                    How was your experience at Arlinjai Paradise?
                  </p>

                  {reviewSubmitted ? (
                    <div className="text-center py-4">
                      <FaCheckCircle className="text-green-500 mx-auto mb-2" size={28} />
                      <p className="font-poppins font-semibold text-navy">Thank you for your review!</p>
                    </div>
                  ) : (
                    <>
                      {/* Stars */}
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <FaStar
                              size={28}
                              style={{
                                color: s <= (hoverRating || rating) ? '#C9A227' : '#e5e7eb',
                                transition: 'color 0.15s',
                              }}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                        placeholder="Share your experience with us..."
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-poppins text-sm
                                   focus:outline-none focus:border-gold resize-none mb-4"
                      />

                      <button onClick={handleReviewSubmit} className="btn-gold px-6 py-2.5 text-sm">
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')}?text=${encodeURIComponent(`Hello! My Booking ID is ${booking.bookingId}. I need assistance.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600
                             text-white font-poppins font-semibold text-sm py-3 rounded-lg transition-colors"
                >
                  <FaWhatsapp size={16} /> Contact Hotel
                </a>
                <a
                  href="/booking"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gold text-gold
                             font-poppins font-semibold text-sm py-3 rounded-lg hover:bg-gold hover:text-white
                             transition-colors"
                >
                  Make Another Booking <FaArrowRight size={12} />
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body > *:not(.print-card) { display: none !important; }
          .print-card { display: block !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}
