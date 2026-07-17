const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const mongoose = require('mongoose')
const Booking = require('../models/Booking')

const checkBookings = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined.')
      process.exit(1)
    }
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Database connected.')
    const bookings = await Booking.find({})
    console.log(`Found ${bookings.length} bookings:`)
    bookings.forEach(b => {
      console.log({
        _id: b._id.toString(),
        bookingId: b.bookingId,
        guest: b.guest,
        room: b.room,
        roomSnapshot: b.roomSnapshot,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status
      })
    })
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkBookings()
