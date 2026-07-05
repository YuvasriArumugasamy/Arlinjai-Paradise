import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaUsers, FaBed, FaRulerCombined } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { ROOMS } from '../../constants'

export default function RoomsAdminPage() {
  const [rooms, setRooms] = useState(ROOMS.map((r) => ({ ...r, available: true, totalUnits: 3 })))
  const [showModal, setShowModal] = useState(false)
  const [editRoom, setEditRoom] = useState(null)

  const handleToggle = (id) => {
    setRooms((prev) =>
      prev.map((r) => r.id === id ? { ...r, available: !r.available } : r)
    )
    toast.success('Room availability updated')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms((prev) => prev.filter((r) => r.id !== id))
      toast.success('Room deleted')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Room Management</h2>
          <p className="font-poppins text-sm text-gray-500">{rooms.length} room types configured</p>
        </div>
        <button
          onClick={() => { setEditRoom(null); setShowModal(true) }}
          className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5"
        >
          <FaPlus size={12} /> Add Room Type
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-50"
          >
            <div className="relative">
              <img src={room.image} alt={room.name} className="w-full h-44 object-cover" />
              <div className="absolute top-3 left-3">
                <span className="bg-gold text-white text-xs font-bold font-poppins px-3 py-1">
                  {room.badge}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => handleToggle(room.id)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 cursor-pointer
                      ${room.available ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
                      ${room.available ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className={`text-xs font-poppins font-medium ${room.available ? 'text-white' : 'text-white'}`}>
                    {room.available ? 'Available' : 'Unavailable'}
                  </span>
                </label>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-playfair font-bold text-navy text-lg">{room.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditRoom(room); setShowModal(true) }}
                    className="p-2 text-gray-400 hover:text-gold transition-colors"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-gray-500 font-poppins mb-4">
                <span className="flex items-center gap-1"><FaUsers size={10} className="text-gold" /> {room.minGuests}–{room.guests} guests</span>
                <span className="flex items-center gap-1"><FaBed size={10} className="text-gold" /> {room.bedType}</span>
                <span className="flex items-center gap-1"><FaRulerCombined size={10} className="text-gold" /> {room.size} sq.ft</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-playfair text-2xl font-bold text-gold">₹{room.price.toLocaleString()}</span>
                  <span className="font-poppins text-xs text-gray-500">/night</span>
                </div>
                <div className="text-right">
                  <p className="font-poppins text-xs text-gray-500">High Season</p>
                  <p className="font-poppins text-sm font-bold text-navy">₹{room.highSeasonPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="font-poppins text-xs text-gray-500 mb-2">Available Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {room.features.slice(0, 4).map((f, fi) => (
                    <span key={fi} className="text-xs bg-lightbg text-gray-600 font-poppins px-2 py-0.5 rounded flex items-center gap-1">
                      <FaCheck size={8} className="text-gold" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Room Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-playfair font-bold text-navy text-lg">
                {editRoom ? 'Edit Room' : 'Add New Room Type'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-navy">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-text">Room Name *</label>
                <input
                  type="text"
                  defaultValue={editRoom?.name}
                  className="input-field"
                  placeholder="e.g. Deluxe AC Room"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Price per Night (₹) *</label>
                  <input type="number" defaultValue={editRoom?.price} className="input-field" />
                </div>
                <div>
                  <label className="label-text">High Season Price (₹)</label>
                  <input type="number" defaultValue={editRoom?.highSeasonPrice} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Max Guests</label>
                  <select defaultValue={editRoom?.guests || 2} className="select-field">
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Room Size (sq.ft)</label>
                  <input type="number" defaultValue={editRoom?.size} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea
                  defaultValue={editRoom?.description}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    toast.success(`Room ${editRoom ? 'updated' : 'added'} successfully`)
                    setShowModal(false)
                  }}
                  className="btn-gold flex-1 py-3"
                >
                  {editRoom ? 'Update Room' : 'Add Room'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-outline-gold flex-1 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
