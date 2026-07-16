const express = require('express')
const { body } = require('express-validator')
const { register, login, getMe, changePassword, refreshAccessToken, logout } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { adminOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register', protect, adminOnly, registerValidation, register)
router.post('/login', loginValidation, login)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.put('/change-password', protect, changePassword)

module.exports = router
