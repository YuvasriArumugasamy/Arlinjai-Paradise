const Review = require('../models/Review')
const { validationResult } = require('express-validator')

// @desc    Get all approved reviews (public)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const { approved, featured, page = 1, limit = 20 } = req.query
    const query = {}

    // Public only sees approved reviews
    if (!req.user || req.user.role === 'guest') {
      query.approved = true
    } else if (approved !== undefined) {
      query.approved = approved === 'true'
    }

    if (featured !== undefined) query.featured = featured === 'true'

    const total = await Review.countDocuments(query)
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean()

    res.json({ success: true, count: reviews.length, total, reviews })
  } catch (error) {
    next(error)
  }
}

// @desc    Create review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { name, email, city, rating, review, roomType } = req.body

    const newReview = await Review.create({
      name,
      email,
      city,
      rating: parseInt(rating),
      review,
      roomType,
      date: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      approved: false, // Needs admin approval
    })

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be published after approval.',
      review: newReview,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Approve/Reject review (admin)
// @route   PATCH /api/reviews/:id/approve
// @access  Private (Admin/Manager)
const approveReview = async (req, res, next) => {
  try {
    const { approved, featured } = req.body
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved, featured },
      { new: true }
    )

    if (!review) return res.status(404).json({ message: 'Review not found' })

    res.json({ success: true, message: `Review ${approved ? 'approved' : 'rejected'}`, review })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json({ success: true, message: 'Review deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getReviews, createReview, approveReview, deleteReview }
