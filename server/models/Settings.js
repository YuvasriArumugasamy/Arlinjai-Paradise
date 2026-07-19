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
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Settings', settingsSchema)
