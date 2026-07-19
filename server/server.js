const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
const { initFirebase } = require('./config/firebase')

// Route imports
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const galleryRoutes = require('./routes/galleryRoutes')
const contactRoutes = require('./routes/contactRoutes')
const userRoutes = require('./routes/userRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const settingRoutes = require('./routes/settingRoutes')

const app = express()

// Trust proxy (for rate limiting behind reverse proxy like Render)
app.set('trust proxy', 1)

// Connect to MongoDB
connectDB()

// Initialize Firebase Admin SDK
initFirebase()

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true)
    
    // Check if origin matches the production domain or its subdomains
    const isCustomDomain = origin === 'https://arlinjaiparadise.in' || 
                           origin === 'http://arlinjaiparadise.in' || 
                           origin.endsWith('.arlinjaiparadise.in')

    // Allow any Vercel domain, the custom production domain, or other allowed origins
    if (origin.endsWith('.vercel.app') || isCustomDomain || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('CORS: Not allowed by policy'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Cookie parser (must be before routes)
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // increased limit for local development to avoid accidental 429s
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' },
  skip: (req) => process.env.NODE_ENV !== 'production',
  keyGenerator: (req) => req.ip || req.connection.remoteAddress,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // login attempts: allow more during development
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  skip: (req) => process.env.NODE_ENV !== 'production',
  keyGenerator: (req) => req.ip || req.connection.remoteAddress,
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
app.use('/api/notifications', notificationRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/settings', settingRoutes)

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
