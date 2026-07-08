import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSave, FaHotel, FaLock, FaBell, FaEnvelope, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { HOTEL_INFO } from '../../constants'

const TABS = [
  { id: 'general', label: 'General', icon: FaHotel },
  { id: 'blocking', label: 'Room Blocking', icon: FaCalendarAlt },
  { id: 'notifications', label: 'Notifications', icon: FaBell },
  { id: 'email', label: 'Email', icon: FaEnvelope },
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
  const [settings, setSettings] = useState({
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
  })

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

  const handleSave = () => {
    toast.success('Settings saved successfully')
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
                  <input type="time" value={settings.checkIn} onChange={(e) => setSettings({ ...settings, checkIn: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">Check-out Time</label>
                  <input type="time" value={settings.checkOut} onChange={(e) => setSettings({ ...settings, checkOut: e.target.value })} className="input-field" />
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

          {/* Email Config */}
          {activeTab === 'email' && (
            <div className="space-y-5">
              <h3 className="font-playfair font-bold text-navy text-lg border-b border-gray-100 pb-4">
                Email Configuration (SMTP)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-text">SMTP Host</label>
                  <input type="text" value={settings.smtpHost} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">SMTP Port</label>
                  <input type="text" value={settings.smtpPort} onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-text">SMTP Username</label>
                  <input type="email" value={settings.smtpUser} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} placeholder="your@email.com" className="input-field" />
                </div>
                <div>
                  <label className="label-text">SMTP Password</label>
                  <input type="password" value={settings.smtpPass} onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })} placeholder="App password" className="input-field" />
                </div>
              </div>
              <p className="font-poppins text-xs text-gray-500 bg-blue-50 border border-blue-200 p-3 rounded">
                💡 For Gmail, use App Passwords (not your regular Gmail password). Enable 2FA and create an App Password in your Google Account settings.
              </p>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-playfair font-bold text-navy text-lg border-b border-gray-100 pb-4">
                Change Password
              </h3>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="label-text">Current Password</label>
                  <input
                    type="password"
                    value={settings.currentPassword}
                    onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">New Password</label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Confirm New Password</label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
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

          {activeTab !== 'blocking' && (
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
