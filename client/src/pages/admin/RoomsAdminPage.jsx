import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaBed, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'

// Real room data: 15 rooms total
const INITIAL_ROOMS = [
  // Deluxe AC — 101 to 105
  { roomNo: 101, type: 'Deluxe AC', floor: '1st Floor', status: 'available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { roomNo: 102, type: 'Deluxe AC', floor: '1st Floor', status: 'available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { roomNo: 103, type: 'Deluxe AC', floor: '1st Floor', status: 'available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { roomNo: 104, type: 'Deluxe AC', floor: '1st Floor', status: 'available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { roomNo: 105, type: 'Deluxe AC', floor: '1st Floor', status: 'available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  // Normal AC — 201, 301 to 305
  { roomNo: 201, type: 'Normal AC', floor: '2nd Floor', status: 'available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { roomNo: 301, type: 'Normal AC', floor: '3rd Floor', status: 'available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { roomNo: 302, type: 'Normal AC', floor: '3rd Floor', status: 'available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { roomNo: 303, type: 'Normal AC', floor: '3rd Floor', status: 'available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { roomNo: 304, type: 'Normal AC', floor: '3rd Floor', status: 'available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { roomNo: 305, type: 'Normal AC', floor: '3rd Floor', status: 'available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  // Non AC — 202 to 205
  { roomNo: 202, type: 'Non AC', floor: '2nd Floor', status: 'available', weekdayPrice: 1500, weekendPrice: 2000, peakPrice: 3000 },
  { roomNo: 203, type: 'Non AC', floor: '2nd Floor', status: 'available', weekdayPrice: 1500, weekendPrice: 2000, peakPrice: 3000 },
  { roomNo: 204, type: 'Non AC', floor: '2nd Floor', status: 'available', weekdayPrice: 1500, weekendPrice: 2000, peakPrice: 3000 },
  { roomNo: 205, type: 'Non AC', floor: '2nd Floor', status: 'available', weekdayPrice: 1500, weekendPrice: 2000, peakPrice: 3000 },
]

const STATUS_STYLES = {
  available:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Available' },
  occupied:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Occupied' },
  maintenance: { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Maintenance' },
}

const ROOM_TYPES = ['Deluxe AC', 'Normal AC', 'Non AC']

export default function RoomsAdminPage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS)
  const [showModal, setShowModal] = useState(false)
  const [editRoom, setEditRoom] = useState(null)

  const totalAvailable   = rooms.filter((r) => r.status === 'available').length
  const totalOccupied    = rooms.filter((r) => r.status === 'occupied').length
  const totalMaintenance = rooms.filter((r) => r.status === 'maintenance').length

  const handleEditClick = (room) => {
    setEditRoom({ ...room })
    setShowModal(true)
  }

  const handleDelete = (roomNo) => {
    if (window.confirm(`Are you sure you want to delete Room #${roomNo}?`)) {
      setRooms((prev) => prev.filter((r) => r.roomNo !== roomNo))
      toast.success(`Room #${roomNo} deleted`)
    }
  }

  const handleSave = () => {
    setRooms((prev) => prev.map((r) => (r.roomNo === editRoom.roomNo ? editRoom : r)))
    toast.success(`Room #${editRoom.roomNo} updated`)
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Room Management</h2>
          <p className="font-poppins text-sm text-gray-500">{rooms.length} rooms total</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Rooms',  value: rooms.length,    color: 'bg-navy',    icon: FaBed },
          { label: 'Available',    value: totalAvailable,  color: 'bg-green-500', icon: FaCheckCircle },
          { label: 'Occupied',     value: totalOccupied,   color: 'bg-blue-500',  icon: FaBed },
          { label: 'Maintenance',  value: totalMaintenance,color: 'bg-red-500',   icon: FaTimesCircle },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-4 shadow-card flex items-center gap-3"
            >
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="font-playfair text-2xl font-bold text-navy">{s.value}</p>
                <p className="font-poppins text-xs text-gray-500">{s.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {rooms.sort((a, b) => a.roomNo - b.roomNo).map((room, ri) => {
          const st = STATUS_STYLES[room.status]
          return (
            <motion.div
              key={room.roomNo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ri * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top Row: Room Number & Status Badge */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-playfair text-2xl font-bold text-navy">#{room.roomNo}</h3>
                <span className={`px-3 py-1 text-[10px] tracking-wider font-bold rounded-full uppercase ${st.bg} ${st.text}`}>
                  {st.label}
                </span>
              </div>

              {/* Subtitle: Room Type */}
              <p className="font-poppins text-sm text-gray-600 mb-4">{room.type}</p>

              {/* Price Details */}
              <div className="mb-5 space-y-1">
                <p className="font-playfair text-gold font-bold text-lg">
                  ₹{room.weekdayPrice}<span className="text-sm text-gray-500 font-poppins font-normal">/night</span>
                </p>
                <p className="font-poppins text-[11px] text-gray-400">
                  (Weekday: ₹{room.weekdayPrice} | Weekend: ₹{room.weekendPrice} | Peak: ₹{room.peakPrice})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(room)}
                  className="flex-1 py-2 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold transition-colors"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(room.roomNo)}
                  className="flex-1 py-2 border border-red-100 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Edit Room Modal */}
      {showModal && editRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-playfair font-bold text-navy text-2xl">Edit Room</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-navy transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                  <input
                    type="number"
                    value={editRoom.roomNo}
                    onChange={(e) => setEditRoom({ ...editRoom, roomNo: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                    readOnly // Since roomNo is primary key, it's safer to make it read-only, or let them edit carefully
                  />
                </div>
                <div>
                  <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                  <select
                    value={editRoom.type}
                    onChange={(e) => setEditRoom({ ...editRoom, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                  >
                    {ROOM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Weekday Price (Mon-Thu) (₹)</label>
                  <input
                    type="number"
                    value={editRoom.weekdayPrice}
                    onChange={(e) => setEditRoom({ ...editRoom, weekdayPrice: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                  />
                </div>
                <div>
                  <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Weekend Price (Fri-Sun) (₹)</label>
                  <input
                    type="number"
                    value={editRoom.weekendPrice}
                    onChange={(e) => setEditRoom({ ...editRoom, weekendPrice: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Peak Season Price (₹)</label>
                  <input
                    type="number"
                    value={editRoom.peakPrice}
                    onChange={(e) => setEditRoom({ ...editRoom, peakPrice: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editRoom.status}
                  onChange={(e) => setEditRoom({ ...editRoom, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className="w-full bg-[#d4af37] hover:bg-[#c5a028] text-white font-poppins font-semibold py-3 rounded-lg transition-colors"
                >
                  Update Room
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
