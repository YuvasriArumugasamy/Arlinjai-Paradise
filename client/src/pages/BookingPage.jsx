import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheck, FaUser, FaEnvelope, FaPhoneAlt, FaBed,
  FaCalendarAlt, FaUsers, FaArrowRight, FaArrowLeft,
  FaVenusMars, FaBirthdayCake, FaIdCard, FaClock, FaPrint
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

import useSEO from '../hooks/useSEO'

export default function BookingPage() {
  useSEO({
    title: 'Book Your Stay',
    description: 'Book your luxury stay at Arlinjai Paradise Hotel Kanyakumari. Safe, comfortable, family-friendly hotel. Book directly online for best rates.',
    keywords: 'Book hotel room Kanyakumari, online hotel booking, stay in Kanyakumari, reserve room'
  })
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const formRef = useRef(null)

  // Load Razorpay script on mount (Commented out as we are using direct booking now)
  /*
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  */

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
    checkInTime: '',
    checkOutTime: '',
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
  const basePrice = selectedRoom ? selectedRoom.price * nights : 0
  const gstAmount = Math.round(basePrice * 0.12)
  const totalPrice = basePrice + gstAmount

  const updateBooking = (field, value) =>
    setBookingData((prev) => ({ ...prev, [field]: value }))

  // Step 0: Room Selection
  const renderStep0 = () => (
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
  const renderStep1 = () => {
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

          {/* Expected Check-in and Check-out Times */}
          <div>
            <label className="label-text flex items-center gap-2">
              <FaClock size={11} className="text-gold" /> Expected Check-in Time *
            </label>
            <input
              type="time"
              value={bookingData.checkInTime}
              onChange={(e) => updateBooking('checkInTime', e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-text flex items-center gap-2">
              <FaClock size={11} className="text-gold" /> Expected Check-out Time *
            </label>
            <input
              type="time"
              value={bookingData.checkOutTime}
              onChange={(e) => updateBooking('checkOutTime', e.target.value)}
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
            if (!bookingData.checkInTime) {
              toast.error('Please enter expected check-in time')
              return
            }
            if (!bookingData.checkOutTime) {
              toast.error('Please enter expected check-out time')
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
  const renderStep2 = () => (
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
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between font-poppins text-sm">
                <span className="text-gray-500">
                  ₹{selectedRoom?.price.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
                </span>
                <span className="text-navy">₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-poppins text-sm">
                <span className="text-gray-500">GST (12%)</span>
                <span className="text-navy">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-poppins text-sm border-t pt-2">
                <span className="font-bold text-navy">Total (incl. GST)</span>
                <span className="font-bold text-gold text-lg">₹{totalPrice.toLocaleString()}</span>
              </div>
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
              { label: 'Expected Check-in Time', value: bookingData.checkInTime },
              { label: 'Expected Check-out Time', value: bookingData.checkOutTime },
              { label: 'ID Proof', value: bookingData.idType ? `${bookingData.idType} — ${bookingData.idNumber}` : 'Not provided' },
              { label: 'Special Requests', value: bookingData.specialRequests || 'None' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-4">
                <span className="text-gray-500 flex-shrink-0">{item.label}</span>
                <span className="text-navy font-medium text-right">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Payment Method — Pay at Hotel */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <h4 className="font-poppins font-semibold text-navy text-sm mb-3">Payment Method</h4>
            <div className="flex items-center gap-3 p-4 rounded-sm border border-gold bg-gold bg-opacity-5">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">🏨</span>
              </div>
              <div>
                <p className="font-poppins text-sm font-semibold text-navy">Pay at Hotel / Cash on Arrival</p>
                <p className="font-poppins text-xs text-gray-500 mt-0.5">No immediate online payment required. Pay directly at the front desk upon check-in.</p>
              </div>
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
            // ── Helper: save booking data and advance to confirmation ──
            const finalizeBooking = async (paymentDetails = {}) => {
              setLoading(true)
              try {
                const payload = { ...bookingData, ...paymentDetails }
                const res = await axios.post(`${API_BASE_URL}/bookings`, payload)
                const newBookingId = res.data.bookingId || 'AP' + String(Date.now()).slice(-6)
                setBookingId(newBookingId)

                const savedBookings = JSON.parse(localStorage.getItem('arlinjai_bookings') || '[]')
                savedBookings.unshift({
                  id: newBookingId,
                  guest: bookingData.name,
                  gender: bookingData.gender,
                  dob: bookingData.dob,
                  email: bookingData.email,
                  phone: bookingData.phone,
                  idType: bookingData.idType,
                  idNumber: bookingData.idNumber,
                  address: bookingData.address,
                  room: selectedRoom?.name || bookingData.roomId,
                  checkIn: bookingData.checkIn,
                  checkInTime: bookingData.checkInTime,
                  checkOut: bookingData.checkOut,
                  checkOutTime: bookingData.checkOutTime,
                  nights,
                  guests: bookingData.guests,
                  amount: totalPrice,
                  paymentMethod: bookingData.paymentMethod,
                  specialRequests: bookingData.specialRequests,
                  status: paymentDetails.razorpay_payment_id ? 'confirmed' : 'pending',
                  razorpayPaymentId: paymentDetails.razorpay_payment_id || null,
                  createdAt: new Date().toISOString(),
                })
                localStorage.setItem('arlinjai_bookings', JSON.stringify(savedBookings))
                goToStep(3)
              } catch {
                const offlineId = 'AP' + String(Date.now()).slice(-6)
                setBookingId(offlineId)
                const savedBookings = JSON.parse(localStorage.getItem('arlinjai_bookings') || '[]')
                savedBookings.unshift({
                  id: offlineId,
                  guest: bookingData.name,
                  gender: bookingData.gender,
                  dob: bookingData.dob,
                  email: bookingData.email,
                  phone: bookingData.phone,
                  idType: bookingData.idType,
                  idNumber: bookingData.idNumber,
                  address: bookingData.address,
                  room: selectedRoom?.name || bookingData.roomId,
                  checkIn: bookingData.checkIn,
                  checkInTime: bookingData.checkInTime,
                  checkOut: bookingData.checkOut,
                  checkOutTime: bookingData.checkOutTime,
                  nights,
                  guests: bookingData.guests,
                  amount: totalPrice,
                  paymentMethod: bookingData.paymentMethod,
                  specialRequests: bookingData.specialRequests,
                  status: paymentDetails.razorpay_payment_id ? 'confirmed' : 'pending',
                  razorpayPaymentId: paymentDetails.razorpay_payment_id || null,
                  createdAt: new Date().toISOString(),
                })
                localStorage.setItem('arlinjai_bookings', JSON.stringify(savedBookings))
                goToStep(3)
              } finally {
                setLoading(false)
              }
            }

            // ── Direct Booking Flow (Bypass Razorpay) ────
            /*
            if (!window.Razorpay) {
              toast.error('Payment gateway not loaded. Please refresh and try again.')
              return
            }
            setPaymentLoading(true)

            const rzpOptions = {
              key: 'rzp_test_TBQl2GSohl5ZkT',
              amount: totalPrice * 100, // paise
              currency: 'INR',
              name: 'Arlinjai Paradise',
              description: `Room Booking — ${selectedRoom?.name || bookingData.roomId}`,
              image: '/logo.png',
              prefill: {
                name: bookingData.name,
                email: bookingData.email,
                contact: bookingData.phone,
              },
              notes: {
                room: selectedRoom?.name || bookingData.roomId,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
              },
              theme: { color: '#C9A96E' },
              method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true,
                upi_intent: true,
              },
              config: {
                display: {
                  blocks: {
                    upi_block: {
                      name: 'Pay via UPI / QR Code',
                      instruments: [
                        { method: 'upi', flows: ['qr', 'collect', 'intent'] },
                      ],
                    },
                  },
                  sequence: ['block.upi_block'],
                  preferences: { show_default_blocks: true },
                },
              },
              modal: {
                ondismiss: () => {
                  setPaymentLoading(false)
                  toast.error('Payment cancelled. Booking not confirmed.')
                },
              },
              handler: async (response) => {
                toast.success('Payment successful! 🎉')
                // Try server verify — but don't block if server is offline
                try {
                  await axios.post(`${API_BASE_URL}/payments/verify`, {
                    razorpay_order_id: response.razorpay_order_id || '',
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature || '',
                  })
                } catch { }
                await finalizeBooking({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id || '',
                })
              },
            }

            const rzp = new window.Razorpay(rzpOptions)
            rzp.open()
            */

            await finalizeBooking()
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
            <>🏨 Confirm Booking <FaCheck size={14} /></>
          )}
        </button>
      </div>
    </div>
  )

  // Step 3: Confirmation
  const renderStep3 = () => (
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

      <div className="bg-white rounded-sm shadow-card max-w-md mx-auto mb-8 text-left overflow-hidden">
        <div className="p-8">
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
              <span className="text-gray-500">Room Charges</span>
              <span className="text-navy font-medium">₹{basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">GST (12%)</span>
              <span className="text-navy font-medium">₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-500 font-bold">{bookingData.paymentMethod === 'razorpay' ? 'Total Paid' : 'Total Amount'}</span>
              <span className="text-gold font-bold text-lg">₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className={`font-medium text-xs px-2 py-0.5 rounded-full ${bookingData.paymentMethod === 'razorpay' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {bookingData.paymentMethod === 'razorpay' ? '✅ Paid Online' : '🏨 Pay at Hotel'}
              </span>
            </div>
          </div>
        </div>

        {/* Print Button (Hidden in Print) */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-[#08111F] text-white
                       font-poppins font-semibold text-sm py-3 rounded-lg hover:bg-[#08111F]/90
                       transition-colors cursor-pointer"
          >
            <FaPrint size={13} /> Save / Print Receipt
          </button>
        </div>
      </div>

      <p className="font-poppins text-gray-600 text-sm mb-6 print:hidden">
        Questions? Call us at{' '}
        <a href={`tel:${HOTEL_INFO.phone1}`} className="text-gold font-semibold">{HOTEL_INFO.phone1}</a>
      </p>

      <button onClick={() => navigate('/')} className="btn-gold px-8 py-3.5 print:hidden">
        Back to Home
      </button>

      {/* Printable Invoice (Hidden on Screen, Visible on Print) */}
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
            <p className="guest-name">{bookingData.name}</p>
            <p>Phone: {bookingData.phone}</p>
            <p>Email: {bookingData.email}</p>
          </div>
          <div className="invoice-details">
            <h3 className="section-title">RECEIPT DETAILS</h3>
            <p><strong>Receipt No:</strong> INV-{bookingId}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
            <p><strong>Status:</strong> <span className="status-badge" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>Confirmed</span></p>
            <p><strong>Payment:</strong> {bookingData.paymentMethod === 'razorpay' ? 'Paid Online' : 'Pay at Hotel (Cash/UPI)'}</p>
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
                <strong>Room Charge ({selectedRoom?.name})</strong>
                <p className="nights-desc">{nights} Night(s)</p>
              </td>
              <td className="text-center">
                <div>{new Date(bookingData.checkIn).toLocaleDateString('en-IN')} ({bookingData.checkInTime || '12:00 PM'})</div>
                <div>{new Date(bookingData.checkOut).toLocaleDateString('en-IN')} ({bookingData.checkOutTime || '11:00 AM'})</div>
              </td>
              <td className="text-center">1 Room × {bookingData.guests} Guests</td>
              <td className="text-center">₹{selectedRoom?.price.toLocaleString()}</td>
              <td className="text-right">₹{basePrice.toLocaleString()}</td>
            </tr>
            <tr className="subtotal-row">
              <td colSpan="3"></td>
              <td className="text-right font-medium">Subtotal</td>
              <td className="text-right font-medium">₹{basePrice.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className="text-right text-gray-500">GST (12%)</td>
              <td className="text-right text-gray-500">₹{gstAmount.toLocaleString()}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="3"></td>
              <td className="text-right font-bold">Total Amount</td>
              <td className="text-right font-bold text-gold">₹{totalPrice.toLocaleString()}</td>
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
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Header */}
      <div
        className="py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.85), rgba(8,17,31,0.85)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.webp')`,
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
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
