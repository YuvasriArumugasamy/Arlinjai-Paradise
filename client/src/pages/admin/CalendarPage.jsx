import { useState, useMemo, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight, FaThumbtack, FaCalendarAlt, FaUsers, FaPhoneAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../../constants'

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const toDateStr = (date) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - (offset * 60 * 1000))
  return local.toISOString().split('T')[0]
}
const todayStr = toDateStr(new Date())

const STATUS_STYLES = {
  confirmed:    { bg: 'bg-blue-500',   text: 'text-white',   label: 'Confirmed' },
  pending:      { bg: 'bg-yellow-500', text: 'text-navy',    label: 'Pending' },
  'checked-in': { bg: 'bg-green-600',  text: 'text-white',   label: 'Checked In' },
  'checked-out':{ bg: 'bg-gray-400',   text: 'text-white',   label: 'Checked Out' },
  cancelled:    { bg: 'bg-red-400',    text: 'text-white',   label: 'Cancelled' },
}

export default function CalendarPage() {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(todayStr)
  const [selectedRoomType, setSelectedRoomType] = useState('All')
  const [bookings, setBookings] = useState([])
  const [roomAssignments, setRoomAssignments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('arlinjai_room_assignments') || '{}')
    } catch {
      return {}
    }
  })

  const [loading, setLoading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingModalData, setBookingModalData] = useState({
    name: '',
    phone: '',
    email: '',
    roomType: 'deluxe-ac',
    numRooms: 1,
    checkIn: '',
    checkInTime: '12:00',
    checkOut: '',
    checkOutTime: '11:00',
    guests: 2,
    advancePaid: 0,
    paymentMethod: 'Cash',
    notes: '',
    physicalRoomId: '',
    physicalRoomName: '',
  })

  const handleCellClick = (room, dateStr) => {
    const typeMap = {
      'Deluxe AC': 'deluxe-ac',
      'Normal AC': 'normal-ac',
      'Non AC': 'non-ac'
    }
    const roomTypeId = typeMap[room.type] || 'deluxe-ac';
    const nextDay = new Date(dateStr + 'T00:00:00')
    nextDay.setDate(nextDay.getDate() + 1)
    const checkOutStr = toDateStr(nextDay)

    setBookingModalData({
      name: '',
      phone: '',
      email: '',
      roomType: roomTypeId,
      numRooms: 1,
      checkIn: dateStr,
      checkInTime: '12:00',
      checkOut: checkOutStr,
      checkOutTime: '11:00',
      guests: 2,
      advancePaid: 0,
      paymentMethod: 'Cash',
      notes: `Offline Booking pre-filled for ${room.name}`,
      physicalRoomId: room.id,
      physicalRoomName: room.name,
    })
    setShowBookingModal(true)
  }

  const handleConfirmBooking = async (e) => {
    e.preventDefault()
    if (!bookingModalData.name || !bookingModalData.phone || !bookingModalData.checkIn || !bookingModalData.checkOut) {
      toast.error('Please fill in all required fields')
      return
    }

    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    setLoading(true)

    // Calculate nights
    const diff = new Date(bookingModalData.checkOut) - new Date(bookingModalData.checkIn)
    const nights = Math.max(1, Math.floor(diff / 86400000))

    // Map roomTypeId to category prices
    const categoryPrices = {
      'deluxe-ac': 2500,
      'normal-ac': 2000,
      'non-ac': 1500
    }
    const pricePerNight = categoryPrices[bookingModalData.roomType] || 1500
    const basePrice = pricePerNight * nights
    const gstAmount = Math.round(basePrice * 0.12)
    const totalPrice = basePrice + gstAmount

    const payload = {
      roomId: bookingModalData.roomType,
      checkIn: bookingModalData.checkIn,
      checkOut: bookingModalData.checkOut,
      checkInTime: bookingModalData.checkInTime,
      checkOutTime: bookingModalData.checkOutTime,
      guests: bookingModalData.guests,
      name: bookingModalData.name,
      phone: bookingModalData.phone,
      email: bookingModalData.email,
      address: 'Offline Booking',
      paymentMethod: bookingModalData.paymentMethod.toLowerCase() === 'cash' ? 'cash' : bookingModalData.paymentMethod.toLowerCase() === 'upi' ? 'upi' : 'card',
      specialRequests: bookingModalData.notes,
      advancePaid: Number(bookingModalData.advancePaid),
      status: 'confirmed'
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/bookings`, payload, { headers })
      if (res.data.success) {
        const newBooking = res.data.booking
        const newBookingId = newBooking.bookingId || newBooking._id
        
        // Add to calendar local state
        const mappedNewBooking = {
          id: newBookingId,
          guest: newBooking.guest?.name || newBooking.guest || bookingModalData.name,
          room: newBooking.roomSnapshot?.name || newBooking.room?.name || (bookingModalData.roomType === 'deluxe-ac' ? 'Deluxe AC Room' : bookingModalData.roomType === 'normal-ac' ? 'Normal AC Room' : 'Non AC Room'),
          checkIn: bookingModalData.checkIn,
          checkOut: bookingModalData.checkOut,
          nights: nights,
          guests: bookingModalData.guests,
          amount: totalPrice,
          status: 'confirmed',
          phone: bookingModalData.phone,
        }
        setBookings(prev => [mappedNewBooking, ...prev])

        // Save physical room assignment locally for calendar room mapping
        const updatedAssignments = { ...roomAssignments, [newBookingId]: bookingModalData.physicalRoomId }
        setRoomAssignments(updatedAssignments)
        localStorage.setItem('arlinjai_room_assignments', JSON.stringify(updatedAssignments))

        toast.success('Booking created successfully!')
        setShowBookingModal(false)
      } else {
        toast.error(res.data.message || 'Failed to create booking')
      }
    } catch (err) {
      console.error(err)
      toast.error('Unable to create booking on server. Please check your network and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Generate 14 days dynamically from startDate
  const days = useMemo(() => {
    const base = new Date(startDate + 'T00:00:00')
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return {
        day: DAY_NAMES[d.getDay()],
        date: `${String(d.getDate()).padStart(2, '0')} ${MONTH_NAMES[d.getMonth()]}`,
        dateStr: toDateStr(d),
        isToday: toDateStr(d) === todayStr,
      }
    })
  }, [startDate])

  const navigate14 = (dir) => {
    const base = new Date(startDate + 'T00:00:00')
    base.setDate(base.getDate() + dir * 14)
    setStartDate(toDateStr(base))
  }

  const goToToday = () => setStartDate(todayStr)

  const rooms = [
    { id: '101', name: 'Room 101', type: 'Deluxe AC', typeColor: 'text-blue-500' },
    { id: '102', name: 'Room 102', type: 'Deluxe AC', typeColor: 'text-blue-500' },
    { id: '103', name: 'Room 103', type: 'Deluxe AC', typeColor: 'text-blue-500' },
    { id: '104', name: 'Room 104', type: 'Deluxe AC', typeColor: 'text-blue-500' },
    { id: '105', name: 'Room 105', type: 'Deluxe AC', typeColor: 'text-blue-500' },
    { id: '201', name: 'Room 201', type: 'Normal AC', typeColor: 'text-cyan-500' },
    { id: '301', name: 'Room 301', type: 'Normal AC', typeColor: 'text-cyan-500' },
    { id: '302', name: 'Room 302', type: 'Normal AC', typeColor: 'text-cyan-500' },
    { id: '303', name: 'Room 303', type: 'Normal AC', typeColor: 'text-cyan-500' },
    { id: '304', name: 'Room 304', type: 'Normal AC', typeColor: 'text-cyan-500' },
    { id: '305', name: 'Room 305', type: 'Normal AC', typeColor: 'text-cyan-500' },
    { id: '202', name: 'Room 202', type: 'Non AC', typeColor: 'text-amber-500' },
    { id: '203', name: 'Room 203', type: 'Non AC', typeColor: 'text-amber-500' },
    { id: '204', name: 'Room 204', type: 'Non AC', typeColor: 'text-amber-500' },
    { id: '205', name: 'Room 205', type: 'Non AC', typeColor: 'text-amber-500' },
  ]

  const filteredRooms = selectedRoomType === 'All'
    ? rooms
    : rooms.filter(room => room.type === selectedRoomType)

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      try {
        const res = await axios.get(`${API_BASE_URL}/bookings?limit=100`, { headers })
        if (res.data.success) {
          const mapped = res.data.bookings.map(b => ({
            id: b.bookingId || b._id,
            guest: b.guest?.name || b.guest || '—',
            room: b.roomSnapshot?.name || b.room?.name || '—',
            checkIn: toDateStr(new Date(b.checkIn)),
            checkOut: toDateStr(new Date(b.checkOut)),
            nights: b.nights,
            guests: b.guests,
            amount: b.pricing?.finalAmount || 0,
            status: b.status,
            phone: b.guest?.phone || b.phone || '',
          }))
          setBookings(mapped)
        }
      } catch {
        toast.error('Unable to load calendar bookings from the server. Please check your network and login status.')
      }
    }
    fetchBookings()
  }, [])

  const daysList = days.map(d => d.dateStr)
  const minDate = daysList[0]
  const maxDate = daysList[daysList.length - 1]

  const overlappingBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'cancelled') return false
      return b.checkIn <= maxDate && b.checkOut >= minDate
    })
  }, [bookings, minDate, maxDate])

  const allocations = useMemo(() => {
    return overlappingBookings.filter(b => !roomAssignments[b.id]).map(b => ({
      id: b.id,
      name: b.guest,
      type: b.room,
      dates: `${new Date(b.checkIn).toLocaleDateString('en-IN')} to ${new Date(b.checkOut).toLocaleDateString('en-IN')}`,
      guests: `${b.guests} Guest(s)`,
      phone: b.phone || '—',
      booking: b,
    }))
  }, [overlappingBookings, roomAssignments])

  const handleAssignRoom = (bookingId, roomId) => {
    if (!roomId) return
    const updated = { ...roomAssignments, [bookingId]: roomId }
    setRoomAssignments(updated)
    localStorage.setItem('arlinjai_room_assignments', JSON.stringify(updated))
    toast.success('Room assigned successfully')
  }

  const handleUnassignRoom = (bookingId) => {
    const updated = { ...roomAssignments }
    delete updated[bookingId]
    setRoomAssignments(updated)
    localStorage.setItem('arlinjai_room_assignments', JSON.stringify(updated))
    toast.success('Room unassigned')
  }

  return (
    <div className="flex flex-col gap-6 font-poppins">
      
      {/* Main Calendar Card — full width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate14(-1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaChevronLeft size={10} /> Prev 14 Days
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => navigate14(1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              Next 14 Days <FaChevronRight size={10} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 sm:ml-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Start Date:</span>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 outline-none"
              />
            </div>
            <div>
              <select 
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 outline-none font-medium"
              >
                <option value="All">All Room Types</option>
                <option value="Deluxe AC">Deluxe AC</option>
                <option value="Normal AC">Normal AC</option>
                <option value="Non AC">Non AC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid Area — scrollable horizontally, full vertical */}
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '540px' }}>
          <div className="min-w-[1000px] border-b border-gray-100 flex">
            {/* Rooms Header */}
            <div className="w-48 flex-shrink-0 border-r border-gray-100 p-3 bg-gray-50 flex items-end">
              <span className="text-sm font-semibold text-gray-700">Rooms ({filteredRooms.length})</span>
            </div>
            
            {/* Days Header */}
            <div className="flex flex-1">
              {days.map((d, i) => (
                <div key={i} className={`flex-1 min-w-[70px] flex flex-col items-center justify-center p-2 border-r border-gray-100 ${d.isToday ? 'border-t-2 border-t-gold' : ''}`}>
                  <span className={`text-[10px] font-bold ${d.isToday ? 'text-gold' : 'text-gray-400'}`}>{d.day}</span>
                  <span className={`text-xs font-semibold ${d.isToday ? 'text-navy' : 'text-gray-700'}`}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Rows */}
          <div className="flex flex-col">
            {filteredRooms.map((room) => (
              <div key={room.id} className="flex border-b border-gray-100 hover:bg-gray-50">
                {/* Room Info */}
                <div className="w-48 flex-shrink-0 border-r border-gray-100 p-3 flex flex-col justify-center">
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-gray-400 text-xs">🛏️</span> {room.name}
                  </span>
                  <span className={`text-[10px] font-semibold mt-0.5 ${room.typeColor || 'text-gray-500'}`}>
                    {room.type}
                  </span>
                </div>
                
                {/* Day Cells */}
                <div className="flex flex-1">
                  {days.map((d, di) => {
                    const dateStr = d.dateStr
                    // Check if there is an overlapping booking assigned to this physical room on this dateStr
                    const activeBooking = overlappingBookings.find(b => {
                      return roomAssignments[b.id] === room.id && dateStr >= b.checkIn && dateStr < b.checkOut
                    })

                    if (activeBooking) {
                      const isStart = activeBooking.checkIn === dateStr
                      const st = STATUS_STYLES[activeBooking.status] || { bg: 'bg-blue-500', text: 'text-white' }
                      return (
                        <div 
                          key={di}
                          onClick={() => {
                            if (window.confirm(`Unassign room for booking of ${activeBooking.guest}?`)) {
                              handleUnassignRoom(activeBooking.id)
                            }
                          }}
                          className={`flex-1 min-w-[70px] border-r border-gray-100 flex items-center justify-center p-1 text-center font-poppins text-[10px] cursor-pointer transition-all hover:opacity-90 ${st.bg} ${st.text}`}
                          title={`Guest: ${activeBooking.guest}\nDates: ${activeBooking.checkIn} to ${activeBooking.checkOut}\nStatus: ${activeBooking.status}\nClick to Unassign`}
                        >
                          <span className="truncate max-w-[65px] font-semibold">
                            {isStart ? activeBooking.guest : '•••'}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <div 
                        key={di} 
                        onClick={() => handleCellClick(room, dateStr)}
                        className="flex-1 min-w-[70px] border-r border-gray-100 flex items-center justify-center cursor-pointer group hover:bg-gray-50"
                      >
                        <span className="text-[10px] font-medium text-gray-300 group-hover:text-green-500 transition-colors">
                          + Book
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* end Grid Area */}

      </div>
      {/* end Calendar Card */}

      {/* Room Allocations — below calendar, full width */}
      <div className="bg-white rounded-xl shadow-sm border border-gold border-opacity-30 p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <FaThumbtack className="text-red-500" />
            <h3 className="font-playfair font-bold text-navy text-lg">Room Allocations</h3>
          </div>
          
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Bookings in this 14-day window that are confirmed but do not have an assigned physical room number. Assign them below:
          </p>

          <div className="space-y-4">
            {allocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <FaCalendarAlt className="text-gray-300" size={24} />
                </div>
                <h4 className="font-poppins font-medium text-sm text-gray-700 mb-1">All Caught Up!</h4>
                <p className="text-xs text-gray-500">No pending room allocations at the moment.</p>
              </div>
            ) : (
              allocations.map((alloc, idx) => (
                <div key={idx} className="border border-blue-100 bg-[#fbfdff] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-navy">{alloc.name}</h4>
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{alloc.type}</span>
                  </div>
                  
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FaCalendarAlt className="text-blue-400" size={10} />
                      <span>{alloc.dates}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FaUsers className="text-blue-400" size={10} />
                      <span>{alloc.guests}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FaPhoneAlt className="text-red-400" size={10} />
                      <span>{alloc.phone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">AVAILABLE ROOMS</span>
                    <select 
                      onChange={(e) => handleAssignRoom(alloc.id, e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 outline-none cursor-pointer"
                    >
                      <option value="">-- Select a Room --</option>
                      {rooms.filter(r => r.type === alloc.type).map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      {/* Add Offline Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto font-poppins">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-playfair font-bold text-navy text-xl flex items-center gap-2">
                <span className="text-gold font-poppins">+</span> Add Offline Booking
              </h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmBooking} className="space-y-4 text-left">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Name"
                  value={bookingModalData.name}
                  onChange={(e) => setBookingModalData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 9876543210"
                    value={bookingModalData.phone}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. guest@example.com"
                    value={bookingModalData.email}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Room Type & Number of Rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Room Type *</label>
                  <select 
                    value={bookingModalData.roomType}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, roomType: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-medium"
                  >
                    <option value="deluxe-ac">Deluxe AC Room</option>
                    <option value="normal-ac">Normal AC Room</option>
                    <option value="non-ac">Non AC Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Rooms</label>
                  <input 
                    type="number" 
                    min="1"
                    value={bookingModalData.numRooms}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, numRooms: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Check-In Date & Check-In Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-In Date *</label>
                  <input 
                    type="date" 
                    required
                    value={bookingModalData.checkIn}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-In Time *</label>
                  <input 
                    type="time" 
                    required
                    value={bookingModalData.checkInTime}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, checkInTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Check-Out Date & Check-Out Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-Out Date *</label>
                  <input 
                    type="date" 
                    required
                    value={bookingModalData.checkOut}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-Out Time *</label>
                  <input 
                    type="time" 
                    required
                    value={bookingModalData.checkOutTime}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Guests & Advance Paid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Guests</label>
                  <input 
                    type="number" 
                    min="1"
                    value={bookingModalData.guests}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, guests: parseInt(e.target.value) || 2 }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Advance Paid (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={bookingModalData.advancePaid}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, advancePaid: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Payment Method & Special Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Method (for Advance)</label>
                  <select 
                    value={bookingModalData.paymentMethod}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-medium"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Special Notes</label>
                  <input 
                    type="text" 
                    placeholder="Special requests or notes"
                    value={bookingModalData.notes}
                    onChange={(e) => setBookingModalData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9A227] hover:bg-[#A07D10] text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Offline Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
