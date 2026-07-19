const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Auto-seed default admin if database is empty
    await seedDefaultAdmin()
    // Auto-seed default rooms if database is empty
    await seedRooms()
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

const seedRooms = async () => {
  try {
    const Room = require('../models/Room')
    const defaults = [
      {
        name: 'Deluxe AC Room',
        slug: 'deluxe-ac-room',
        category: 'deluxe',
        badge: 'PREMIUM',
        price: 2500,
        highSeasonPrice: 5000,
        size: 240,
        guests: 4,
        minGuests: 2,
        bedType: '1 Double Bed',
        floor: '2nd & 3rd Floor',
        view: 'City & Partial Sea View',
        totalUnits: 5,
        description: 'Our most premium offering, the Deluxe AC Room offers spacious comfort with elegant furnishings and modern amenities.'
      },
      {
        name: 'Normal AC Room',
        slug: 'normal-ac-room',
        category: 'standard',
        badge: 'VALUE',
        price: 2000,
        highSeasonPrice: 4000,
        size: 200,
        guests: 4,
        minGuests: 2,
        bedType: '1 Double Bed',
        floor: '1st & 2nd Floor',
        view: 'Garden & City View',
        totalUnits: 6,
        description: 'The Normal AC Room combines affordability with comfort. Equipped with essential modern amenities.'
      },
      {
        name: 'Non AC Room',
        slug: 'non-ac-room',
        category: 'budget',
        badge: 'BUDGET',
        price: 1500,
        highSeasonPrice: 3000,
        size: 180,
        guests: 4,
        minGuests: 2,
        bedType: '1 Double Bed',
        floor: 'Ground & 1st Floor',
        view: 'Garden View',
        totalUnits: 4,
        description: 'Our budget-friendly Non AC Room is perfect for the cost-conscious traveler who still wants a clean and comfortable stay.'
      }
    ]

    for (const roomData of defaults) {
      const exists = await Room.findOne({ slug: roomData.slug })
      if (!exists) {
        console.log(`[SEED] Seeding room category: ${roomData.name}`)
        await Room.create(roomData)
      }
    }
    console.log('[SEED] ✅ Room seeding check complete.')
  } catch (error) {
    console.error('[SEED] ❌ Error seeding default rooms:', error.message)
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
