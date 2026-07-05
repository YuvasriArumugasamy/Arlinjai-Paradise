// Restrict access to certain roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      })
    }

    next()
  }
}

// Admin only
const adminOnly = authorize('admin')

// Admin and Manager
const managerAndAbove = authorize('admin', 'manager')

// All staff (admin, manager, receptionist)
const staffOnly = authorize('admin', 'manager', 'receptionist')

module.exports = { authorize, adminOnly, managerAndAbove, staffOnly }
