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
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@arlinjaiparadise.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234'
    
    console.log(`[SEED] Starting admin seed check for email: ${adminEmail}`)
    
    // Check if the specific admin user exists by email
    let admin = await User.findOne({ email: adminEmail }).select('+password')
    
    if (!admin) {
      console.log(`[SEED] Admin user (${adminEmail}) not found. Initializing...`)
      
      admin = await User.create({
        name: 'Arlinjai Paradise',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: process.env.HOTEL_PHONE || '9486271234',
        isActive: true
      })
      
      console.log(`[SEED] ✅ Default admin user created successfully! Email: ${adminEmail}`)
    } else {
      console.log(`[SEED] Admin user found in database. Verifying details...`)
      let updated = false
      
      if (admin.name !== 'Arlinjai Paradise') {
        console.log(`[SEED] Name mismatch: "${admin.name}" vs "Arlinjai Paradise". Updating...`)
        admin.name = 'Arlinjai Paradise'
        updated = true
      }
      
      const isMatch = await admin.matchPassword(adminPassword)
      console.log(`[SEED] Password match status: ${isMatch}`)
      
      if (!isMatch) {
        console.log(`[SEED] Password mismatch. Updating password to configured value...`)
        admin.password = adminPassword
        updated = true
      }
      
      if (updated) {
        await admin.save()
        console.log('[SEED] ✅ Admin details updated and saved successfully in database!')
      } else {
        console.log('[SEED] ✅ Admin details are already up to date.')
      }
    }
  } catch (error) {
    console.error('[SEED] ❌ Error seeding default admin:', error.message)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...')
})

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected')
})

module.exports = connectDB
