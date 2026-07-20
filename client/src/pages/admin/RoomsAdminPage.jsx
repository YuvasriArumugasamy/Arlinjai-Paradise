import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaBed, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaTimes, FaCoins, FaRegCalendarAlt, FaPercentage, FaSun, FaCalendarDay } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authAxios } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'

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

const STATUS_STYLES = {
  available:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Available' },
  occupied:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Occupied' },
  maintenance: { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Maintenance' },
}

export default function RoomsAdminPage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS)
  const [dbRooms, setDbRooms] = useState([])
  const [dbLoading, setDbLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editRoom, setEditRoom] = useState(null)

  // Category Pricing
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ price: 0, highSeasonPrice: 0 })

  // Global Settings (Peak Season & GST)
  const [globalSettings, setGlobalSettings] = useState({ isPeakSeason: false, gstRate: 12, specialPrices: [] })
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [gstFormRate, setGstFormRate] = useState(12)

  // Special Date Pricing Form
  const [specialForm, setSpecialForm] = useState({
    roomCategory: 'deluxe',
    startDate: '',
    endDate: '',
    price: ''
  })

  const fetchDbRooms = async () => {
    try {
      setDbLoading(true)
      const res = await authAxios.get(`${API_BASE_URL}/rooms`)
      if (res.data?.success) {
        setDbRooms(res.data.rooms)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load room pricing from database')
    } finally {
      setDbLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true)
      const res = await authAxios.get(`${API_BASE_URL}/settings`)
      if (res.data?.success && res.data?.settings) {
        setGlobalSettings(res.data.settings)
        setGstFormRate(res.data.settings.gstRate)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load global settings')
    } finally {
      setSettingsLoading(false)
    }
  }

  useEffect(() => {
    fetchDbRooms()
    fetchSettings()
  }, [])

  // Toggle Peak Season
  const handleTogglePeakSeason = async () => {
    try {
      const nextVal = !globalSettings.isPeakSeason
      const res = await authAxios.put(`${API_BASE_URL}/settings`, {
        isPeakSeason: nextVal
      })
      if (res.data?.success) {
        setGlobalSettings(res.data.settings)
        toast.success(nextVal ? 'Peak season pricing activated!' : 'Peak season pricing deactivated')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update peak season setting')
    }
  }

  // Update GST Rate
  const handleSaveGst = async () => {
    try {
      const res = await authAxios.put(`${API_BASE_URL}/settings`, {
        gstRate: Number(gstFormRate)
      })
      if (res.data?.success) {
        setGlobalSettings(res.data.settings)
        toast.success(`GST rate updated to ${gstFormRate}% successfully!`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update GST rate')
    }
  }

  // Add Special Price Rule
  const handleAddSpecialPrice = async (e) => {
    e.preventDefault()
    if (!specialForm.startDate || !specialForm.endDate || !specialForm.price) {
      toast.error('Please fill all special pricing fields')
      return
    }
    if (new Date(specialForm.startDate) > new Date(specialForm.endDate)) {
      toast.error('Start date cannot be after end date')
      return
    }

    const newRule = {
      roomCategory: specialForm.roomCategory,
      startDate: new Date(specialForm.startDate),
      endDate: new Date(specialForm.endDate),
      price: Number(specialForm.price)
    }

    const updatedRules = [...(globalSettings.specialPrices || []), newRule]

    try {
      const res = await authAxios.put(`${API_BASE_URL}/settings`, {
        specialPrices: updatedRules
      })
      if (res.data?.success) {
        setGlobalSettings(res.data.settings)
        toast.success('Special date pricing rule added!')
        setSpecialForm({
          roomCategory: 'deluxe',
          startDate: '',
          endDate: '',
          price: ''
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to add special pricing rule')
    }
  }

  // Delete Special Price Rule
  const handleDeleteSpecialPrice = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this special pricing rule?')) return

    const updatedRules = (globalSettings.specialPrices || []).filter(rule => rule._id !== ruleId)

    try {
      const res = await authAxios.put(`${API_BASE_URL}/settings`, {
        specialPrices: updatedRules
      })
      if (res.data?.success) {
        setGlobalSettings(res.data.settings)
        toast.success('Special pricing rule deleted')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete special pricing rule')
    }
  }

  // Map individual rooms with prices from DB
  const mappedRooms = useMemo(() => {
    return rooms.map(room => {
      const typeToSlug = {
        'Deluxe AC': 'deluxe-ac-room',
        'Normal AC': 'normal-ac-room',
        'Non AC': 'non-ac-room'
      }
      const slug = typeToSlug[room.type]
      const dbRoom = dbRooms.find(r => r.slug === slug)
      
      const basePrice = dbRoom ? dbRoom.price : 0
      const peakPrice = dbRoom ? dbRoom.highSeasonPrice : 0
      
      // Check if there is an active special price rule for TODAY
      const today = new Date()
      const specialRule = (globalSettings.specialPrices || []).find(rule => {
        if (!dbRoom || rule.roomCategory !== dbRoom.category) return false
        const start = new Date(rule.startDate)
        const end = new Date(rule.endDate)
        const check = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const checkStart = new Date(start.getFullYear(), start.getMonth(), start.getDate())
        const checkEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate())
        return check >= checkStart && check <= checkEnd
      })
      
      const displayPrice = specialRule ? specialRule.price : (globalSettings.isPeakSeason ? peakPrice : basePrice)

      return {
        ...room,
        weekdayPrice: basePrice,
        peakPrice: peakPrice,
        displayPrice
      }
    })
  }, [rooms, dbRooms, globalSettings])

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
    toast.success(`Room #${editRoom.roomNo} status updated`)
    setShowModal(false)
  }

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category)
    setCategoryForm({
      price: category.price,
      highSeasonPrice: category.highSeasonPrice
    })
    setShowCategoryModal(true)
  }

  const handleCategorySave = async () => {
    try {
      const res = await authAxios.put(`${API_BASE_URL}/rooms/${editingCategory._id}`, {
        price: Number(categoryForm.price),
        highSeasonPrice: Number(categoryForm.highSeasonPrice)
      })

      if (res.data?.success) {
        toast.success(`${editingCategory.name} pricing updated successfully!`)
        setShowCategoryModal(false)
        fetchDbRooms()
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update room pricing in database')
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Room & Price Management</h2>
          <p className="font-poppins text-sm text-gray-500">{rooms.length} rooms total | Managed dynamically</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
              className="bg-white rounded-xl p-3 sm:p-4 shadow-card flex items-center gap-2.5 sm:gap-3 min-w-0"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-playfair text-xl sm:text-2xl font-bold text-navy leading-tight">{s.value}</p>
                <p className="font-poppins text-[11px] sm:text-xs text-gray-500 truncate" title={s.label}>{s.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pricing & Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Room Categories Base Pricing Card */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="font-playfair text-xl font-bold text-navy mb-2 flex items-center gap-2">
              <FaCoins className="text-gold" /> Room Categories Base Pricing
            </h3>
            <p className="font-poppins text-xs text-gray-500 mb-6">
              Set base and peak season prices for the 3 main room categories.
            </p>

            {dbLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dbRooms.map((category) => (
                  <div key={category._id} className="border border-gray-200 rounded-xl p-4 hover:border-gold transition-colors flex flex-col justify-between">
                    <div>
                      <span className="bg-gold/10 text-[#c5a028] font-poppins text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {category.category}
                      </span>
                      <h4 className="font-playfair font-bold text-navy text-sm mt-2 mb-3">{category.name}</h4>
                      
                      <div className="space-y-1.5 font-poppins text-xs text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Normal:</span>
                          <strong className="text-navy">₹{category.price}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Peak:</span>
                          <strong className="text-[#c5a028]">₹{category.highSeasonPrice}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEditCategoryClick(category)}
                      className="w-full py-2 bg-navy hover:bg-navy/90 text-white font-poppins font-medium text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FaEdit size={10} /> Edit Rates
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Seasonal & Tax Controls Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="font-playfair text-xl font-bold text-navy mb-2 flex items-center gap-2">
              <FaPercentage className="text-gold" /> Tax & Seasonal Controls
            </h3>
            <p className="font-poppins text-xs text-gray-500 mb-6">
              Configure global billing tax rates and season price triggers.
            </p>

            {settingsLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Peak Season Control */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-poppins text-xs font-semibold text-gray-700">Peak Season Pricing</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                      globalSettings.isPeakSeason ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {globalSettings.isPeakSeason ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={handleTogglePeakSeason}
                    className={`w-full py-2 px-4 rounded-lg font-poppins text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                      globalSettings.isPeakSeason
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FaSun size={12} /> Toggle Peak Season
                  </button>
                </div>

                {/* GST Percentage Control */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <label className="block font-poppins text-xs font-semibold text-gray-700">GST Billing Rate (%)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gstFormRate}
                        onChange={(e) => setGstFormRate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:border-gold font-poppins text-xs text-gray-700"
                        placeholder="12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-poppins text-xs font-semibold text-gray-400">%</span>
                    </div>
                    <button
                      onClick={handleSaveGst}
                      className="px-4 bg-navy hover:bg-navy/90 text-white font-poppins font-semibold text-xs rounded-lg transition-colors flex items-center justify-center"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Special Date Pricing Manager ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: List of Special Pricing Rules */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-playfair text-xl font-bold text-navy flex items-center gap-2">
            <FaRegCalendarAlt className="text-gold" /> Active Special Date Pricing Rules
          </h3>
          <p className="font-poppins text-xs text-gray-500">
            Below are active date-range override rules. Bookings within these dates will use these custom rates instead of the base rates.
          </p>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left font-poppins text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">End Date</th>
                  <th className="py-3 px-3">Rate / Night</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {(!globalSettings.specialPrices || globalSettings.specialPrices.length === 0) ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-400 italic">No special date pricing rules created yet.</td>
                  </tr>
                ) : (
                  globalSettings.specialPrices.map((rule) => (
                    <tr key={rule._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 capitalize font-semibold text-navy whitespace-nowrap">
                        {rule.roomCategory === 'standard' ? 'Normal AC Room' : rule.roomCategory === 'budget' ? 'Non AC Room' : 'Deluxe AC Room'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{new Date(rule.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{new Date(rule.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-3 font-bold text-gold whitespace-nowrap">₹{rule.price}</td>
                      <td className="py-3 px-3 text-right font-semibold whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteSpecialPrice(rule._id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete rule"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {(!globalSettings.specialPrices || globalSettings.specialPrices.length === 0) ? (
              <div className="py-6 text-center text-gray-400 italic text-xs bg-gray-50 rounded-xl border border-gray-100">
                No special date pricing rules created yet.
              </div>
            ) : (
              globalSettings.specialPrices.map((rule) => {
                const categoryName = rule.roomCategory === 'standard'
                  ? 'Normal AC Room'
                  : rule.roomCategory === 'budget'
                  ? 'Non AC Room'
                  : 'Deluxe AC Room'

                const startStr = new Date(rule.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                const endStr = new Date(rule.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

                return (
                  <div key={rule._id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-poppins font-bold text-sm text-navy">{categoryName}</span>
                      <button
                        onClick={() => handleDeleteSpecialPrice(rule._id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete rule"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-poppins text-gray-600 pt-1">
                      <span>📅 {startStr} → {endStr}</span>
                      <span className="font-bold text-gold text-sm">₹{rule.price} <span className="text-[10px] font-normal text-gray-400">/night</span></span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Col: Add Special Pricing Rule Form */}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
          <h3 className="font-playfair text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <FaCalendarDay className="text-gold" /> Add Date Override Rate
          </h3>
          <form onSubmit={handleAddSpecialPrice} className="space-y-4 font-poppins text-xs">
            <div>
              <label className="block text-gray-600 font-semibold mb-1.5">Room Category</label>
              <select
                value={specialForm.roomCategory}
                onChange={(e) => setSpecialForm({ ...specialForm, roomCategory: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold text-gray-700"
              >
                <option value="deluxe">Deluxe AC Room</option>
                <option value="standard">Normal AC Room</option>
                <option value="budget">Non AC Room</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={specialForm.startDate}
                  onChange={(e) => setSpecialForm({ ...specialForm, startDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1.5">End Date</label>
                <input
                  type="date"
                  value={specialForm.endDate}
                  onChange={(e) => setSpecialForm({ ...specialForm, endDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1.5">Rate / Night (₹)</label>
              <input
                type="number"
                min="0"
                value={specialForm.price}
                onChange={(e) => setSpecialForm({ ...specialForm, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold text-gray-700"
                placeholder="e.g. 3500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy hover:bg-navy/90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Add Date Override
            </button>
          </form>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div>
        <h3 className="font-playfair text-xl font-bold text-navy mb-4 flex items-center gap-2">
          <FaBed className="text-gold" /> Individual Rooms Status Dashboard
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {mappedRooms.sort((a, b) => a.roomNo - b.roomNo).map((room, ri) => {
            const st = STATUS_STYLES[room.status]
            const displayPrice = room.displayPrice
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
                    ₹{displayPrice}<span className="text-sm text-gray-500 font-poppins font-normal">/night</span>
                  </p>
                  <p className="font-poppins text-[11px] text-gray-400">
                    (Normal: ₹{room.weekdayPrice} | Peak: ₹{room.peakPrice})
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(room)}
                    title="Change status"
                    className="flex-1 py-2 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold transition-colors"
                  >
                    <FaEdit size={14} className="mr-1" /> Status
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Edit Room Status Modal */}
      {showModal && editRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-playfair font-bold text-navy text-2xl">Edit Room #{editRoom.roomNo}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-navy transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                <input
                  type="text"
                  value={editRoom.type}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 font-poppins text-sm text-gray-500 outline-none cursor-not-allowed"
                  readOnly
                />
              </div>

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

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className="w-full bg-[#d4af37] hover:bg-[#c5a028] text-white font-poppins font-semibold py-3 rounded-lg transition-colors"
                >
                  Update Room Status
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Category Pricing Modal */}
      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-playfair font-bold text-navy text-xl">Edit {editingCategory.name}</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-navy transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Normal Season Price (₹)</label>
                <input
                  type="number"
                  value={categoryForm.price}
                  onChange={(e) => setCategoryForm({ ...categoryForm, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">Peak Season Price (₹)</label>
                <input
                  type="number"
                  value={categoryForm.highSeasonPrice}
                  onChange={(e) => setCategoryForm({ ...categoryForm, highSeasonPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold font-poppins text-sm text-gray-700"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCategorySave}
                  className="w-full bg-[#d4af37] hover:bg-[#c5a028] text-white font-poppins font-semibold py-3 rounded-lg transition-colors"
                >
                  Save Category Pricing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
