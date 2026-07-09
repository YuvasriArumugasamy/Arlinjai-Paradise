const https = require('https')
const crypto = require('crypto')

// ─── Helper: Razorpay API request (no npm package needed) ─────────────────────
function razorpayRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64')

    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: `/v1${path}`,
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (res.statusCode >= 400) return reject(parsed)
          resolve(parsed)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

// ─── Create Razorpay Order ────────────────────────────────────────────────────
// POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' })
    }

    const order = await razorpayRequest('POST', '/orders', {
      amount: Math.round(amount * 100), // Razorpay expects paise
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
    res.status(500).json({
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
