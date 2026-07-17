const Booking = require('../models/Booking')
const Room = require('../models/Room')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const { sendBookingNotification } = require('./notificationController')

// Email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send booking confirmation email
const sendConfirmationEmail = async (booking, room) => {
  try {
    const transporter = createTransporter()
    const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: booking.guest.email,
      subject: `Booking Confirmed – ${booking.bookingId} | Arlinjai Paradise`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Booking Confirmation</title></head>
        <body style="font-family: 'Poppins', Arial, sans-serif; background: #f8f9fa; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: #08111F; padding: 30px; text-align: center;">
              <h1 style="font-family: Georgia, serif; color: #C9A227; margin: 0; font-size: 24px;">ARLINJAI PARADISE</h1>
              <p style="color: #888; font-size: 11px; letter-spacing: 3px; margin: 5px 0 0;">FOR PLEASANT STAY</p>
            </div>
            <div style="padding: 30px;">
              <div style="background: #C9A227; color: white; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 13px; opacity: 0.9;">BOOKING CONFIRMATION</p>
                <h2 style="margin: 5px 0; font-size: 28px; font-weight: bold;">${booking.bookingId}</h2>
              </div>
              <p style="color: #333;">Dear <strong>${booking.guest.name}</strong>,</p>
              <p style="color: #555; line-height: 1.6;">Your booking at Arlinjai Paradise has been confirmed. We look forward to welcoming you!</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-size: 13px;">Room Type</td>
                  <td style="padding: 12px 0; font-weight: 600; text-align: right; color: #333;">${booking.roomSnapshot.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-size: 13px;">Check-in</td>
                  <td style="padding: 12px 0; font-weight: 600; text-align: right; color: #333;">${checkIn} (12:00 PM)</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-size: 13px;">Check-out</td>
                  <td style="padding: 12px 0; font-weight: 600; text-align: right; color: #333;">${checkOut} (11:00 AM)</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-size: 13px;">Duration</td>
                  <td style="padding: 12px 0; font-weight: 600; text-align: right; color: #333;">${booking.nights} Night(s)</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-size: 13px;">Guests</td>
                  <td style="padding: 12px 0; font-weight: 600; text-align: right; color: #333;">${booking.guests}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0 0; font-size: 16px; font-weight: bold; color: #333;">Total Amount</td>
                  <td style="padding: 15px 0 0; font-size: 20px; font-weight: bold; text-align: right; color: #C9A227;">₹${booking.pricing.finalAmount.toLocaleString()}</td>
                </tr>
              </table>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px; color: #333; font-size: 14px;">Hotel Contact</h4>
                <p style="margin: 0; color: #555; font-size: 13px; line-height: 1.8;">
                  📍 No. 5/69, Beach Road, Kanyakumari – 629702<br/>
                  📞 9486271234 | 04652 271234<br/>
                  📧 info@arlinjaiparadise.com
                </p>
              </div>
              <p style="color: #555; font-size: 13px; line-height: 1.7;">
                ${booking.specialRequests ? `<strong>Special Requests:</strong> ${booking.specialRequests}<br/><br/>` : ''}
                We will do our best to accommodate your requests.
              </p>
            </div>
            <div style="background: #08111F; padding: 20px; text-align: center;">
              <p style="color: #888; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Arlinjai Paradise. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })
  } catch (err) {
    console.error('Email sending failed:', err.message)
  }
}

// @desc    Create booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    let { roomId, checkIn, checkOut, checkInTime, checkOutTime, guests, name, email, phone, address, specialRequests, paymentMethod, gender, dob, idType, idNumber, roomAmount, status } = req.body

    // Fallback for empty email in offline bookings
    if (!email || email.trim() === '') {
      email = 'offline@arlinjaiparadise.com'
    }

    // Find room
    let room = null
    const mongoose = require('mongoose')
    if (mongoose.Types.ObjectId.isValid(roomId)) {
      room = await Room.findById(roomId)
    }

    if (!room) {
      // Static lookup for frontend string IDs (e.g. 'deluxe-ac')
      const staticRooms = {
        'deluxe-ac': { _id: 'deluxe-ac', name: 'Deluxe AC Room', price: 2500, category: 'deluxe' },
        'normal-ac': { _id: 'normal-ac', name: 'Normal AC Room', price: 2000, category: 'standard' },
        'non-ac':    { _id: 'non-ac',    name: 'Non AC Room',    price: 1500, category: 'budget'   },
      }

      if (!staticRooms[roomId]) {
        return res.status(404).json({ message: 'Room not found' })
      }

      const sr = staticRooms[roomId]
      const nights = Math.max(1, Math.floor((new Date(checkOut) - new Date(checkIn)) / 86400000))
      
      const customPrice = roomAmount ? parseFloat(roomAmount) : null
      const finalPricePerNight = customPrice !== null ? Math.round(customPrice / nights) : sr.price
      const totalAmount = customPrice !== null ? customPrice : sr.price * nights

      const booking = await Booking.create({
        guest: { name, email, phone, address, gender: gender || null, dob: dob ? new Date(dob) : null, idType: idType || null, idNumber: idNumber || null },
        room: new mongoose.Types.ObjectId('000000000000000000000001'),
        roomSnapshot: { name: sr.name, price: finalPricePerNight, category: sr.category },
        checkIn: new Date(checkIn),
        checkInTime: checkInTime || '12:00 PM',
        checkOut: new Date(checkOut),
        checkOutTime: checkOutTime || '11:00 AM',
        nights,
        guests: parseInt(guests),
        specialRequests,
        pricing: { pricePerNight: finalPricePerNight, totalAmount, discountAmount: 0, finalAmount: totalAmount },
        paymentMethod: paymentMethod || 'pay_at_hotel',
        status: status || 'pending',
      })

      // Send push notification (async)
      sendBookingNotification(booking)

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        bookingId: booking.bookingId,
        booking,
      })
    }

    if (!room.isAvailable) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.max(1, Math.floor((checkOutDate - checkInDate) / 86400000))

    const checkInMonth = checkInDate.getMonth()
    const isHighSeason = [11, 0].includes(checkInMonth)
    
    const customPrice = roomAmount ? parseFloat(roomAmount) : null
    const pricePerNight = customPrice !== null ? Math.round(customPrice / nights) : (isHighSeason ? room.highSeasonPrice : room.price)
    const totalAmount = customPrice !== null ? customPrice : pricePerNight * nights

    const booking = await Booking.create({
      guest: { name, email, phone, address, gender: gender || null, dob: dob ? new Date(dob) : null, idType: idType || null, idNumber: idNumber || null },
      room: room._id,
      roomSnapshot: { name: room.name, price: pricePerNight, category: room.category },
      checkIn: checkInDate,
      checkInTime: checkInTime || '12:00 PM',
      checkOut: checkOutDate,
      checkOutTime: checkOutTime || '11:00 AM',
      nights,
      guests: parseInt(guests),
      specialRequests,
      pricing: { pricePerNight, totalAmount, discountAmount: 0, finalAmount: totalAmount },
      paymentMethod: paymentMethod || 'pay_at_hotel',
      status: status || 'pending',
    })

    // Send confirmation email (async, don't block response)
    sendConfirmationEmail(booking, room)

    // Send push notification (async)
    sendBookingNotification(booking)

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! Confirmation email sent.',
      bookingId: booking.bookingId,
      booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query
    const query = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'guest.name': { $regex: search, $options: 'i' } },
        { 'guest.email': { $regex: search, $options: 'i' } },
      ]
    }

    const total = await Booking.countDocuments(query)
    const bookings = await Booking.find(query)
      .populate('room', 'name category')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    res.json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      bookings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
    }).populate('room')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    booking.status = status
    if (notes) booking.internalNotes = notes
    if (status === 'checked-in') booking.checkedInAt = new Date()
    if (status === 'checked-out') booking.checkedOutAt = new Date()
    if (status === 'cancelled') {
      booking.cancelledAt = new Date()
      booking.cancellationReason = notes
    }

    await booking.save()

    res.json({ success: true, message: 'Booking status updated', booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
    })
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    res.json({ success: true, message: 'Booking deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { createBooking, getBookings, getBooking, updateBookingStatus, deleteBooking }
