import { Link } from 'react-router-dom'
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaChevronRight
} from 'react-icons/fa'
import { HOTEL_INFO } from '../../constants'
import LazyImage from './LazyImage'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'About Us', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Attractions', path: '/explore' },
  { label: 'Contact Us', path: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white relative">
      {/* Top gold line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* ── Brand Column ── */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-4">
              <LazyImage
                src="/Elegant monogram with seaside emblem.webp"
                alt="Arlinjai Paradise Logo"
                className="w-12 h-12 object-contain rounded-full border-2 border-gold bg-white"
                width={48}
                height={48}
              />
              <div>
                <h3 className="font-playfair font-bold text-base tracking-wider leading-tight text-white uppercase">
                  ARLINJAI PARADISE
                </h3>
                <p className="font-poppins text-[9px] tracking-[0.22em] text-gold uppercase mt-1">
                  For Pleasant Stay
                </p>
              </div>
            </div>
            <p className="font-poppins text-xs text-gray-400 leading-relaxed mb-6 max-w-sm">
              Experience unmatched comfort and luxury in every stay. Your perfect getaway awaits.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div className="flex flex-col items-start text-left">
            <h4 className="font-playfair font-bold text-sm uppercase tracking-wider text-white mb-6 relative pb-2 w-full">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="w-full space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-poppins text-xs text-gray-400 hover:text-gold flex items-center justify-between border-b border-white/5 pb-2 transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <FaChevronRight size={10} className="text-gray-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Us ── */}
          <div className="flex flex-col items-start text-left">
            <h4 className="font-playfair font-bold text-sm uppercase tracking-wider text-white mb-6 relative pb-2 w-full">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-4 w-full mb-4">
              <li>
                <a
                  href={`tel:${HOTEL_INFO.phone1}`}
                  className="font-poppins text-xs text-gray-400 hover:text-gold flex items-start gap-3 transition-colors duration-200"
                >
                  <FaPhoneAlt size={12} className="text-gold mt-0.5 flex-shrink-0" />
                  <span>{HOTEL_INFO.phone1} / {HOTEL_INFO.phone2}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${HOTEL_INFO.email}`}
                  className="font-poppins text-xs text-gray-400 hover:text-gold flex items-center gap-3 transition-colors duration-200"
                >
                  <FaEnvelope size={12} className="text-gold flex-shrink-0" />
                  <span className="break-all">{HOTEL_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={HOTEL_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-poppins text-xs text-gray-400 hover:text-gold flex items-start gap-3 transition-colors duration-200"
                >
                  <FaMapMarkerAlt size={12} className="text-gold mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{HOTEL_INFO.address}</span>
                </a>
              </li>
            </ul>
            {/* Map Frame (Matches the mockup's visual representation of map) */}
            <div className="w-full h-24 rounded-sm overflow-hidden border border-white/10 shadow-inner">
              <iframe
                title="Footer Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.870967441316!2d77.53198551478507!3d8.088248993939977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ef1264570469%3A0x65e2a7736b3e0b13!2sKanyakumari%2C%20Tamil%20Nadu%20629702!5e0!3m2!1sen!2sin!4v1643000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1) brightness(0.9)' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 pt-3 pb-16 md:py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p className="font-poppins text-[10px] text-white/90 leading-relaxed">
            Copyright © {new Date().getFullYear()} Arlinjai Paradise, Kanyakumari.
            <br className="md:hidden" /> All rights reserved |{' '}
            <br className="md:hidden" /> Website Designed 💖 by -Yuvasri Arumugasamy
          </p>
          <Link to="/login" className="font-poppins text-[10px] text-white/90 hover:text-gold transition-colors duration-200">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
