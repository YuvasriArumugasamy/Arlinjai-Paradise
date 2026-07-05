import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt, FaBed, FaUsers, FaRupeeSign,
  FaArrowUp, FaArrowDown, FaClock, FaCheck, FaTimes, FaEye
} from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'

const MOCK_STATS = {
  totalRevenue: 125000,
  totalBookings: 48,
  occupancyRate: 72,
  totalGuests: 89,
  revenueGrowth: 12.5,
  bookingGrowth: 8.3,
}

const MOCK_BOOKINGS = [
  { id: 'AP001', guest: 'Priya S.', room: 'Deluxe AC Room', checkIn: '2025-01-20', checkOut: '2025-01-23', amount: 7500, status: 'confirmed' },
  { id: 'AP002', guest: 'Rahul K.', room: 'Normal AC Room', checkIn: '2025-01-21', checkOut: '2025-01-22', amount: 2000, status: 'pending' },
  { id: 'AP003', guest: 'Anitha R.', room: 'Non AC Room', checkIn: '2025-01-22', checkOut: '2025-01-24', amount: 3000, status: 'confirmed' },
  { id: 'AP004', guest: 'James W.', room: 'Deluxe AC Room', checkIn: '2025-01-23', checkOut: '2025-01-26', amount: 7500, status: 'checked-in' },
  { id: 'AP005', guest: 'Meena T.', room: 'Normal AC Room', checkIn: '2025-01-19', checkOut: '2025-01-21', amount: 4000, status: 'checked-out' },
]

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
  const [stats, setStats] = useState(MOCK_STATS)
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)

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
        <Link to="/admin/bookings" className="btn-gold text-sm px-5 py-2.5 self-start sm:self-auto">
          + New Booking
        </Link>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Available Rooms', value: 4, icon: FaBed, color: 'text-green-500' },
          { label: 'Occupied Today', value: 3, icon: FaCheck, color: 'text-blue-500' },
          { label: 'Pending Check-ins', value: 2, icon: FaClock, color: 'text-yellow-500' },
          { label: 'Check-outs Today', value: 1, icon: FaArrowUp, color: 'text-red-500' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-card border border-gray-50 flex items-center gap-3"
            >
              <Icon size={22} className={item.color} />
              <div>
                <p className="font-playfair font-bold text-2xl text-navy">{item.value}</p>
                <p className="font-poppins text-xs text-gray-500">{item.label}</p>
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
        <div className="overflow-x-auto">
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
              {bookings.map((booking) => {
                const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                return (
                  <tr key={booking.id} className="hover:bg-lightbg transition-colors">
                    <td className="px-6 py-4 font-poppins text-sm font-medium text-navy">{booking.id}</td>
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
                      <button className="text-gold hover:text-gold-dark transition-colors">
                        <FaEye size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
              { name: 'Deluxe AC Room', total: 3, occupied: 2 },
              { name: 'Normal AC Room', total: 5, occupied: 3 },
              { name: 'Non AC Room', total: 4, occupied: 2 },
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
              { label: 'View Messages', path: '/admin/messages', color: 'bg-purple-500' },
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
