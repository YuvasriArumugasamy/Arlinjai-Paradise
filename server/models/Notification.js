const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'cancellation', 'payment', 'review', 'contact', 'system'],
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    link: String,
    data: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Notification', notificationSchema)
