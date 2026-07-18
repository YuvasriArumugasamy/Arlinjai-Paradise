const FcmToken = require('../models/FcmToken')
const Notification = require('../models/Notification')
const { admin } = require('../config/firebase')

// @desc  Save or update FCM token from a browser/device
// @route POST /api/notifications/fcm-token
// @access Public
const saveFcmToken = async (req, res, next) => {
  try {
    const { token, email } = req.body

    if (!token) {
      return res.status(400).json({ message: 'FCM token is required' })
    }

    // Upsert — update lastSeen if token exists, else create new
    await FcmToken.findOneAndUpdate(
      { token },
      { token, email: email || null, lastSeen: new Date() },
      { upsert: true, new: true }
    )

    res.status(200).json({ success: true, message: 'FCM token saved' })
  } catch (error) {
    next(error)
  }
}

// @desc  Send push notification to a specific token or all tokens
// @route POST /api/notifications/send
// @access Private (admin)
const sendNotification = async (req, res, next) => {
  try {
    const { title, body, token, data = {} } = req.body

    if (!title || !body) {
      return res.status(400).json({ message: 'title and body are required' })
    }

    const messaging = admin?.messaging()
    if (!messaging) {
      return res.status(503).json({ message: 'Firebase not initialized' })
    }

    let result

    if (token) {
      // Send to single token
      result = await messaging.send({
        token,
        notification: { title, body },
        webpush: {
          notification: {
            icon: '/Elegant monogram with seaside emblem.png',
          },
        },
        data,
      })
    } else {
      // Broadcast to all saved tokens
      const tokens = await FcmToken.find({}).select('token')
      const tokenList = tokens.map((t) => t.token)

      if (tokenList.length === 0) {
        return res.status(200).json({ success: true, message: 'No tokens registered' })
      }

      const response = await messaging.sendEachForMulticast({
        tokens: tokenList,
        notification: { title, body },
        webpush: {
          notification: {
            icon: '/Elegant monogram with seaside emblem.png',
          },
        },
        data,
      })

      // Clean up invalid tokens
      const invalidTokens = []
      response.responses.forEach((r, i) => {
        if (!r.success) invalidTokens.push(tokenList[i])
      })
      if (invalidTokens.length > 0) {
        await FcmToken.deleteMany({ token: { $in: invalidTokens } })
      }

      result = { successCount: response.successCount, failureCount: response.failureCount }
    }

    res.json({ success: true, result })
  } catch (error) {
    next(error)
  }
}

// @desc    Get notifications for admin
// @route   GET /api/notifications
// @access  Private (Admin)
const getNotifications = async (req, res, next) => {
  try {
    const { read, type, page = 1, limit = 20 } = req.query
    const query = {}
    if (read === 'true') query.read = true
    else if (read === 'false') query.read = false
    if (type) query.type = type

    const total = await Notification.countDocuments(query)
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean()

    res.json({ success: true, count: notifications.length, total, notifications })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private (Admin)
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ message: 'Notification not found' })
    res.json({ success: true, notification })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    if (!notification) return res.status(404).json({ message: 'Notification not found' })
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    next(error)
  }
}

/**
 * Helper: send booking confirmation push notification
 * Call this after a booking is created.
 */
const sendBookingNotification = async (booking) => {
  try {
    const notificationRecord = await Notification.create({
      title: `New booking: ${booking.bookingId}`,
      message: `${booking.guest?.name || 'Guest'} booked ${booking.roomSnapshot?.name || 'a room'} from ${new Date(booking.checkIn).toLocaleDateString('en-IN')} to ${new Date(booking.checkOut).toLocaleDateString('en-IN')}.`,
      type: 'booking',
      read: false,
      link: `/admin/bookings/${booking._id}`,
      data: {
        bookingId: booking.bookingId,
        email: booking.guest?.email?.toLowerCase() || null,
        amount: booking.pricing?.finalAmount || 0,
      },
    })

    const messaging = admin?.messaging()
    if (!messaging) return

    // Find token by guest email if available
    const tokenDoc = booking.guest?.email
      ? await FcmToken.findOne({ email: booking.guest.email.toLowerCase() })
      : null

    if (!tokenDoc) return

    await messaging.send({
      token: tokenDoc.token,
      notification: {
        title: '✅ Booking Confirmed!',
        body: `Booking ${booking.bookingId} confirmed for ${booking.roomSnapshot?.name}. Check-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}`,
      },
      webpush: {
        notification: {
          icon: '/Elegant monogram with seaside emblem.png',
        },
      },
      data: {
        bookingId: booking.bookingId,
        type: 'booking_confirmed',
      },
    })

    console.log(`📲 Push notification sent for booking ${booking.bookingId}`)
  } catch (err) {
    console.error('Push notification failed:', err.message)
  }
}

module.exports = {
  saveFcmToken,
  sendNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  sendBookingNotification,
}
