const express = require('express')
const { saveFcmToken, sendNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')
const { adminOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

// Public: save FCM token from any browser
router.post('/fcm-token', saveFcmToken)

// Admin only: send manual push notification
router.post('/send', protect, adminOnly, sendNotification)

module.exports = router
