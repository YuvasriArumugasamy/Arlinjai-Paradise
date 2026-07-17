const express = require('express')
const {
  saveFcmToken,
  sendNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
} = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')
const { adminOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

// Public: save FCM token from any browser
router.post('/fcm-token', saveFcmToken)

// Admin only: notification management
router.get('/', protect, adminOnly, getNotifications)
router.patch('/:id/read', protect, adminOnly, markNotificationRead)
router.delete('/:id', protect, adminOnly, deleteNotification)

// Admin only: send manual push notification
router.post('/send', protect, adminOnly, sendNotification)

module.exports = router
