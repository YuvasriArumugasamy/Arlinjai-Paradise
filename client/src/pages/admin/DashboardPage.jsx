import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt, FaBed, FaUsers, FaRupeeSign,
  FaArrowUp, FaArrowDown, FaClock, FaCheck, FaTimes, FaEye,
  FaWhatsapp
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authAxios, useAuth } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'

const MOCK_STATS = {
  totalRevenue: 0,
  totalBookings: 0,
  occupancyRate: 0,
  totalGuests: 0,
  revenueGrowth: 0,
  bookingGrowth: 0,
  availableRooms: 15,
  checkInsToday: 0,
  checkOutsToday: 0,
  currentlyCheckedIn: 0,
}

const MOCK_BOOKINGS = [];

const STATUS_STYLES = {
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  'checked-in': { bg: 'bg-green-100', text: 'text-green-700', label: 'Checked In' },
  'checked-out': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Checked Out' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
}

function StatCard({ title, value, prefix, suffix, growth, icon: Icon, color, delay }) {
  const isPositive = growth >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-6 shadow-card border border-gray-50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-poppins text-sm text-gray-500 mb-1">{title}</p>
          <p className="font-playfair text-3xl font-bold text-navy">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-poppins font-medium
              ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
              {Math.abs(growth)}% vs last month
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { loading: authLoading } = useAuth()
  const [filterMode, setFilterMode] = useState('month')
  const [stats, setStats] = useState(MOCK_STATS)
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [loading, setLoading] = useState(true)

  const handleWhatsApp = (booking, e) => {
    if (e) e.preventDefault()
    const phone = (booking.phone || '').replace(/[^0-9]/g, '')
    const formattedPhone = phone.startsWith('91') && phone.length === 12 
      ? phone 
      : (phone.length === 10 ? '91' + phone : phone)
    
    const checkInDate = booking.checkIn 
      ? new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'
    const checkOutDate = booking.checkOut
      ? new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'
    const statusLabel = STATUS_STYLES[booking.status]?.label || booking.status

    const message = `\u2705 *Arlinjai Paradise – Booking Update*\n\nDear ${booking.guest || 'Guest'},\n\nRegarding your booking (ID: *${booking.bookingId || booking.id}*):\n\n\u{1F6CF}\uFE0F Room: *${booking.room}*\n\u{1F4C5} Check-in: *${checkInDate}*\n\u{1F4C5} Check-out: *${checkOutDate}*\n\u{1F4CA} Status: *${statusLabel}*\n\n\u{1F4CC} Arlinjai Paradise, No. 5/69, Beach Road, Kanyakumari – 629702, Tamil Nadu, India\n\nThank you! \u{1F64F}`
    
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    if (authLoading) return

    const fetchDashboard = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          authAxios.get(`${API_BASE_URL}/dashboard/stats?filter=${filterMode}`),
          authAxios.get(`${API_BASE_URL}/dashboard/recent-bookings`),
        ])
        setStats({ ...MOCK_STATS, ...statsRes.data.stats })
        // Map backend booking shape to dashboard table shape
        const mapped = (bookingsRes.data.bookings || []).map(b => ({
          id: b._id || b.bookingId,
          bookingId: b.bookingId || b._id,
          guest: b.guest?.name || b.guest || '—',
          room: b.roomSnapshot?.name || b.room?.name || '—',
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          amount: b.pricing?.finalAmount || 0,
          status: b.status,
          phone: b.guest?.phone || b.phone || '',
        }))
        setBookings(mapped)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
        const msg = err?.response?.data?.message || err.message || 'Unable to load dashboard data'
        toast.error(`Dashboard Error: ${msg}`)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
    // Refresh every 2 minutes to reduce request volume
    const interval = setInterval(fetchDashboard, 120000)
    return () => clearInterval(interval)
  }, [authLoading, filterMode])

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Dashboard Overview</h2>
          <p className="font-poppins text-sm text-gray-500 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
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
          <Link to="/admin/bookings" className="btn-gold text-sm px-5 py-2.5">
            + New Booking
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue (Month)"
          value={stats.totalRevenue}
          prefix="₹"
          growth={stats.revenueGrowth}
          icon={FaRupeeSign}
          color="bg-gold"
          delay={0}
        />
        <StatCard
          title="Total Bookings (Month)"
          value={stats.totalBookings}
          growth={stats.bookingGrowth}
          icon={FaCalendarAlt}
          color="bg-blue-500"
          delay={0.1}
        />
        <StatCard
          title="Occupancy Rate"
          value={stats.occupancyRate}
          suffix="%"
          icon={FaBed}
          color="bg-purple-500"
          delay={0.2}
        />
        <StatCard
          title="Total Guests (Month)"
          value={stats.totalGuests}
          icon={FaUsers}
          color="bg-green-500"
          delay={0.3}
        />
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Available Rooms', value: stats.availableRooms || 15, icon: FaBed, color: 'text-green-500' },
          { label: 'Occupied Today', value: stats.currentlyCheckedIn ?? 0, icon: FaCheck, color: 'text-blue-500' },
          { label: 'Pending Check-ins', value: stats.checkInsToday ?? 0, icon: FaClock, color: 'text-yellow-500' },
          { label: 'Check-outs Today', value: stats.checkOutsToday ?? 0, icon: FaArrowUp, color: 'text-red-500' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-card border border-gray-50 flex items-center gap-2.5 sm:gap-3 min-w-0"
            >
              <Icon size={20} className={`${item.color} flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="font-playfair font-bold text-xl sm:text-2xl text-navy leading-tight">{item.value}</p>
                <p className="font-poppins text-[11px] sm:text-xs text-gray-500 truncate" title={item.label}>{item.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-card border border-gray-50"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-playfair font-bold text-navy text-lg">Recent Bookings</h3>
          <Link to="/admin/bookings" className="font-poppins text-xs text-gold hover:text-gold-dark transition-colors">
            View All →
          </Link>
        </div>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Booking ID', 'Guest', 'Room', 'Check In', 'Check Out', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 font-poppins text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 font-poppins text-sm">
                      <svg className="animate-spin h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Loading bookings...
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <p className="font-poppins text-sm text-gray-400">No bookings yet</p>
                  </td>
                </tr>
              ) : bookings.map((booking) => {
                const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                return (
                  <tr key={booking.id} className="hover:bg-lightbg transition-colors">
                    <td className="px-6 py-4 font-poppins text-sm font-medium text-navy">{booking.bookingId || booking.id}</td>
                    <td className="px-6 py-4 font-poppins text-sm text-gray-700">{booking.guest}</td>
                    <td className="px-6 py-4 font-poppins text-sm text-gray-600">{booking.room}</td>
                    <td className="px-6 py-4 font-poppins text-sm text-gray-600">
                      {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-poppins text-sm text-gray-600">
                      {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-poppins text-sm font-semibold text-navy">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-poppins text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to="/admin/bookings" className="text-gold hover:text-gold-dark transition-colors inline-block">
                        <FaEye size={14} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400 font-poppins text-sm">
                <svg className="animate-spin h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Loading bookings...
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-poppins text-sm text-gray-400">No bookings yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {bookings.map((booking) => {
                const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                return (
                  <div key={booking.id} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-wider">Booking ID</p>
                        <p className="font-poppins text-sm font-semibold text-[#08111F]">{booking.bookingId || booking.id}</p>
                      </div>
                      <span className={`font-poppins text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs font-poppins">
                      <div>
                        <p className="text-gray-400">Guest</p>
                        <p className="font-medium text-[#08111F] truncate">{booking.guest}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Room</p>
                        <p className="font-medium text-[#08111F] truncate">{booking.room}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Check In</p>
                        <p className="font-medium text-gray-700">
                          {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Check Out</p>
                        <p className="font-medium text-gray-700">
                          {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2 gap-3">
                      <div className="flex-1">
                        <p className="font-poppins text-[10px] text-gray-400 uppercase">Total Amount</p>
                        <p className="font-poppins text-sm font-bold text-navy">₹{(booking.amount || 0).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => handleWhatsApp(booking, e)}
                        className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-poppins text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        <FaWhatsapp size={13} /> WhatsApp
                      </button>
                      <Link to="/admin/bookings" className="text-gold hover:text-gold-dark transition-colors p-2 flex-shrink-0" title="View Details">
                        <FaEye size={14} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Grid: Room Availability + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-card border border-gray-50 p-6"
        >
          <h3 className="font-playfair font-bold text-navy text-lg mb-5">Room Availability</h3>
          <div className="space-y-4">
            {[
              { name: 'Deluxe AC Room (101–105)', total: 5, occupied: 0 },
              { name: 'Normal AC Room (201, 301–305)', total: 6, occupied: 0 },
              { name: 'Non AC Room (202–205)', total: 4, occupied: 0 },
            ].map((room) => {
              const pct = Math.round((room.occupied / room.total) * 100)
              return (
                <div key={room.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-poppins text-sm text-navy font-medium">{room.name}</span>
                    <span className="font-poppins text-xs text-gray-500">
                      {room.occupied}/{room.total} occupied ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-card border border-gray-50 p-6"
        >
          <h3 className="font-playfair font-bold text-navy text-lg mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Booking', path: '/admin/bookings', color: 'bg-gold' },
              { label: 'Add Room', path: '/admin/rooms', color: 'bg-blue-500' },
              { label: 'Notifications', path: '/admin/notifications', color: 'bg-purple-500' },
              { label: 'Generate Report', path: '/admin/reports', color: 'bg-green-500' },
            ].map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className={`${action.color} text-white font-poppins text-sm font-medium px-4 py-3 
                            rounded-lg text-center hover:opacity-90 transition-opacity`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
