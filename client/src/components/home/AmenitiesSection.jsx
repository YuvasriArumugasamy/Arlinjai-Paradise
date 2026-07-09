import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FaWifi, FaSnowflake, FaTv, FaShower, FaParking, FaBroom,
  FaConciergeBell, FaBolt, FaClock, FaVideo, FaKey, FaBus
} from 'react-icons/fa'
import { AMENITIES } from '../../constants'

const iconComponents = {
  wifi: FaWifi,
  ac: FaSnowflake,
  tv: FaTv,
  water: FaShower,
  parking: FaParking,
  housekeeping: FaBroom,
  roomservice: FaConciergeBell,
  power: FaBolt,
  reception: FaClock,
  security: FaVideo,
  checkin: FaKey,
  travel: FaBus,
}

// Split amenities into two columns
const col1 = AMENITIES.slice(0, 6)
const col2 = AMENITIES.slice(6, 12)

export default function AmenitiesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      style={{
        background: 'linear-gradient(135deg, #f8f5ef 0%, #fff 60%, #f3ede2 100%)',
        padding: '90px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)`,
        backgroundSize: '20px 20px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            What We Offer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#08111f',
              marginBottom: '16px',
            }}
          >
            Hotel <span style={{ color: '#c9a84c', fontStyle: 'italic', fontWeight: 400 }}>Amenities</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              width: '56px', height: '2px',
              background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
              margin: '0 auto 16px',
              transformOrigin: 'center',
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#6b7280',
              fontSize: '0.9rem',
              maxWidth: '440px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Everything you need for a comfortable and convenient stay, all included.
          </motion.p>
        </div>

        {/* Two-column amenity list + side image */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 380px',
          gap: '20px',
          alignItems: 'start',
        }}
          className="amenities-grid"
        >
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {col1.map((amenity, i) => {
              const Icon = iconComponents[amenity.icon] || FaWifi
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px 20px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    cursor: 'default',
                    transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.2s',
                  }}
                  whileHover={{
                    boxShadow: '0 6px 28px rgba(201,168,76,0.18)',
                    borderColor: 'rgba(201,168,76,0.45)',
                    y: -2,
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #c9a84c22 0%, #c9a84c11 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    border: '1.5px solid rgba(201,168,76,0.25)',
                  }}>
                    <Icon size={18} style={{ color: '#c9a84c' }} />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600, fontSize: '0.85rem',
                      color: '#08111f', margin: '0 0 3px',
                    }}>
                      {amenity.label}
                    </p>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.75rem', color: '#9ca3af',
                      margin: 0, lineHeight: 1.5,
                    }}>
                      {amenity.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {col2.map((amenity, i) => {
              const Icon = iconComponents[amenity.icon] || FaWifi
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 + 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px 20px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    cursor: 'default',
                    transition: 'box-shadow 0.25s, border-color 0.25s',
                  }}
                  whileHover={{
                    boxShadow: '0 6px 28px rgba(201,168,76,0.18)',
                    borderColor: 'rgba(201,168,76,0.45)',
                    y: -2,
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #c9a84c22 0%, #c9a84c11 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    border: '1.5px solid rgba(201,168,76,0.25)',
                  }}>
                    <Icon size={18} style={{ color: '#c9a84c' }} />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600, fontSize: '0.85rem',
                      color: '#08111f', margin: '0 0 3px',
                    }}>
                      {amenity.label}
                    </p>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.75rem', color: '#9ca3af',
                      margin: 0, lineHeight: 1.5,
                    }}>
                      {amenity.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right side — Photo card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 12px 50px rgba(0,0,0,0.18)',
              minHeight: '520px',
            }}
          >
            <img
              src="/Screenshot 2026-07-04 223125.webp"
              alt="Arlinjai Paradise Room"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                position: 'absolute', inset: 0,
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(8,17,31,0.75) 0%, rgba(8,17,31,0.1) 55%, transparent 100%)',
            }} />

            {/* Bottom text */}
            <div style={{
              position: 'absolute', bottom: '28px', left: '24px', right: '24px',
            }}>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '10px', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#c9a84c',
                marginBottom: '6px', fontWeight: 600,
              }}>
                Arlinjai Paradise
              </p>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem', fontWeight: 700,
                color: '#fff', lineHeight: 1.3, margin: 0,
              }}>
                Comfort You Can Count On
              </p>

              {/* Mini stats row */}
              <div style={{
                display: 'flex', gap: '20px', marginTop: '16px',
              }}>
                {[
                  { num: '500+', label: 'Happy Guests' },
                  { num: '12', label: 'Amenities' },
                  { num: '5+', label: 'Years' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.25rem', fontWeight: 700,
                      color: '#c9a84c', margin: 0,
                    }}>{s.num}</p>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)',
                      margin: 0, letterSpacing: '0.05em',
                    }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .amenities-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .amenities-grid > div:last-child {
            grid-column: 1 / -1;
            min-height: 280px !important;
          }
        }
        @media (max-width: 640px) {
          .amenities-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
