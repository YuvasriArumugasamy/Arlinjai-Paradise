import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTrash, FaUpload, FaPlus, FaTimes, FaImage, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { GALLERY_IMAGES } from '../../constants'

const CATEGORIES = ['exterior', 'rooms', 'interior', 'nearby']
const STORAGE_KEY = 'arlinjai_gallery_images'

// Load from localStorage or fall back to default
const loadImages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.map(img => {
        if (img.url && (img.url.endsWith('.jpeg') || img.url.endsWith('.jpg') || img.url.endsWith('.png')) && !img.url.startsWith('data:')) {
          // Convert extension to .webp
          const lastDot = img.url.lastIndexOf('.')
          const urlWithoutExt = img.url.substring(0, lastDot)
          if (urlWithoutExt.toLowerCase().endsWith('.jpg')) {
            const innerDot = urlWithoutExt.lastIndexOf('.')
            return { ...img, url: urlWithoutExt.substring(0, innerDot) + '.webp' }
          }
          return { ...img, url: urlWithoutExt + '.webp' }
        }
        return img
      })
    }
  } catch {}
  return GALLERY_IMAGES
}

// Save to localStorage
const saveImages = (images) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
  } catch {
    console.warn('localStorage save failed (storage full?)')
  }
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState(loadImages)
  const [showUpload, setShowUpload] = useState(false)
  const [newImage, setNewImage] = useState({ title: '', category: 'rooms', url: '' })
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef(null)

  // Auto-save to localStorage whenever images change
  useEffect(() => {
    saveImages(images)
  }, [images])

  // Read file → base64 preview (no backend needed)
  const processFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB allowed.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setPreviewUrl(dataUrl)
      setNewImage((prev) => ({ ...prev, url: dataUrl }))
      toast.success('Image loaded! Fill in the title and save.')
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => processFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const handleAdd = () => {
    if (!newImage.url) {
      toast.error('Please upload or enter an image URL')
      return
    }
    if (!newImage.title.trim()) {
      toast.error('Please enter an image title')
      return
    }
    setImages((prev) => [{ ...newImage, id: Date.now() }, ...prev])
    toast.success('Image added to gallery!')
    closeModal()
  }

  const closeModal = () => {
    setShowUpload(false)
    setNewImage({ title: '', category: 'rooms', url: '' })
    setPreviewUrl('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this image?')) {
      setImages((prev) => prev.filter((img) => img.id !== id))
      toast.success('Image deleted')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Gallery Management</h2>
          <p className="font-poppins text-sm text-gray-500">{images.length} images in gallery</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5"
        >
          <FaPlus size={12} /> Add Image
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="relative group bg-white rounded-xl overflow-hidden shadow-card"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-navy bg-opacity-0 group-hover:bg-opacity-60
                           transition-all duration-300 flex items-center justify-center gap-2">
              <button
                onClick={() => handleDelete(img.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white
                           p-2 rounded-full hover:bg-red-600"
              >
                <FaTrash size={12} />
              </button>
            </div>
            <div className="p-3">
              <p className="font-poppins text-sm font-medium text-navy truncate">{img.title}</p>
              <span className="inline-block mt-1 text-xs font-poppins text-gold capitalize bg-gold bg-opacity-10 px-2 py-0.5 rounded">
                {img.category}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Upload placeholder card */}
        <button
          onClick={() => setShowUpload(true)}
          className="border-2 border-dashed border-gray-200 rounded-xl h-40 flex flex-col items-center
                     justify-center gap-2 hover:border-gold hover:bg-gold hover:bg-opacity-5
                     transition-all duration-200 group"
        >
          <FaPlus size={20} className="text-gray-300 group-hover:text-gold transition-colors" />
          <span className="font-poppins text-xs text-gray-400 group-hover:text-gold transition-colors">Add Image</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            style={{ height: 'min(90vh, 680px)', display: 'flex', flexDirection: 'column' }}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-playfair font-bold text-navy text-lg">Add Gallery Image</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-navy">
                <FaTimes size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragging ? 'border-gold bg-gold bg-opacity-5' : 'border-gray-200 hover:border-gold'}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-36 object-cover rounded-lg" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <FaCheckCircle size={14} />
                    </div>
                    <p className="font-poppins text-xs text-gray-500 mt-2">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <FaImage size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="font-poppins text-sm text-gray-500">Click to upload or drag & drop</p>
                    <p className="font-poppins text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="text-center font-poppins text-xs text-gray-400">— OR enter image URL —</div>

              <div>
                <label className="label-text">Image URL</label>
                <input
                  type="url"
                  value={previewUrl ? '' : newImage.url}
                  onChange={(e) => {
                    const val = e.target.value
                    setNewImage((prev) => ({ ...prev, url: val }))
                    setPreviewUrl('')
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>

              {/* URL preview (when no file selected) */}
              {!previewUrl && newImage.url && (
                <img src={newImage.url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              )}

              <div>
                <label className="label-text">Image Title *</label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Hotel Lobby"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Category</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage((prev) => ({ ...prev, category: e.target.value }))}
                  className="select-field"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

            </div>
            {/* end scrollable content */}

            {/* Fixed Footer Buttons — always visible */}
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3 bg-white rounded-b-xl">
              <button
                onClick={handleAdd}
                className="btn-gold flex-1 py-3 flex items-center justify-center gap-2"
              >
                <FaUpload size={12} /> Add to Gallery
              </button>
              <button onClick={closeModal} className="btn-outline-gold flex-1 py-3">
                Cancel
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </div>
  )
}
