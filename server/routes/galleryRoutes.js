const express = require('express')
const { getGallery, uploadImage, deleteImage, updateImage } = require('../controllers/galleryController')
const { protect } = require('../middleware/authMiddleware')
const { managerAndAbove } = require('../middleware/roleMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

const router = express.Router()

router.route('/')
  .get(getGallery)
  .post(protect, managerAndAbove, upload.single('image'), uploadImage)

router.route('/:id')
  .put(protect, managerAndAbove, updateImage)
  .delete(protect, managerAndAbove, deleteImage)

module.exports = router
