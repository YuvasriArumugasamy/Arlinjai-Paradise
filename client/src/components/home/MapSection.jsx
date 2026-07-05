import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaDirections } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'

export default function MapSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-subtitle mb-3"
          >
            Find Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Our Location
          </motion.h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 rounded-sm overflow-hidden shadow-card"
            style={{ height: '400px' }}
          >
            <iframe
              title="Arlinjai Paradise Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.870967441316!2d77.53198551478507!3d8.088248993939977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ef1264570469%3A0x65e2a7736b3e0b13!2sKanyakumari%2C%20Tamil%20Nadu%20629702!5e0!3m2!1sen!2sin!4v1643000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            <div className="bg-navy rounded-sm p-6">
              <h3 className="font-playfair font-bold text-white text-xl mb-5">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gold mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-poppins text-gray-400 text-xs mb-1">Address</p>
                    <p className="font-poppins text-white text-sm leading-relaxed">
                      {HOTEL_INFO.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gold mt-1 flex-shrink-0" size={14} />
                  <div>
                    <p className="font-poppins text-gray-400 text-xs mb-1">Phone</p>
                    <a href={`tel:${HOTEL_INFO.phone1}`} className="font-poppins text-white text-sm hover:text-gold block transition-colors">
                      {HOTEL_INFO.phone1}
                    </a>
                    <a href={`tel:${HOTEL_INFO.phone2}`} className="font-poppins text-white text-sm hover:text-gold block transition-colors">
                      {HOTEL_INFO.phone2}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gold mt-1 flex-shrink-0" size={14} />
                  <div>
                    <p className="font-poppins text-gray-400 text-xs mb-1">Email</p>
                    <a href={`mailto:${HOTEL_INFO.email}`} className="font-poppins text-white text-sm hover:text-gold break-all transition-colors">
                      {HOTEL_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={HOTEL_INFO.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex items-center justify-center gap-2 py-4"
            >
              <FaDirections size={16} />
              Get Directions
            </a>

            <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-sm p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-poppins text-xs text-gray-500 mb-1">Check-in</p>
                  <p className="font-poppins font-semibold text-navy">12:00 PM</p>
                </div>
                <div>
                  <p className="font-poppins text-xs text-gray-500 mb-1">Check-out</p>
                  <p className="font-poppins font-semibold text-navy">11:00 AM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
