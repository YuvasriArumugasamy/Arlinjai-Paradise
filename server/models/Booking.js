const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    guest: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
      },
      phone: { type: String, required: true, trim: true },
      address: { type: String, trim: true },
      gender: { type: String, enum: ['Male', 'Female', 'Other'], default: null },
      dob: { type: Date, default: null },
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    roomSnapshot: {
      name: String,
      price: Number,
      category: String,
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    pricing: {
      pricePerNight: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      finalAmount: { type: Number, required: true },
      couponCode: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['pay_at_hotel', 'upi', 'card', 'bank_transfer'],
      default: 'pay_at_hotel',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'refunded'],
      default: 'pending',
    },
    paymentNotes: String,
    internalNotes: String,
    source: {
      type: String,
      enum: ['website', 'phone', 'walk-in', 'agent'],
      default: 'website',
    },
    cancellationReason: String,
    cancelledAt: Date,
    checkedInAt: Date,
    checkedOutAt: Date,
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate booking ID
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments()
    this.bookingId = `AP${String(count + 1).padStart(6, '0')}`
  }
  next()
})

// Virtual: duration check
bookingSchema.virtual('isActive').get(function () {
  return ['confirmed', 'checked-in'].includes(this.status)
})

module.exports = mongoose.model('Booking', bookingSchema)
