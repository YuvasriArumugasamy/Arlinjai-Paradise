const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: String,
    category: {
      type: String,
      enum: ['exterior', 'rooms', 'interior', 'nearby', 'amenities'],
      default: 'rooms',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Gallery', gallerySchema)
