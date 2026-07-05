import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaPhone, FaArrowRight } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'

export default function CallToAction() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(8,17,31,0.85), rgba(8,17,31,0.85)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      ref={ref}
    >
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient opacity-60" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-poppins text-gold font-medium uppercase tracking-widest text-sm mb-4"
        >
          Book Your Stay
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Ready to Experience <br />
          <span className="text-gradient-gold">Kanyakumari?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="font-poppins text-gray-300 text-base mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Book directly with us for the best rates and personalized service. Our team is ready 
          to make your Kanyakumari visit truly memorable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/booking"
            className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider px-8 py-4"
          >
            Book Now – Best Rate
            <FaArrowRight size={14} />
          </Link>
          <a
            href={`tel:${HOTEL_INFO.phone1}`}
            className="btn-white inline-flex items-center gap-2 text-sm px-8 py-4"
          >
            <FaPhone size={14} className="text-gold" />
            Call Us: {HOTEL_INFO.phone1}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="font-poppins text-gray-500 text-xs mt-8"
        >
          ✓ No hidden charges &nbsp;&nbsp; ✓ Free Cancellation &nbsp;&nbsp; ✓ Best Price Guarantee
        </motion.p>
      </div>
    </section>
  )
}
