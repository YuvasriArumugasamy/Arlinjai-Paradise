import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEdit, FaTrash, FaTimes, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

// Room data based on user requirements
const INITIAL_ROOMS = [
  // Deluxe AC — 101 to 105
  { id: 1, roomNo: 101, type: 'Deluxe AC', status: 'Available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { id: 2, roomNo: 102, type: 'Deluxe AC', status: 'Available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { id: 3, roomNo: 103, type: 'Deluxe AC', status: 'Available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { id: 4, roomNo: 104, type: 'Deluxe AC', status: 'Available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  { id: 5, roomNo: 105, type: 'Deluxe AC', status: 'Available', weekdayPrice: 2500, weekendPrice: 3000, peakPrice: 5000 },
  // Normal AC — 201, 301 to 305
  { id: 6, roomNo: 201, type: 'Normal AC', status: 'Available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { id: 7, roomNo: 301, type: 'Normal AC', status: 'Available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { id: 8, roomNo: 302, type: 'Normal AC', status: 'Available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { id: 9, roomNo: 303, type: 'Normal AC', status: 'Available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { id: 10, roomNo: 304, type: 'Normal AC', status: 'Available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  { id: 11, roomNo: 305, type: 'Normal AC', status: 'Available', weekdayPrice: 2000, weekendPrice: 2500, peakPrice: 4000 },
  // Non AC — 202 to 205
  { id: 12, roomNo: 202, type: 'Non AC', status: 'Available', weekdayPrice: 1500, weekendPrice: 1800, peakPrice: 3000 },
  { id: 13, roomNo: 203, type: 'Non AC', status: 'Available', weekdayPrice: 1500, weekendPrice: 1800, peakPrice: 3000 },
  { id: 14, roomNo: 204, type: 'Non AC', status: 'Available', weekdayPrice: 1500, weekendPrice: 1800, peakPrice: 3000 },
  { id: 15, roomNo: 205, type: 'Non AC', status: 'Available', weekdayPrice: 1500, weekendPrice: 1800, peakPrice: 3000 },
]

const STATUS_STYLES = {
  Available: { bg: 'bg-[#e6fbf4]', text: 'text-[#10b981]' },
  Occupied: { bg: 'bg-[#e0f2fe]', text: 'text-[#0284c7]' },
  Maintenance: { bg: 'bg-[#fee2e2]', text: 'text-[#ef4444]' },
}

const ROOM_TYPES = ['Deluxe AC', 'Normal AC', 'Non AC']
const STATUS_OPTIONS = ['Available', 'Occupied', 'Maintenance']

export default function RoomsAdminPage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    roomNo: '',
    type: 'Deluxe AC',
    weekdayPrice: '',
    weekendPrice: '',
    peakPrice: '',
    status: 'Available',
  })

  const handleEditClick = (room) => {
    setEditingRoom(room)
    setFormData({ ...room })
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms((prev) => prev.filter((r) => r.id !== id))
      toast.success('Room deleted successfully')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingRoom(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveRoom = () => {
    if (!formData.roomNo) {
      toast.error('Room number is required')
      return
    }

    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) => (r.id === editingRoom.id ? { ...formData, id: r.id } : r))
      )
      toast.success('Room updated successfully')
    } else {
      const newRoom = { ...formData, id: Date.now() }
      setRooms((prev) => [...prev, newRoom])
      toast.success('Room added successfully')
    }
    handleModalClose()
  }

  return (
    <div className="space-y-6 bg-[#faf9f6] min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins text-xl font-medium text-gray-700">Manage your inventory and pricing</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md font-poppins text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Reset Layout
          </button>
          <button
            onClick={() => {
              setEditingRoom(null)
              setFormData({
                roomNo: '',
                type: 'Deluxe AC',
                weekdayPrice: '',
                weekendPrice: '',
                peakPrice: '',
                status: 'Available',
              })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#dcb163] text-white rounded-md font-poppins text-sm font-medium hover:bg-[#cda252] transition-colors"
          >
            <FaPlus size={12} /> Add Room
          </button>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const st = STATUS_STYLES[room.status] || STATUS_STYLES.Available
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-playfair text-2xl font-bold text-gray-800">#{room.roomNo}</h3>
                <span
                  className={`font-poppins text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${st.bg} ${st.text}`}
                >
                  {room.status}
                </span>
              </div>
              <p className="font-poppins text-sm text-gray-500 mb-4">{room.type}</p>

              <div className="mb-1">
                <span className="font-poppins text-base font-bold text-[#dcb163]">
                  ₹{room.weekdayPrice}
                </span>
                <span className="font-poppins text-sm font-bold text-[#dcb163]">/price/night</span>
              </div>
              <p className="font-poppins text-[11px] text-gray-400 mb-5">
                (Weekday: ₹{room.weekdayPrice} | Weekend: ₹{room.weekendPrice} | Peak: ₹{room.peakPrice})
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEditClick(room)}
                  className="flex-1 py-2.5 flex justify-center items-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteClick(room.id)}
                  className="flex-1 py-2.5 flex justify-center items-center border border-gray-200 rounded-lg hover:bg-red-50 transition-colors text-red-400"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Edit/Add Room Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="font-playfair text-2xl font-bold text-gray-900">
                  {editingRoom ? 'Edit Room' : 'Add Room'}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-poppins text-sm font-semibold text-gray-700">Room Number</label>
                    <input
                      type="number"
                      name="roomNo"
                      value={formData.roomNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#dcb163]/50 focus:border-[#dcb163] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-poppins text-sm font-semibold text-gray-700">Room Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#dcb163]/50 focus:border-[#dcb163] transition-all"
                    >
                      {ROOM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-poppins text-sm font-semibold text-gray-700">Weekday Price (Mon-Thu) (₹)</label>
                    <input
                      type="number"
                      name="weekdayPrice"
                      value={formData.weekdayPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#dcb163]/50 focus:border-[#dcb163] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-poppins text-sm font-semibold text-gray-700">Weekend Price (Fri-Sun) (₹)</label>
                    <input
                      type="number"
                      name="weekendPrice"
                      value={formData.weekendPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#dcb163]/50 focus:border-[#dcb163] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-poppins text-sm font-semibold text-gray-700">Peak Season Price (₹)</label>
                    <input
                      type="number"
                      name="peakPrice"
                      value={formData.peakPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#dcb163]/50 focus:border-[#dcb163] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="font-poppins text-sm font-semibold text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#dcb163]/50 focus:border-[#dcb163] transition-all"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 pb-2">
                  <button
                    onClick={handleSaveRoom}
                    className="w-full py-3 bg-[#dcb163] text-white font-poppins font-medium rounded-lg hover:bg-[#cda252] transition-colors shadow-sm"
                  >
                    {editingRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
