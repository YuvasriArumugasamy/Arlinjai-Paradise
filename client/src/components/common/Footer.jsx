import { Link } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Our Rooms', path: '/rooms' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Explore Kanyakumari', path: '/explore' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
]

const roomLinks = [
  { label: 'Deluxe AC Room', path: '/rooms/deluxe-ac-room' },
  { label: 'Normal AC Room', path: '/rooms/normal-ac-room' },
  { label: 'Non AC Room', path: '/rooms/non-ac-room' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/Elegant monogram with seaside emblem.png"
                  alt="Arlinjai Paradise Logo"
                  className="w-14 h-14 object-contain rounded-full border-2 border-gold"
                  style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)' }}
                />
                <div>
                  <h3 className="font-playfair font-bold text-lg text-white tracking-wider leading-tight">
                    ARLINJAI PARADISE
                  </h3>
                  <p className="font-poppins text-[9px] text-gold tracking-[0.25em] uppercase mt-0.5">
                    For Pleasant Stay
                  </p>
                </div>
              </div>
              <div className="w-12 h-0.5 bg-gold" />
            </div>
            <p className="font-poppins text-gray-400 text-sm leading-relaxed mb-6">
              {HOTEL_INFO.tagline}. Experience the beauty of Kanyakumari from the comfort of our well-appointed rooms.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={HOTEL_INFO.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white border-opacity-20 flex items-center justify-center
                           hover:bg-gold hover:border-gold transition-all duration-300 text-gray-400 hover:text-white"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href={HOTEL_INFO.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white border-opacity-20 flex items-center justify-center
                           hover:bg-gold hover:border-gold transition-all duration-300 text-gray-400 hover:text-white"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href={HOTEL_INFO.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white border-opacity-20 flex items-center justify-center
                           hover:bg-gold hover:border-gold transition-all duration-300 text-gray-400 hover:text-white"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/\s+/g, '').replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white border-opacity-20 flex items-center justify-center
                           hover:bg-green-500 hover:border-green-500 transition-all duration-300 text-gray-400 hover:text-white"
              >
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-bold text-white text-lg mb-6 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-3 mt-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-poppins text-sm text-gray-400 hover:text-gold transition-colors duration-200 
                               flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Rooms */}
          <div>
            <h4 className="font-playfair font-bold text-white text-lg mb-6 relative">
              Our Rooms
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-3 mt-4">
              {roomLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-poppins text-sm text-gray-400 hover:text-gold transition-colors duration-200 
                               flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 border border-gold border-opacity-30 rounded-sm bg-white bg-opacity-5">
              <p className="font-poppins text-xs text-gray-400 mb-1">Check-in Time</p>
              <p className="font-poppins text-sm text-white font-medium">12:00 PM</p>
              <p className="font-poppins text-xs text-gray-400 mb-1 mt-3">Check-out Time</p>
              <p className="font-poppins text-sm text-white font-medium">11:00 AM</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-bold text-white text-lg mb-6 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-4 mt-4">
              <li>
                <a
                  href={`tel:${HOTEL_INFO.phone1}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-gold transition-colors duration-200 group"
                >
                  <FaPhone className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={14} />
                  <div>
                    <p className="font-poppins text-sm">{HOTEL_INFO.phone1}</p>
                    <p className="font-poppins text-sm">{HOTEL_INFO.phone2}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/\s+/g, '').replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <FaWhatsapp className="text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={16} />
                  <span className="font-poppins text-sm">{HOTEL_INFO.whatsapp}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${HOTEL_INFO.email}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-gold transition-colors duration-200 group"
                >
                  <FaEnvelope className="text-gold flex-shrink-0 group-hover:scale-110 transition-transform" size={14} />
                  <span className="font-poppins text-sm break-all">{HOTEL_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={HOTEL_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-gold transition-colors duration-200 group"
                >
                  <FaMapMarkerAlt className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={14} />
                  <span className="font-poppins text-sm leading-relaxed">{HOTEL_INFO.address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-poppins text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Arlinjai Paradise. All rights reserved.
            </p>
            <p className="font-poppins text-xs text-gray-500 flex items-center gap-1">
              Made with <FaHeart className="text-gold text-xs" /> for our guests
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="font-poppins text-xs text-gray-500 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/about" className="font-poppins text-xs text-gray-500 hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
