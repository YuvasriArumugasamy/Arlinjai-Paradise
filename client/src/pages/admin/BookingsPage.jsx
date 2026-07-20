import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaSearch, FaFilter, FaEye, FaTimes, FaDownload,
  FaUser, FaPhoneAlt, FaEnvelope, FaBed, FaCalendarAlt,
  FaIdCard, FaVenusMars, FaBirthdayCake, FaMoneyBillWave,
  FaWhatsapp, FaTimesCircle, FaTrashAlt
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authAxios } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'

const STATUS_STYLES = {
  confirmed:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Confirmed' },
  pending:      { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  'checked-in': { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Checked In' },
  'checked-out':{ bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Checked Out' },
  cancelled:    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelled' },
}

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—'

const getAge = (dob) => {
  if (!dob) return null
  const today = new Date()
  const b = new Date(dob)
  let age = today.getFullYear() - b.getFullYear()
  if (today.getMonth() - b.getMonth() < 0 ||
     (today.getMonth() - b.getMonth() === 0 && today.getDate() < b.getDate())) age--
  return age
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterMode, setFilterMode] = useState('month')
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Offline Booking Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  
  const getTodayISO = () => new Date().toISOString().slice(0, 10)
  const getTomorrowISO = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  const [addForm, setAddForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    roomSlug: 'deluxe-ac-room',
    roomsCount: 1,
    checkIn: getTodayISO(),
    checkInTime: '12:00',
    checkOut: getTomorrowISO(),
    checkOutTime: '11:00',
    guests: 2,
    amount: '',
    advancePaid: 0,
    paymentMethod: 'Cash',
    specialNotes: '',
  })

  const fetchBookings = async () => {
    try {
      const res = await authAxios.get(`${API_BASE_URL}/bookings?limit=100`)
      if (res.data.success) {
        const mapped = res.data.bookings.map(b => ({
          id: b._id || b.bookingId,
          bookingId: b.bookingId || b._id,
          guest: b.guest?.name || b.guest || '—',
          gender: b.guest?.gender || b.gender || '',
          dob: b.guest?.dob || b.dob || '',
          email: b.guest?.email || b.email || '',
          phone: b.guest?.phone || b.phone || '',
          idType: b.guest?.idType || b.idType || '',
          idNumber: b.guest?.idNumber || b.idNumber || '',
          room: b.roomSnapshot?.name || b.room?.name || '—',
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          nights: b.nights,
          guests: b.guests,
          amount: b.pricing?.finalAmount || 0,
          paymentMethod: b.paymentMethod || 'pay_at_hotel',
          status: b.status,
          createdAt: b.createdAt
        }))
        setBookings(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch bookings from server:', err)
      toast.error('Unable to load bookings from server.')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCreateOfflineBooking = async (e) => {
    e.preventDefault()
    if (!addForm.guestName || !addForm.phone || !addForm.checkIn || !addForm.checkOut) {
      toast.error('Please fill required fields (Customer Name, Phone Number, Dates)')
      return
    }
    if (new Date(addForm.checkIn) >= new Date(addForm.checkOut)) {
      toast.error('Check-Out date must be after Check-In date')
      return
    }

    try {
      setAddLoading(true)

      const pMethodMap = {
        'Cash': 'pay_at_hotel',
        'UPI': 'upi',
        'Card': 'card',
        'Bank Transfer': 'bank_transfer'
      }

      const payload = {
        name: addForm.guestName,
        phone: addForm.phone,
        email: addForm.email || 'offline@arlinjaiparadise.com',
        roomId: addForm.roomSlug,
        checkIn: addForm.checkIn,
        checkInTime: addForm.checkInTime || '12:00 PM',
        checkOut: addForm.checkOut,
        checkOutTime: addForm.checkOutTime || '11:00 AM',
        guests: Number(addForm.guests),
        roomAmount: addForm.amount ? Number(addForm.amount) : undefined,
        advancePaid: Number(addForm.advancePaid || 0),
        paymentMethod: pMethodMap[addForm.paymentMethod] || 'pay_at_hotel',
        specialRequests: addForm.specialNotes,
        status: 'confirmed',
      }

      const res = await authAxios.post(`${API_BASE_URL}/bookings`, payload)
      if (res.data.success) {
        toast.success('Offline booking confirmed successfully!')
        setShowAddModal(false)
        setAddForm({
          guestName: '',
          phone: '',
          email: '',
          roomSlug: 'deluxe-ac-room',
          roomsCount: 1,
          checkIn: getTodayISO(),
          checkInTime: '12:00',
          checkOut: getTomorrowISO(),
          checkOutTime: '11:00',
          guests: 2,
          amount: '',
          advancePaid: 0,
          paymentMethod: 'Cash',
          specialNotes: '',
        })
        fetchBookings()
      }
    } catch (err) {
      console.error('Failed to create offline booking:', err)
      const msg = err.response?.data?.message || 'Failed to create offline booking'
      toast.error(msg)
    } finally {
      setAddLoading(false)
    }
  }

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (b.guest || '').toLowerCase().includes(q) ||
      (b.bookingId || b.id || '').toLowerCase().includes(q) ||
      (b.email || '').toLowerCase().includes(q) ||
      (b.phone || '').includes(q)
    const matchStatus = statusFilter === 'all' || b.status === statusFilter

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const matchPeriod = filterMode === 'all' || new Date(b.createdAt || b.checkIn) >= startOfMonth

    return matchSearch && matchStatus && matchPeriod
  })

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await authAxios.patch(`${API_BASE_URL}/bookings/${id}/status`, { status: newStatus })
      if (res.data.success) {
        const updated = bookings.map((b) => b.id === id ? { ...b, status: newStatus } : b)
        setBookings(updated)
        if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status: newStatus })
        toast.success(`Status updated to ${newStatus}`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    }
  }

  const handleWhatsApp = (booking, e) => {
    if (e) e.stopPropagation()
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

  const handleCancel = (booking, e) => {
    if (e) e.stopPropagation()
    if (window.confirm(`Are you sure you want to cancel booking ${booking.bookingId || booking.id}?`)) {
      updateStatus(booking.id, 'cancelled')
    }
  }

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation()
    if (window.confirm(`Are you sure you want to permanently delete booking ${bookings.find((b) => b.id === id)?.bookingId || id}? This action cannot be undone.`)) {
      try {
        const res = await authAxios.delete(`${API_BASE_URL}/bookings/${id}`)
        if (res.data.success) {
          const updated = bookings.filter((b) => b.id !== id)
          setBookings(updated)
          if (selectedBooking?.id === id) setSelectedBooking(null)
          toast.success('Booking deleted successfully')
        }
      } catch (err) {
        console.error(err)
        toast.error('Unable to delete booking. Please try again.')
      }
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Guest', 'Gender', 'DOB', 'Phone', 'Email', 'ID Type', 'ID Number',
      'Room', 'Check In', 'Check Out', 'Nights', 'Guests', 'Amount', 'Payment', 'Status', 'Booked On']
    const rows = bookings.map((b) => [
      b.bookingId || b.id, b.guest, b.gender || '', b.dob || '', b.phone, b.email,
      b.idType || '', b.idNumber || '', b.room,
      fmt(b.checkIn), fmt(b.checkOut), b.nights, b.guests,
      b.amount, b.paymentMethod, b.status, fmt(b.createdAt),
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Bookings</h2>
          <p className="font-poppins text-sm text-gray-500">{filtered.length} bookings found</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Add Offline Booking Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#D0A448] hover:bg-[#b88e36] text-navy font-poppins font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="text-base sm:text-lg font-bold leading-none">+</span> Add Offline Booking
          </button>
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
          <button onClick={exportCSV} className="flex items-center gap-2 btn-gold text-sm px-4 py-2.5">
            <FaDownload size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by guest name, booking ID, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter size={14} className="text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-field text-sm w-36">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Status' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className="hidden md:block bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-lightbg">
                {['ID', 'Guest', 'Room', 'Dates', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-3 py-3 font-poppins text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="px-3 py-3 font-poppins text-sm font-semibold text-gold whitespace-nowrap">
                      {booking.bookingId || booking.id}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-poppins text-sm font-medium text-navy">{booking.guest}</p>
                    </td>
                    <td className="px-3 py-3 font-poppins text-sm text-gray-600">
                      {booking.room}
                    </td>
                    <td className="px-3 py-3 font-poppins text-sm text-gray-600 whitespace-nowrap">
                      <div>{fmt(booking.checkIn)} - {fmt(booking.checkOut)}</div>
                      <div className="text-xs text-gray-400">{booking.nights} Night(s)</div>
                    </td>
                    <td className="px-3 py-3 font-poppins text-sm font-bold text-navy whitespace-nowrap">
                      ₹{(booking.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`font-poppins text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-gray-400 group-hover:text-gold transition-colors p-1" title="View Details">
                        <FaEye size={16} />
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
            {bookings.length === 0 ? 'No bookings yet.' : 'No bookings found matching your criteria'}
          </div>
        )}
      </div>

      {/* Mobile Card View (Hidden on medium screens and up) */}
      <div className="md:hidden space-y-4">
        {filtered.map((booking, i) => {
          const st = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-poppins text-xs text-gray-500 mb-0.5">Booking ID</p>
                  <p className="font-poppins font-bold text-gold text-sm">{booking.bookingId || booking.id}</p>
                </div>
                <span className={`font-poppins text-[10px] font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                  {st.label}
                </span>
              </div>
              
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-lightbg flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-gray-400" size={10} />
                  </div>
                  <p className="font-poppins text-sm font-medium text-navy truncate">{booking.guest}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-lightbg flex items-center justify-center flex-shrink-0">
                    <FaBed className="text-gray-400" size={10} />
                  </div>
                  <p className="font-poppins text-sm text-gray-600 truncate">{booking.room}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-lightbg flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-gray-400" size={10} />
                  </div>
                  <p className="font-poppins text-xs text-gray-500">
                    {fmt(booking.checkIn)} <span className="text-gray-300 mx-1">→</span> {fmt(booking.checkOut)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <p className="font-poppins text-xs text-gray-500">{booking.nights} Night(s)</p>
                <p className="font-poppins text-sm font-bold text-navy">₹{(booking.amount || 0).toLocaleString()}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 pt-3 border-t border-gray-100 flex gap-2">
                <button
                  onClick={(e) => handleWhatsApp(booking, e)}
                  className="flex-grow flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-poppins text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <FaWhatsapp size={14} /> WhatsApp Guest
                </button>
                <button
                  onClick={(e) => handleDelete(booking.id, e)}
                  className="flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Delete Booking"
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center font-poppins text-gray-500 text-sm">
            {bookings.length === 0 ? 'No bookings yet.' : 'No bookings found matching your criteria'}
          </div>
        )}
      </div>

      {/* Full Guest Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
            style={{ maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-navy rounded-t-xl">
              <div>
                <p className="font-poppins text-xs text-gray-400 uppercase tracking-wider">Booking ID</p>
                <h3 className="font-playfair font-bold text-gold text-xl">{selectedBooking.bookingId || selectedBooking.id}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-poppins text-xs font-medium px-3 py-1 rounded-full
                  ${STATUS_STYLES[selectedBooking.status]?.bg} ${STATUS_STYLES[selectedBooking.status]?.text}`}>
                  {STATUS_STYLES[selectedBooking.status]?.label}
                </span>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white transition-colors">
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">

              {/* Guest Info */}
              <div>
                <p className="font-poppins text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaUser size={10} className="text-gold" /> Guest Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-sm bg-lightbg rounded-lg p-4">
                  {[
                    { icon: FaUser,          label: 'Full Name',   value: selectedBooking.guest },
                    { icon: FaVenusMars,     label: 'Gender',      value: selectedBooking.gender || '—' },
                    { icon: FaBirthdayCake,  label: 'Date of Birth', value: selectedBooking.dob
                      ? `${fmt(selectedBooking.dob)} (Age: ${getAge(selectedBooking.dob)})`
                      : '—' },
                    { icon: FaPhoneAlt,      label: 'Phone',       value: selectedBooking.phone },
                    { icon: FaEnvelope,      label: 'Email',       value: selectedBooking.email },
                    { icon: null,            label: 'Address',     value: selectedBooking.address || '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                        {Icon && <Icon size={9} className="text-gold" />} {label}
                      </p>
                      <p className="font-medium text-navy text-sm break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ID Proof */}
              <div>
                <p className="font-poppins text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaIdCard size={10} className="text-gold" /> ID Proof
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-sm bg-lightbg rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">ID Type</p>
                    <p className="font-medium text-navy">{selectedBooking.idType || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">ID Number</p>
                    <p className="font-medium text-navy break-all font-mono">{selectedBooking.idNumber || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div>
                <p className="font-poppins text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaBed size={10} className="text-gold" /> Stay Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-sm bg-lightbg rounded-lg p-4">
                  {[
                    { label: 'Room Type',  value: selectedBooking.room },
                    { label: 'Guests',     value: selectedBooking.guests },
                    { label: 'Check In',   value: `${fmt(selectedBooking.checkIn)} (${selectedBooking.checkInTime || '12:00 PM'})` },
                    { label: 'Check Out',  value: `${fmt(selectedBooking.checkOut)} (${selectedBooking.checkOutTime || '11:00 AM'})` },
                    { label: 'Nights',     value: selectedBooking.nights },
                    { label: 'Booked On',  value: fmt(selectedBooking.createdAt) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                        <FaCalendarAlt size={9} className="text-gold" /> {label}
                      </p>
                      <p className="font-medium text-navy break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="font-poppins text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaMoneyBillWave size={10} className="text-gold" /> Payment
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-sm bg-lightbg rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                    <p className="font-bold text-gold text-lg">₹{(selectedBooking.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
                    <p className="font-medium text-navy capitalize">
                      {selectedBooking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel' : selectedBooking.paymentMethod}
                    </p>
                  </div>
                  {selectedBooking.specialRequests && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-0.5">Special Requests</p>
                      <p className="font-medium text-navy break-words">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Status */}
              <div className="border-t pt-4">
                <p className="font-poppins text-sm font-semibold text-gray-700 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'cancelled'].map((s) => (
                    <button key={s} onClick={() => updateStatus(selectedBooking.id, s)}
                      className={`font-poppins text-xs px-4 py-1.5 rounded-full border transition-colors capitalize
                        ${selectedBooking.status === s
                          ? 'bg-gold text-white border-gold'
                          : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => handleWhatsApp(selectedBooking)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-poppins text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <FaWhatsapp size={16} /> WhatsApp Guest
                </button>
                <button
                  onClick={() => handleDelete(selectedBooking.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-poppins text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  <FaTrashAlt size={14} /> Delete Booking
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Add Offline Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-[#C9A227] font-bold text-lg leading-none">+</span>
                <h3 className="font-playfair font-bold text-navy text-xl">
                  Add Offline Booking
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-navy transition-colors p-1"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOfflineBooking} className="p-6 space-y-4 overflow-y-auto font-poppins text-xs">
              {/* Customer Name */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addForm.guestName}
                  onChange={(e) => setAddForm({ ...addForm, guestName: e.target.value })}
                  placeholder="Name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="e.g. guest@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={addForm.roomSlug}
                  onChange={(e) => setAddForm({ ...addForm, roomSlug: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold cursor-pointer text-slate-700 bg-white"
                >
                  <option value="deluxe-ac-room">Deluxe AC Room</option>
                  <option value="normal-ac-room">Normal AC Room</option>
                  <option value="non-ac-room">Non AC Room</option>
                </select>
              </div>

              {/* Number of Rooms */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={addForm.roomsCount}
                  onChange={(e) => setAddForm({ ...addForm, roomsCount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Check-In Date */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Check-In Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={addForm.checkIn}
                  onChange={(e) => setAddForm({ ...addForm, checkIn: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Check-In Time */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Check-In Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={addForm.checkInTime}
                  onChange={(e) => setAddForm({ ...addForm, checkInTime: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Check-Out Date */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Check-Out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={addForm.checkOut}
                  onChange={(e) => setAddForm({ ...addForm, checkOut: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Check-Out Time */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Check-Out Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={addForm.checkOutTime}
                  onChange={(e) => setAddForm({ ...addForm, checkOutTime: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={addForm.guests}
                  onChange={(e) => setAddForm({ ...addForm, guests: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Number of Rooms */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={addForm.roomsCount}
                  onChange={(e) => setAddForm({ ...addForm, roomsCount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Room Charge (₹) * (before GST) */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Room Charge (₹) <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(before GST)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={addForm.amount}
                  onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                  placeholder="Enter room charge amount"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Advance Paid (₹) */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Advance Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={addForm.advancePaid}
                  onChange={(e) => setAddForm({ ...addForm, advancePaid: e.target.value })}
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700"
                />
              </div>

              {/* Payment Method (for Advance) */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Payment Method <span className="text-slate-400 font-normal">(for Advance)</span>
                </label>
                <select
                  value={addForm.paymentMethod}
                  onChange={(e) => setAddForm({ ...addForm, paymentMethod: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold cursor-pointer text-slate-700 bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1.5">
                  Special Notes
                </label>
                <input
                  type="text"
                  value={addForm.specialNotes}
                  onChange={(e) => setAddForm({ ...addForm, specialNotes: e.target.value })}
                  placeholder="Offline Booking pre-filled for Room"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="w-full py-3.5 bg-[#C9A227] hover:bg-[#b59120] text-white font-poppins font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  {addLoading ? 'Confirming...' : 'Confirm Offline Booking'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
