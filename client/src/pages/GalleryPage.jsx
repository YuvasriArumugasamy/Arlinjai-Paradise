import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { GALLERY_IMAGES } from '../constants'

const CATEGORIES = ['all', 'exterior', 'rooms', 'interior', 'nearby']

// Load gallery — admin additions from localStorage take priority
const loadGalleryImages = () => {
  try {
    const saved = localStorage.getItem('arlinjai_gallery_images')
    if (saved) return JSON.parse(saved)
  } catch {}
  return GALLERY_IMAGES
}

/* ── Arrow button with hover-preview thumbnail ── */
function ArrowBtn({ direction, onClick, previewSrc, previewTitle }) {
  const [hovered, setHovered] = useState(false)
  const isLeft = direction === 'left'

  return (
    <div
      className={`absolute ${isLeft ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2`}
      style={{ alignItems: isLeft ? 'flex-start' : 'flex-end' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview thumbnail — appears above the arrow on hover */}
      <AnimatePresence>
        {hovered && previewSrc && (
          <motion.div
            initial={{ opacity: 0, y: isLeft ? 10 : 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.85 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-none"
            style={{
              position: 'absolute',
              bottom: '68px',
              [isLeft ? 'left' : 'right']: '0',
              width: '160px',
            }}
          >
            <div
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
                border: '2px solid rgba(255,255,255,0.18)',
                background: '#111',
              }}
            >
              <img
                src={previewSrc}
                alt={previewTitle}
                style={{
                  width: '100%',
                  height: '110px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  padding: '6px 10px 8px',
                  background: 'rgba(10,15,30,0.88)',
                }}
              >
                <p
                  style={{
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {previewTitle}
                </p>
                <p
                  style={{
                    color: '#c9a84c',
                    fontSize: '10px',
                    fontFamily: 'Poppins, sans-serif',
                    margin: '2px 0 0',
                  }}
                >
                  {isLeft ? '← Previous' : 'Next →'}
                </p>
              </div>
            </div>
            {/* Small triangle pointer */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(10,15,30,0.88)',
                margin: isLeft ? '0 0 0 20px' : '0 20px 0 auto',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrow button */}
      <button
        onClick={onClick}
        style={{
          background: hovered
            ? 'rgba(201,168,76,0.85)'
            : 'rgba(255,255,255,0.18)',
          border: hovered ? '2px solid #c9a84c' : '2px solid rgba(255,255,255,0.25)',
          color: '#fff',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s, border 0.2s, transform 0.18s',
          transform: hovered ? (isLeft ? 'scale(1.12) translateX(-3px)' : 'scale(1.12) translateX(3px)') : 'scale(1)',
          boxShadow: hovered ? '0 4px 20px rgba(201,168,76,0.4)' : '0 2px 10px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(6px)',
        }}
      >
        {isLeft ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
      </button>
    </div>
  )
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Load from localStorage (admin additions) or fall back to constants
  const allImages = loadGalleryImages()

  const filtered = activeCategory === 'all'
    ? allImages
    : allImages.filter((img) => img.category === activeCategory)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((i) => (i === 0 ? filtered.length - 1 : i - 1))
  const nextImage = () => setLightboxIndex((i) => (i === filtered.length - 1 ? 0 : i + 1))

  const prevIndex = lightboxIndex !== null
    ? (lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1)
    : null
  const nextIndex = lightboxIndex !== null
    ? (lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1)
    : null

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Header */}
      <div
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.8), rgba(8,17,31,0.8)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">Visual Tour</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">
            Our <span className="italic font-normal text-gold">Gallery</span>
          </h1>
          <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-3 mb-4" />
          <p className="font-poppins text-gray-300 max-w-xl mx-auto text-base">
            Take a visual tour of Arlinjai Paradise and see what makes us special.
          </p>
          <div className="mt-6 flex justify-center">
            <Breadcrumb items={[{ label: 'Gallery', path: '/gallery' }]} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-poppins text-sm font-medium px-5 py-2 rounded-sm 
                         capitalize transition-all duration-200 ${
                           activeCategory === cat
                             ? 'bg-gold text-white shadow-gold'
                             : 'bg-white text-navy hover:bg-gold hover:text-white border border-gray-200'
                         }`}
            >
              {cat === 'all' ? 'All Photos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm
                           shadow-card hover:shadow-card-hover"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy bg-opacity-0 group-hover:bg-opacity-50 
                               transition-all duration-300 flex items-center justify-center">
                  <FaExpand
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    size={24}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy/70 to-transparent
                               translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-poppins text-white text-sm font-medium">{img.title}</p>
                  <p className="font-poppins text-gold text-xs capitalize">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl text-navy">No images in this category</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-20 text-white bg-white bg-opacity-20 p-2 rounded-full 
                         hover:bg-opacity-30 transition-colors"
              onClick={closeLightbox}
            >
              <FaTimes size={20} />
            </button>

            {/* Left arrow with prev preview */}
            <ArrowBtn
              direction="left"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              previewSrc={filtered[prevIndex]?.url}
              previewTitle={filtered[prevIndex]?.title}
            />

            {/* Main image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].title}
                className="max-w-4xl max-h-[80vh] object-contain rounded-sm"
              />
              <p className="mt-4 font-poppins text-white font-medium">
                {filtered[lightboxIndex].title}
              </p>
              <p className="font-poppins text-gray-400 text-sm mt-1">
                {lightboxIndex + 1} of {filtered.length}
              </p>
            </motion.div>

            {/* Right arrow with next preview */}
            <ArrowBtn
              direction="right"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              previewSrc={filtered[nextIndex]?.url}
              previewTitle={filtered[nextIndex]?.title}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
