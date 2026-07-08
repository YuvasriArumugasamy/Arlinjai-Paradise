import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaBed, FaSnowflake, FaFan, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

// Real room data: 15 rooms total
const INITIAL_ROOMS = [
  // Deluxe AC — 101 to 105
  { roomNo: 101, type: 'Deluxe AC', floor: '1st Floor', status: 'available' },
  { roomNo: 102, type: 'Deluxe AC', floor: '1st Floor', status: 'available' },
  { roomNo: 103, type: 'Deluxe AC', floor: '1st Floor', status: 'available' },
  { roomNo: 104, type: 'Deluxe AC', floor: '1st Floor', status: 'available' },
  { roomNo: 105, type: 'Deluxe AC', floor: '1st Floor', status: 'available' },
  // Normal AC — 201, 301 to 305
  { roomNo: 201, type: 'Normal AC', floor: '2nd Floor', status: 'available' },
  { roomNo: 301, type: 'Normal AC', floor: '3rd Floor', status: 'available' },
  { roomNo: 302, type: 'Normal AC', floor: '3rd Floor', status: 'available' },
  { roomNo: 303, type: 'Normal AC', floor: '3rd Floor', status: 'available' },
  { roomNo: 304, type: 'Normal AC', floor: '3rd Floor', status: 'available' },
  { roomNo: 305, type: 'Normal AC', floor: '3rd Floor', status: 'available' },
  // Non AC — 202 to 205
  { roomNo: 202, type: 'Non AC', floor: '2nd Floor', status: 'available' },
  { roomNo: 203, type: 'Non AC', floor: '2nd Floor', status: 'available' },
  { roomNo: 204, type: 'Non AC', floor: '2nd Floor', status: 'available' },
  { roomNo: 205, type: 'Non AC', floor: '2nd Floor', status: 'available' },
]

const STATUS_CYCLE = ['available', 'occupied', 'maintenance']

const STATUS_STYLES = {
  available:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Available',   dot: 'bg-green-500' },
  occupied:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Occupied',    dot: 'bg-blue-500' },
  maintenance: { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Maintenance', dot: 'bg-red-500' },
}

const TYPE_CONFIG = {
  'Deluxe AC':  { icon: FaSnowflake, color: 'text-blue-500',  bg: 'bg-blue-50',  border: 'border-blue-200',  badge: 'bg-blue-500',  price: '₹2,500–₹5,000' },
  'Normal AC':  { icon: FaSnowflake, color: 'text-cyan-500',  bg: 'bg-cyan-50',  border: 'border-cyan-200',  badge: 'bg-cyan-500',  price: '₹2,000–₹4,000' },
  'Non AC':     { icon: FaFan,       color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', price: '₹1,500–₹3,000' },
}

const GROUP_ORDER = ['Deluxe AC', 'Normal AC', 'Non AC']

export default function RoomsAdminPage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS)

  const cycleStatus = (roomNo) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNo !== roomNo) return r
        const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(r.status) + 1) % STATUS_CYCLE.length]
        toast.success(`Room ${roomNo} → ${next}`)
        return { ...r, status: next }
      })
    )
  }

  const totalAvailable   = rooms.filter((r) => r.status === 'available').length
  const totalOccupied    = rooms.filter((r) => r.status === 'occupied').length
  const totalMaintenance = rooms.filter((r) => r.status === 'maintenance').length

  const grouped = GROUP_ORDER.map((type) => ({
    type,
    rooms: rooms.filter((r) => r.type === type).sort((a, b) => a.roomNo - b.roomNo),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Room Management</h2>
          <p className="font-poppins text-sm text-gray-500">15 rooms total · Click a room card to cycle status</p>
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

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap gap-4 items-center">
        <span className="font-poppins text-xs text-gray-500 font-medium">Status Legend:</span>
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
            <span className="font-poppins text-xs text-gray-600">{s.label}</span>
          </div>
        ))}
        <span className="font-poppins text-xs text-gray-400 ml-auto italic">
          Click any room card to change status
        </span>
      </div>

      {/* Room Groups */}
      {grouped.map(({ type, rooms: groupRooms }, gi) => {
        const cfg = TYPE_CONFIG[type]
        const Icon = cfg.icon
        const availCount = groupRooms.filter((r) => r.status === 'available').length

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 + 0.3 }}
            className={`bg-white rounded-xl shadow-card border ${cfg.border} overflow-hidden`}
          >
            {/* Group Header */}
            <div className={`${cfg.bg} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${cfg.badge} rounded-lg flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-navy text-lg">{type} Rooms</h3>
                  <p className="font-poppins text-xs text-gray-500">
                    {groupRooms.length} rooms · {availCount} available · {cfg.price}/night
                  </p>
                </div>
              </div>
              <span className={`font-poppins text-xs font-bold text-white px-3 py-1.5 rounded-full ${cfg.badge}`}>
                {groupRooms.length} rooms
              </span>
            </div>

            {/* Room Cards Grid */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {groupRooms.map((room, ri) => {
                const st = STATUS_STYLES[room.status]
                return (
                  <motion.button
                    key={room.roomNo}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: gi * 0.1 + ri * 0.04 + 0.4 }}
                    onClick={() => cycleStatus(room.roomNo)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 
                      hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer
                      ${st.bg} ${room.status === 'available' ? 'border-green-300' : 
                                  room.status === 'occupied' ? 'border-blue-300' : 'border-red-300'}`}
                  >
                    {/* Status dot */}
                    <span className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ${st.dot}`} />

                    {/* Room Number */}
                    <p className="font-playfair text-2xl font-bold text-navy mb-1">
                      {room.roomNo}
                    </p>

                    {/* Floor */}
                    <p className="font-poppins text-xs text-gray-500 mb-2">{room.floor}</p>

                    {/* Status Badge */}
                    <span className={`font-poppins text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text} border border-current border-opacity-30`}>
                      {st.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
