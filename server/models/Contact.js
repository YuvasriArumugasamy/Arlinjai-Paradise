const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    inquiryType: {
      type: String,
      enum: ['General Inquiry', 'Room Booking', 'Rates & Packages', 'Feedback', 'Other'],
      default: 'General Inquiry',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'resolved'],
      default: 'new',
    },
    reply: {
      text: String,
      sentAt: Date,
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Contact', contactSchema)
