import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FaMapMarkerAlt, FaUsers, FaHeadset, FaWifi,
  FaCalendarCheck, FaSun, FaCheckCircle, FaShieldAlt,
  FaTag, FaHeart, FaBed, FaStar, FaSmile
} from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { HOTEL_INFO } from '../constants'

function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span>{count.toLocaleString()}{suffix}</span>
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
})

const FEATURES = [
  { icon: FaMapMarkerAlt, title: 'Prime Location', desc: 'Close to beaches, temples, Vivekananda Rock Memorial and local markets.' },
  { icon: FaUsers, title: 'Family Friendly', desc: 'Safe, welcoming and suitable for families, couples and solo travelers.' },
  { icon: FaHeadset, title: '24×7 Support', desc: 'Round-the-clock assistance and quick response to all guest requests.' },
  { icon: FaWifi, title: 'Modern Facilities', desc: 'Free Wi-Fi, Smart TV, Ample parking, Air-conditioned rooms & Hot water.' },
  { icon: FaCalendarCheck, title: 'Easy Booking', desc: 'Book directly through our website with secure payment and instant confirmation.' },
  { icon: FaSun, title: 'Local Experience', desc: 'Sunrise & sunset viewing, sightseeing, taxi and tour arrangements.' },
]

const PROMISES = [
  { icon: FaCheckCircle, title: 'Clean & Hygienic Rooms', desc: 'Well-maintained rooms for a pleasant stay.' },
  { icon: FaShieldAlt, title: 'Safe & Secure', desc: 'Your safety and comfort are our top priority.' },
  { icon: FaTag, title: 'Best Price Guarantee', desc: 'Get the best rates when you book directly with us.' },
  { icon: FaHeart, title: 'Personalized Care', desc: 'We treat every guest like our family.' },
]

const STATS = [
  { icon: FaSmile, target: 1000, suffix: '+', label: 'Happy Guests' },
  { icon: FaBed, target: 11, suffix: '+', label: 'Comfortable Rooms' },
  { icon: FaHeadset, target: 5, suffix: '+', label: 'Years of Hospitality' },
  { icon: FaStar, target: 100, suffix: '%', label: 'Guest Satisfaction' },
]

function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ background: '#c9a84c', padding: '36px 0' }} ref={ref}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32,
      }} className="stats-grid">
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                transition: 'background 0.3s',
              }}>
                <Icon size={17} style={{ color: '#fff' }} />
              </div>
              <p style={{
                fontFamily: 'Playfair Display,serif', fontWeight: 700,
                fontSize: '1.8rem', color: '#fff', margin: '0 0 4px', lineHeight: 1,
              }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} inView={inView} />
              </p>
              <p style={{
                fontFamily: 'Poppins,sans-serif', fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.88)', fontWeight: 500, margin: 0,
              }}>
                {s.label}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

import useSEO from '../hooks/useSEO'

export default function AboutPage() {
  useSEO({
    title: 'About Us',
    description: 'Learn more about Arlinjai Paradise Hotel in Kanyakumari. Our history, location, hospitality, values, and dedication to offering a pleasant stay.',
    keywords: 'About Arlinjai Paradise, hotel history, Kanyakumari hotel management, luxury hospitality'
  })
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>

      {/* ── Hero Header ── */}
      <div style={{
        position: 'relative',
        backgroundImage: `linear-gradient(rgba(8,17,31,0.76), rgba(8,17,31,0.76)), url('/ChatGPT Image Jul 15, 2026, 04_54_06 PM.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: '200px 0 180px', textAlign: 'center', overflow: 'hidden',
        minHeight: '500px',
      }}>
        {/* Watermark logo right side */}
        <div style={{
          position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)',
          opacity: 0.08, pointerEvents: 'none',
        }}>
          <img src="/Elegant monogram with seaside emblem.webp" alt=""
            style={{ width: 160, height: 160, objectFit: 'contain',
              filter: 'brightness(0) invert(1)' }} />
          <p style={{ fontFamily: 'Playfair Display,serif', color: '#fff',
            fontSize: '0.7rem', letterSpacing: '0.2em', textAlign: 'center', marginTop: 6 }}>
            ARLINJAI PARADISE
          </p>
        </div>

        {/* Bottom glow */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            transformOrigin: 'left' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.h1 {...fadeUp(0.3)} style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 700, color: '#fff',
            marginBottom: 20, lineHeight: 1.15,
          }}>
            About <span style={{ fontStyle: 'italic', color: '#c9a84c', fontWeight: 400 }}>Us</span>
          </motion.h1>
          <motion.div {...fadeUp(0.45)} style={{ display: 'flex', justifyContent: 'center' }}>
            <Breadcrumb items={[{ label: 'About Us', path: '/about' }]} />
          </motion.div>
        </div>
      </div>

      {/* ── Our Story ── */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'center' }}
            className="about-story-grid">

            {/* Left text */}
            <motion.div {...fadeUp(0.1)}>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#c9a84c',
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
                Our Story
              </p>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(1.8rem,3vw,2.5rem)',
                fontWeight: 700, color: '#08111f', marginBottom: 10 }}>
                Your Home in{' '}
                <span style={{ color: '#c9a84c', fontStyle: 'italic', fontWeight: 400 }}>Kanyakumari</span>
              </h2>
              <div style={{ width: 56, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', marginBottom: 20 }} />

              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.87rem', color: '#374151',
                lineHeight: 1.8, marginBottom: 14 }}>
                Arlinjai Paradise was established on{' '}
                <span style={{ color: '#c9a84c', fontWeight: 600 }}>30th August 2022</span>{' '}
                with a simple vision – to provide every guest with a comfortable, clean and memorable
                stay in the divine land of Kanyakumari.
              </p>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.87rem', color: '#374151',
                lineHeight: 1.8, marginBottom: 28 }}>
                Located close to the major attractions, we offer well-maintained rooms, modern
                facilities and warm hospitality that make every stay feel like home.
              </p>

              {/* Signature */}
              <p style={{ fontFamily: 'Playfair Display,serif', fontStyle: 'italic',
                fontSize: '1.35rem', color: '#c9a84c', marginBottom: 4 }}>
                Arlinjai Paradise
              </p>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.8rem', color: '#6b7280',
                lineHeight: 1.5 }}>
                Comfort, Cleanliness, and Care –<br />Your Home in Kanyakumari.
              </p>
            </motion.div>

            {/* Right photo */}
            <motion.div {...fadeUp(0.2)} style={{ position: 'relative' }}>
              <div style={{ borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 12px 48px rgba(0,0,0,0.16)' }}>
                <img src="/B791C280-016C-4109-AD3A-787851527299.JPG.webp"
                  alt="Arlinjai Paradise Hotel"
                  style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }} />
              </div>
              {/* SINCE badge */}
              <div style={{
                position: 'absolute', bottom: 20, right: 20,
                background: '#fff', borderRadius: 10, padding: '12px 18px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
                display: 'flex', alignItems: 'center', gap: 12,
                border: '1px solid rgba(201,168,76,0.2)',
              }}>
                <FaCalendarCheck size={22} style={{ color: '#c9a84c' }} />
                <div>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 10,
                    color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                    Since
                  </p>
                  <p style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700,
                    fontSize: '1rem', color: '#08111f', margin: 0 }}>
                    30 Aug 2022
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What Makes Us Special ── */}
      <section style={{ background: '#f8f7f4', padding: '72px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <motion.p {...fadeUp(0)} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11,
              color: '#c9a84c', letterSpacing: '0.22em', textTransform: 'uppercase',
              fontWeight: 600, marginBottom: 10 }}>
              What Makes Us Special
            </motion.p>
            <motion.h2 {...fadeUp(0.1)} style={{ fontFamily: 'Playfair Display,serif',
              fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 700, color: '#08111f', marginBottom: 14 }}>
              Comfort, Care &amp;{' '}
              <span style={{ color: '#c9a84c', fontStyle: 'italic', fontWeight: 400 }}>Convenience</span>
            </motion.h2>
            <motion.div {...fadeUp(0.2)} style={{ width: 56, height: 2, margin: '0 auto 14px',
              background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 20 }}
            className="features-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.08)}
                  style={{ textAlign: 'center', padding: '28px 14px',
                    background: '#fff', borderRadius: 12,
                    boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(201,168,76,0.1)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    cursor: 'default' }}
                  whileHover={{ y: -4,
                    boxShadow: '0 8px 28px rgba(201,168,76,0.2)',
                    borderColor: 'rgba(201,168,76,0.4)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%',
                    border: '1.5px solid rgba(201,168,76,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px' }}>
                    <Icon size={20} style={{ color: '#c9a84c' }} />
                  </div>
                  <h4 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700,
                    fontSize: '0.82rem', color: '#08111f', marginBottom: 8 }}>
                    {f.title}
                  </h4>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.72rem',
                    color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
                    {f.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Our Promise ── */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'center' }}
            className="about-promise-grid">

            {/* Left photo */}
            <motion.div {...fadeUp(0.1)}
              style={{ borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 12px 48px rgba(0,0,0,0.14)' }}>
              <img src="/Screenshot 2026-07-04 223125.webp"
                alt="Our Promise"
                style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
            </motion.div>

            {/* Right content */}
            <motion.div {...fadeUp(0.15)}>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#c9a84c',
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
                Our Promise
              </p>
              <h2 style={{ fontFamily: 'Playfair Display,serif',
                fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700,
                color: '#08111f', marginBottom: 10 }}>
                A Stay You Will{' '}
                <span style={{ color: '#c9a84c', fontStyle: 'italic', fontWeight: 400 }}>Always Remember</span>
              </h2>
              <div style={{ width: 56, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', marginBottom: 20 }} />
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.87rem', color: '#6b7280',
                lineHeight: 1.8, marginBottom: 28 }}>
                At Arlinjai Paradise, we are committed to providing more than just a place to stay.
                We focus on every little detail to ensure cleanliness, comfort and personalized care
                for each guest. Whether you are here for a spiritual journey, family vacation or
                business trip, we promise you a relaxing and memorable experience.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {PROMISES.map((p, i) => {
                  const Icon = p.icon
                  return (
                    <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '14px 16px', background: '#f8f7f4', borderRadius: 10,
                        border: '1px solid rgba(201,168,76,0.12)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%',
                        border: '1.5px solid rgba(201,168,76,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} style={{ color: '#c9a84c' }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700,
                          fontSize: '0.8rem', color: '#08111f', margin: '0 0 3px' }}>
                          {p.title}
                        </p>
                        <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.73rem',
                          color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                          {p.desc}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar — gold bg matching home page ── */}
      <StatsBar />

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .about-story-grid, .about-promise-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
