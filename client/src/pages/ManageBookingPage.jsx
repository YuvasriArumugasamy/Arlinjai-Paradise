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
import signatureImg from './admin/image.png'

// Dummy fallback for demo (when backend not running)
const DEMO_BOOKINGS = [
  {
    bookingId: 'AP000001',
    status: 'confirmed',
    guest: { name: 'Demo Guest', phone: '9876543210', email: 'demo@example.com', address: 'Kanyakumari, Tamil Nadu' },
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

// State and code detection helper
const STATE_CODES = {
  'tamil nadu': '33', 'tn': '33',
  'delhi': '07', 'new delhi': '07',
  'kerala': '32', 'kl': '32',
  'karnataka': '29', 'ka': '29',
  'andhra pradesh': '37', 'ap': '37',
  'telangana': '36', 'tg': '36',
  'maharashtra': '27', 'mh': '27',
  'pondicherry': '34', 'puducherry': '34',
  'goa': '30', 'ga': '30',
  'gujarat': '24', 'gj': '24',
  'rajasthan': '08', 'rj': '08',
  'west bengal': '19', 'wb': '19',
  'uttar pradesh': '09', 'up': '09',
  'bihar': '10', 'br': '10',
  'madhya pradesh': '23', 'mp': '23',
  'punjab': '03', 'pb': '03',
  'haryana': '06', 'hr': '06',
};

const getStateWithCode = (address) => {
  if (!address) return { name: 'Tamil Nadu', code: '33' };
  const clean = address.toLowerCase();
  for (const [state, code] of Object.entries(STATE_CODES)) {
    if (clean.includes(state)) {
      const name = state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { name, code };
    }
  }
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    const nameCandidate = parts[parts.length - 2] || parts[parts.length - 1];
    if (nameCandidate) {
      const name = nameCandidate.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { name, code: '33' };
    }
  }
  return { name: 'Tamil Nadu', code: '33' };
};

const formatDateDDMMYYYY = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTimeHHMM = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampmLabel = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');
  return `${hoursStr}:${minutes} ${ampmLabel}`;
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
};

const formatDateOrdinal = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
};

const numberToWords = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convertThousands = (n) => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)];
        if (n % 10 > 0) {
          str += '-' + a[n % 10];
        }
      }
    }
    return str.trim();
  };
  
  let parts = [];
  let units = num % 1000;
  let remaining = Math.floor(num / 1000);
  
  let thousands = remaining % 100;
  remaining = Math.floor(remaining / 100);
  
  let lakhs = remaining % 100;
  let crores = Math.floor(remaining / 100);
  
  if (crores > 0) {
    parts.push(convertThousands(crores) + ' Crore');
  }
  if (lakhs > 0) {
    parts.push(convertThousands(lakhs) + ' Lakh');
  }
  if (thousands > 0) {
    parts.push(convertThousands(thousands) + ' Thousand');
  }
  if (units > 0) {
    parts.push(convertThousands(units));
  }
  
  return parts.join(' ').trim() + ' Rupees only';
};

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
            guest: { name: local.guest, phone: local.phone, email: local.email, address: local.address },
            roomSnapshot: { name: local.room },
            checkIn: local.checkIn,
            checkInTime: local.checkInTime,
            checkOut: local.checkOut,
            checkOutTime: local.checkOutTime,
            nights: local.nights,
            guests: local.guests,
            pricing: { finalAmount: local.basePrice || Math.round(local.amount / 1.12) },
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

  const basePrice = booking ? (booking.pricing?.finalAmount || 0) : 0;
  const gstAmount = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + gstAmount;

  // Keep old names for compatibility with on-screen view
  const baseAmount = basePrice;
  const gst = gstAmount;
  const totalWithGst = totalPrice;

  const guestState = getStateWithCode(booking?.guest?.address || booking?.address);
  const isTamilNadu = guestState.code === '33';
  const gstLabelAmount = isTamilNadu ? gstAmount / 2 : gstAmount;
  const isPaid = booking?.paymentStatus === 'paid' || booking?.paymentMethod === 'upi' || booking?.paymentMethod === 'card' || booking?.paymentMethod === 'bank_transfer' || booking?.status === 'checked-out';
  const amountReceived = isPaid ? totalPrice : 0;
  const balanceAmount = totalPrice - amountReceived;
  const paymentModeLabel = booking?.paymentMethod === 'pay_at_hotel' ? 'Cash' 
    : booking?.paymentMethod === 'upi' ? 'UPI'
    : booking?.paymentMethod === 'card' ? 'Card'
    : booking?.paymentMethod === 'bank_transfer' ? 'Bank Transfer'
    : 'Cash';

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
                
                {/* Status Banner */}
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
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 print:hidden">
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
            {/* Header section with left navy curved container & right contacts section */}
            <div className="invoice-header-container">
              {/* Left Navy container */}
              <div className="invoice-header-left-navy">
                <div className="logo-section">
                  <div className="logo-circle">
                    <img src="/Elegant monogram with seaside emblem.webp" alt="Arlinjai Paradise Logo" />
                  </div>
                </div>
                <div className="hotel-details-section">
                  <h2 className="hotel-title">Arlinjai Paradise</h2>
                  <p className="hotel-subtitle">GSTIN: 33ALCPA0679E2ZN</p>
                  <p className="hotel-subtitle">State: 33-Tamil Nadu</p>
                </div>
              </div>

              {/* Right section containing Green bar and Tax Invoice Title */}
              <div className="invoice-header-right">
                <div className="green-contacts-bar">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span className="contact-text">9486271234</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉</span>
                    <span className="contact-text">arlinjaiparadise@gmail.com</span>
                  </div>
                  <div className="contact-item address-item">
                    <span className="contact-icon">📍</span>
                    <span className="contact-text">ARLINJAI PARADISE , 6/248D, Kotakarai, Kovalam, Kanniyakumari,629702 Tamil Nadu,</span>
                  </div>
                </div>
                <div className="title-section">
                  <h1 className="tax-invoice-text">Tax Invoice</h1>
                </div>
              </div>
            </div>

            {/* Invoice Metadata and Bill To */}
            <div className="invoice-meta-section">
              <div className="bill-to-box">
                <span className="section-label">Bill To</span>
                <h2 className="guest-name">{booking.guest?.name || booking.guest}</h2>
                <p className="guest-address">{booking.guest?.address || booking.address || 'Kanyakumari, Tamil Nadu'}</p>
                <p className="guest-detail"><strong>Contact No.:</strong> {booking.guest?.phone || booking.phone}</p>
                <p className="guest-detail"><strong>GSTIN Number:</strong> N/A</p>
                <p className="guest-detail"><strong>State:</strong> {guestState.code}-{guestState.name}</p>
              </div>
              <div className="meta-details-box">
                <div className="meta-row">
                  <span className="meta-label">Invoice No.:</span>
                  <span className="meta-value">{booking.bookingId || booking.id}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">{formatDateDDMMYYYY(new Date(booking.createdAt || Date.now()))}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Time:</span>
                  <span className="meta-value">{formatTimeHHMM(new Date(booking.createdAt || Date.now()))}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Place of Supply:</span>
                  <span className="meta-value">{guestState.code}-{guestState.name}</span>
                </div>
              </div>
            </div>

            {/* Booking Details Table */}
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '38%' }}>Item Name</th>
                  <th style={{ width: '12%' }}>HSN/ SAC</th>
                  <th style={{ width: '8%' }}>Quantity</th>
                  <th style={{ width: '8%' }}>Unit</th>
                  <th style={{ width: '13%' }}>Price/ Unit</th>
                  <th style={{ width: '15%' }}>GST</th>
                  <th style={{ width: '13%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td className="item-name-cell">{booking.roomSnapshot?.name || booking.room || 'Deluxe AC Room'}</td>
                  <td className="text-center">996311</td>
                  <td className="text-center">1</td>
                  <td className="text-center">Nos</td>
                  <td className="text-right">Rs {basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-right">Rs {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (12.0%)</td>
                  <td className="text-right">Rs {totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr className="table-total-row">
                  <td></td>
                  <td className="text-left font-bold">Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-right font-bold">Rs {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-right font-bold">Rs {totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>

            {/* Description & Summary Section */}
            <div className="invoice-bottom-section">
              {/* Left side details */}
              <div className="bottom-left-info">
                <div className="info-block">
                  <h4>Description</h4>
                  <p>Check in date - {formatDateOrdinal(booking.checkIn)}</p>
                  <p>Check out date - {formatDateOrdinal(booking.checkOut)}</p>
                  <p>Pax - {booking.guests}</p>
                </div>
                <div className="info-block">
                  <h4>Invoice Amount In Words</h4>
                  <p className="words-amount">{numberToWords(totalPrice)}</p>
                </div>
                <div className="info-block terms-block">
                  <h4>Terms And Conditions</h4>
                  <p>Thank you for doing business with us.</p>
                  <div className="signature-area">
                    <p>For: Arlinjai Paradise</p>
                    <div className="sig-wrap">
                      <img src={signatureImg} alt="Authorized Signature" className="signature-img" />
                    </div>
                    <h5>Authorized Signatory</h5>
                  </div>
                </div>
              </div>

              {/* Right side summary */}
              <div className="bottom-right-summary">
                <table className="summary-box-table">
                  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td>Rs {basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    {isTamilNadu ? (
                      <>
                        <tr>
                          <td>CGST@6.0%</td>
                          <td>Rs {gstLabelAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <td>SGST@6.0%</td>
                          <td>Rs {gstLabelAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td>IGST@12.0%</td>
                        <td>Rs {gstLabelAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                    <tr className="summary-total-row">
                      <td>Total</td>
                      <td>Rs {totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td>Received</td>
                      <td>Rs {amountReceived.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td>Balance</td>
                      <td>Rs {balanceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td>Payment Mode</td>
                      <td>{paymentModeLabel}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Decoration */}
            <div className="invoice-bottom-decoration">
              <div className="deco-green"></div>
              <div className="deco-grey"></div>
            </div>
          </div>
        )}

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
            
            /* Header Wave Design */
            .invoice-header-container {
              display: flex !important;
              width: 100% !important;
              margin-bottom: 25px !important;
            }
            .invoice-header-left-navy {
              background: #1a2d42 !important;
              color: #ffffff !important;
              width: 400px !important;
              padding: 15px 20px !important;
              clip-path: ellipse(100% 120% at 0% 50%) !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 12px !important;
              box-sizing: border-box !important;
            }
            .logo-circle {
              width: 65px !important;
              height: 65px !important;
              border-radius: 50% !important;
              border: 2px solid #C9A227 !important;
              background: #ffffff !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              overflow: hidden !important;
            }
            .logo-circle img {
              width: 85% !important;
              height: 85% !important;
              object-fit: contain !important;
            }
            .hotel-details-section .hotel-title {
              font-family: 'Playfair Display', serif !important;
              font-size: 20px !important;
              font-weight: 700 !important;
              margin: 0 0 4px 0 !important;
              color: #ffffff !important;
            }
            .hotel-details-section p {
              font-family: 'Poppins', sans-serif !important;
              font-size: 9px !important;
              margin: 1px 0 !important;
              opacity: 0.9 !important;
              color: #ffffff !important;
            }
            .invoice-header-right {
              width: calc(100% - 400px) !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              box-sizing: border-box !important;
            }
            .green-contacts-bar {
              background: #16c085 !important;
              color: #ffffff !important;
              display: flex !important;
              align-items: center !important;
              padding: 6px 10px 6px 25px !important;
              font-family: 'Poppins', sans-serif !important;
              font-size: 8px !important;
              gap: 5px !important;
              justify-content: space-between !important;
              height: 45px !important;
              box-sizing: border-box !important;
              border-top-left-radius: 60px 45px !important;
            }
            .contact-item {
              display: flex !important;
              align-items: center !important;
              gap: 4px !important;
              border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
              padding-right: 8px !important;
              flex: 1 !important;
            }
            .contact-item:last-child {
              border-right: none !important;
              padding-right: 0 !important;
              flex: 1.5 !important;
            }
            .contact-icon {
              font-size: 10px !important;
            }
            .contact-text {
              line-height: 1.2 !important;
              color: #ffffff !important;
            }
            .title-section {
              text-align: right !important;
              padding-right: 10px !important;
              padding-bottom: 5px !important;
            }
            .tax-invoice-text {
              font-family: 'Playfair Display', Georgia, serif !important;
              font-size: 34px !important;
              color: #1a2d42 !important;
              margin: 0 !important;
              font-weight: 500 !important;
            }
            
            /* Bill To & Meta Section */
            .invoice-meta-section {
              display: flex !important;
              justify-content: space-between !important;
              padding: 0 15px !important;
              margin-bottom: 25px !important;
            }
            .bill-to-box {
              width: 55% !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 2px !important;
            }
            .section-label {
              color: #16c085 !important;
              font-family: 'Poppins', sans-serif !important;
              font-size: 12px !important;
              font-weight: 600 !important;
              margin-bottom: 4px !important;
              text-transform: uppercase !important;
            }
            .guest-name {
              font-family: 'Poppins', sans-serif !important;
              font-size: 15px !important;
              font-weight: 700 !important;
              color: #1a2d42 !important;
              margin: 0 0 3px 0 !important;
            }
            .guest-address {
              font-family: 'Poppins', sans-serif !important;
              font-size: 10px !important;
              color: #555555 !important;
              margin: 0 0 4px 0 !important;
              line-height: 1.3 !important;
              max-width: 90% !important;
            }
            .guest-detail {
              font-family: 'Poppins', sans-serif !important;
              font-size: 10px !important;
              color: #333333 !important;
              margin: 1px 0 !important;
            }
            .meta-details-box {
              width: 38% !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 4px !important;
              font-family: 'Poppins', sans-serif !important;
              font-size: 10px !important;
            }
            .meta-row {
              display: flex !important;
              justify-content: space-between !important;
            }
            .meta-label {
              font-weight: 600 !important;
              color: #333333 !important;
            }
            .meta-value {
              color: #000000 !important;
              text-align: right !important;
            }
            
            /* Table Styling */
            .invoice-items-table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-bottom: 25px !important;
              font-family: 'Poppins', sans-serif !important;
            }
            .invoice-items-table th {
              background: #16c085 !important;
              color: #ffffff !important;
              font-size: 10px !important;
              font-weight: 600 !important;
              padding: 8px 10px !important;
              border: 1px solid #16c085 !important;
              text-transform: uppercase !important;
            }
            .invoice-items-table td {
              padding: 8px 10px !important;
              border: 1px solid #dddddd !important;
              font-size: 10px !important;
              color: #333333 !important;
              vertical-align: middle !important;
            }
            .invoice-items-table .item-name-cell {
              font-weight: 600 !important;
              color: #1a2d42 !important;
            }
            .table-total-row td {
              background: #16c085 !important;
              color: #ffffff !important;
              font-weight: 700 !important;
              font-size: 11px !important;
              border: 1px solid #16c085 !important;
            }
            
            /* Bottom Section Layout */
            .invoice-bottom-section {
              display: flex !important;
              justify-content: space-between !important;
              padding: 0 15px !important;
              margin-top: 15px !important;
              font-family: 'Poppins', sans-serif !important;
            }
            .bottom-left-info {
              width: 55% !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 12px !important;
            }
            .info-block h4 {
              color: #16c085 !important;
              font-size: 10px !important;
              font-weight: 600 !important;
              margin: 0 0 3px 0 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
            }
            .info-block p {
              font-size: 10px !important;
              color: #444444 !important;
              margin: 1px 0 !important;
              line-height: 1.3 !important;
            }
            .words-amount {
              font-weight: 600 !important;
              color: #1a2d42 !important;
            }
            .terms-block {
              margin-top: 3px !important;
            }
            .signature-area {
              margin-top: 10px !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            .signature-area p {
              font-size: 9px !important;
              color: #555555 !important;
              margin-bottom: 1px !important;
            }
            .sig-wrap {
              height: 40px !important;
              margin-bottom: 2px !important;
            }
            .signature-img {
              height: 100% !important;
              width: auto !important;
              display: block !important;
            }
            .signature-area h5 {
              font-size: 10px !important;
              font-weight: 700 !important;
              color: #1a2d42 !important;
              margin: 3px 0 0 0 !important;
              border-top: 1px solid #cccccc !important;
              width: 140px !important;
              padding-top: 3px !important;
              text-align: center !important;
            }
            
            .bottom-right-summary {
              width: 38% !important;
            }
            .summary-box-table {
              width: 100% !important;
              border-collapse: collapse !important;
              border: 1px solid #dddddd !important;
            }
            .summary-box-table td {
              padding: 5px 8px !important;
              border: 1px solid #dddddd !important;
              font-size: 10px !important;
              color: #333333 !important;
            }
            .summary-box-table td:first-child {
              font-weight: 600 !important;
            }
            .summary-box-table td:last-child {
              text-align: right !important;
            }
            .summary-total-row td {
              background: #16c085 !important;
              color: #ffffff !important;
              font-weight: 700 !important;
              border: 1px solid #16c085 !important;
            }
            
            /* Bottom Decoration */
            .invoice-bottom-decoration {
              display: flex !important;
              height: 12px !important;
              width: 100% !important;
              margin-top: 35px !important;
            }
            .deco-green {
              background: #16c085 !important;
              width: 35% !important;
              height: 100% !important;
              border-top-right-radius: 12px !important;
            }
            .deco-grey {
              background: #f3f4f6 !important;
              width: 65% !important;
              height: 100% !important;
            }
            
            /* Alignments */
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
            .font-bold { font-weight: 700 !important; }
          }
        `}</style>
      </div>
    </div>
  )
}
