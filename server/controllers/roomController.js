const Room = require('../models/Room')
const { validationResult } = require('express-validator')

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const { category, available, minPrice, maxPrice } = req.query
    const query = {}

    if (category) query.category = category
    if (available !== undefined) query.isAvailable = available === 'true'
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const rooms = await Room.find(query).sort({ price: 1 })
    res.json({ success: true, count: rooms.length, rooms })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single room by slug or ID
// @route   GET /api/rooms/:idOrSlug
// @access  Public
const getRoom = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/)

    const room = isObjectId
      ? await Room.findById(idOrSlug)
      : await Room.findOne({ slug: idOrSlug })

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    res.json({ success: true, room })
  } catch (error) {
    next(error)
  }
}

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (Admin/Manager)
const createRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const room = await Room.create(req.body)
    res.status(201).json({ success: true, message: 'Room created successfully', room })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Room with this slug already exists' })
    }
    next(error)
  }
}

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin/Manager)
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    res.json({ success: true, message: 'Room updated successfully', room })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }
    res.json({ success: true, message: 'Room deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle room availability
// @route   PATCH /api/rooms/:id/availability
// @access  Private (Admin/Manager/Receptionist)
const toggleAvailability = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    room.isAvailable = !room.isAvailable
    await room.save()

    res.json({
      success: true,
      message: `Room is now ${room.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: room.isAvailable,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom, toggleAvailability }
