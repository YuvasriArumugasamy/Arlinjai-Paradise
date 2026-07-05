import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaSearch } from 'react-icons/fa'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-lightbg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative mb-8 inline-block">
          <span className="font-playfair text-[150px] font-bold text-gold leading-none opacity-10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaSearch size={48} className="text-gold" />
          </div>
        </div>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy mb-4">
          Page Not Found
        </h1>
        <p className="font-poppins text-gray-600 text-base max-w-md mx-auto mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let us guide you back to paradise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-gold flex items-center gap-2 justify-center">
            <FaHome size={14} />
            Back to Home
          </Link>
          <Link to="/rooms" className="btn-outline-gold">
            Browse Rooms
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
