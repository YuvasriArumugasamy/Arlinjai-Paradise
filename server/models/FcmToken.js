const mongoose = require('mongoose')

// Stores FCM tokens for push notification delivery.
// One document per unique device token.
const fcmTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Optional: link to a logged-in user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Guest email if known (from booking)
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('FcmToken', fcmTokenSchema)
