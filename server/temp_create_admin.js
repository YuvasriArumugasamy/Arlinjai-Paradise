const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/User')

const createAdminOnRender = async () => {
  try {
    // Render MongoDB URI
    const mongoUri = 'mongodb+srv://adminuyuya123.db_user:yuvasri123@cluster0.lddeux.mongodb.net/arlinjai_paradise?appName=cluster0'
    
    console.log('Connecting to Render MongoDB...')
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    })
    console.log('✅ Connected to Render MongoDB')

    const email = 'admin@arlinjaiparadise.com'
    const newPassword = 'Admin@1234'

    console.log(`Searching for user with email: ${email}...`)
    let user = await User.findOne({ email })
    
    if (!user) {
      console.log('User not found. Creating new admin user...')
      user = new User({
        name: 'Arlinjai Paradise',
        email,
        password: newPassword,
        role: 'admin',
        phone: '9486271234',
        isActive: true
      })
    } else {
      console.log('User found. Updating password...')
      user.password = newPassword
    }

    await user.save()
    console.log('✅ Admin user created/updated successfully on Render MongoDB')
    console.log(`Email: ${email}`)
    console.log(`Password: ${newPassword}`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdminOnRender()
