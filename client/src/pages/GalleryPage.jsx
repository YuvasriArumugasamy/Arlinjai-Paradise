import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { GALLERY_IMAGES } from '../constants'

const CATEGORIES = ['all', 'exterior', 'rooms', 'interior', 'nearby']

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered = activeCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === activeCategory)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((i) => (i === 0 ? filtered.length - 1 : i - 1))
  const nextImage = () => setLightboxIndex((i) => (i === filtered.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Header */}
      <div
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.8), rgba(8,17,31,0.8)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">Visual Tour</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">Gallery</h1>
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
            <button
              className="absolute top-4 right-4 z-10 text-white bg-white bg-opacity-20 p-2 rounded-full 
                         hover:bg-opacity-30 transition-colors"
              onClick={closeLightbox}
            >
              <FaTimes size={20} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white bg-opacity-20 
                         p-3 rounded-full hover:bg-opacity-30 transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
            >
              <FaChevronLeft size={20} />
            </button>

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

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white bg-opacity-20 
                         p-3 rounded-full hover:bg-opacity-30 transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
            >
              <FaChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
