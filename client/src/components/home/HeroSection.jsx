import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUsers, FaBed, FaStar } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'

export default function HeroSection() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [form, setForm] = useState({
    checkIn: today,
    checkOut: tomorrow,
    guests: '2',
    roomType: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(form)
    navigate(`/booking?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/75" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 flex flex-col items-center text-center">

        {/* Rating badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 bg-white bg-opacity-15 backdrop-blur-sm text-white 
                     px-4 py-2 rounded-full text-sm font-poppins mb-6 border border-white border-opacity-20"
        >
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => <FaStar key={i} size={12} />)}
          </div>
          <span>Rated #1 Hotel in Kanyakumari</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
        >
          Welcome to{' '}
          <span className="text-gradient-gold block sm:inline">Arlinjai Paradise</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-poppins text-white text-opacity-90 text-base sm:text-lg md:text-xl 
                     max-w-2xl mb-3 leading-relaxed"
        >
          {HOTEL_INFO.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 text-gold text-sm font-poppins mb-12"
        >
          <span className="w-8 h-px bg-gold" />
          <span>{HOTEL_INFO.location}</span>
          <span className="w-8 h-px bg-gold" />
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden"
        >
          <div className="bg-gold px-6 py-3">
            <h3 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider text-center">
              Check Availability & Book Now
            </h3>
          </div>
          <form onSubmit={handleSearch} className="p-5 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="label-text flex items-center gap-2">
                  <FaCalendarAlt className="text-gold" size={12} />
                  Check In
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={form.checkIn}
                  min={today}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label-text flex items-center gap-2">
                  <FaCalendarAlt className="text-gold" size={12} />
                  Check Out
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={form.checkOut}
                  min={form.checkIn || today}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label-text flex items-center gap-2">
                  <FaUsers className="text-gold" size={12} />
                  Guests
                </label>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className="select-field text-sm"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="label-text flex items-center gap-2">
                  <FaBed className="text-gold" size={12} />
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  className="select-field text-sm"
                >
                  <option value="">Any Room</option>
                  <option value="deluxe-ac">Deluxe AC Room</option>
                  <option value="normal-ac">Normal AC Room</option>
                  <option value="non-ac">Non AC Room</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="btn-gold px-10 py-3.5 text-sm uppercase tracking-widest w-full sm:w-auto"
              >
                Check Availability
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick info bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mt-10 text-white text-sm font-poppins"
        >
          {[
            { label: 'Starting from ₹1,500/night' },
            { label: 'Free WiFi' },
            { label: 'Free Parking' },
            { label: 'Best Price Guarantee' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="text-white text-opacity-85">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-poppins text-white text-opacity-60 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white border-opacity-40 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2.5 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
