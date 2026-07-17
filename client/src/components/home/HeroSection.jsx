import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUsers, FaBed, FaStar } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'
import { StarButtonLink, StarButton } from '../common/StarButton'

export default function HeroSection() {
  const navigate = useNavigate()
  const getLocalDateStr = (date = new Date()) => {
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - (offset * 60 * 1000))
    return local.toISOString().split('T')[0]
  }
  const today = getLocalDateStr()
  const tomorrow = getLocalDateStr(new Date(Date.now() + 86400000))

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
    <section className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/ChatGPT Image Jul 5, 2026, 12_17_46 PM.webp')`,
        }}
      />
      {/* Overlay - stronger for better text clarity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 flex flex-col items-center justify-center text-center">

        {/* Logo above heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <img
            src="/Elegant monogram with seaside emblem.webp"
            alt="Arlinjai Paradise Logo"
            className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-full border-2 border-gold shadow-lg mx-auto"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
        >
          Welcome to{' '}
          <span className="text-gradient-gold block sm:inline">Arlinjai Paradise</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-poppins text-white text-base sm:text-lg md:text-xl 
                     max-w-2xl mb-4 leading-relaxed drop-shadow-md"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
        >
          {HOTEL_INFO.tagline}
        </motion.p>

        {/* Buttons - Mobile Side-by-side, Desktop side-by-side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-row items-center justify-center gap-4 mb-8 sm:mb-12"
        >
          <StarButtonLink to="/booking" className="text-xs uppercase tracking-wider font-bold font-poppins">
            Book Now
          </StarButtonLink>
          <Link
            to="/rooms"
            className="border-2 border-white hover:border-gold hover:bg-gold hover:text-white text-white font-poppins text-xs font-bold px-6 py-2.5 uppercase tracking-wider transition-all duration-300"
          >
            View More
          </Link>
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
              <div className="flex flex-col gap-1 text-left">
                <label className="label-text flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
              <div className="flex flex-col gap-1 text-left">
                <label className="label-text flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
              <div className="flex flex-col gap-1 text-left">
                <label className="label-text flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
              <div className="flex flex-col gap-1 text-left">
                <label className="label-text flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
              <StarButton
                type="submit"
                className="px-10 py-3.5 text-sm uppercase tracking-widest w-full"
              >
                Check Availability
              </StarButton>
            </div>
          </form>
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
