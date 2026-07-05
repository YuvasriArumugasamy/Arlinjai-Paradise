const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minBookingAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  },
  {
    timestamps: true,
  }
)

couponSchema.virtual('isValid').get(function () {
  const now = new Date()
  return this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
})

module.exports = mongoose.model('Coupon', couponSchema)
