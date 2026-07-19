const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { validationResult } = require('express-validator')

// ── Token helpers ────────────────────────────────────────────────────────────

// Short-lived access token (15 min)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

// Opaque refresh token — random hex stored hashed in DB
const generateRefreshToken = () => crypto.randomBytes(40).toString('hex')

// Hash before saving to DB
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

// Set refresh token as HttpOnly cookie
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  })
}

// ── Controllers ──────────────────────────────────────────────────────────────

// @desc    Register user
// @route   POST /api/auth/register
// @access  Private (Admin only creates staff)
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { name, email, password, role, phone } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    const user = await User.create({ name, email, password, role: role || 'guest', phone })

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken()
    user.refreshToken = hashToken(refreshToken)
    await user.save({ validateBeforeSave: false })

    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({
      $or: [{ email }, { name: email }]
    }).select('+password')

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated. Contact admin.' })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken()

    // Save hashed refresh token to DB
    user.refreshToken = hashToken(refreshToken)
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    // Send refresh token as HttpOnly cookie
    setRefreshCookie(res, refreshToken)

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id).select('+password')

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh access token using HttpOnly cookie
// @route   POST /api/auth/refresh
// @access  Public (cookie required)
const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken
    if (!token) {
      return res.status(401).json({ message: 'No refresh token. Please login.' })
    }

    const hashed = hashToken(token)
    const user = await User.findOne({ refreshToken: hashed })

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or expired session. Please login.' })
    }

    // Issue new access token + rotate refresh token
    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken()
    user.refreshToken = hashToken(newRefreshToken)
    await user.save({ validateBeforeSave: false })

    setRefreshCookie(res, newRefreshToken)

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout - clear refresh token cookie + DB
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      const hashed = hashToken(token)
      await User.findOneAndUpdate({ refreshToken: hashed }, { refreshToken: null })
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    })
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Initialize admin user (only if no users exist)
// @route   POST /api/auth/initialize-admin
// @access  Public (only works on first deployment)
const initializeAdmin = async (req, res, next) => {
  try {
    // Check if any users exist
    const userCount = await User.countDocuments()
    if (userCount > 0) {
      return res.status(403).json({ message: 'Database already initialized. Admin already exists.' })
    }

    // Create default admin
    const user = await User.create({
      name: 'Arlinjai Paradise',
      email: 'admin@arlinjaiparadise.com',
      password: 'Admin@1234',
      role: 'admin',
      phone: '9486271234',
      isActive: true
    })

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken()
    user.refreshToken = hashToken(refreshToken)
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      success: true,
      message: 'Admin user initialized successfully',
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getMe, changePassword, refreshAccessToken, logout, initializeAdmin }
