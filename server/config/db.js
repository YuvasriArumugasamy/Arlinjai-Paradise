const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Auto-seed default admin if database is empty
    await seedDefaultAdmin()
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

const seedDefaultAdmin = async () => {
  try {
    const User = require('../models/User')
    
    // Check if any admin user exists
    const adminExists = await User.findOne({ role: 'admin' })
    
    if (!adminExists) {
      console.log('⏳ No admin user found in database. Initializing default admin...')
      
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@arlinjaiparadise.com'
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234'
      
      await User.create({
        name: 'Arlinjai Paradise',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: process.env.HOTEL_PHONE || '9486271234',
        isActive: true
      })
      
      console.log('✅ Default admin user created successfully!')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
    }
  } catch (error) {
    console.error('❌ Error seeding default admin:', error.message)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...')
})

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected')
})

module.exports = connectDB
