import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaPaperPlane, FaClock, FaConciergeBell, FaUtensils, FaCalendarCheck,
  FaUser, FaCommentDots
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import Breadcrumb from '../components/common/Breadcrumb'
import { HOTEL_INFO, API_BASE_URL } from '../constants'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
})

/* ── Shared input style ── */
const inputStyle = {
  width: '100%',
  padding: '11px 16px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '8px',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.85rem',
  color: '#1f2937',
  outline: 'none',
  background: '#fafafa',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

import useSEO from '../hooks/useSEO'

export default function ContactPage() {
  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with Arlinjai Paradise Hotel Kanyakumari. Reach out for direct bookings, queries, feedback, or customer assistance.',
    keywords: 'Contact Arlinjai Paradise, hotel phone number, Kanyakumari hotel email, reach hotel'
  })
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/contact`, form)
      toast.success("Message sent! We'll reply within 24 hours.")
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send. Please call or WhatsApp us directly.')
    } finally {
      setLoading(false)
    }
  }

  const getBorder = (field) => focused === field
    ? '1.5px solid #c9a84c'
    : '1.5px solid #e5e7eb'

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>

      {/* ── Hero Header ── */}
      <div
        style={{
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(8,17,31,0.78), rgba(8,17,31,0.78)), url('/IMG_0472.JPG.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '140px 0 80px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Bottom glow line */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            transformOrigin: 'left' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.p {...fadeUp(0.2)} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11,
            letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c9a84c',
            fontWeight: 600, marginBottom: 12 }}>
            Get In Touch
          </motion.p>
          <motion.h1 {...fadeUp(0.35)} style={{ fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 700, color: '#fff',
            marginBottom: 14, lineHeight: 1.15 }}>
            Contact <span style={{ fontStyle: 'italic', color: '#c9a84c', fontWeight: 400 }}>Us</span>
          </motion.h1>
          <motion.div {...fadeUp(0.45)} style={{ width: 56, height: 2, margin: '0 auto 18px',
            background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
          <motion.p {...fadeUp(0.55)} style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(220,220,220,0.82)',
            fontSize: '0.92rem', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.7 }}>
            We're available 24/7. Reach out by phone, WhatsApp, email, or the form below.
          </motion.p>
          <motion.div {...fadeUp(0.65)} style={{ display: 'flex', justifyContent: 'center' }}>
            <Breadcrumb items={[{ label: 'Contact Us', path: '/contact' }]} />
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 36, alignItems: 'start' }}
          className="contact-grid">

          {/* LEFT — contact info */}
          <motion.div {...fadeUp(0.1)}>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#c9a84c', fontWeight: 600, marginBottom: 8 }}>
              Get In Touch
            </p>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.9rem',
              fontWeight: 700, color: '#08111f', marginBottom: 6 }}>
              We're Here to Help You
            </h2>
            <div style={{ width: 40, height: 2, background: '#c9a84c', marginBottom: 14 }} />
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.85rem', color: '#6b7280',
              lineHeight: 1.7, marginBottom: 28 }}>
              Have questions or need assistance with your booking?<br />
              Feel free to reach out to us. Our team will be happy to assist you.
            </p>

            {/* Contact cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Phone */}
              <motion.a href={`tel:${HOTEL_INFO.phone1}`} {...fadeUp(0.15)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  background: '#fff', borderRadius: 10, boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(201,168,76,0.12)', textDecoration: 'none',
                  transition: 'box-shadow 0.2s, border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'}>
                <div style={{ width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid rgba(201,168,76,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaPhoneAlt size={16} style={{ color: '#c9a84c' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Phone</p>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '0.88rem',
                    color: '#08111f', margin: 0 }}>{HOTEL_INFO.phone1}</p>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.8rem',
                    color: '#6b7280', margin: 0 }}>{HOTEL_INFO.phone2}</p>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.div {...fadeUp(0.2)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  background: '#fff', borderRadius: 10, boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(201,168,76,0.12)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid rgba(37,211,102,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaWhatsapp size={18} style={{ color: '#25d366' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>WhatsApp</p>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '0.88rem',
                    color: '#08111f', margin: 0 }}>{HOTEL_INFO.whatsapp}</p>
                </div>
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')}?text=${encodeURIComponent('Hello! I have a query about Arlinjai Paradise.')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ padding: '7px 16px', background: '#c9a84c', color: '#fff',
                    borderRadius: 6, fontFamily: 'Poppins,sans-serif', fontSize: '0.75rem',
                    fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
                    letterSpacing: '0.04em', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#b8962e'}
                  onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                >
                  CHAT NOW
                </a>
              </motion.div>

              {/* Email */}
              <motion.a href={`mailto:${HOTEL_INFO.email}`} {...fadeUp(0.25)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  background: '#fff', borderRadius: 10, boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(201,168,76,0.12)', textDecoration: 'none',
                  transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'}>
                <div style={{ width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid rgba(201,168,76,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaEnvelope size={16} style={{ color: '#c9a84c' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Email</p>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '0.88rem',
                    color: '#08111f', margin: 0 }}>{HOTEL_INFO.email}</p>
                </div>
              </motion.a>

              {/* Address */}
              <motion.a href={HOTEL_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer"
                {...fadeUp(0.3)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px',
                  background: '#fff', borderRadius: 10, boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(201,168,76,0.12)', textDecoration: 'none',
                  transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'}>
                <div style={{ width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid rgba(201,168,76,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <FaMapMarkerAlt size={16} style={{ color: '#c9a84c' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Address</p>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '0.88rem',
                    color: '#08111f', margin: 0, lineHeight: 1.5 }}>{HOTEL_INFO.address}</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div {...fadeUp(0.15)}
            style={{ background: '#fff', borderRadius: 16, padding: '36px 32px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.09)', border: '1px solid rgba(201,168,76,0.1)' }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.55rem',
              fontWeight: 700, color: '#08111f', marginBottom: 24 }}>
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Row: Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ position: 'relative' }}>
                  <FaUser size={13} style={{ position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                    placeholder="Your Name *" required
                    style={{ ...inputStyle, paddingLeft: 36, border: getBorder('name') }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <FaPhoneAlt size={13} style={{ position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                    placeholder="Phone Number *"
                    style={{ ...inputStyle, paddingLeft: 36, border: getBorder('phone') }} />
                </div>
              </div>

              {/* Email */}
              <div style={{ position: 'relative' }}>
                <FaEnvelope size={13} style={{ position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="Email Address *" required
                  style={{ ...inputStyle, paddingLeft: 36, border: getBorder('email') }} />
              </div>

              {/* Subject */}
              <div style={{ position: 'relative' }}>
                <FaCommentDots size={13} style={{ position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                <input type="text" name="subject" value={form.subject} onChange={handleChange}
                  onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                  placeholder="Subject *" required
                  style={{ ...inputStyle, paddingLeft: 36, border: getBorder('subject') }} />
              </div>

              {/* Message */}
              <textarea name="message" value={form.message} onChange={handleChange}
                onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                placeholder="Your Message *" rows={5} required
                style={{ ...inputStyle, resize: 'none', border: getBorder('message'), lineHeight: 1.6 }} />

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px 24px', background: loading ? '#d4b96a' : '#c9a84c',
                  color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '0.88rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: '0 4px 18px rgba(201,168,76,0.35)',
                  transition: 'background 0.2s, transform 0.15s' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#b8962e' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#c9a84c' }}
              >
                {loading ? (
                  <svg className="animate-spin" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                    <path fill="currentColor" style={{ opacity: 0.75 }} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <FaPaperPlane size={14} />
                )}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* ── Find Us / Map ── */}
      <div style={{ maxWidth: 1160, margin: '0 auto 0', padding: '0 24px 64px' }}>
        <motion.div {...fadeUp(0.1)}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.55rem',
            fontWeight: 700, color: '#08111f', marginBottom: 6 }}>Find Us</h2>
          <div style={{ width: 40, height: 2, background: '#c9a84c', marginBottom: 20 }} />
        </motion.div>
        <motion.div {...fadeUp(0.2)}
          style={{ borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 4px 28px rgba(0,0,0,0.1)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <iframe
            title="Arlinjai Paradise Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.870967441316!2d77.53198551478507!3d8.088248993939977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ef1264570469%3A0x65e2a7736b3e0b13!2sKanyakumari%2C%20Tamil%20Nadu%20629702!5e0!3m2!1sen!2sin!4v1643000000000!5m2!1sen!2sin"
            width="100%" height="380"
            style={{ border: 0, display: 'block' }}
            allowFullScreen loading="lazy"
          />
        </motion.div>
      </div>

      {/* ── Info Strip ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #f0ebe0', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
          className="info-strip">
          {[
            { icon: FaClock, title: 'Check-in / Check-out',
              lines: ['Check-in: 12:00 PM', 'Check-out: 10:00 AM'] },
            { icon: FaConciergeBell, title: 'Guest Support',
              lines: ['We are available 24x7', 'to assist you.'] },
            { icon: FaUtensils, title: 'Kitchen Facility',
              lines: ['Kitchen available based on', 'guest request. Food will be arranged from outside.'] },
            { icon: FaCalendarCheck, title: 'Easy Booking',
              lines: ['Book directly through our', 'website for best prices and exclusive benefits.'] },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%',
                  border: '1.5px solid rgba(201,168,76,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px' }}>
                  <Icon size={22} style={{ color: '#c9a84c' }} />
                </div>
                <h4 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700,
                  fontSize: '0.88rem', color: '#08111f', marginBottom: 8 }}>
                  {item.title}
                </h4>
                {item.lines.map((l, j) => (
                  <p key={j} style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.78rem',
                    color: '#6b7280', margin: '2px 0', lineHeight: 1.6 }}>{l}</p>
                ))}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .info-strip { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .info-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
