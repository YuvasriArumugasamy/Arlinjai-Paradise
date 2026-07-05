const express = require('express')
const { body } = require('express-validator')
const { getRooms, getRoom, createRoom, updateRoom, deleteRoom, toggleAvailability } = require('../controllers/roomController')
const { protect } = require('../middleware/authMiddleware')
const { managerAndAbove, adminOnly, staffOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

const roomValidation = [
  body('name').trim().notEmpty().withMessage('Room name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('category').isIn(['deluxe', 'standard', 'budget']).withMessage('Invalid category'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Valid price required'),
  body('highSeasonPrice').isNumeric().isFloat({ min: 0 }).withMessage('Valid high season price required'),
  body('size').isNumeric().withMessage('Valid size required'),
  body('guests').isNumeric().isInt({ min: 1 }).withMessage('Valid guest count required'),
  body('bedType').notEmpty().withMessage('Bed type is required'),
]

router.route('/')
  .get(getRooms)
  .post(protect, managerAndAbove, roomValidation, createRoom)

router.route('/:idOrSlug')
  .get(getRoom)

router.route('/:id')
  .put(protect, managerAndAbove, updateRoom)
  .delete(protect, adminOnly, deleteRoom)

router.patch('/:id/availability', protect, staffOnly, toggleAvailability)

module.exports = router
