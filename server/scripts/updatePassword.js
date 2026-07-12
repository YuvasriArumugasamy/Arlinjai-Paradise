const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')

const updatePassword = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file.')
      process.exit(1)
    }

    console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Database connected successfully.')

    const email = 'admin@arlinjaiparadise.com'
    const newPassword = 'Admin@1234'

    console.log(`Searching for user with email: ${email}...`)
    let user = await User.findOne({ email })
    
    if (!user) {
      console.log('User not found. Creating a new admin user...')
      user = new User({
        name: 'Arlinjai Paradise',
        email,
        password: newPassword,
        role: 'admin',
        phone: '1234567890',
        isActive: true
      })
    } else {
      console.log('User found. Updating name and password...')
      user.name = 'Arlinjai Paradise'
      user.password = newPassword
    }

    await user.save()
    console.log('✅ Admin password updated successfully to: Admin@1234')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating password:', error.message)
    process.exit(1)
  }
}

updatePassword()
