const express = require('express')
const { body } = require('express-validator')
const { submitContact, getContacts, deleteContact, replyContact } = require('../controllers/contactController')
const { protect } = require('../middleware/authMiddleware')
const { staffOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

const messageValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
]

router.route('/')
  .get(protect, staffOnly, getContacts)
  .post(messageValidation, submitContact)

router.route('/:id')
  .delete(protect, staffOnly, deleteContact)

router.post('/:id/reply', protect, staffOnly, replyContact)

module.exports = router
