import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaUsers, FaBed, FaRulerCombined, FaArrowRight, FaCheck } from 'react-icons/fa'
import { ROOMS } from '../../constants'

function RoomCard({ room, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="group bg-white rounded-sm overflow-hidden shadow-card hover:shadow-card-hover 
                 transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gold"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-gold text-white font-poppins text-xs font-bold px-3 py-1 tracking-wider">
            {room.badge}
          </span>
        </div>
        {room.popular && (
          <div className="absolute top-3 right-3">
            <span className="bg-navy text-white font-poppins text-xs font-medium px-3 py-1">
              Most Popular
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50
                       transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/rooms/${room.slug}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       bg-gold text-white px-5 py-2 font-poppins text-sm font-semibold rounded-sm"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-playfair font-bold text-xl text-navy mb-2">{room.name}</h3>

        <div className="flex items-center gap-4 text-gray-500 text-xs font-poppins mb-4">
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

        <ul className="space-y-1.5 mb-5">
          {room.features.slice(0, 4).map((f, fi) => (
            <li key={fi} className="flex items-center gap-2 text-xs text-gray-600 font-poppins">
              <FaCheck size={9} className="text-gold flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="font-playfair text-2xl font-bold text-gold">
              ₹{room.price.toLocaleString()}
            </span>
            <span className="font-poppins text-xs text-gray-500"> /night</span>
          </div>
          <Link
            to={`/booking?roomType=${room.id}`}
            className="bg-gold text-white font-poppins text-xs font-semibold px-4 py-2 rounded-sm
                       hover:bg-gold-dark transition-colors flex items-center gap-1.5"
          >
            Book Now
            <FaArrowRight size={10} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function RoomPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-subtitle mb-3"
          >
            Our Accommodations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Comfort for Every Stay
          </motion.h2>
          <div className="gold-divider" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="font-poppins text-gray-600 max-w-xl mx-auto mt-4 text-sm"
          >
            From budget-friendly to premium, we have the perfect room for every traveler.
          </motion.p>
        </div>

        {/* Cards — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ROOMS.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} inView={inView} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link to="/rooms" className="btn-outline-gold inline-flex items-center gap-2">
            Explore All Rooms
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
