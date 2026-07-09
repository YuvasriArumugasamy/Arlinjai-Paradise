import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaThumbtack, FaCalendarAlt, FaUsers, FaPhoneAlt } from 'react-icons/fa'

export default function CalendarPage() {
  const [startDate, setStartDate] = useState('2026-07-07')
  const [selectedRoomType, setSelectedRoomType] = useState('All')

  // Generate 14 days starting from Wed 08 Jul (dummy data to match image)
  const days = [
    { day: 'WED', date: '08 Jul', active: true },
    { day: 'THU', date: '09 Jul' },
    { day: 'FRI', date: '10 Jul' },
    { day: 'SAT', date: '11 Jul' },
    { day: 'SUN', date: '12 Jul' },
    { day: 'MON', date: '13 Jul' },
    { day: 'TUE', date: '14 Jul' },
    { day: 'WED', date: '15 Jul' },
    { day: 'THU', date: '16 Jul' },
    { day: 'FRI', date: '17 Jul' },
    { day: 'SAT', date: '18 Jul' },
    { day: 'SUN', date: '19 Jul' },
    { day: 'MON', date: '20 Jul' },
    { day: 'TUE', date: '21 Jul' },
  ]

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

  const allocations = []

  return (
    <div className="flex flex-col gap-6 font-poppins">
      
      {/* Main Calendar Card — full width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              <FaChevronLeft size={10} /> Prev 14 Days
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Today
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
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
                <div key={i} className={`flex-1 min-w-[70px] flex flex-col items-center justify-center p-2 border-r border-gray-100 ${d.active ? 'border-t-2 border-t-gold' : ''}`}>
                  <span className={`text-[10px] font-bold ${d.active ? 'text-gold' : 'text-gray-400'}`}>{d.day}</span>
                  <span className={`text-xs font-semibold ${d.active ? 'text-navy' : 'text-gray-700'}`}>{d.date}</span>
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
                  {days.map((_, i) => (
                    <div key={i} className="flex-1 min-w-[70px] border-r border-gray-100 flex items-center justify-center cursor-pointer group">
                      <span className="text-[10px] font-medium text-green-100 group-hover:text-green-500 transition-colors">
                        + Book
                      </span>
                    </div>
                  ))}
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
                    <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 outline-none">
                      <option>-- Select a Room --</option>
                      <option>Room 102</option>
                      <option>Room 201</option>
                      <option>Room 202</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      {/* end Room Allocations */}

    </div>
  )
}
