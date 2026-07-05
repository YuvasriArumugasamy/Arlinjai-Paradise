import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaArrowRight, FaExpand, FaTimes } from 'react-icons/fa'
import { GALLERY_IMAGES } from '../../constants'

export default function GalleryPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState(null)

  const previewImages = GALLERY_IMAGES.slice(0, 6)

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-subtitle mb-3"
          >
            Our Hotel
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Gallery
          </motion.h2>
          <div className="gold-divider" />
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {previewImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`relative overflow-hidden rounded-sm cursor-pointer group
                ${i === 0 ? 'md:col-span-2 row-span-2' : ''}
                ${i === 0 ? 'h-72 md:h-96' : 'h-48 md:h-44'}`}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-navy bg-opacity-0 group-hover:bg-opacity-50 
                             transition-all duration-300 flex items-center justify-center">
                <FaExpand
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  size={22}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy/70 to-transparent
                             translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-poppins text-white text-sm font-medium">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-outline-gold inline-flex items-center gap-2">
            View Full Gallery
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lightbox-overlay"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white bg-opacity-20 p-2 rounded-full
                       hover:bg-opacity-30 transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <FaTimes size={20} />
          </button>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={lightbox.url}
            alt={lightbox.title}
            className="max-w-4xl max-h-[85vh] object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-poppins text-white text-sm
                        bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {lightbox.title}
          </p>
        </motion.div>
      )}
    </section>
  )
}
