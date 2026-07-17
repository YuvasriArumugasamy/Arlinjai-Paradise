import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFilter, FaUsers, FaBed, FaRulerCombined, FaCheck,
  FaArrowRight, FaTimes, FaSnowflake, FaFan
} from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { ROOMS } from '../constants'
import { StarButtonLink } from '../components/common/StarButton'
import useSEO from '../hooks/useSEO'

const CATEGORIES = [
  { value: 'all', label: 'All Rooms' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'standard', label: 'Standard' },
  { value: 'budget', label: 'Budget' },
]

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price' },
  { value: '0-2000', label: 'Under ₹2,000' },
  { value: '2000-3000', label: '₹2,000 – ₹3,000' },
  { value: '3000+', label: '₹3,000+' },
]

export default function RoomsPage() {
  useSEO({
    title: 'Rooms & Suites',
    description: 'Explore our luxury, standard, and budget-friendly AC & Non-AC rooms in Kanyakumari. Select the perfect room for your comfortable stay at Arlinjai Paradise.',
    keywords: 'Arlinjai Paradise rooms, luxury AC rooms, normal AC rooms, Non-AC rooms Kanyakumari, budget hotel rooms'
  })
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [guests, setGuests] = useState('any')
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredRooms = useMemo(() => {
    return ROOMS.filter((room) => {
      if (category !== 'all' && room.category !== category) return false
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map((v) => (v === '+' ? Infinity : parseInt(v)))
        if (priceRange.endsWith('+')) {
          if (room.price < parseInt(priceRange)) return false
        } else {
          if (room.price < min || room.price > max) return false
        }
      }
      if (guests !== 'any' && room.guests < parseInt(guests)) return false
      return true
    })
  }, [category, priceRange, guests])

  return (
    <div className="min-h-screen bg-lightbg">
      {/* ── Premium Page Header ── */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: '340px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url('/Screenshot 2026-07-04 223125.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay (lightened for clearer background) */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(120deg, rgba(5,10,20,0.45) 40%, rgba(5,10,20,0.18) 100%)',
          }}
        />

        {/* Text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center w-full">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '14px',
              fontWeight: 500,
            }}
          >
            Accommodations
          </motion.p>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.15,
            }}
          >
            Our{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: '#c9a84c',
                fontWeight: 400,
              }}
            >
              Rooms
            </span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              width: '60px', height: '2px',
              background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
              margin: '0 auto 18px',
              transformOrigin: 'center',
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: 'rgba(220,220,220,0.8)',
              fontSize: '0.95rem',
              maxWidth: '480px',
              margin: '0 auto 24px',
              lineHeight: 1.7,
            }}
          >
            Choose from our carefully designed rooms offering comfort and convenience.
          </motion.p>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="flex justify-center"
          >
            <Breadcrumb items={[{ label: 'Rooms', path: '/rooms' }]} />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-sm shadow-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair font-bold text-navy text-lg">Filters</h3>
                <button
                  onClick={() => { setCategory('all'); setPriceRange('all'); setGuests('any') }}
                  className="font-poppins text-xs text-gold hover:text-gold-dark transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-poppins font-semibold text-navy text-sm mb-3">Room Type</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={category === cat.value}
                        onChange={() => setCategory(cat.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className={`font-poppins text-sm transition-colors ${
                        category === cat.value ? 'text-gold font-medium' : 'text-gray-600 group-hover:text-navy'
                      }`}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-poppins font-semibold text-navy text-sm mb-3">Price Range</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((pr) => (
                    <label key={pr.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        value={pr.value}
                        checked={priceRange === pr.value}
                        onChange={() => setPriceRange(pr.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className={`font-poppins text-sm transition-colors ${
                        priceRange === pr.value ? 'text-gold font-medium' : 'text-gray-600 group-hover:text-navy'
                      }`}>
                        {pr.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div>
                <h4 className="font-poppins font-semibold text-navy text-sm mb-3">Guests</h4>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="any">Any</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <p className="font-poppins text-sm text-gray-600">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              </p>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-sm
                           font-poppins text-sm text-navy hover:border-gold transition-colors"
              >
                {filterOpen ? <FaTimes size={14} /> : <FaFilter size={14} />}
                {filterOpen ? 'Close' : 'Filters'}
              </button>
            </div>

            {/* Desktop result count */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="font-poppins text-sm text-gray-600">
                Showing <span className="font-semibold text-navy">{filteredRooms.length}</span> room{filteredRooms.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Room Cards */}
            {filteredRooms.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-sm">
                <p className="font-playfair text-2xl text-navy mb-3">No Rooms Found</p>
                <p className="font-poppins text-gray-600 text-sm mb-6">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={() => { setCategory('all'); setPriceRange('all'); setGuests('any') }}
                  className="btn-gold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRooms.map((room, i) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-sm shadow-card hover:shadow-card-hover 
                               transition-all duration-300 overflow-hidden group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative md:w-72 h-52 md:h-auto overflow-hidden flex-shrink-0">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-gold text-white text-xs font-bold font-poppins px-3 py-1 tracking-wider">
                            {room.badge}
                          </span>
                        </div>
                        {room.popular && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-navy text-white text-xs font-poppins px-2 py-1">
                              Popular
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-playfair font-bold text-xl text-navy">{room.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {room.category === 'deluxe' || room.category === 'standard' ? (
                                <FaSnowflake className="text-blue-400" size={12} />
                              ) : (
                                <FaFan className="text-gray-400" size={12} />
                              )}
                            </div>
                          </div>

                          {/* Specs */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-poppins mb-4">
                            <span className="flex items-center gap-1.5">
                              <FaUsers size={11} className="text-gold" />
                              {room.minGuests}–{room.guests} Guests
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaBed size={11} className="text-gold" />
                              {room.bedType}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaRulerCombined size={11} className="text-gold" />
                              {room.size} sq.ft
                            </span>
                          </div>

                          <p className="font-poppins text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                            {room.description}
                          </p>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2">
                            {room.features.slice(0, 5).map((f, fi) => (
                              <span
                                key={fi}
                                className="flex items-center gap-1 text-xs text-gray-600 font-poppins 
                                           bg-lightbg px-2 py-1 rounded-sm"
                              >
                                <FaCheck size={8} className="text-gold" />
                                {f}
                              </span>
                            ))}
                            {room.features.length > 5 && (
                              <span className="text-xs text-gold font-poppins font-medium px-2 py-1">
                                +{room.features.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 mt-4 border-t border-gray-100 gap-3">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="font-playfair text-2xl font-bold text-gold">
                                ₹{room.price.toLocaleString()}
                              </span>
                              <span className="font-poppins text-sm text-gray-500">/night</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/rooms/${room.slug}`}
                              className="btn-outline-gold text-xs px-3 py-1.5 text-center"
                            >
                              Details
                            </Link>
                            <StarButtonLink
                              to={`/booking?roomType=${room.id}`}
                              className="text-xs px-3 py-1.5 inline-flex items-center gap-1"
                            >
                              Book Now
                              <FaArrowRight size={10} />
                            </StarButtonLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
