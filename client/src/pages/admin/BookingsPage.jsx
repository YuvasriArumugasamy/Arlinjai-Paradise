import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaSearch, FaFilter, FaEye, FaTimes, FaDownload,
  FaUser, FaPhoneAlt, FaEnvelope, FaBed, FaCalendarAlt,
  FaIdCard, FaVenusMars, FaBirthdayCake, FaMoneyBillWave,
  FaWhatsapp, FaTimesCircle, FaTrashAlt, FaEdit, FaPrint
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authAxios } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'
import signatureImg from './image.png'

const STATUS_STYLES = {
  confirmed:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Confirmed' },
  pending:      { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  'checked-in': { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Checked In' },
  'checked-out':{ bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Checked Out' },
  cancelled:    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelled' },
}

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']

const rooms = [
  { id: '101', name: 'Room 101', type: 'Deluxe AC' },
  { id: '102', name: 'Room 102', type: 'Deluxe AC' },
  { id: '103', name: 'Room 103', type: 'Deluxe AC' },
  { id: '104', name: 'Room 104', type: 'Deluxe AC' },
  { id: '105', name: 'Room 105', type: 'Deluxe AC' },
  { id: '201', name: 'Room 201', type: 'Normal AC' },
  { id: '301', name: 'Room 301', type: 'Normal AC' },
  { id: '302', name: 'Room 302', type: 'Normal AC' },
  { id: '303', name: 'Room 303', type: 'Normal AC' },
  { id: '304', name: 'Room 304', type: 'Normal AC' },
  { id: '305', name: 'Room 305', type: 'Normal AC' },
  { id: '202', name: 'Room 202', type: 'Non AC' },
  { id: '203', name: 'Room 203', type: 'Non AC' },
  { id: '204', name: 'Room 204', type: 'Non AC' },
  { id: '205', name: 'Room 205', type: 'Non AC' },
]

const slugToCategoryType = {
  'deluxe-ac-room': 'Deluxe AC',
  'normal-ac-room': 'Normal AC',
  'non-ac-room': 'Non AC'
}

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

const STATE_CODES = {
  'tamil nadu': '33', 'tn': '33',
  'delhi': '07', 'new delhi': '07',
  'kerala': '32', 'kl': '32',
  'karnataka': '29', 'ka': '29',
  'andhra pradesh': '37', 'ap': '37',
  'telangana': '36', 'tg': '36',
  'maharashtra': '27', 'mh': '27',
  'pondicherry': '34', 'puducherry': '34',
  'goa': '30', 'ga': '30',
  'gujarat': '24', 'gj': '24',
  'rajasthan': '08', 'rj': '08',
  'west bengal': '19', 'wb': '19',
  'uttar pradesh': '09', 'up': '09',
  'bihar': '10', 'br': '10',
  'madhya pradesh': '23', 'mp': '23',
  'punjab': '03', 'pb': '03',
  'haryana': '06', 'hr': '06',
};

const getStateWithCode = (address) => {
  if (!address) return { name: 'Tamil Nadu', code: '33' };
  const clean = address.toLowerCase();
  for (const [state, code] of Object.entries(STATE_CODES)) {
    if (clean.includes(state)) {
      const name = state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { name, code };
    }
  }
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    const nameCandidate = parts[parts.length - 2] || parts[parts.length - 1];
    if (nameCandidate) {
      const name = nameCandidate.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { name, code: '33' };
    }
  }
  return { name: 'Tamil Nadu', code: '33' };
};

const formatDateDDMMYYYY = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTimeHHMM = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampmLabel = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');
  return `${hoursStr}:${minutes} ${ampmLabel}`;
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
};

const formatDateOrdinal = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
};

const numberToWords = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convertThousands = (n) => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)];
        if (n % 10 > 0) {
          str += '-' + a[n % 10];
        }
      }
    }
    return str.trim();
  };
  
  let parts = [];
  let units = num % 1000;
  let remaining = Math.floor(num / 1000);
  
  let thousands = remaining % 100;
  remaining = Math.floor(remaining / 100);
  
  let lakhs = remaining % 100;
  let crores = Math.floor(remaining / 100);
  
  if (crores > 0) {
    parts.push(convertThousands(crores) + ' Crore');
  }
  if (lakhs > 0) {
    parts.push(convertThousands(lakhs) + ' Lakh');
  }
  if (thousands > 0) {
    parts.push(convertThousands(thousands) + ' Thousand');
  }
  if (units > 0) {
    parts.push(convertThousands(units));
  }
  
  return parts.join(' ').trim() + ' Rupees only';
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterMode, setFilterMode] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [activePrintBooking, setActivePrintBooking] = useState(null)

  const handlePrintBooking = (booking, e) => {
    if (e) e.stopPropagation()
    setActivePrintBooking(booking)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  // Offline Booking Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingBookingId, setEditingBookingId] = useState(null)
  
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
    children: 0,
    extraBeds: 0,
    amount: '',
    advancePaid: 0,
    paymentMethod: 'Cash',
    specialNotes: '',
    taxType: 'without_tax',
    selectedPhysicalRooms: [],
  })

  const mapSingleBooking = (b) => {
    const rawAmt = b.pricing?.finalAmount ?? b.pricing?.totalAmount ?? b.amount ?? 0
    const rAmt = b.roomAmount ?? b.pricing?.roomAmount ?? (rawAmt ? Math.round(rawAmt / 1.12) : 0)
    const totAmt = b.pricing?.finalAmount ?? (rAmt ? rAmt + Math.round(rAmt * 0.12) : rawAmt)
    const advPaid = b.advancePaid ?? b.pricing?.advancePaid ?? 0

    return {
      id: b._id || b.bookingId,
      bookingId: b.bookingId || b._id,
      guest: typeof b.guest === 'string' ? b.guest : (b.guest?.name || '—'),
      gender: typeof b.guest === 'object' ? (b.guest?.gender || '') : (b.gender || ''),
      dob: typeof b.guest === 'object' ? (b.guest?.dob || '') : (b.dob || ''),
      email: typeof b.guest === 'object' ? (b.guest?.email || '') : (b.email || ''),
      phone: typeof b.guest === 'object' ? (b.guest?.phone || '') : (b.phone || ''),
      idType: typeof b.guest === 'object' ? (b.guest?.idType || '') : (b.idType || ''),
      idNumber: typeof b.guest === 'object' ? (b.guest?.idNumber || '') : (b.idNumber || ''),
      address: typeof b.guest === 'object' ? (b.guest?.address || '') : (b.address || ''),
      room: b.roomSnapshot?.name || (typeof b.room === 'string' ? b.room : b.room?.name) || '—',
      checkIn: b.checkIn,
      checkInTime: b.checkInTime || '12:00 PM',
      checkOut: b.checkOut,
      checkOutTime: b.checkOutTime || '11:00 AM',
      nights: b.nights,
      guests: b.guests,
      children: b.children || 0,
      extraBeds: b.extraBeds ?? 0,
      amount: totAmt,
      roomAmount: rAmt,
      advancePaid: advPaid,
      paymentMethod: b.paymentMethod || 'pay_at_hotel',
      specialRequests: b.specialRequests || '',
      taxType: b.taxType || b.pricing?.taxType || 'without_tax',
      gstAmount: b.gstAmount || b.pricing?.gstAmount || 0,
      assignedRoom: b.assignedRoom || null,
      numRooms: b.numRooms || 1,
      status: b.status,
      createdAt: b.createdAt
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await authAxios.get(`${API_BASE_URL}/bookings?limit=100`)
      if (res.data.success) {
        const mapped = res.data.bookings.map(mapSingleBooking)
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

  const resetAddForm = () => {
    setIsEditMode(false)
    setEditingBookingId(null)
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
      children: 0,
      extraBeds: 0,
      amount: '',
      advancePaid: 0,
      paymentMethod: 'Pay at Hotel',
      specialNotes: '',
      taxType: 'without_tax',
      selectedPhysicalRooms: [],
    })
  }

  const getRoomSlugFromName = (name) => {
    const map = {
      'Deluxe AC Room': 'deluxe-ac-room',
      'Normal AC Room': 'normal-ac-room',
      'Non AC Room': 'non-ac-room',
    }
    return map[name] || 'deluxe-ac-room'
  }

  const openEditModal = (booking) => {
    setIsEditMode(true)
    setEditingBookingId(booking.id)
    setShowAddModal(true)
    const initialAssigned = booking.assignedRoom ? booking.assignedRoom.split(',').map(s => s.trim()) : []
    setAddForm({
      guestName: booking.guest || '',
      phone: booking.phone || '',
      email: booking.email || '',
      roomSlug: getRoomSlugFromName(booking.room),
      roomsCount: booking.roomsCount || booking.numRooms || 1,
      checkIn: booking.checkIn ? new Date(booking.checkIn).toISOString().slice(0, 10) : getTodayISO(),
      checkInTime: booking.checkInTime || '12:00',
      checkOut: booking.checkOut ? new Date(booking.checkOut).toISOString().slice(0, 10) : getTomorrowISO(),
      checkOutTime: booking.checkOutTime || '11:00',
      guests: booking.guests || 1,
      children: booking.children || 0,
      extraBeds: booking.extraBeds || 0,
      amount: booking.roomAmount || booking.amount || '',
      advancePaid: booking.advancePaid || 0,
      paymentMethod: booking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel'
        : booking.paymentMethod === 'cash' ? 'Cash'
        : booking.paymentMethod === 'upi' ? 'UPI'
        : booking.paymentMethod === 'card' ? 'Card'
        : booking.paymentMethod === 'bank_transfer' ? 'Bank Transfer'
        : 'Pay at Hotel',
      specialNotes: booking.specialRequests || '',
      taxType: booking.taxType || 'without_tax',
      selectedPhysicalRooms: initialAssigned,
    })
  }

  const getOccupiedRoomIds = (checkIn, checkOut, excludeBookingId = null) => {
    if (!checkIn || !checkOut) return new Set()
    const occupied = new Set()
    bookings.forEach(b => {
      if (b.status === 'cancelled') return
      if (excludeBookingId && (b.id === excludeBookingId || b.bookingId === excludeBookingId)) return
      const isOverlap = b.checkIn < checkOut && b.checkOut > checkIn
      if (isOverlap && b.assignedRoom) {
        b.assignedRoom.split(',').forEach(r => {
          const trimmed = r.trim()
          if (trimmed) occupied.add(trimmed)
        })
      }
    })
    return occupied
  }

  const handleNumRoomsChange = (newVal) => {
    const count = Math.max(1, parseInt(newVal, 10) || 1)
    const categoryType = slugToCategoryType[addForm.roomSlug] || 'Deluxe AC'
    const occupiedSet = getOccupiedRoomIds(addForm.checkIn, addForm.checkOut, editingBookingId)
    const categoryRooms = rooms.filter(r => r.type === categoryType)

    let updatedSelected = (addForm.selectedPhysicalRooms || []).filter(id => {
      const rm = categoryRooms.find(r => r.id === id)
      return rm && !occupiedSet.has(id)
    })

    if (updatedSelected.length < count) {
      categoryRooms.forEach(rm => {
        if (updatedSelected.length < count && !occupiedSet.has(rm.id) && !updatedSelected.includes(rm.id)) {
          updatedSelected.push(rm.id)
        }
      })
    } else if (updatedSelected.length > count) {
      updatedSelected = updatedSelected.slice(0, count)
    }

    setAddForm(prev => ({
      ...prev,
      roomsCount: count,
      selectedPhysicalRooms: updatedSelected
    }))
  }

  const handleRoomTypeChange = (newSlug) => {
    const categoryType = slugToCategoryType[newSlug] || 'Deluxe AC'
    const occupiedSet = getOccupiedRoomIds(addForm.checkIn, addForm.checkOut, editingBookingId)
    const categoryRooms = rooms.filter(r => r.type === categoryType)
    const count = addForm.roomsCount || 1

    const availableRooms = categoryRooms.filter(r => !occupiedSet.has(r.id)).map(r => r.id)
    const updatedSelected = availableRooms.slice(0, count)

    setAddForm(prev => ({
      ...prev,
      roomSlug: newSlug,
      selectedPhysicalRooms: updatedSelected
    }))
  }

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
        'Pay at Hotel': 'pay_at_hotel',
        'Cash': 'cash',
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
        guests: parseInt(addForm.guests || 2, 10),
        children: parseInt(addForm.children || 0, 10),
        extraBeds: parseInt(addForm.extraBeds || 0, 10),
        roomAmount: addForm.amount !== '' && !isNaN(addForm.amount) ? parseFloat(addForm.amount) : undefined,
        advancePaid: parseFloat(addForm.advancePaid || 0),
        paymentMethod: pMethodMap[addForm.paymentMethod] || 'pay_at_hotel',
        specialRequests: addForm.specialNotes,
        taxType: addForm.taxType || 'without_tax',
        numRooms: parseInt(addForm.roomsCount || 1, 10),
        assignedRoom: (addForm.selectedPhysicalRooms || []).join(', ') || null,
        status: 'confirmed',
      }

      const res = isEditMode && editingBookingId
        ? await authAxios.patch(`${API_BASE_URL}/bookings/${editingBookingId}`, payload)
        : await authAxios.post(`${API_BASE_URL}/bookings`, { ...payload, status: 'confirmed' })
      if (res.data.success) {
        toast.success(isEditMode ? 'Offline booking updated successfully!' : 'Offline booking confirmed successfully!')
        setShowAddModal(false)
        resetAddForm()
        fetchBookings()
        const createdBkg = res.data.booking ? mapSingleBooking(res.data.booking) : null
        if (createdBkg) {
          setSelectedBooking(createdBkg)
        } else if (isEditMode && selectedBooking?.id === editingBookingId) {
          setSelectedBooking(null)
        }
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
      'Room', 'Check In', 'Check Out', 'Nights', 'Adults', 'Children', 'Amount', 'Payment', 'Status', 'Booked On']
    const rows = bookings.map((b) => [
      b.bookingId || b.id, b.guest, b.gender || '', b.dob || '', b.phone, b.email,
      b.idType || '', b.idNumber || '', b.room,
      fmt(b.checkIn), fmt(b.checkOut), b.nights, b.guests, b.children || 0,
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
            onClick={() => {
              resetAddForm()
              setShowAddModal(true)
            }}
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
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="text-gray-400 hover:text-gold transition-colors p-1 cursor-pointer"
                          title="View Details"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-navy transition-colors p-1 cursor-pointer"
                          title="Print / Download PDF Confirmation"
                          onClick={(e) => handlePrintBooking(booking, e)}
                        >
                          <FaPrint size={15} />
                        </button>
                      </div>
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
                  onClick={(e) => handlePrintBooking(booking, e)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-navy hover:bg-navy/90 text-white font-poppins text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <FaPrint size={13} /> PDF
                </button>
                <button
                  onClick={(e) => handleWhatsApp(booking, e)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-poppins text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <FaWhatsapp size={13} /> WhatsApp
                </button>
                <button
                  onClick={(e) => handleDelete(booking.id, e)}
                  className="flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Delete Booking"
                >
                  <FaTrashAlt size={13} />
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
                      <p className="font-medium text-navy text-sm break-words">
                        {typeof value === 'object' ? (value?.name || '—') : String(value ?? '—')}
                      </p>
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
                    { label: 'Adults',     value: selectedBooking.guests },
                    { label: 'Children',   value: selectedBooking.children ?? 0 },
                    { label: 'Extra Beds',  value: selectedBooking.extraBeds ?? 0 },
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
                  <FaMoneyBillWave size={10} className="text-gold" /> Payment Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-sm bg-lightbg rounded-lg p-4">
                  {selectedBooking.roomAmount > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Room Charge (before GST)</p>
                      <p className="font-semibold text-navy">₹{Number(selectedBooking.roomAmount).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Total Amount (incl. GST)</p>
                    <p className="font-bold text-gold text-lg">₹{(selectedBooking.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Advance Paid</p>
                    <p className="font-semibold text-green-600 text-sm">₹{Number(selectedBooking.advancePaid || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Balance Due at Check-In</p>
                    <p className="font-bold text-red-600 text-sm">
                      ₹{Math.max(0, (selectedBooking.amount || 0) - Number(selectedBooking.advancePaid || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
                    <p className="font-medium text-navy capitalize">
                      {selectedBooking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel (No Advance)' : selectedBooking.paymentMethod}
                    </p>
                  </div>
                  {selectedBooking.specialRequests && (
                    <div className="col-span-2 border-t border-gray-200 pt-2 mt-1">
                      <p className="text-xs text-gray-400 mb-0.5">Special Requests</p>
                      <p className="font-medium text-navy break-words">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Status */}
              <div className="border-t pt-4">
                <p className="font-poppins text-sm font-semibold text-gray-700 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {['confirmed', 'cancelled'].map((s) => (
                    <button key={s} onClick={() => updateStatus(selectedBooking.id, s)}
                      className={`font-poppins text-xs px-4 py-1.5 rounded-full border transition-colors capitalize
                        ${selectedBooking.status === s
                          ? 'bg-gold text-white border-gold'
                          : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'}`}>
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => openEditModal(selectedBooking)}
                    className="font-poppins text-xs px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
                  >
                    <FaEdit className="inline-block mr-1" /> Edit
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => handlePrintBooking(selectedBooking)}
                  className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-poppins text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <FaPrint size={16} /> Print / Download PDF Confirmation
                </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto font-poppins">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-playfair font-bold text-navy text-xl flex items-center gap-2">
                <span className="text-gold font-poppins">+</span> {isEditMode ? 'Edit Offline Booking' : 'Add Offline Booking'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOfflineBooking} className="space-y-4 text-left">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Name"
                  value={addForm.guestName}
                  onChange={(e) => setAddForm(prev => ({ ...prev, guestName: e.target.value }))}
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
                    value={addForm.phone}
                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. guest@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Room Type & Number of Rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Room Type *</label>
                  <select 
                    value={addForm.roomSlug}
                    onChange={(e) => handleRoomTypeChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-medium"
                  >
                    <option value="deluxe-ac-room">Deluxe AC Room</option>
                    <option value="normal-ac-room">Normal AC Room</option>
                    <option value="non-ac-room">Non AC Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Rooms</label>
                  <input 
                    type="number" 
                    min="1"
                    value={addForm.roomsCount}
                    onChange={(e) => handleNumRoomsChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Physical Room Picker */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Assign Physical Rooms *
                  </label>
                  <span className="text-[11px] text-gray-500">
                    Selected: <strong className="text-navy">{addForm.selectedPhysicalRooms?.length || 0}</strong> / {addForm.roomsCount} room(s)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  {rooms
                    .filter(r => r.type === (slugToCategoryType[addForm.roomSlug] || 'Deluxe AC'))
                    .map(r => {
                      const occupied = getOccupiedRoomIds(addForm.checkIn, addForm.checkOut, editingBookingId).has(r.id)
                      const isChecked = addForm.selectedPhysicalRooms?.includes(r.id)
                      return (
                        <button 
                          type="button"
                          key={r.id}
                          disabled={occupied}
                          onClick={() => {
                            const currentSelected = addForm.selectedPhysicalRooms || []
                            if (isChecked) {
                              setAddForm(prev => ({
                                ...prev,
                                selectedPhysicalRooms: currentSelected.filter(id => id !== r.id)
                              }))
                            } else {
                              setAddForm(prev => ({
                                ...prev,
                                selectedPhysicalRooms: [...currentSelected, r.id]
                              }))
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                            occupied 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                              : isChecked
                                ? 'bg-[#C9A227] text-white border-[#C9A227] shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#C9A227]'
                          }`}
                        >
                          <span>{isChecked ? '✓' : '+'} {r.name}</span>
                          {occupied && <span className="text-[9px] text-red-500 font-normal">(Booked)</span>}
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Check-In Date & Check-In Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-In Date *</label>
                  <input 
                    type="date" 
                    required
                    value={addForm.checkIn}
                    onChange={(e) => setAddForm(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-In Time *</label>
                  <input 
                    type="time" 
                    required
                    value={addForm.checkInTime}
                    onChange={(e) => setAddForm(prev => ({ ...prev, checkInTime: e.target.value }))}
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
                    value={addForm.checkOut}
                    onChange={(e) => setAddForm(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-Out Time *</label>
                  <input 
                    type="time" 
                    required
                    value={addForm.checkOutTime}
                    onChange={(e) => setAddForm(prev => ({ ...prev, checkOutTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Adults, Children & Extra Beds */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Adults</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={addForm.guests}
                    onChange={(e) => setAddForm(prev => ({ ...prev, guests: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Children</label>
                  <input 
                    type="number" 
                    min="0"
                    max="10"
                    value={addForm.children}
                    onChange={(e) => setAddForm(prev => ({ ...prev, children: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Extra Beds</label>
                  <input 
                    type="number" 
                    min="0"
                    max="10"
                    value={addForm.extraBeds}
                    onChange={(e) => setAddForm(prev => ({ ...prev, extraBeds: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Room Charge & Advance Paid */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Room Charge (₹) *</label>
                    <input 
                      type="number" 
                      min="0"
                      required
                      placeholder="Enter room charge amount"
                      value={addForm.amount}
                      onChange={(e) => setAddForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Advance Paid (₹)</label>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      value={addForm.advancePaid}
                      onChange={(e) => setAddForm(prev => ({ ...prev, advancePaid: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Tax Option Buttons */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tax Calculation Option</label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAddForm(prev => ({ ...prev, taxType: 'without_tax' }))}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        (addForm.taxType || 'without_tax') === 'without_tax' ? 'bg-[#C9A227] text-white shadow-sm' : 'text-gray-600 hover:text-navy'
                      }`}
                    >
                      Without Tax (+12%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddForm(prev => ({ ...prev, taxType: 'with_tax' }))}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        addForm.taxType === 'with_tax' ? 'bg-[#C9A227] text-white shadow-sm' : 'text-gray-600 hover:text-navy'
                      }`}
                    >
                      With Tax (Included)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddForm(prev => ({ ...prev, taxType: 'no_tax' }))}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        addForm.taxType === 'no_tax' ? 'bg-[#C9A227] text-white shadow-sm' : 'text-gray-600 hover:text-navy'
                      }`}
                    >
                      No Tax (0%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Summary with GST */}
              {(parseFloat(addForm.amount) > 0 || parseFloat(addForm.advancePaid) > 0) && (() => {
                const enteredCharge = parseFloat(addForm.amount) || 0
                const currentTax = addForm.taxType || 'without_tax'
                let baseRoomCharge = enteredCharge
                let gst = 0
                let total = enteredCharge

                if (currentTax === 'with_tax') {
                  total = enteredCharge
                  baseRoomCharge = Math.round(enteredCharge / 1.12)
                  gst = total - baseRoomCharge
                } else if (currentTax === 'no_tax') {
                  total = enteredCharge
                  baseRoomCharge = enteredCharge
                  gst = 0
                } else {
                  baseRoomCharge = enteredCharge
                  gst = Math.round(enteredCharge * 0.12)
                  total = enteredCharge + gst
                }

                const advance = parseFloat(addForm.advancePaid) || 0
                const balance = Math.max(0, total - advance)

                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-1.5">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">💰 Payment Summary</p>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Room Charge {currentTax === 'with_tax' ? '(Base)' : ''}</span>
                      <span>₹{baseRoomCharge.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST {currentTax === 'with_tax' ? '(12% Included)' : currentTax === 'no_tax' ? '(0%)' : '(12% Extra)'}</span>
                      <span>₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-amber-300 pt-1.5 mt-1">
                      <span>Total Amount</span>
                      <span className="text-[#C9A227]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Advance Paid</span>
                      <span className="font-semibold">₹{advance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-red-600 border-t border-amber-300 pt-1.5">
                      <span>Balance Due at Check-In</span>
                      <span>₹{balance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )
              })()}

              {/* Payment Method & Special Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Method (for Advance)</label>
                  <select 
                    value={addForm.paymentMethod}
                    onChange={(e) => setAddForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-medium"
                  >
                    <option value="Pay at Hotel">Pay at Hotel (No Advance)</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Special Notes</label>
                  <input 
                    type="text" 
                    placeholder="Special requests or notes"
                    value={addForm.specialNotes}
                    onChange={(e) => setAddForm(prev => ({ ...prev, specialNotes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-[#C9A227] hover:bg-[#A07D10] text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {addLoading ? (isEditMode ? 'Updating...' : 'Confirming...') : (isEditMode ? 'Update Offline Booking' : 'Confirm Offline Booking')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice (Hidden on Screen, Visible on Print) */}
      {activePrintBooking && (() => {
        const printGuestState = getStateWithCode(activePrintBooking.address);
        const printIsTamilNadu = printGuestState.code === '33';
        const printTotal = activePrintBooking.amount || 0;
        const printRoomAmount = activePrintBooking.roomAmount || Math.round(printTotal / 1.12);
        const printGstAmount = activePrintBooking.gstAmount || (printTotal - printRoomAmount);
        const printGstLabelAmount = printIsTamilNadu ? printGstAmount / 2 : printGstAmount;
        const printAdvance = Number(activePrintBooking.advancePaid || 0);
        const printBalance = Math.max(0, printTotal - printAdvance);
        const printPaymentMode = activePrintBooking.paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel'
          : activePrintBooking.paymentMethod === 'cash' ? 'Cash'
          : activePrintBooking.paymentMethod === 'upi' ? 'UPI'
          : activePrintBooking.paymentMethod === 'card' ? 'Card'
          : activePrintBooking.paymentMethod === 'bank_transfer' ? 'Bank Transfer'
          : activePrintBooking.paymentMethod || 'Cash';

        return (
          <div className="printable-invoice">
            {/* Header section with left navy curved container & right contacts section */}
            <div className="invoice-header-container">
              {/* Left Navy container */}
              <div className="invoice-header-left-navy">
                <div className="logo-section">
                  <div className="logo-circle">
                    <img src="/Elegant monogram with seaside emblem.webp" alt="Arlinjai Paradise Logo" />
                  </div>
                </div>
                <div className="hotel-details-section">
                  <h2 className="hotel-title">Arlinjai Paradise</h2>
                  <p className="hotel-subtitle">GSTIN: 33ALCPA0679E2ZN</p>
                  <p className="hotel-subtitle">State: 33-Tamil Nadu</p>
                </div>
              </div>

              {/* Right section containing Green bar and Tax Invoice Title */}
              <div className="invoice-header-right">
                <div className="green-contacts-bar">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span className="contact-text">9486271234</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉</span>
                    <span className="contact-text">arlinjaiparadise@gmail.com</span>
                  </div>
                  <div className="contact-item address-item">
                    <span className="contact-icon">📍</span>
                    <span className="contact-text">ARLINJAI PARADISE , 6/248D, Kotakarai, Kovalam, Kanniyakumari,629702 Tamil Nadu,</span>
                  </div>
                </div>
                <div className="title-section">
                  <h1 className="tax-invoice-text">Tax Invoice</h1>
                </div>
              </div>
            </div>

            {/* Invoice Metadata and Bill To */}
            <div className="invoice-meta-section">
              <div className="bill-to-box">
                <span className="section-label">Bill To</span>
                <h2 className="guest-name">{activePrintBooking.guest}</h2>
                <p className="guest-address">{activePrintBooking.address || 'Kanyakumari, Tamil Nadu'}</p>
                <p className="guest-detail"><strong>Contact No.:</strong> {activePrintBooking.phone}</p>
                <p className="guest-detail"><strong>GSTIN Number:</strong> N/A</p>
                <p className="guest-detail"><strong>State:</strong> {printGuestState.code}-{printGuestState.name}</p>
              </div>
              <div className="meta-details-box">
                <div className="meta-row">
                  <span className="meta-label">Invoice No.:</span>
                  <span className="meta-value">{activePrintBooking.bookingId || activePrintBooking.id}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">{formatDateDDMMYYYY(new Date(activePrintBooking.createdAt || Date.now()))}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Time:</span>
                  <span className="meta-value">{formatTimeHHMM(new Date(activePrintBooking.createdAt || Date.now()))}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Place of Supply:</span>
                  <span className="meta-value">{printGuestState.code}-{printGuestState.name}</span>
                </div>
              </div>
            </div>

            {/* Booking Details Table */}
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '38%' }}>Item Name</th>
                  <th style={{ width: '12%' }}>HSN/ SAC</th>
                  <th style={{ width: '8%' }}>Quantity</th>
                  <th style={{ width: '8%' }}>Unit</th>
                  <th style={{ width: '13%' }}>Price/ Unit</th>
                  <th style={{ width: '15%' }}>GST</th>
                  <th style={{ width: '13%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td className="item-name-cell">{activePrintBooking.room || 'Deluxe AC Room'}</td>
                  <td className="text-center">996311</td>
                  <td className="text-center">{activePrintBooking.numRooms || 1}</td>
                  <td className="text-center">Nos</td>
                  <td className="text-right">Rs {printRoomAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-right">Rs {printGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({activePrintBooking.taxType === 'no_tax' ? '0.0%' : '12.0%'})</td>
                  <td className="text-right">Rs {printTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr className="table-total-row">
                  <td></td>
                  <td className="text-left font-bold">Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-right font-bold">Rs {printGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-right font-bold">Rs {printTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>

            {/* Description & Summary Section */}
            <div className="invoice-bottom-section">
              {/* Left side details */}
              <div className="bottom-left-info">
                <div className="info-block">
                  <h4>Description</h4>
                  <p>Check in date - {formatDateOrdinal(activePrintBooking.checkIn)}</p>
                  <p>Check out date - {formatDateOrdinal(activePrintBooking.checkOut)}</p>
                  <p>Pax - {activePrintBooking.guests}</p>
                  {activePrintBooking.assignedRoom && <p>Assigned Room(s) - {activePrintBooking.assignedRoom}</p>}
                </div>
                <div className="info-block">
                  <h4>Invoice Amount In Words</h4>
                  <p className="words-amount">{numberToWords(printTotal)}</p>
                </div>
                <div className="info-block terms-block">
                  <h4>Terms And Conditions</h4>
                  <p>Thank you for doing business with us.</p>
                  <div className="signature-area">
                    <p>For: Arlinjai Paradise</p>
                    <div className="sig-wrap">
                      <img src={signatureImg} alt="Authorized Signature" className="signature-img" />
                    </div>
                    <h5>Authorized Signatory</h5>
                  </div>
                </div>
              </div>

              {/* Right side summary */}
              <div className="bottom-right-summary">
                <table className="summary-box-table">
                  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td>Rs {printRoomAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    {printIsTamilNadu ? (
                      <>
                        <tr>
                          <td>CGST@{activePrintBooking.taxType === 'no_tax' ? '0.0' : '6.0'}%</td>
                          <td>Rs {printGstLabelAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <td>SGST@{activePrintBooking.taxType === 'no_tax' ? '0.0' : '6.0'}%</td>
                          <td>Rs {printGstLabelAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td>IGST@{activePrintBooking.taxType === 'no_tax' ? '0.0' : '12.0'}%</td>
                        <td>Rs {printGstLabelAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                    <tr className="summary-total-row">
                      <td>Total</td>
                      <td>Rs {printTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td>Received (Advance)</td>
                      <td>Rs {printAdvance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td>Balance Due</td>
                      <td>Rs {printBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td>Payment Mode</td>
                      <td>{printPaymentMode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Print Styles */}
            <style>{`
              @media screen {
                .printable-invoice {
                  display: none !important;
                }
              }
              @page {
                size: A4 portrait;
                margin: 8mm 12mm 8mm 12mm !important;
              }
              @media print {
                body * {
                  visibility: hidden !important;
                }
                html, body {
                  height: 100%;
                  overflow: hidden;
                }
                .printable-invoice, .printable-invoice * {
                  visibility: visible !important;
                }
                #root, #root *, div, main, section, article {
                  transform: none !important;
                  filter: none !important;
                  perspective: none !important;
                  will-change: auto !important;
                }
                .printable-invoice {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  color: #333333 !important;
                  font-family: 'Poppins', sans-serif !important;
                  box-sizing: border-box !important;
                }
                .invoice-header-container {
                  display: flex !important;
                  width: 100% !important;
                  margin-bottom: 50px !important;
                }
                .invoice-header-left-navy {
                  background: #1a2d42 !important;
                  color: #ffffff !important;
                  width: 400px !important;
                  padding: 15px 20px !important;
                  border-bottom-right-radius: 120px 100px !important;
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 12px !important;
                  box-sizing: border-box !important;
                  position: relative !important;
                  z-index: 1 !important;
                }
                .logo-circle {
                  width: 65px !important;
                  height: 65px !important;
                  border-radius: 50% !important;
                  border: 2px solid #C9A227 !important;
                  background: #ffffff !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  overflow: hidden !important;
                }
                .logo-circle img {
                  width: 85% !important;
                  height: 85% !important;
                  object-fit: contain !important;
                }
                .hotel-details-section .hotel-title {
                  font-family: 'Playfair Display', serif !important;
                  font-size: 20px !important;
                  font-weight: 700 !important;
                  margin: 0 0 4px 0 !important;
                  color: #ffffff !important;
                }
                .hotel-details-section p {
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 9px !important;
                  margin: 1px 0 !important;
                  opacity: 0.9 !important;
                  color: #ffffff !important;
                }
                .invoice-header-right {
                  width: calc(100% - 400px) !important;
                  display: flex !important;
                  flex-direction: column !important;
                  justify-content: space-between !important;
                  box-sizing: border-box !important;
                  position: relative !important;
                  z-index: 2 !important;
                }
                .green-contacts-bar {
                  background: #16c085 !important;
                  color: #ffffff !important;
                  display: flex !important;
                  align-items: center !important;
                  padding: 6px 10px 6px 135px !important;
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 8px !important;
                  gap: 5px !important;
                  justify-content: space-between !important;
                  height: 48px !important;
                  box-sizing: border-box !important;
                  border-bottom-left-radius: 120px 48px !important;
                  margin-left: -120px !important;
                  position: relative !important;
                  z-index: 5 !important;
                }
                .contact-item {
                  display: flex !important;
                  align-items: center !important;
                  gap: 4px !important;
                  border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
                  padding-right: 8px !important;
                  flex: 1 !important;
                }
                .contact-item:last-child {
                  border-right: none !important;
                  padding-right: 0 !important;
                  flex: 1.5 !important;
                }
                .contact-icon {
                  font-size: 10px !important;
                }
                .contact-text {
                  line-height: 1.2 !important;
                  color: #ffffff !important;
                }
                .title-section {
                  text-align: right !important;
                  padding-right: 10px !important;
                  padding-bottom: 5px !important;
                }
                .tax-invoice-text {
                  font-family: 'Playfair Display', Georgia, serif !important;
                  font-size: 34px !important;
                  color: #1a2d42 !important;
                  margin: 0 !important;
                  font-weight: 500 !important;
                }
                .invoice-meta-section {
                  display: flex !important;
                  justify-content: space-between !important;
                  padding: 0 15px !important;
                  margin-bottom: 50px !important;
                }
                .bill-to-box {
                  width: 55% !important;
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 2px !important;
                }
                .section-label {
                  color: #16c085 !important;
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 12px !important;
                  font-weight: 600 !important;
                  margin-bottom: 4px !important;
                  text-transform: uppercase !important;
                }
                .guest-name {
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 15px !important;
                  font-weight: 700 !important;
                  color: #1a2d42 !important;
                  margin: 0 0 3px 0 !important;
                }
                .guest-address {
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 10px !important;
                  color: #555555 !important;
                  margin: 0 0 4px 0 !important;
                  line-height: 1.3 !important;
                  max-width: 90% !important;
                }
                .guest-detail {
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 10px !important;
                  color: #333333 !important;
                  margin: 1px 0 !important;
                }
                .meta-details-box {
                  width: 38% !important;
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 4px !important;
                  font-family: 'Poppins', sans-serif !important;
                  font-size: 10px !important;
                }
                .meta-row {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .meta-label {
                  font-weight: 600 !important;
                  color: #333333 !important;
                }
                .meta-value {
                  color: #000000 !important;
                  text-align: right !important;
                }
                .invoice-items-table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  margin-bottom: 60px !important;
                  font-family: 'Poppins', sans-serif !important;
                }
                .invoice-items-table th {
                  background: #16c085 !important;
                  color: #ffffff !important;
                  font-size: 10px !important;
                  font-weight: 600 !important;
                  padding: 14px 10px !important;
                  border: 1px solid #16c085 !important;
                  text-transform: uppercase !important;
                }
                .invoice-items-table td {
                  padding: 14px 10px !important;
                  border: 1px solid #dddddd !important;
                  font-size: 10px !important;
                  color: #333333 !important;
                  vertical-align: middle !important;
                }
                .invoice-items-table .item-name-cell {
                  font-weight: 600 !important;
                  color: #1a2d42 !important;
                }
                .table-total-row td {
                  background: #16c085 !important;
                  color: #ffffff !important;
                  font-weight: 700 !important;
                  font-size: 11px !important;
                  border: 1px solid #16c085 !important;
                }
                .invoice-bottom-section {
                  display: flex !important;
                  justify-content: space-between !important;
                  padding: 0 15px !important;
                  margin-top: 40px !important;
                  font-family: 'Poppins', sans-serif !important;
                }
                .bottom-left-info {
                  width: 55% !important;
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 20px !important;
                }
                .info-block h4 {
                  color: #16c085 !important;
                  font-size: 10px !important;
                  font-weight: 600 !important;
                  margin: 0 0 3px 0 !important;
                  text-transform: uppercase !important;
                  letter-spacing: 0.5px !important;
                }
                .info-block p {
                  font-size: 10px !important;
                  color: #444444 !important;
                  margin: 1px 0 !important;
                  line-height: 1.3 !important;
                }
                .words-amount {
                  font-weight: 600 !important;
                  color: #1a2d42 !important;
                }
                .terms-block {
                  margin-top: 3px !important;
                }
                .signature-area {
                  margin-top: 20px !important;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: flex-start !important;
                }
                .signature-area p {
                  font-size: 9px !important;
                  color: #555555 !important;
                  margin-bottom: 1px !important;
                }
                .sig-wrap {
                  height: 40px !important;
                  margin-bottom: 2px !important;
                }
                .signature-img {
                  height: 100% !important;
                  width: auto !important;
                  display: block !important;
                }
                .signature-area h5 {
                  font-size: 10px !important;
                  font-weight: 700 !important;
                  color: #1a2d42 !important;
                  margin: 3px 0 0 0 !important;
                  border-top: 1px solid #cccccc !important;
                  width: 140px !important;
                  padding-top: 3px !important;
                  text-align: center !important;
                }
                .bottom-right-summary {
                  width: 38% !important;
                }
                .summary-box-table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  border: 1px solid #dddddd !important;
                }
                .summary-box-table td {
                  padding: 8px 10px !important;
                  border: 1px solid #dddddd !important;
                  font-size: 10px !important;
                  color: #333333 !important;
                }
                .summary-box-table td:first-child {
                  font-weight: 600 !important;
                }
                .summary-box-table td:last-child {
                  text-align: right !important;
                }
                .summary-total-row td {
                  background: #16c085 !important;
                  color: #ffffff !important;
                  font-weight: 700 !important;
                  border: 1px solid #16c085 !important;
                }
                .text-center { text-align: center !important; }
                .text-right { text-align: right !important; }
                .text-left { text-align: left !important; }
                .font-bold { font-weight: 700 !important; }
              }
            `}</style>
          </div>
        );
      })()}
    </div>
  )
}
