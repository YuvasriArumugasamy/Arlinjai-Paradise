const Gallery = require('../models/Gallery')
const path = require('path')
const fs = require('fs')
const { admin } = require('../config/firebase')

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query
    const query = { isPublished: true }
    if (category) query.category = category

    const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 }).lean()
    res.json({ success: true, count: images.length, images })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload gallery image
// @route   POST /api/gallery
// @access  Private (Admin/Manager)
const uploadImage = async (req, res, next) => {
  try {
    const { title, category, url } = req.body
    let imageUrl = url
    let filename = ''

    if (req.file) {
      if (!admin) {
        return res.status(500).json({ message: 'Firebase Storage is not configured on this server.' })
      }
      
      const bucket = admin.storage().bucket()
      const ext = path.extname(req.file.originalname).toLowerCase()
      filename = `gallery/arlinjai_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`
      
      const file = bucket.file(filename)
      
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        public: true
      })
      
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Please provide an image URL or upload a file' })
    }

    const image = await Gallery.create({
      title,
      category: category || 'rooms',
      url: imageUrl,
      filename: filename || undefined,
      uploadedBy: req.user?.id,
    })

    res.status(201).json({ success: true, message: 'Image added to gallery', image })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) return res.status(404).json({ message: 'Image not found' })

    // Delete physical file if it was uploaded
    if (image.filename) {
      if (image.filename.startsWith('gallery/') && admin) {
        try {
          const bucket = admin.storage().bucket()
          await bucket.file(image.filename).delete()
          console.log(`Deleted Firebase Storage file: ${image.filename}`)
        } catch (err) {
          console.error(`Failed to delete file from Firebase Storage:`, err.message)
        }
      } else {
        const filePath = path.join(__dirname, '../uploads', image.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    }

    await image.deleteOne()
    res.json({ success: true, message: 'Image deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Update image details
// @route   PUT /api/gallery/:id
// @access  Private (Admin/Manager)
const updateImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!image) return res.status(404).json({ message: 'Image not found' })
    res.json({ success: true, image })
  } catch (error) {
    next(error)
  }
}

module.exports = { getGallery, uploadImage, deleteImage, updateImage }
