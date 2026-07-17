const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// ─── Create Razorpay Order ────────────────────────────────────────────────────
// POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body
    const paise = Number(amount)

    if (!paise || isNaN(paise) || paise < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise' })
    }

    const order = await razorpayClient.orders.create({
      amount: Math.round(paise),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes,
    })

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('Razorpay create-order error:', err)
    const statusCode = err?.statusCode === 401 ? 401 : 500
    res.status(statusCode).json({
      message: err?.error?.description || 'Failed to create payment order',
    })
  }
}

// ─── Verify Payment Signature ─────────────────────────────────────────────────
// POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' })
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    })
  } catch (err) {
    console.error('Razorpay verify error:', err)
    res.status(500).json({ message: 'Payment verification failed' })
  }
}
