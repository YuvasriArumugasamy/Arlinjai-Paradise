const express = require('express')
const { body } = require('express-validator')
const { createBooking, getBookings, getBooking, updateBookingStatus, deleteBooking } = require('../controllers/bookingController')
const { protect } = require('../middleware/authMiddleware')
const { staffOnly, adminOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

const bookingValidation = [
  body('name').trim().notEmpty().withMessage('Guest name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date required'),
  body('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be between 1 and 10'),
]

router.route('/')
  .get(protect, staffOnly, getBookings)
  .post(bookingValidation, createBooking)

router.route('/:id')
  .get(protect, staffOnly, getBooking)
  .delete(protect, adminOnly, deleteBooking)

router.patch('/:id/status', protect, staffOnly, updateBookingStatus)

module.exports = router
