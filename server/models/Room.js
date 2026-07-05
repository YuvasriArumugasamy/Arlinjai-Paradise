const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['deluxe', 'standard', 'budget'],
      required: true,
    },
    badge: {
      type: String,
      default: 'VALUE',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    highSeasonPrice: {
      type: Number,
      required: true,
    },
    highSeasonLabel: {
      type: String,
      default: 'Dec–Jan',
    },
    size: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      max: 10,
    },
    minGuests: {
      type: Number,
      default: 1,
    },
    bedType: {
      type: String,
      required: true,
    },
    floor: String,
    view: String,
    features: [String],
    images: [String],
    mainImage: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    totalUnits: {
      type: Number,
      default: 1,
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Room', roomSchema)
