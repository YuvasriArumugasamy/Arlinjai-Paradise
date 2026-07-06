import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaMapMarkerAlt, FaClock, FaTicketAlt, FaArrowRight } from 'react-icons/fa'
import { ATTRACTIONS } from '../../constants'

export default function NearbyAttractions() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const highlighted = ATTRACTIONS.filter((a) => a.highlight).slice(0, 3)

  return (
    <section className="py-20 lg:py-28 bg-lightbg" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-subtitle mb-3"
          >
            Explore Nearby
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Nearby <span className="text-gold italic font-normal">Attractions</span>
          </motion.h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-4" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="font-poppins text-gray-600 max-w-xl mx-auto mt-4 text-sm"
          >
            Arlinjai Paradise is perfectly located for exploring the best of Kanyakumari.
          </motion.p>
        </div>

        {/* Mobile Attractions List (hidden on md and above) */}
        <div className="block md:hidden space-y-4 mb-8">
          {ATTRACTIONS.slice(0, 5).map((attraction) => (
            <div
              key={attraction.id}
              className="bg-white rounded-sm p-3.5 shadow-sm border border-gray-100 flex gap-4 items-center text-left"
            >
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-playfair font-bold text-sm text-navy truncate">
                  {attraction.name}
                </h4>
                <p className="font-poppins text-[10px] text-gray-500 font-medium my-0.5">
                  {attraction.distance}
                </p>
                <p className="font-poppins text-xs text-gray-600 line-clamp-2 leading-tight">
                  {attraction.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {highlighted.map((attraction, i) => (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group bg-white rounded-sm overflow-hidden shadow-card hover:shadow-card-hover 
                         transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gold"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-gold text-white text-xs font-poppins font-medium px-3 py-1 rounded-sm">
                    {attraction.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white bg-opacity-90 
                               text-navy text-xs font-poppins font-semibold px-2 py-1 rounded-sm">
                  <FaMapMarkerAlt size={10} className="text-gold" />
                  {attraction.distance}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-playfair font-bold text-lg text-navy mb-2">
                  {attraction.name}
                </h3>
                <p className="font-poppins text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                  {attraction.description}
                </p>
                <div className="flex gap-4 text-xs text-gray-500 font-poppins">
                  <span className="flex items-center gap-1">
                    <FaClock size={10} className="text-gold" />
                    {attraction.timings.split(',')[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaTicketAlt size={10} className="text-gold" />
                    {attraction.entryFee}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buttons (Responsive styling) */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            to="/explore"
            className="block md:inline-flex w-full md:w-auto bg-gold hover:bg-gold-dark text-white font-poppins text-xs font-bold py-3.5 px-8 text-center uppercase tracking-wider transition-colors md:btn-outline-gold md:bg-transparent md:text-gold"
          >
            Explore More Places
          </Link>
        </div>
      </div>
    </section>
  )
}
