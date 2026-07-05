import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaTrash, FaUpload, FaPlus, FaTimes, FaImage } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { GALLERY_IMAGES } from '../../constants'

const CATEGORIES = ['exterior', 'rooms', 'interior', 'nearby']

export default function GalleryAdminPage() {
  const [images, setImages] = useState(GALLERY_IMAGES)
  const [showUpload, setShowUpload] = useState(false)
  const [newImage, setNewImage] = useState({ title: '', category: 'rooms', url: '' })
  const fileRef = useRef(null)

  const handleDelete = (id) => {
    if (window.confirm('Delete this image?')) {
      setImages((prev) => prev.filter((img) => img.id !== id))
      toast.success('Image deleted')
    }
  }

  const handleAdd = () => {
    if (!newImage.title || !newImage.url) {
      toast.error('Please fill in all fields')
      return
    }
    setImages((prev) => [...prev, { ...newImage, id: Date.now() }])
    toast.success('Image added to gallery')
    setShowUpload(false)
    setNewImage({ title: '', category: 'rooms', url: '' })
  }

  return (
    <div className="space-y-6">
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
            transition={{ delay: i * 0.05 }}
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

        {/* Upload Card */}
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
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-playfair font-bold text-navy text-lg">Add Gallery Image</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-navy">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image URL or Upload */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center 
                            hover:border-gold cursor-pointer transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <FaImage size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="font-poppins text-sm text-gray-500">Click to upload or drag & drop</p>
                <p className="font-poppins text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                <input ref={fileRef} type="file" className="hidden" accept="image/*" />
              </div>

              <div className="text-center font-poppins text-xs text-gray-400">— OR enter image URL —</div>

              <div>
                <label className="label-text">Image URL</label>
                <input
                  type="url"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>

              {newImage.url && (
                <img src={newImage.url} alt="Preview" className="w-full h-32 object-cover rounded" />
              )}

              <div>
                <label className="label-text">Image Title *</label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="e.g. Hotel Lobby"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Category</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="select-field"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={handleAdd} className="btn-gold flex-1 py-3 flex items-center justify-center gap-2">
                  <FaUpload size={12} /> Add to Gallery
                </button>
                <button onClick={() => setShowUpload(false)} className="btn-outline-gold flex-1 py-3">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
