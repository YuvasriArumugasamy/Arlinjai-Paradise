const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

// Route imports
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const galleryRoutes = require('./routes/galleryRoutes')
const contactRoutes = require('./routes/contactRoutes')
const userRoutes = require('./routes/userRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
})

app.use('/api/', limiter)
app.use('/api/auth/login', authLimiter)

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Arlinjai Paradise API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 404 handler
app.use(notFound)

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n✅ Arlinjai Paradise Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`📍 API: http://localhost:${PORT}/api`)
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`)
})

module.exports = app
