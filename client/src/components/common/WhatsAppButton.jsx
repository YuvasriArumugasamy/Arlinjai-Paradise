import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'

export default function WhatsAppButton() {
  const phone = HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')
  const message = encodeURIComponent(
    'Hello! I\'m interested in booking a room at Arlinjai Paradise. Please share availability and rates.'
  )
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-40 w-11 h-11 bg-green-500 text-white rounded-full 
                 flex items-center justify-center shadow-lg hover:bg-green-600 
                 transition-colors duration-300"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Pulse animation */}
      <span className="absolute w-full h-full rounded-full bg-green-500 animate-ping opacity-30" />
      <FaWhatsapp size={22} className="relative z-10" />
    </motion.a>
  )
}
