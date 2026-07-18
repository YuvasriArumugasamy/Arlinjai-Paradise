const Gallery = require('../models/Gallery')
const path = require('path')
const fs = require('fs')

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

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Please provide an image URL or upload a file' })
    }

    const image = await Gallery.create({
      title,
      category: category || 'rooms',
      url: imageUrl,
      filename: req.file?.filename,
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
      const filePath = path.join(__dirname, '../uploads', image.filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
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
