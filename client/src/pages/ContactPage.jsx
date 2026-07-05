import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import Breadcrumb from '../components/common/Breadcrumb'
import { HOTEL_INFO, API_BASE_URL } from '../constants'

const INQUIRY_TYPES = ['General Inquiry', 'Room Booking', 'Rates & Packages', 'Feedback', 'Other']

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'General Inquiry'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/contact`, form)
      toast.success('Message sent successfully! We\'ll reply within 24 hours.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'General Inquiry' })
    } catch {
      toast.error('Failed to send message. Please try WhatsApp or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Header */}
      <div
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.8), rgba(8,17,31,0.8)), url('/IMG_0472.JPG.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">Reach Us</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="font-poppins text-gray-300 max-w-xl mx-auto">
            We're available 24/7. Reach out to us by phone, WhatsApp, email, or the form below.
          </p>
          <div className="mt-6 flex justify-center">
            <Breadcrumb items={[{ label: 'Contact Us', path: '/contact' }]} />
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="bg-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FaPhone, label: 'Phone', value: HOTEL_INFO.phone1, href: `tel:${HOTEL_INFO.phone1}`, sub: HOTEL_INFO.phone2 },
              { icon: FaWhatsapp, label: 'WhatsApp', value: HOTEL_INFO.whatsapp, href: `https://wa.me/${HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')}`, sub: 'Quick response' },
              { icon: FaEnvelope, label: 'Email', value: HOTEL_INFO.email, href: `mailto:${HOTEL_INFO.email}`, sub: 'Reply within 24hrs' },
              { icon: FaMapMarkerAlt, label: 'Address', value: 'Beach Road, Kanyakumari', href: HOTEL_INFO.googleMapsLink, sub: '629702' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={i}
                  href={item.href}
                  target={i === 3 || i === 1 ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-6 bg-white bg-opacity-5 
                             border border-white border-opacity-10 rounded-sm hover:border-gold 
                             hover:border-opacity-50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gold bg-opacity-20 rounded-full flex items-center 
                                 justify-center mb-3 group-hover:bg-gold transition-all duration-300">
                    <Icon size={18} className="text-gold group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-poppins text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="font-poppins text-white text-sm font-medium break-all">{item.value}</p>
                  <p className="font-poppins text-gray-500 text-xs mt-0.5">{item.sub}</p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form + Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-sm shadow-card p-8"
          >
            <h2 className="font-playfair font-bold text-2xl text-navy mb-2">Send a Message</h2>
            <p className="font-poppins text-gray-600 text-sm mb-6">
              Fill the form below and we'll get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-text">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="label-text">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-text">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={form.inquiryType}
                  onChange={handleChange}
                  className="select-field"
                >
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Brief subject"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-text">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message here..."
                  className="input-field resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 py-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <FaPaperPlane size={14} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white rounded-sm shadow-card overflow-hidden" style={{ height: '350px' }}>
              <iframe
                title="Arlinjai Paradise"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.870967441316!2d77.53198551478507!3d8.088248993939977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ef1264570469%3A0x65e2a7736b3e0b13!2sKanyakumari%2C%20Tamil%20Nadu%20629702!5e0!3m2!1sen!2sin!4v1643000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Quick Details */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h3 className="font-playfair font-bold text-navy text-lg mb-4">Hotel Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-poppins text-xs text-gray-500 mb-1">Full Address</p>
                  <p className="font-poppins text-sm text-navy">{HOTEL_INFO.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-poppins text-xs text-gray-500 mb-1">Check-in</p>
                    <p className="font-poppins text-sm font-semibold text-navy">12:00 PM</p>
                  </div>
                  <div>
                    <p className="font-poppins text-xs text-gray-500 mb-1">Check-out</p>
                    <p className="font-poppins text-sm font-semibold text-navy">11:00 AM</p>
                  </div>
                </div>
                <div>
                  <p className="font-poppins text-xs text-gray-500 mb-1">Reception</p>
                  <p className="font-poppins text-sm font-semibold text-navy">Open 24 Hours</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')}?text=${encodeURIComponent('Hello! I have a query about Arlinjai Paradise.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 text-white font-poppins 
                         font-semibold py-4 rounded-sm hover:bg-green-600 transition-colors shadow-lg"
            >
              <FaWhatsapp size={20} />
              Chat on WhatsApp for Instant Reply
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
