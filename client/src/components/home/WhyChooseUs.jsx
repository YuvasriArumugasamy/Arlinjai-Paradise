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
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-subtitle mb-3"
          >
            Why Guests Love Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title"
          >
            The Arlinjai Difference
          </motion.h2>
          <div className="gold-divider" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-poppins text-gray-600 max-w-2xl mx-auto mt-4 text-sm leading-relaxed"
          >
            We go above and beyond to make your stay in Kanyakumari memorable, comfortable, and truly special.
          </motion.p>
        </div>

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
                           transition-all duration-300 hover:-translate-y-2 group border border-transparent
                           hover:border-gold hover:border-opacity-20 relative overflow-hidden"
              >
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
