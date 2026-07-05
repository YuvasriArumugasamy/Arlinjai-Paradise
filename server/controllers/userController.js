const User = require('../models/User')

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query
    const query = {}
    if (role) query.role = role

    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    res.json({ success: true, count: users.length, total, users })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or Self)
const updateUser = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address },
      { new: true, runValidators: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ success: true, message: 'User updated', user })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle user active status
// @route   PATCH /api/users/:id/toggle
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.isActive = !user.isActive
    await user.save({ validateBeforeSave: false })

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      isActive: user.isActive,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getUsers, getUser, updateUser, toggleUserStatus, deleteUser }
