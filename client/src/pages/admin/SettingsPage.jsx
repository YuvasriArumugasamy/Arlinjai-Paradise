import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSave, FaHotel, FaLock, FaBell, FaCalendarAlt, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { HOTEL_INFO, API_BASE_URL } from '../../constants'
import { authAxios } from '../../context/AuthContext'
import PushNotificationCard from '../../components/admin/PushNotificationCard'

const TABS = [
  { id: 'general', label: 'General', icon: FaHotel },
  { id: 'blocking', label: 'Room Blocking', icon: FaCalendarAlt },
  { id: 'notifications', label: 'Notifications', icon: FaBell },
  { id: 'security', label: 'Security', icon: FaLock },
]

const ROOMS_LIST = [
  { id: '101', name: 'Room 101 (Deluxe AC)', type: 'Deluxe AC' },
  { id: '102', name: 'Room 102 (Deluxe AC)', type: 'Deluxe AC' },
  { id: '103', name: 'Room 103 (Deluxe AC)', type: 'Deluxe AC' },
  { id: '104', name: 'Room 104 (Deluxe AC)', type: 'Deluxe AC' },
  { id: '105', name: 'Room 105 (Deluxe AC)', type: 'Deluxe AC' },
  { id: '201', name: 'Room 201 (Normal AC)', type: 'Normal AC' },
  { id: '301', name: 'Room 301 (Normal AC)', type: 'Normal AC' },
  { id: '302', name: 'Room 302 (Normal AC)', type: 'Normal AC' },
  { id: '303', name: 'Room 303 (Normal AC)', type: 'Normal AC' },
  { id: '304', name: 'Room 304 (Normal AC)', type: 'Normal AC' },
  { id: '305', name: 'Room 305 (Normal AC)', type: 'Normal AC' },
  { id: '202', name: 'Room 202 (Non AC)', type: 'Non AC' },
  { id: '203', name: 'Room 203 (Non AC)', type: 'Non AC' },
  { id: '204', name: 'Room 204 (Non AC)', type: 'Non AC' },
  { id: '205', name: 'Room 205 (Non AC)', type: 'Non AC' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const defaultSettings = {
    hotelName: HOTEL_INFO.name,
    tagline: HOTEL_INFO.tagline,
    address: HOTEL_INFO.address,
    phone1: HOTEL_INFO.phone1,
    phone2: HOTEL_INFO.phone2,
    email: HOTEL_INFO.email,
    checkIn: '12:00',
    checkOut: '11:00',
    emailNotif: true,
    smsNotif: false,
    newBookingAlert: true,
    cancellationAlert: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('arlinjai_settings')
      if (saved) {
        return {
          ...defaultSettings,
          ...JSON.parse(saved),
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
      }
    } catch {}
    return defaultSettings
  })

  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })

  const [blockedRooms, setBlockedRooms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('blockedRooms') || '[]')
    } catch {
      return []
    }
  })

  const [blockingForm, setBlockingForm] = useState({
    roomId: '',
    startDate: '',
    endDate: '',
  })

  const [isPeakSeason, setIsPeakSeason] = useState(() => {
    return localStorage.getItem('isPeakSeason') === 'true'
  })

  const handleTogglePeakSeason = () => {
    const nextVal = !isPeakSeason
    setIsPeakSeason(nextVal)
    localStorage.setItem('isPeakSeason', String(nextVal))
    if (nextVal) {
      toast.success('Peak season pricing activated!')
    } else {
      toast.success('Peak season pricing deactivated')
    }
  }

  const [timingRules, setTimingRules] = useState({
    standardCheckInTime: '11:00',
    standardCheckOutTime: '09:00',
    earlyCheckInFee: 500,
    lateCheckOutFee: 500,
  })

  useEffect(() => {
    authAxios.get('/settings')
      .then(res => {
        if (res.data?.success && res.data?.settings) {
          const s = res.data.settings
          setTimingRules({
            standardCheckInTime: s.standardCheckInTime || '11:00',
            standardCheckOutTime: s.standardCheckOutTime || '09:00',
            earlyCheckInFee: s.earlyCheckInFee !== undefined ? s.earlyCheckInFee : 500,
            lateCheckOutFee: s.lateCheckOutFee !== undefined ? s.lateCheckOutFee : 500,
          })
        }
      })
      .catch(err => console.error('Failed to load timing rules:', err))
  }, [])

  const handleSaveTimingRules = async () => {
    try {
      await authAxios.put('/settings', timingRules)
      toast.success('Check-in / Check-out timing and fee settings updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update timing rules')
    }
  }

  const handleSave = () => {
    try {
      localStorage.setItem('arlinjai_settings', JSON.stringify(settings))
      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings')
    }
  }

  const handleChangePassword = async () => {
    if (!settings.currentPassword) {
      toast.error('Please enter your current password')
      return
    }
    if (!settings.newPassword || settings.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (settings.newPassword !== settings.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_BASE_URL}/auth/change-password`,
        { currentPassword: settings.currentPassword, newPassword: settings.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Password changed successfully!')
      setSettings(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
  }

  const handleBlockRoom = (e) => {
    e.preventDefault()
    if (!blockingForm.roomId) {
      toast.error('Please select a room')
      return
    }
    if (!blockingForm.startDate || !blockingForm.endDate) {
      toast.error('Please select start and end dates')
      return
    }
    if (new Date(blockingForm.startDate) > new Date(blockingForm.endDate)) {
      toast.error('Start date cannot be after end date')
      return
    }

    const room = ROOMS_LIST.find(r => r.id === blockingForm.roomId)
    const newBlock = {
      id: Date.now().toString(),
      roomId: blockingForm.roomId,
      roomName: room ? room.name : `Room ${blockingForm.roomId}`,
      roomType: room ? room.type : '',
      startDate: blockingForm.startDate,
      endDate: blockingForm.endDate,
    }

    const updated = [...blockedRooms, newBlock]
    setBlockedRooms(updated)
    localStorage.setItem('blockedRooms', JSON.stringify(updated))
    toast.success(`${room ? room.name.split(' (')[0] : 'Room'} blocked successfully`)
    setBlockingForm({ roomId: '', startDate: '', endDate: '' })
  }

  const handleUnblockRoom = (id) => {
    const updated = blockedRooms.filter(block => block.id !== id)
    setBlockedRooms(updated)
    localStorage.setItem('blockedRooms', JSON.stringify(updated))
    toast.success('Room unblocked successfully')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-navy">Settings</h2>
        <p className="font-poppins text-sm text-gray-500">Manage hotel configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                    ${activeTab === tab.id
                      ? 'bg-gold text-white font-medium'
                      : 'text-gray-600 hover:bg-lightbg hover:text-navy'
                    }`}
                >
                  <Icon size={14} />
                  <span className="font-poppins text-sm">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-card p-6"
        >
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="font-playfair font-bold text-navy text-lg border-b border-gray-100 pb-4">
                General Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-text">Hotel Name</label>
                  <input
                    type="text"
                    value={settings.hotelName}
                    onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Phone 1</label>
                  <input type="tel" value={settings.phone1} onChange={(e) => setSettings({ ...settings, phone1: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">Phone 2</label>
                  <input type="tel" value={settings.phone2} onChange={(e) => setSettings({ ...settings, phone2: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">Email</label>
                  <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">Check-in Time</label>
                  <input type="time" value={timingRules.standardCheckInTime} onChange={(e) => setTimingRules({ ...timingRules, standardCheckInTime: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">Check-out Time</label>
                  <input type="time" value={timingRules.standardCheckOutTime} onChange={(e) => setTimingRules({ ...timingRules, standardCheckOutTime: e.target.value })} className="input-field" />
                </div>
              </div>

              {/* Check-in / Check-out & Timing Fee Rules */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-playfair font-bold text-navy text-lg flex items-center gap-2">
                      ⏰ Standard Timing & Extra Fee Rules
                    </h4>
                    <p className="font-poppins text-xs text-gray-500 mt-0.5">
                      Configure standard hotel check-in/out times and extra charges applied for early arrival or late departure.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveTimingRules}
                    className="btn-gold flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm"
                  >
                    <FaSave size={12} /> Save Timing Rules
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div>
                    <label className="label-text flex items-center gap-1.5 font-semibold text-navy">
                      <span>Standard Check-in Time</span>
                    </label>
                    <input
                      type="time"
                      value={timingRules.standardCheckInTime}
                      onChange={(e) => setTimingRules({ ...timingRules, standardCheckInTime: e.target.value })}
                      className="input-field bg-white"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Default standard check-in time for guests (e.g. 11:00)</p>
                  </div>

                  <div>
                    <label className="label-text flex items-center gap-1.5 font-semibold text-navy">
                      <span>Standard Check-out Time</span>
                    </label>
                    <input
                      type="time"
                      value={timingRules.standardCheckOutTime}
                      onChange={(e) => setTimingRules({ ...timingRules, standardCheckOutTime: e.target.value })}
                      className="input-field bg-white"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Default standard check-out time for guests (e.g. 09:00)</p>
                  </div>

                  <div>
                    <label className="label-text flex items-center gap-1.5 font-semibold text-navy">
                      <span>Early Check-in Extra Fee (₹)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={timingRules.earlyCheckInFee}
                      onChange={(e) => setTimingRules({ ...timingRules, earlyCheckInFee: Number(e.target.value) })}
                      className="input-field bg-white"
                      placeholder="500"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Extra fee charged if guest checks in before standard check-in time</p>
                  </div>

                  <div>
                    <label className="label-text flex items-center gap-1.5 font-semibold text-navy">
                      <span>Late Check-out Extra Fee (₹)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={timingRules.lateCheckOutFee}
                      onChange={(e) => setTimingRules({ ...timingRules, lateCheckOutFee: Number(e.target.value) })}
                      className="input-field bg-white"
                      placeholder="500"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Extra fee charged if guest checks out after standard check-out time</p>
                  </div>
                </div>
              </div>

              {/* Peak Season Pricing */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="bg-[#FFFDF4] border border-[#E5D0A1] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔥</span>
                      <h4 className="font-playfair font-bold text-navy text-base">
                        Peak Season Pricing
                      </h4>
                    </div>
                    <p className="font-poppins text-xs text-gray-500 leading-relaxed max-w-2xl">
                      When activated, the website will automatically transition to peak season rates (Deluxe AC: ₹5,000 | Normal AC: ₹4,000 | Non AC: ₹3,000).
                    </p>
                    
                    {isPeakSeason && (
                      <div className="mt-4 inline-flex items-center gap-2 bg-[#FFF6E5] text-[#A07D10] text-[10px] font-bold font-poppins px-3 py-1.5 rounded-lg border border-[#F5E5C4]">
                        <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full animate-ping" />
                        PEAK SEASON RATES ARE LIVE
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleTogglePeakSeason}
                    className={`w-14 h-7 rounded-full relative transition-colors duration-300 flex-shrink-0
                      ${isPeakSeason ? 'bg-[#C9A227]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300
                      ${isPeakSeason ? 'left-[30px]' : 'left-[2px]'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-playfair font-bold text-navy text-lg border-b border-gray-100 pb-4">
                Notification Preferences
              </h3>

              <PushNotificationCard />

              {[
                { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive booking notifications via email' },
                { key: 'smsNotif', label: 'SMS Notifications', desc: 'Receive booking notifications via SMS' },
                { key: 'newBookingAlert', label: 'New Booking Alerts', desc: 'Alert when a new booking is received' },
                { key: 'cancellationAlert', label: 'Cancellation Alerts', desc: 'Alert when a booking is cancelled' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-lightbg rounded-lg">
                  <div>
                    <p className="font-poppins text-sm font-medium text-navy">{item.label}</p>
                    <p className="font-poppins text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200
                      ${settings[item.key] ? 'bg-gold' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200
                      ${settings[item.key] ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-playfair font-bold text-navy text-lg border-b border-gray-100 pb-4">
                Change Password
              </h3>
              <div className="space-y-4 max-w-sm">
                {/* Current Password */}
                <div>
                  <label className="label-text">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPass.current ? 'text' : 'password'}
                      value={settings.currentPassword}
                      onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => ({ ...p, current: !p.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                    >
                      {showPass.current ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
                {/* New Password */}
                <div>
                  <label className="label-text">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass.new ? 'text' : 'password'}
                      value={settings.newPassword}
                      onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => ({ ...p, new: !p.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                    >
                      {showPass.new ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
                <div>
                  <label className="label-text">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPass.confirm ? 'text' : 'password'}
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                    >
                      {showPass.confirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <button onClick={handleChangePassword} className="btn-gold flex items-center gap-2 px-8 py-3">
                  <FaLock size={12} /> Update Password
                </button>
              </div>
            </div>
          )}

          {/* Room Blocking Center */}
          {activeTab === 'blocking' && (
            <div className="space-y-5">
              <h3 className="font-playfair font-bold text-navy text-lg border-b border-gray-100 pb-4">
                Room Blocking Center
              </h3>
              
              <div className="bg-[#FFF5F5] border border-red-100 rounded-2xl p-6 shadow-sm">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 flex-shrink-0">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-navy text-lg leading-tight">
                      Room Blocking Center
                    </h3>
                    <p className="font-poppins text-xs text-gray-500 mt-1">
                      Block rooms for maintenance or custom bookings
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBlockRoom} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Select Room
                    </label>
                    <select
                      value={blockingForm.roomId}
                      onChange={(e) => setBlockingForm({ ...blockingForm, roomId: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Choose Room --</option>
                      {ROOMS_LIST.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={blockingForm.startDate}
                        onChange={(e) => setBlockingForm({ ...blockingForm, startDate: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={blockingForm.endDate}
                        onChange={(e) => setBlockingForm({ ...blockingForm, endDate: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D32F2F] hover:bg-red-700 text-white font-poppins font-semibold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    + Block Room
                  </button>
                </form>

                {/* Blocked Dates List */}
                <div className="mt-8 border-t border-red-100 pt-6">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Blocked Dates
                  </label>
                  
                  {blockedRooms.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No blocked dates currently.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {blockedRooms.map((block) => (
                        <div
                          key={block.id}
                          className="flex items-center justify-between bg-white border border-red-100 rounded-xl p-4 shadow-xs"
                        >
                          <div>
                            <p className="font-poppins font-bold text-sm text-navy">
                              {block.roomName}
                            </p>
                            <p className="font-poppins text-xs text-gray-500 mt-1">
                              📅 {block.startDate} to {block.endDate}
                            </p>
                          </div>
                          <button
                            onClick={() => handleUnblockRoom(block.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-1.5 border border-red-100 hover:border-red-200 rounded-lg transition-colors"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab !== 'blocking' && activeTab !== 'security' && (
            <div className="mt-8 pt-5 border-t border-gray-100">
              <button onClick={handleSave} className="btn-gold flex items-center gap-2 px-8 py-3">
                <FaSave size={14} /> Save Changes
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
