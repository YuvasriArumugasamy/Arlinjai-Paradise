const express = require('express')
const { getDashboardStats, getRecentBookings, getRevenueChart } = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware')
const { staffOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/stats', protect, staffOnly, getDashboardStats)
router.get('/recent-bookings', protect, staffOnly, getRecentBookings)
router.get('/revenue-chart', protect, staffOnly, getRevenueChart)

module.exports = router
