import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaClock, FaTicketAlt } from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { ATTRACTIONS, HOTEL_INFO } from '../constants'

const CATEGORIES = ['All Places', 'Nature', 'Heritage', 'Temple', 'Beach', 'Church', 'Entertainment']

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All Places')

  const filtered = activeCategory === 'All Places'
    ? ATTRACTIONS
    : ATTRACTIONS.filter((a) => a.category === activeCategory)

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Hero */}
      <div
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.75), rgba(8,17,31,0.75)), url('/Screenshot 2026-07-05 100133.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">
            Kanyakumari
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">
            Explore <span className="italic font-normal text-gold">Kanyakumari</span>
          </h1>
          <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-3 mb-4" />
          <p className="font-poppins text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            Discover the magical land where three seas meet. From ancient temples to iconic landmarks,
            Kanyakumari offers experiences that will last a lifetime.
          </p>
          <div className="mt-6 flex justify-center">
            <Breadcrumb items={[{ label: 'Explore Kanyakumari', path: '/explore' }]} />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-white" size={18} />
              <p className="font-poppins text-white text-sm font-medium">
                All major attractions are within <strong>2 km</strong> from Arlinjai Paradise
              </p>
            </div>
            <a
              href={HOTEL_INFO.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins text-white text-sm border border-white border-opacity-50 
                         px-4 py-2 rounded-sm hover:bg-white hover:text-gold transition-colors flex-shrink-0"
            >
              Get Directions to Hotel
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-poppins text-sm font-medium px-5 py-2 rounded-sm 
                         transition-all duration-200 ${
                           activeCategory === cat
                             ? 'bg-gold text-white shadow-gold'
                             : 'bg-white text-navy hover:border-gold border border-gray-200'
                         }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="font-poppins text-sm text-gray-500 text-center mb-8">
          Showing <span className="font-semibold text-navy">{filtered.length}</span> attractions
        </p>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((attraction, i) => (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-sm overflow-hidden shadow-card hover:shadow-card-hover 
                         transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-gold text-white text-xs font-poppins font-medium px-2 py-1 rounded-sm">
                    {attraction.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white bg-opacity-90 
                               text-navy text-xs font-poppins font-semibold px-2 py-1 rounded-sm">
                  <FaMapMarkerAlt size={9} className="text-gold" />
                  {attraction.distance}
                </div>
                {attraction.highlight && (
                  <div className="absolute top-3 left-3 bg-navy text-white text-xs font-poppins px-2 py-1 rounded-sm">
                    Must Visit
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-playfair font-bold text-base text-navy mb-2 leading-tight">
                  {attraction.name}
                </h3>
                <p className="font-poppins text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                  {attraction.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaClock size={10} className="text-gold flex-shrink-0" />
                    <p className="font-poppins text-xs text-gray-600">{attraction.timings}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTicketAlt size={10} className="text-gold flex-shrink-0" />
                    <p className="font-poppins text-xs text-navy font-medium">{attraction.entryFee}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Travel Tips */}
        <div className="mt-16 bg-navy rounded-sm p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl font-bold text-white mb-3">
              Travel Tips for Kanyakumari
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🌅',
                title: 'Best Time to Visit',
                desc: 'October to March offers pleasant weather. December and January are peak season with higher prices.'
              },
              {
                icon: '🚢',
                title: 'Ferry to Rock Memorial',
                desc: 'Ferries operate from Kanyakumari Pier. Buy tickets early morning to avoid queues. Last ferry at 4 PM.'
              },
              {
                icon: '👗',
                title: 'Temple Dress Code',
                desc: 'Modest dress required at Kumari Amman Temple. No shorts or sleeveless attire allowed inside.'
              },
              {
                icon: '🌊',
                title: 'Sunrise & Sunset',
                desc: 'Wake up early for the famous sunrise! The sunset over the Arabian Sea is equally spectacular.'
              },
              {
                icon: '🍛',
                title: 'Local Cuisine',
                desc: 'Try seafood delicacies, coconut-based curries, and fresh fish near the beach area.'
              },
              {
                icon: '📸',
                title: 'Photography',
                desc: 'The confluence of three seas creates unique photo opportunities. Golden hour is magical here.'
              },
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white bg-opacity-5 rounded-sm p-5 border border-white border-opacity-10
                           hover:border-gold hover:border-opacity-30 transition-colors"
              >
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h4 className="font-poppins font-semibold text-white text-sm mb-2">{tip.title}</h4>
                <p className="font-poppins text-gray-400 text-xs leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-sm shadow-card p-10">
          <h3 className="font-playfair text-2xl font-bold text-navy mb-3">
            Stay Close to All Attractions
          </h3>
          <p className="font-poppins text-gray-600 text-sm mb-6 max-w-xl mx-auto">
            Arlinjai Paradise is perfectly located — walk to the beach, temple, and ferry point within minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/booking"
              className="btn-gold inline-flex items-center gap-2 px-8 py-3.5"
            >
              Book Your Stay
            </a>
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')}?text=${encodeURIComponent('Hello! I want to explore Kanyakumari. Please share room availability.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white font-poppins font-semibold 
                         px-8 py-3.5 rounded-sm hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
