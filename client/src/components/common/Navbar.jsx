import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaPhoneAlt } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'
import { StarButtonLink } from './StarButton'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Explore Kanyakumari', path: '/explore' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Manage Booking', path: '/manage-booking' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileOpen])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/Elegant monogram with seaside emblem.webp"
                alt="Arlinjai Paradise Logo"
                className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-full border-2 border-gold"
              />
              <div className="flex flex-col items-start">
                <span
                  className={`font-playfair font-bold text-base lg:text-lg tracking-wider transition-colors duration-300 leading-tight ${
                    scrolled ? 'text-navy' : 'text-white'
                  } group-hover:text-gold`}
                >
                  ARLINJAI PARADISE
                </span>
                <span className="font-poppins text-[9px] tracking-[0.2em] uppercase text-gold leading-tight">
                  {HOTEL_INFO.shortTagline}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-poppins text-sm font-medium transition-colors duration-200 relative group ${
                    isActive(link.path)
                      ? 'text-gold'
                      : scrolled
                      ? 'text-navy hover:text-gold'
                      : 'text-white hover:text-gold'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full ${
                      isActive(link.path) ? 'w-full' : ''
                    }`}
                  />
                </Link>
              ))}
              <a
                href={`tel:${HOTEL_INFO.phone1}`}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ml-2 shadow-sm hover:shadow-md"
                title="Call Us"
              >
                <FaPhoneAlt size={14} />
              </a>
              <StarButtonLink
                to="/booking"
                className="text-sm font-semibold ml-2"
              >
                Book Now
              </StarButtonLink>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors duration-200 ${
                scrolled ? 'text-navy hover:text-gold' : 'text-white hover:text-gold'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-navy lg:hidden"
            style={{ paddingTop: '64px' }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="px-6 py-8 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-4 px-4 font-poppins text-base font-medium border-b border-white border-opacity-10 
                                 transition-colors duration-200 ${
                                   isActive(link.path) ? 'text-gold' : 'text-white hover:text-gold'
                                 }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.07 }}
                  className="mt-6"
                >
                  <StarButtonLink
                    to="/booking"
                    className="block w-full text-center font-semibold py-4"
                  >
                    Book Now
                  </StarButtonLink>
                </motion.div>
                <div className="mt-8 flex flex-col gap-3 px-4">
                  <a
                    href={`tel:${HOTEL_INFO.phone1}`}
                    className="flex items-center gap-3 text-white text-sm font-poppins"
                  >
                    <FaPhoneAlt className="text-gold" />
                    {HOTEL_INFO.phone1}
                  </a>
                  <a
                    href={`tel:${HOTEL_INFO.phone2}`}
                    className="flex items-center gap-3 text-white text-sm font-poppins"
                  >
                    <FaPhoneAlt className="text-gold" />
                    {HOTEL_INFO.phone2}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
