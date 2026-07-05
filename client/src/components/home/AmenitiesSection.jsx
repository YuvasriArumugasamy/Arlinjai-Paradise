import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FaWifi, FaSnowflake, FaTv, FaShower, FaParking, FaBroom,
  FaConciergeBell, FaBolt, FaClock, FaVideo, FaKey, FaBus
} from 'react-icons/fa'
import { AMENITIES } from '../../constants'

const iconComponents = {
  wifi: FaWifi,
  ac: FaSnowflake,
  tv: FaTv,
  water: FaShower,
  parking: FaParking,
  housekeeping: FaBroom,
  roomservice: FaConciergeBell,
  power: FaBolt,
  reception: FaClock,
  security: FaVideo,
  checkin: FaKey,
  travel: FaBus,
}

export default function AmenitiesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(8,17,31,0.92), rgba(8,17,31,0.92)), url('/IMG_0472.JPG.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-poppins text-gold font-medium uppercase tracking-widest text-sm mb-3"
          >
            What We Offer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Hotel Amenities
          </motion.h2>
          <div className="gold-divider" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="font-poppins text-gray-400 max-w-xl mx-auto mt-4 text-sm"
          >
            Everything you need for a comfortable and convenient stay, all included.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {AMENITIES.map((amenity, i) => {
            const Icon = iconComponents[amenity.icon] || FaWifi
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group flex flex-col items-center text-center p-5 rounded-sm
                           border border-white border-opacity-10 hover:border-gold hover:border-opacity-50
                           bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gold bg-opacity-15 flex items-center justify-center
                               mb-3 group-hover:bg-gold group-hover:bg-opacity-100 transition-all duration-300">
                  <Icon size={20} className="text-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="font-poppins text-white text-xs font-medium leading-tight">
                  {amenity.label}
                </h4>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
