const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const Notification = require('../models/Notification')

const clearBookings = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file.')
      process.exit(1)
    }

    console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Database connected successfully.')

    console.log('Clearing bookings collection...')
    const bookingResult = await Booking.deleteMany({})
    console.log(`Deleted ${bookingResult.deletedCount} bookings.`)

    console.log('Clearing notifications collection...')
    const notificationResult = await Notification.deleteMany({})
    console.log(`Deleted ${notificationResult.deletedCount} notifications.`)

    console.log('✅ Database cleared successfully.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing database:', error.message)
    process.exit(1)
  }
}

clearBookings()
