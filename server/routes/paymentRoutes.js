const express = require('express')
const { createOrder, verifyPayment } = require('../controllers/paymentController')

const router = express.Router()

// POST /api/payments/create-order — create Razorpay order
router.post('/create-order', createOrder)

// POST /api/payments/verify — verify payment signature after checkout
router.post('/verify', verifyPayment)

module.exports = router
