import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FaMapMarkerAlt, FaBroom, FaTags, FaConciergeBell,
  FaWifi, FaUsers
} from 'react-icons/fa'
import { WHY_CHOOSE_US } from '../../constants'

const iconMap = {
  location: FaMapMarkerAlt,
  clean: FaBroom,
  price: FaTags,
  service: FaConciergeBell,
  wifi: FaWifi,
  family: FaUsers,
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

export default function WhyChooseUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 lg:py-28 bg-lightbg" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Premium Title Board ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #08111f 0%, #0d1e36 100%)',
            borderRadius: '14px',
            padding: '36px 40px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(8,17,31,0.18)',
          }}
        >
          {/* Bottom glow line */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)',
          }} />

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 11,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#c9a84c', fontWeight: 600, marginBottom: 10,
              }}
            >
              Why Guests Love Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.2,
              }}
            >
              The{' '}
              <span style={{ fontStyle: 'italic', color: '#c9a84c', fontWeight: 400 }}>
                Arlinjai
              </span>{' '}
              Difference
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                width: 60, height: 2, margin: '0 auto 14px',
                background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
                transformOrigin: 'center',
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem',
                color: 'rgba(220,220,220,0.75)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
              }}
            >
              We go above and beyond to make your stay in Kanyakumari memorable, comfortable, and truly special.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = iconMap[item.icon] || FaMapMarkerAlt
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="bg-white rounded-sm p-8 shadow-card hover:shadow-card-hover 
                           transition-all duration-300 hover:-translate-y-2 group border border-gray-200
                           hover:border-gold relative overflow-hidden"
              >
                {/* Gold Top Accent Board/Bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: '#c9a84c',
                }} />

                <div className="absolute top-0 right-0 w-20 h-20 bg-gold opacity-0 group-hover:opacity-5 
                               rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-300" />
                <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-sm flex items-center justify-center 
                               mb-5 group-hover:bg-gold transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-gold group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-playfair font-bold text-lg text-navy mb-3">
                  {item.title}
                </h3>
                <p className="font-poppins text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
