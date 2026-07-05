import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaEye, FaEdit, FaTimes, FaCalendarAlt, FaDownload } from 'react-icons/fa'
import toast from 'react-hot-toast'

const MOCK_BOOKINGS = [
  { id: 'AP001', guest: 'Priya S.', email: 'priya@email.com', phone: '9876543210', room: 'Deluxe AC Room', checkIn: '2025-01-20', checkOut: '2025-01-23', nights: 3, guests: 2, amount: 7500, status: 'confirmed', paymentMethod: 'pay_at_hotel', createdAt: '2025-01-15' },
  { id: 'AP002', guest: 'Rahul K.', email: 'rahul@email.com', phone: '9876543211', room: 'Normal AC Room', checkIn: '2025-01-21', checkOut: '2025-01-22', nights: 1, guests: 2, amount: 2000, status: 'pending', paymentMethod: 'upi', createdAt: '2025-01-16' },
  { id: 'AP003', guest: 'Anitha R.', email: 'anitha@email.com', phone: '9876543212', room: 'Non AC Room', checkIn: '2025-01-22', checkOut: '2025-01-24', nights: 2, guests: 3, amount: 3000, status: 'confirmed', paymentMethod: 'pay_at_hotel', createdAt: '2025-01-17' },
  { id: 'AP004', guest: 'James W.', email: 'james@email.com', phone: '9876543213', room: 'Deluxe AC Room', checkIn: '2025-01-23', checkOut: '2025-01-26', nights: 3, guests: 2, amount: 7500, status: 'checked-in', paymentMethod: 'upi', createdAt: '2025-01-18' },
  { id: 'AP005', guest: 'Meena T.', email: 'meena@email.com', phone: '9876543214', room: 'Normal AC Room', checkIn: '2025-01-19', checkOut: '2025-01-21', nights: 2, guests: 2, amount: 4000, status: 'checked-out', paymentMethod: 'pay_at_hotel', createdAt: '2025-01-14' },
  { id: 'AP006', guest: 'Suresh P.', email: 'suresh@email.com', phone: '9876543215', room: 'Non AC Room', checkIn: '2025-01-25', checkOut: '2025-01-27', nights: 2, guests: 4, amount: 3000, status: 'cancelled', paymentMethod: 'pay_at_hotel', createdAt: '2025-01-19' },
]

const STATUS_STYLES = {
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  'checked-in': { bg: 'bg-green-100', text: 'text-green-700', label: 'Checked In' },
  'checked-out': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Checked Out' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
}

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']

export default function BookingsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const filtered = bookings.filter((b) => {
    const matchSearch = b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (id, newStatus) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b))
    toast.success(`Booking ${id} status updated to ${newStatus}`)
    setSelectedBooking(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Bookings</h2>
          <p className="font-poppins text-sm text-gray-500">{filtered.length} bookings found</p>
        </div>
        <button className="flex items-center gap-2 btn-gold text-sm px-4 py-2.5">
          <FaDownload size={12} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by guest name, booking ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field text-sm w-36"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Status' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-lightbg">
                {['ID', 'Guest', 'Room', 'Check In', 'Check Out', 'Nights', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-poppins text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((booking, i) => {
                const st = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                return (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-lightbg transition-colors"
                  >
                    <td className="px-4 py-3.5 font-poppins text-sm font-semibold text-gold">{booking.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-poppins text-sm font-medium text-navy">{booking.guest}</p>
                      <p className="font-poppins text-xs text-gray-500">{booking.email}</p>
                    </td>
                    <td className="px-4 py-3.5 font-poppins text-sm text-gray-600 whitespace-nowrap">{booking.room}</td>
                    <td className="px-4 py-3.5 font-poppins text-sm text-gray-600 whitespace-nowrap">
                      {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-poppins text-sm text-gray-600 whitespace-nowrap">
                      {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-poppins text-sm text-gray-600 text-center">{booking.nights}</td>
                    <td className="px-4 py-3.5 font-poppins text-sm font-bold text-navy">₹{booking.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <span className={`font-poppins text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-gold hover:text-gold-dark transition-colors p-1"
                      >
                        <FaEye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 font-poppins text-gray-500">
            No bookings found matching your criteria
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-playfair font-bold text-navy text-lg">Booking #{selectedBooking.id}</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-navy">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 font-poppins text-sm">
                {[
                  { label: 'Guest Name', value: selectedBooking.guest },
                  { label: 'Email', value: selectedBooking.email },
                  { label: 'Phone', value: selectedBooking.phone },
                  { label: 'Room', value: selectedBooking.room },
                  { label: 'Check In', value: new Date(selectedBooking.checkIn).toLocaleDateString('en-IN') },
                  { label: 'Check Out', value: new Date(selectedBooking.checkOut).toLocaleDateString('en-IN') },
                  { label: 'Nights', value: selectedBooking.nights },
                  { label: 'Guests', value: selectedBooking.guests },
                  { label: 'Amount', value: `₹${selectedBooking.amount.toLocaleString()}` },
                  { label: 'Payment', value: selectedBooking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel' : 'UPI' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-navy">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="font-poppins text-sm font-medium text-gray-700 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'checked-in', 'checked-out', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedBooking.id, s)}
                      className={`font-poppins text-xs px-3 py-1.5 rounded-full border transition-colors capitalize
                        ${selectedBooking.status === s
                          ? 'bg-gold text-white border-gold'
                          : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
