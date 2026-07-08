import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaDownload, FaCalendarAlt, FaRupeeSign, FaChartBar, FaUsers } from 'react-icons/fa'

const MONTHLY_DATA = []

const ROOM_DATA = []

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly')
  const maxRevenue = MONTHLY_DATA.length > 0 ? Math.max(...MONTHLY_DATA.map((d) => d.revenue)) : 1

  const totalRevenue = MONTHLY_DATA.reduce((s, m) => s + m.revenue, 0)
  const totalBookings = MONTHLY_DATA.reduce((s, m) => s + m.bookings, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Reports & Analytics</h2>
          <p className="font-poppins text-sm text-gray-500">Financial overview and booking analytics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="select-field text-sm w-36"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
            <FaDownload size={12} /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: FaRupeeSign, color: 'bg-gold' },
          { label: 'Total Bookings', value: totalBookings, icon: FaCalendarAlt, color: 'bg-blue-500' },
          { label: 'Avg. per Booking', value: `₹${totalBookings > 0 ? Math.round(totalRevenue / totalBookings).toLocaleString() : 0}`, icon: FaChartBar, color: 'bg-purple-500' },
          { label: 'Total Guests', value: Math.round(totalBookings * 2.1), icon: FaUsers, color: 'bg-green-500' },
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

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="font-playfair font-bold text-navy text-lg mb-6">Monthly Revenue & Bookings</h3>
        <div className="flex items-end gap-3 h-48 overflow-x-auto">
          {MONTHLY_DATA.map((data) => {
            const heightPct = (data.revenue / maxRevenue) * 100
            return (
              <div key={data.month} className="flex flex-col items-center gap-2 flex-1 min-w-12">
                <p className="font-poppins text-xs text-gray-500 text-center">
                  ₹{(data.revenue / 1000).toFixed(0)}k
                </p>
                <div
                  className="w-full bg-gold rounded-t-sm transition-all duration-500 hover:bg-gold-dark relative group"
                  style={{ height: `${heightPct}%`, minHeight: '8px' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs 
                                 font-poppins px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                                 transition-opacity whitespace-nowrap">
                    {data.bookings} bookings
                  </div>
                </div>
                <p className="font-poppins text-xs text-gray-600 font-medium">{data.month}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Revenue by Room Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="font-playfair font-bold text-navy text-lg mb-6">Revenue by Room Type</h3>
        <div className="space-y-5">
          {ROOM_DATA.map((room) => (
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
      </motion.div>

      {/* Booking Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="font-playfair font-bold text-navy text-lg mb-6">Booking Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Confirmed', count: 28, color: 'bg-blue-500', pct: 58 },
            { label: 'Checked In', count: 6, color: 'bg-green-500', pct: 13 },
            { label: 'Checked Out', count: 10, color: 'bg-gray-400', pct: 21 },
            { label: 'Pending', count: 2, color: 'bg-yellow-400', pct: 4 },
            { label: 'Cancelled', count: 2, color: 'bg-red-400', pct: 4 },
          ].map((s) => (
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
      </motion.div>
    </div>
  )
}
