import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaDownload, FaCalendarAlt, FaRupeeSign, FaChartBar, FaUsers } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authAxios } from '../../context/AuthContext'

// ── Derive all report data from localStorage bookings ──────────────────────
function calcReportsFromLocal(bookings) {
  const active = bookings.filter((b) => b.status !== 'cancelled')

  // Monthly Revenue & Bookings (last 6 months)
  const monthlyMap = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-IN', { month: 'short' }) + ' ' + d.getFullYear()
    monthlyMap[key] = { month: d.toLocaleString('en-IN', { month: 'short' }), revenue: 0, bookings: 0 }
  }
  active.forEach((b) => {
    const d = new Date(b.createdAt || b.checkIn)
    const key = d.toLocaleString('en-IN', { month: 'short' }) + ' ' + d.getFullYear()
    if (monthlyMap[key]) {
      monthlyMap[key].revenue += b.amount || b.pricing?.finalAmount || 0
      monthlyMap[key].bookings += 1
    }
  })
  const monthlyData = Object.values(monthlyMap)

  // Revenue by Room Type
  const roomMap = {}
  active.forEach((b) => {
    const room = b.room || b.roomSnapshot?.name || 'Other'
    if (!roomMap[room]) roomMap[room] = { room, revenue: 0, bookings: 0 }
    roomMap[room].revenue += b.amount || b.pricing?.finalAmount || 0
    roomMap[room].bookings += 1
  })
  const totalRoomRevenue = Object.values(roomMap).reduce((s, r) => s + r.revenue, 0)
  const roomData = Object.values(roomMap).map((r) => ({
    ...r,
    pct: totalRoomRevenue > 0 ? Math.round((r.revenue / totalRoomRevenue) * 100) : 0,
  })).sort((a, b) => b.revenue - a.revenue)

  // Status Distribution
  const statusMap = { confirmed: 0, 'checked-in': 0, 'checked-out': 0, pending: 0, cancelled: 0 }
  bookings.forEach((b) => {
    const s = b.status || 'pending'
    if (statusMap[s] !== undefined) statusMap[s]++
    else statusMap.pending++
  })
  const total = bookings.length || 1
  const statusData = [
    { label: 'Confirmed',    count: statusMap.confirmed,      color: 'bg-blue-500',   pct: Math.round(statusMap.confirmed / total * 100) },
    { label: 'Checked In',  count: statusMap['checked-in'],  color: 'bg-green-500',  pct: Math.round(statusMap['checked-in'] / total * 100) },
    { label: 'Checked Out', count: statusMap['checked-out'], color: 'bg-gray-400',   pct: Math.round(statusMap['checked-out'] / total * 100) },
    { label: 'Pending',     count: statusMap.pending,        color: 'bg-yellow-400', pct: Math.round(statusMap.pending / total * 100) },
    { label: 'Cancelled',   count: statusMap.cancelled,      color: 'bg-red-400',    pct: Math.round(statusMap.cancelled / total * 100) },
  ]

  const totalRevenue = active.reduce((s, b) => s + (b.amount || b.pricing?.finalAmount || 0), 0)
  const totalBookings = active.length
  const totalGuests = active.reduce((s, b) => s + (b.guests || 1), 0)

  return { monthlyData, roomData, statusData, totalRevenue, totalBookings, totalGuests }
}

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly')
  const [filterMode, setFilterMode] = useState('month')
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState([])
  const [roomData, setRoomData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [totalGuests, setTotalGuests] = useState(0)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Try API first
        const [chartRes, bookingsRes] = await Promise.all([
          authAxios.get('/dashboard/revenue-chart'),
          authAxios.get('/dashboard/recent-bookings'),
        ])

        // Monthly chart data from API
        const apiMonthly = (chartRes.data.data || []).map((d) => ({
          month: d.month,
          revenue: d.revenue || 0,
          bookings: d.bookings || 0,
        }))
        setMonthlyData(apiMonthly)

        // Derive room/status from bookings API
        const apiBkgs = bookingsRes.data.bookings || []
        const mapped = apiBkgs.map((b) => ({
          amount: b.pricing?.finalAmount || 0,
          room: b.roomSnapshot?.name || b.room?.name || 'Other',
          status: b.status || 'pending',
          guests: b.guests || 1,
          createdAt: b.createdAt,
        }))
        
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const periodMapped = filterMode === 'all'
          ? mapped
          : mapped.filter(b => new Date(b.createdAt) >= startOfMonth)

        const calc = calcReportsFromLocal(periodMapped)
        setRoomData(calc.roomData)
        setStatusData(calc.statusData)
        setTotalRevenue(calc.totalRevenue)
        setTotalBookings(calc.totalBookings)
        setTotalGuests(calc.totalGuests)
      } catch (err) {
        console.error('Reports fetch failed:', err?.response || err)
        const message = err?.response?.data?.message || err.message || 'Unable to load report data from the server. Please check your network and login status.'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [period, filterMode])

  const maxRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map((d) => d.revenue), 1) : 1
  const avgPerBooking = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

  // Export CSV
  const handleExport = () => {
    const rows = [
      ['Month', 'Revenue', 'Bookings'],
      ...monthlyData.map((d) => [d.month, d.revenue, d.bookings]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arlinjai-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Reports & Analytics</h2>
          <p className="font-poppins text-sm text-gray-500">Financial overview and booking analytics</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Calendar dropdown filter */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <FaCalendarAlt className="text-slate-400 mr-2.5" size={14} />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="appearance-none bg-transparent font-poppins font-semibold text-sm text-slate-700 outline-none pr-6 cursor-pointer border-none p-0"
            >
              <option value="month">Month View</option>
              <option value="all">All Time</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="select-field text-sm w-36"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={handleExport} className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
            <FaDownload size={12} /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue',    value: `₹${totalRevenue.toLocaleString()}`, icon: FaRupeeSign,  color: 'bg-gold' },
          { label: 'Total Bookings',   value: totalBookings,                        icon: FaCalendarAlt, color: 'bg-blue-500' },
          { label: 'Avg. per Booking', value: `₹${avgPerBooking.toLocaleString()}`, icon: FaChartBar,   color: 'bg-purple-500' },
          { label: 'Total Guests',     value: totalGuests,                           icon: FaUsers,      color: 'bg-green-500' },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-poppins text-sm text-gray-500">{card.label}</p>
                  <p className="font-playfair text-2xl font-bold text-navy mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Monthly Revenue & Bookings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="font-playfair font-bold text-navy text-lg mb-6">Monthly Revenue & Bookings</h3>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-gold" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : monthlyData.every((d) => d.revenue === 0) ? (
          <div className="h-48 flex items-center justify-center">
            <p className="font-poppins text-sm text-gray-400">No revenue data yet</p>
          </div>
        ) : (
          <div className="flex items-end gap-3 h-48 overflow-x-auto">
            {monthlyData.map((data) => {
              const heightPct = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0
              return (
                <div key={data.month} className="flex flex-col items-center gap-2 flex-1 min-w-12">
                  <p className="font-poppins text-xs text-gray-500 text-center">
                    {data.revenue > 0 ? `₹${(data.revenue / 1000).toFixed(0)}k` : ''}
                  </p>
                  <div
                    className="w-full bg-gold rounded-t-sm transition-all duration-500 hover:bg-opacity-80 relative group cursor-pointer"
                    style={{ height: `${Math.max(heightPct, data.revenue > 0 ? 4 : 0)}%`, minHeight: data.revenue > 0 ? '8px' : '0' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs
                                   font-poppins px-2 py-1 rounded opacity-0 group-hover:opacity-100
                                   transition-opacity whitespace-nowrap z-10">
                      {data.bookings} bookings · ₹{data.revenue.toLocaleString()}
                    </div>
                  </div>
                  <p className="font-poppins text-xs text-gray-600 font-medium">{data.month}</p>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Revenue by Room Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="font-playfair font-bold text-navy text-lg mb-6">Revenue by Room Type</h3>
        {roomData.length === 0 ? (
          <p className="font-poppins text-sm text-gray-400 text-center py-4">No room data yet</p>
        ) : (
          <div className="space-y-5">
            {roomData.map((room) => (
              <div key={room.room}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-poppins text-sm font-medium text-navy">{room.room}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-poppins text-xs text-gray-500">{room.bookings} bookings</span>
                    <span className="font-poppins text-sm font-bold text-gold">₹{room.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${room.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Booking Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="font-playfair font-bold text-navy text-lg mb-6">Booking Status Distribution</h3>
        {statusData.length === 0 || statusData.every((s) => s.count === 0) ? (
          <p className="font-poppins text-sm text-gray-400 text-center py-4">No booking data yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statusData.map((s) => (
              <div key={s.label} className="text-center">
                <div className={`w-16 h-16 ${s.color} rounded-full flex items-center justify-center
                               mx-auto mb-2 text-white font-bold font-poppins text-lg`}>
                  {s.pct}%
                </div>
                <p className="font-poppins text-xs font-medium text-navy">{s.label}</p>
                <p className="font-poppins text-xs text-gray-500">{s.count} bookings</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
