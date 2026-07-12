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

const fmtTime = (dateStr, timeStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) + ` (${timeStr || '12:00 PM'})`

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
      if (demo) { 
        setBooking(demo) 
      } else { 
        // Try localStorage (offline bookings)
        const localBookings = JSON.parse(localStorage.getItem('arlinjai_bookings') || '[]')
        const local = localBookings.find(b => b.id === id)
        if (local) {
          setBooking({
            bookingId: local.id,
            status: local.status || 'pending',
            guest: { name: local.guest, phone: local.phone, email: local.email },
            roomSnapshot: { name: local.room },
            checkIn: local.checkIn,
            checkInTime: local.checkInTime,
            checkOut: local.checkOut,
            checkOutTime: local.checkOutTime,
            nights: local.nights,
            guests: local.guests,
            pricing: { finalAmount: local.amount },
            createdAt: local.createdAt,
            paymentMethod: local.paymentMethod,
          })
        } else {
          setNotFound(true) 
        }
      }
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
              {/* Details Card / Receipt */}
              <div className="bg-white rounded-xl shadow-card overflow-hidden print-card border border-gray-100">
                
                {/* Status Banner (Inside Receipt for Print) */}
                <div
                  className="px-6 py-5 flex items-center gap-4 border-b border-gray-100"
                  style={{ background: statusCfg?.bg || '#f9fafb' }}
                >
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: statusCfg?.color || '#9ca3af' }}
                  >
                    <StatusIcon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight mb-1" style={{ color: statusCfg?.color || '#4b5563' }}>
                      {statusCfg?.label}
                    </h3>
                    <p className="text-sm opacity-90" style={{ color: statusCfg?.color || '#6b7280' }}>
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

                {/* Booking ID */}
                <div className="px-6 py-5 flex items-center gap-3">
                  <p className="font-poppins text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking ID</p>
                  <div className="bg-gray-100 px-3 py-1 rounded font-bold text-gray-700 font-mono tracking-wider text-sm">
                    {booking.bookingId || booking.id}
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Guest Name</p>
                      <p className="font-playfair font-bold text-gray-900">{booking.guest?.name || booking.guest}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                      <p className="font-bold text-gray-900 font-poppins text-sm">{booking.guest?.phone || booking.phone}</p>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                    <div className="col-span-2">
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Room Type</p>
                      <p className="font-playfair font-bold text-gray-900">{booking.roomSnapshot?.name || booking.room}</p>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Check-In</p>
                      <p className="font-bold text-gray-900 font-poppins text-sm">{fmtTime(booking.checkIn, booking.checkInTime)}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Check-Out</p>
                      <p className="font-bold text-gray-900 font-poppins text-sm">
                        {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ({booking.checkOutTime || '11:00 AM'})
                      </p>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Nights</p>
                      <p className="font-bold text-gray-900 font-poppins text-sm">{booking.nights || nights}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Rooms × Guests</p>
                      <p className="font-bold text-gray-900 font-poppins text-sm">1 × {booking.guests}</p>
                    </div>
                  </div>

                  {/* Row 5 */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                    <div className="col-span-2">
                      <p className="font-poppins text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Booked On</p>
                      <p className="font-bold text-gray-900 font-poppins text-sm">{fmt(booking.createdAt)}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-100 pt-6 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500 font-medium">Room Charges ({booking.nights || nights} Nights)</p>
                      <p className="text-xs text-gray-600 font-medium">₹{baseAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-gray-500 font-medium">GST (12%)</p>
                      <p className="text-xs text-gray-600 font-medium">₹{gst.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="font-bold text-gray-900 font-poppins text-sm">Total Amount</p>
                      <p className="font-playfair font-bold text-gold text-2xl">₹{totalWithGst.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Print Button (Hidden in Print) */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
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

        {/* Printable Invoice (Hidden on Screen, Visible on Print) */}
        {booking && (
          <div className="printable-invoice">
            {/* Header with Logo and Hotel Info */}
            <div className="invoice-header">
              <div className="hotel-logo-section">
                <h1 className="hotel-title">ARLINJAI PARADISE</h1>
                <p className="hotel-tagline">FOR A PLEASANT STAY</p>
              </div>
              <div className="hotel-contact-section">
                <p><strong>Arlinjai Paradise Hotel</strong></p>
                <p>No. 5/69, Beach Road, Kanyakumari – 629702</p>
                <p>Phone: +91 94862 71234, 04652 271234</p>
                <p>Email: booking@arlinjaiparadise.com</p>
                <p>GSTIN: 33ARLINJAI1234Z5</p>
              </div>
            </div>

            {/* Divider Line */}
            <div className="invoice-divider"></div>

            {/* Invoice Metadata and Bill To */}
            <div className="invoice-meta-row">
              <div className="bill-to">
                <h3 className="section-title">BILL TO</h3>
                <p className="guest-name">{booking.guest?.name || booking.guest}</p>
                <p>Phone: {booking.guest?.phone || booking.phone}</p>
                <p>Email: {booking.guest?.email || booking.email}</p>
              </div>
              <div className="invoice-details">
                <h3 className="section-title">RECEIPT DETAILS</h3>
                <p><strong>Receipt No:</strong> INV-{booking.bookingId || booking.id}</p>
                <p><strong>Date:</strong> {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                <p><strong>Status:</strong> <span className="status-badge" style={{ backgroundColor: statusCfg?.bg, color: statusCfg?.color }}>{statusCfg?.label}</span></p>
                <p><strong>Payment:</strong> {booking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel (Cash/UPI)' : 'UPI Transfer'}</p>
              </div>
            </div>

            {/* Booking Details Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-center">Check-In / Check-Out</th>
                  <th className="text-center">Guests</th>
                  <th className="text-center">Rate/Night</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Room Charge ({booking.roomSnapshot?.name || booking.room})</strong>
                    <p className="nights-desc">{booking.nights || nights} Night(s)</p>
                  </td>
                  <td className="text-center">
                    <div>{new Date(booking.checkIn).toLocaleDateString('en-IN')} ({booking.checkInTime || '12:00 PM'})</div>
                    <div>{new Date(booking.checkOut).toLocaleDateString('en-IN')} ({booking.checkOutTime || '11:00 AM'})</div>
                  </td>
                  <td className="text-center">1 Room × {booking.guests} Guests</td>
                  <td className="text-center">₹{baseAmount ? Math.round(baseAmount / (booking.nights || nights || 1)).toLocaleString() : 0}</td>
                  <td className="text-right">₹{baseAmount.toLocaleString()}</td>
                </tr>
                <tr className="subtotal-row">
                  <td colSpan="3"></td>
                  <td className="text-right font-medium">Subtotal</td>
                  <td className="text-right font-medium">₹{baseAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td className="text-right text-gray-500">GST (12%)</td>
                  <td className="text-right text-gray-500">₹{gst.toLocaleString()}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="3"></td>
                  <td className="text-right font-bold">Total Amount</td>
                  <td className="text-right font-bold text-gold">₹{totalWithGst.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Footer Section */}
            <div className="invoice-footer">
              <div className="terms">
                <h4>Terms & Conditions</h4>
                <p>1. Please present a valid government-issued ID upon arrival.</p>
                <p>2. Standard Check-in is 12:00 PM and Check-out is 11:00 AM.</p>
                <p>3. Guests are responsible for any damage caused to hotel property.</p>
              </div>
              <div className="signature-section">
                <p className="signature-title">Authorized Signature</p>
                <div className="signature-line">
                  <span className="signature-font">Arlinjai Paradise</span>
                </div>
                <p className="signature-date">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Print Styles */}
      <style>{`
        @media screen {
          .printable-invoice {
            display: none !important;
          }
        }
        @page {
          size: A4 portrait;
          margin: 8mm 12mm 8mm 12mm !important;
        }
        @media print {
          /* Hide all screen elements */
          body * {
            visibility: hidden !important;
          }
          html, body {
            height: 100%;
            overflow: hidden;
          }
          /* Show only the printable invoice card */
          .printable-invoice, .printable-invoice * {
            visibility: visible !important;
          }
          .printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #333333 !important;
            font-family: 'Poppins', sans-serif !important;
            box-sizing: border-box !important;
          }
          .invoice-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            margin-bottom: 12px !important;
          }
          .hotel-logo-section .hotel-title {
            font-family: 'Playfair Display', serif !important;
            font-size: 20px !important;
            font-weight: 800 !important;
            color: #08111F !important;
            margin: 0 !important;
          }
          .hotel-logo-section .hotel-tagline {
            font-size: 8px !important;
            letter-spacing: 2px !important;
            color: #C9A227 !important;
            margin: 2px 0 0 0 !important;
            text-transform: uppercase !important;
            font-weight: 600 !important;
          }
          .hotel-contact-section {
            text-align: right !important;
            font-size: 10px !important;
            color: #555555 !important;
            line-height: 1.4 !important;
          }
          .invoice-divider {
            height: 2px !important;
            background: linear-gradient(90deg, #08111F, #C9A227, #08111F) !important;
            margin-bottom: 15px !important;
          }
          .invoice-meta-row {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 15px !important;
          }
          .bill-to, .invoice-details {
            width: 48% !important;
          }
          .section-title {
            font-size: 9px !important;
            letter-spacing: 2px !important;
            color: #C9A227 !important;
            border-bottom: 1px solid #eeeeee !important;
            padding-bottom: 4px !important;
            margin-bottom: 8px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
          }
          .bill-to p, .invoice-details p {
            font-size: 11px !important;
            color: #444444 !important;
            margin: 2px 0 !important;
          }
          .bill-to .guest-name {
            font-family: 'Playfair Display', serif !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            color: #08111F !important;
            margin-bottom: 4px !important;
          }
          .status-badge {
            padding: 1px 6px !important;
            border-radius: 9999px !important;
            font-size: 9px !important;
            font-weight: 600 !important;
          }
          .invoice-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 15px !important;
          }
          .invoice-table th {
            background: #08111F !important;
            color: #ffffff !important;
            font-size: 10px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            padding: 6px 10px !important;
            font-weight: 600 !important;
            text-align: left !important;
          }
          .invoice-table td {
            padding: 8px 10px !important;
            border-bottom: 1px solid #eeeeee !important;
            font-size: 11px !important;
            color: #444444 !important;
          }
          .nights-desc {
            font-size: 9px !important;
            color: #777777 !important;
            margin: 1px 0 0 0 !important;
          }
          .text-center { text-align: center !important; }
          .text-right { text-align: right !important; }
          .font-medium { font-weight: 500 !important; }
          .font-bold { font-weight: 700 !important; }
          .text-gold { color: #C9A227 !important; }
          .subtotal-row td {
            border-top: 1px solid #dddddd !important;
            padding-top: 8px !important;
          }
          .total-row td {
            font-size: 12px !important;
            color: #08111F !important;
            border-bottom: double 3px #C9A227 !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .invoice-footer {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
            margin-top: 20px !important;
          }
          .terms {
            width: 60% !important;
          }
          .terms h4 {
            font-size: 11px !important;
            font-weight: 700 !important;
            color: #08111F !important;
            margin: 0 0 5px 0 !important;
          }
          .terms p {
            font-size: 9px !important;
            color: #666666 !important;
            margin: 2px 0 !important;
            line-height: 1.3 !important;
          }
          .signature-section {
            text-align: center !important;
            width: 35% !important;
          }
          .signature-title {
            font-size: 10px !important;
            color: #555555 !important;
            margin-bottom: 8px !important;
          }
          .signature-line {
            border-bottom: 1px solid #cccccc !important;
            padding-bottom: 4px !important;
            margin-bottom: 4px !important;
          }
          .signature-font {
            font-family: 'Brush Script MT', cursive, sans-serif !important;
            font-size: 16px !important;
            color: #08111F !important;
            font-style: italic !important;
          }
          .signature-date {
            font-size: 9px !important;
            color: #777777 !important;
          }
        }
      `}</style>
    </div>
  )
}
