const express = require('express')
const { body } = require('express-validator')
const { getReviews, createReview, approveReview, deleteReview } = require('../controllers/reviewController')
const { protect, optionalAuth } = require('../middleware/authMiddleware')
const { managerAndAbove, adminOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

const reviewValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('review').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
]

router.route('/')
  .get(optionalAuth, getReviews)
  .post(reviewValidation, createReview)

router.patch('/:id/approve', protect, managerAndAbove, approveReview)
router.delete('/:id', protect, adminOnly, deleteReview)

module.exports = router
