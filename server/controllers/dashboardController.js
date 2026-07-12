const Booking = require('../models/Booking')
const Room = require('../models/Room')
const Contact = require('../models/Contact')
const Review = require('../models/Review')
const User = require('../models/User')

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin/Manager)
const getDashboardStats = async (req, res, next) => {
  try {
    const { filter = 'month' } = req.query
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPeriod = filter === 'all' ? new Date(0) : startOfMonth

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Period stats
    const [
      totalBookingsThisPeriod,
      totalBookingsLastMonth,
      revenueThisPeriod,
      revenueLastMonth,
      totalGuests,
      newMessages,
      pendingReviews,
      roomCount,
    ] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: startOfPeriod }, status: { $ne: 'cancelled' } }),
      Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $ne: 'cancelled' } }),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startOfPeriod }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.finalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.finalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startOfPeriod }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$guests' } } },
      ]),
      Contact.countDocuments({ status: 'new' }),
      Review.countDocuments({ approved: false }),
      Room.countDocuments({ isAvailable: true }),
    ])

    const thisPeriodRevenue = revenueThisPeriod[0]?.total || 0
    const lastMonthRevenue = revenueLastMonth[0]?.total || 0
    const revenueGrowth = lastMonthRevenue > 0
      ? parseFloat(((thisPeriodRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1))
      : 0

    const bookingGrowth = totalBookingsLastMonth > 0
      ? parseFloat(((totalBookingsThisPeriod - totalBookingsLastMonth) / totalBookingsLastMonth * 100).toFixed(1))
      : 0

    // Today's check-ins and check-outs (UTC midnight alignment)
    const today = new Date()
    const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    const utcTomorrow = new Date(utcToday)
    utcTomorrow.setUTCDate(utcTomorrow.getUTCDate() + 1)

    const [checkInsToday, checkOutsToday, currentlyCheckedIn] = await Promise.all([
      Booking.countDocuments({ checkIn: { $gte: utcToday, $lt: utcTomorrow }, status: { $in: ['confirmed', 'pending'] } }),
      Booking.countDocuments({ checkOut: { $gte: utcToday, $lt: utcTomorrow }, status: { $in: ['checked-in', 'checked-out'] } }),
      Booking.countDocuments({ status: 'checked-in' }),
    ])

    res.json({
      success: true,
      stats: {
        totalRevenue: thisPeriodRevenue,
        totalBookings: totalBookingsThisPeriod,
        totalGuests: totalGuests[0]?.total || 0,
        availableRooms: roomCount,
        revenueGrowth: filter === 'all' ? undefined : revenueGrowth,
        bookingGrowth: filter === 'all' ? undefined : bookingGrowth,
        newMessages,
        pendingReviews,
        checkInsToday,
        checkOutsToday,
        currentlyCheckedIn,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get recent bookings for dashboard
// @route   GET /api/dashboard/recent-bookings
// @access  Private
const getRecentBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name')
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({ success: true, bookings })
  } catch (error) {
    next(error)
  }
}

// @desc    Get monthly revenue chart data
// @route   GET /api/dashboard/revenue-chart
// @access  Private
const getRevenueChart = async (req, res, next) => {
  try {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const [result, bookingCount] = await Promise.all([
        Booking.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } } },
          { $group: { _id: null, revenue: { $sum: '$pricing.finalAmount' } } },
        ]),
        Booking.countDocuments({ createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } }),
      ])

      months.push({
        month: start.toLocaleString('en-IN', { month: 'short' }),
        year: start.getFullYear(),
        revenue: result[0]?.revenue || 0,
        bookings: bookingCount,
      })
    }

    res.json({ success: true, data: months })
  } catch (error) {
    next(error)
  }
}

module.exports = { getDashboardStats, getRecentBookings, getRevenueChart }
