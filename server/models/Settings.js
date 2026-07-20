const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },
    isPeakSeason: {
      type: Boolean,
      default: false,
    },
    gstRate: {
      type: Number,
      default: 12, // 12% default GST
    },
    standardCheckInTime: {
      type: String,
      default: '11:00',
    },
    standardCheckOutTime: {
      type: String,
      default: '09:00',
    },
    earlyCheckInFee: {
      type: Number,
      default: 500,
    },
    lateCheckOutFee: {
      type: Number,
      default: 500,
    },
    specialPrices: [
      {
        roomCategory: {
          type: String,
          enum: ['deluxe', 'standard', 'budget'],
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Settings', settingsSchema)
