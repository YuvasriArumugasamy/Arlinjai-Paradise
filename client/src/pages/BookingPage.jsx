import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheck, FaUser, FaEnvelope, FaPhoneAlt, FaBed,
  FaCalendarAlt, FaUsers, FaArrowRight, FaArrowLeft,
  FaVenusMars, FaBirthdayCake, FaIdCard
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import Breadcrumb from '../components/common/Breadcrumb'
import { ROOMS, HOTEL_INFO, API_BASE_URL } from '../constants'

const STEPS = ['Select Room', 'Your Details', 'Review & Pay', 'Confirmation']

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-poppins font-bold text-sm
                transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-gold text-white'
                    : i === currentStep
                    ? 'bg-gold text-white ring-4 ring-gold ring-opacity-30'
                    : 'bg-gray-200 text-gray-500'
                }`}
            >
              {i < currentStep ? <FaCheck size={12} /> : i + 1}
            </div>
            <span className={`font-poppins text-xs mt-2 hidden sm:block whitespace-nowrap 
              ${i <= currentStep ? 'text-gold font-medium' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 transition-colors duration-300 
              ${i < currentStep ? 'bg-gold' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const formRef = useRef(null)

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const goToStep = (n) => {
    setStep(n)
    setTimeout(scrollToForm, 50)
  }

  const today = new Date().toISOString().split('T')[0]

  const [bookingData, setBookingData] = useState({
    roomId: searchParams.get('roomType') || '',
    checkIn: searchParams.get('checkIn') || today,
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '2'),
    name: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    idType: '',
    idNumber: '',
    specialRequests: '',
    paymentMethod: 'pay_at_hotel',
  })

  const selectedRoom = ROOMS.find((r) => r.id === bookingData.roomId)

  const getNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0
    const diff = new Date(bookingData.checkOut) - new Date(bookingData.checkIn)
    return Math.max(0, Math.floor(diff / 86400000))
  }

  const nights = getNights()
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0

  const updateBooking = (field, value) =>
    setBookingData((prev) => ({ ...prev, [field]: value }))

  // Step 0: Room Selection
  const Step0 = () => (
    <div>
      <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Select Your Room</h2>

      {/* Dates & Guests */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-white rounded-sm shadow-card p-6">
        <div>
          <label className="label-text flex items-center gap-2">
            <FaCalendarAlt size={11} className="text-gold" />
            Check In *
          </label>
          <input
            type="date"
            value={bookingData.checkIn}
            min={today}
            onChange={(e) => updateBooking('checkIn', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text flex items-center gap-2">
            <FaCalendarAlt size={11} className="text-gold" />
            Check Out *
          </label>
          <input
            type="date"
            value={bookingData.checkOut}
            min={bookingData.checkIn || today}
            onChange={(e) => updateBooking('checkOut', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text flex items-center gap-2">
            <FaUsers size={11} className="text-gold" />
            Guests
          </label>
          <select
            value={bookingData.guests}
            onChange={(e) => updateBooking('guests', parseInt(e.target.value))}
            className="select-field"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Options */}
      <div className="space-y-4">
        {ROOMS.map((room) => (
          <div
            key={room.id}
            onClick={() => updateBooking('roomId', room.id)}
            className={`bg-white rounded-sm shadow-card p-5 cursor-pointer transition-all duration-200
              border-2 ${bookingData.roomId === room.id ? 'border-gold shadow-gold' : 'border-transparent hover:border-gray-200'}`}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={room.image}
                alt={room.name}
                className="w-full sm:w-28 h-24 object-cover rounded-sm flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-playfair font-bold text-navy text-lg">{room.name}</h3>
                    <p className="font-poppins text-xs text-gray-500 mt-0.5">
                      {room.bedType} · {room.size} sq.ft · Up to {room.guests} guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair text-2xl font-bold text-gold">
                      ₹{room.price.toLocaleString()}
                    </p>
                    <p className="font-poppins text-xs text-gray-500">/night</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {room.features.slice(0, 4).map((f, fi) => (
                    <span key={fi} className="text-xs bg-lightbg text-gray-600 font-poppins px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <FaCheck size={8} className="text-gold" /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${bookingData.roomId === room.id ? 'bg-gold border-gold' : 'border-gray-300'}`}>
                  {bookingData.roomId === room.id && <FaCheck size={10} className="text-white" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            if (!bookingData.roomId) { toast.error('Please select a room'); return }
            if (!bookingData.checkIn || !bookingData.checkOut) { toast.error('Please set check-in and check-out dates'); return }
            if (nights < 1) { toast.error('Check-out must be after check-in'); return }
            goToStep(1)
          }}
          className="btn-gold flex items-center gap-2 px-8 py-3.5"
        >
          Continue <FaArrowRight size={14} />
        </button>
      </div>
    </div>
  )

  // Step 1: Guest Details
  const Step1 = () => {
    // Calculate age from DOB
    const getAge = (dob) => {
      if (!dob) return null
      const today = new Date()
      const birth = new Date(dob)
      let age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
      return age
    }
    const age = getAge(bookingData.dob)

    return (
    <div>
      <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Your Details</h2>
      <div className="bg-white rounded-sm shadow-card p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="label-text flex items-center gap-2">
              <FaUser size={11} className="text-gold" /> Full Name *
            </label>
            <input
              type="text"
              value={bookingData.name}
              onChange={(e) => updateBooking('name', e.target.value)}
              placeholder="Your full name"
              className="input-field"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="label-text flex items-center gap-2">
              <FaVenusMars size={11} className="text-gold" /> Gender *
            </label>
            <div className="flex gap-3 mt-1">
              {['Male', 'Female', 'Other'].map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm border cursor-pointer
                    font-poppins text-sm font-medium transition-colors
                    ${bookingData.gender === g
                      ? 'border-gold bg-gold bg-opacity-10 text-gold'
                      : 'border-gray-200 text-gray-500 hover:border-gold'}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={bookingData.gender === g}
                    onChange={() => updateBooking('gender', g)}
                    className="hidden"
                  />
                  {g === 'Male' ? '♂' : g === 'Female' ? '♀' : '⚧'} {g}
                </label>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="label-text flex items-center gap-2">
              <FaBirthdayCake size={11} className="text-gold" /> Date of Birth *
            </label>
            <input
              type="date"
              value={bookingData.dob}
              max={today}
              onChange={(e) => updateBooking('dob', e.target.value)}
              className="input-field"
              required
            />
            {age !== null && (
              <p className={`font-poppins text-xs mt-1 ${age < 18 ? 'text-red-500' : 'text-green-600'}`}>
                Age: {age} years {age < 18 ? '— Must be 18+ to book' : '✓'}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label-text flex items-center gap-2">
              <FaPhoneAlt size={11} className="text-gold" /> Phone Number *
            </label>
            <input
              type="tel"
              value={bookingData.phone}
              onChange={(e) => updateBooking('phone', e.target.value)}
              placeholder="+91 XXXXXXXXXX"
              className="input-field"
              required
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="label-text flex items-center gap-2">
              <FaEnvelope size={11} className="text-gold" /> Email Address *
            </label>
            <input
              type="email"
              value={bookingData.email}
              onChange={(e) => updateBooking('email', e.target.value)}
              placeholder="your@email.com"
              className="input-field"
              required
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="label-text">Address</label>
            <textarea
              value={bookingData.address}
              onChange={(e) => updateBooking('address', e.target.value)}
              rows={2}
              placeholder="City, State, Country"
              className="input-field resize-none"
            />
          </div>

          {/* Government ID Proof */}
          <div>
            <label className="label-text flex items-center gap-2">
              <FaIdCard size={11} className="text-gold" /> ID Proof Type *
            </label>
            <select
              value={bookingData.idType}
              onChange={(e) => updateBooking('idType', e.target.value)}
              className="select-field"
            >
              <option value="">— Select ID Type —</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Driving License">Driving License</option>
              <option value="Passport">Passport</option>
              <option value="Voter ID">Voter ID</option>
              <option value="PAN Card">PAN Card</option>
            </select>
          </div>

          <div>
            <label className="label-text flex items-center gap-2">
              <FaIdCard size={11} className="text-gold" /> ID Number *
            </label>
            <input
              type="text"
              value={bookingData.idNumber}
              onChange={(e) => updateBooking('idNumber', e.target.value.toUpperCase())}
              placeholder={
                bookingData.idType === 'Aadhaar Card' ? 'XXXX XXXX XXXX'
                : bookingData.idType === 'Driving License' ? 'TN00 00000000000'
                : bookingData.idType === 'Passport' ? 'A1234567'
                : bookingData.idType === 'PAN Card' ? 'ABCDE1234F'
                : 'Enter ID number'
              }
              className="input-field"
              required
            />
          </div>

          {/* Special Requests */}
          <div className="sm:col-span-2">
            <label className="label-text">Special Requests</label>
            <textarea
              value={bookingData.specialRequests}
              onChange={(e) => updateBooking('specialRequests', e.target.value)}
              rows={3}
              placeholder="Any special requirements? (e.g., early check-in, floor preference)"
              className="input-field resize-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={() => goToStep(0)} className="btn-outline-gold flex items-center gap-2 px-6 py-3">
          <FaArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => {
            if (!bookingData.name || !bookingData.email || !bookingData.phone) {
              toast.error('Please fill in name, email and phone')
              return
            }
            if (!bookingData.gender) {
              toast.error('Please select your gender')
              return
            }
            if (!bookingData.dob) {
              toast.error('Please enter your date of birth')
              return
            }
            const age = getAge(bookingData.dob)
            if (age < 18) {
              toast.error('You must be 18 or older to make a booking')
              return
            }
            if (!bookingData.idType) {
              toast.error('Please select an ID proof type')
              return
            }
            if (!bookingData.idNumber.trim()) {
              toast.error('Please enter your ID number')
              return
            }
            goToStep(2)
          }}
          className="btn-gold flex items-center gap-2 px-8 py-3.5"
        >
          Continue <FaArrowRight size={14} />
        </button>
      </div>
    </div>
  )}

  // Step 2: Review
  const Step2 = () => (
    <div>
      <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Review Your Booking</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <div className="bg-white rounded-sm shadow-card p-6">
          <h3 className="font-playfair font-semibold text-navy text-lg mb-4">Booking Summary</h3>
          {selectedRoom && (
            <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-20 h-16 object-cover rounded-sm"
              />
              <div>
                <h4 className="font-playfair font-bold text-navy">{selectedRoom.name}</h4>
                <p className="font-poppins text-xs text-gray-500 mt-0.5">
                  {selectedRoom.bedType} · {selectedRoom.size} sq.ft
                </p>
              </div>
            </div>
          )}
          <div className="space-y-3 font-poppins text-sm">
            {[
              { label: 'Check In', value: new Date(bookingData.checkIn).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Check Out', value: new Date(bookingData.checkOut).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Duration', value: `${nights} Night${nights > 1 ? 's' : ''}` },
              { label: 'Guests', value: `${bookingData.guests} Guest${bookingData.guests > 1 ? 's' : ''}` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-navy font-medium">{item.value}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-gray-500">
                ₹{selectedRoom?.price.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
              </span>
              <span className="font-bold text-gold text-lg">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Guest Details */}
        <div className="bg-white rounded-sm shadow-card p-6">
          <h3 className="font-playfair font-semibold text-navy text-lg mb-4">Guest Details</h3>
          <div className="space-y-3 font-poppins text-sm">
            {[
              { label: 'Name', value: bookingData.name },
              { label: 'Gender', value: bookingData.gender },
              { label: 'Date of Birth', value: bookingData.dob ? new Date(bookingData.dob).toLocaleDateString('en-IN') : '' },
              { label: 'Email', value: bookingData.email },
              { label: 'Phone', value: bookingData.phone },
              { label: 'ID Proof', value: bookingData.idType ? `${bookingData.idType} — ${bookingData.idNumber}` : 'Not provided' },
              { label: 'Special Requests', value: bookingData.specialRequests || 'None' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-4">
                <span className="text-gray-500 flex-shrink-0">{item.label}</span>
                <span className="text-navy font-medium text-right">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <h4 className="font-poppins font-semibold text-navy text-sm mb-3">Payment Method</h4>
            <div className="space-y-2">
              {[
                { id: 'pay_at_hotel', label: 'Pay at Hotel (Cash/UPI)', desc: 'No advance payment required' },
                { id: 'upi', label: 'UPI Transfer', desc: 'Pay via UPI to confirm booking' },
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start gap-3 p-3 rounded-sm border cursor-pointer transition-colors
                    ${bookingData.paymentMethod === pm.id ? 'border-gold bg-gold bg-opacity-5' : 'border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={bookingData.paymentMethod === pm.id}
                    onChange={() => updateBooking('paymentMethod', pm.id)}
                    className="mt-0.5 text-gold"
                  />
                  <div>
                    <p className="font-poppins text-sm font-medium text-navy">{pm.label}</p>
                    <p className="font-poppins text-xs text-gray-500">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={() => goToStep(1)} className="btn-outline-gold flex items-center gap-2 px-6 py-3">
          <FaArrowLeft size={14} /> Back
        </button>
        <button
          onClick={async () => {
            setLoading(true)
            try {
              const res = await axios.post(`${API_BASE_URL}/bookings`, bookingData)              setBookingId(res.data.bookingId || 'AP' + Date.now())
              goToStep(3)
            } catch {
              toast.error('Booking failed. Please try again or call us.')
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
          className="btn-gold flex items-center gap-2 px-8 py-3.5"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Confirming...
            </span>
          ) : (
            <>Confirm Booking <FaCheck size={14} /></>
          )}
        </button>
      </div>
    </div>
  )

  // Step 3: Confirmation
  const Step3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaCheck size={36} className="text-green-500" />
      </div>
      <h2 className="font-playfair text-3xl font-bold text-navy mb-3">Booking Confirmed!</h2>
      <p className="font-poppins text-gray-600 mb-2">
        Your booking has been received. Booking ID: <strong className="text-gold">{bookingId}</strong>
      </p>
      <p className="font-poppins text-gray-600 text-sm mb-8">
        A confirmation has been sent to <strong>{bookingData.email}</strong>
      </p>

      <div className="bg-white rounded-sm shadow-card p-8 max-w-md mx-auto mb-8 text-left">
        <h3 className="font-playfair font-semibold text-navy text-lg mb-4 text-center">Booking Details</h3>
        <div className="space-y-3 font-poppins text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Room</span>
            <span className="text-navy font-medium">{selectedRoom?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check In</span>
            <span className="text-navy font-medium">{new Date(bookingData.checkIn).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check Out</span>
            <span className="text-navy font-medium">{new Date(bookingData.checkOut).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-500 font-semibold">Total</span>
            <span className="text-gold font-bold text-lg">₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <p className="font-poppins text-gray-600 text-sm mb-6">
        Questions? Call us at{' '}
        <a href={`tel:${HOTEL_INFO.phone1}`} className="text-gold font-semibold">{HOTEL_INFO.phone1}</a>
      </p>

      <button onClick={() => navigate('/')} className="btn-gold px-8 py-3.5">
        Back to Home
      </button>
    </motion.div>
  )

  const stepComponents = [Step0, Step1, Step2, Step3]
  const CurrentStep = stepComponents[step]

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Header */}
      <div
        className="py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.85), rgba(8,17,31,0.85)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">Reserve</p>
          <h1 className="font-playfair text-4xl font-bold text-white mb-4">Book Your Stay</h1>
          <div className="flex justify-center mt-4">
            <Breadcrumb items={[{ label: 'Booking', path: '/booking' }]} />
          </div>
        </div>
      </div>

      <div ref={formRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StepIndicator currentStep={step} />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStep />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
