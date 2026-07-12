import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaUsers, FaBed, FaRulerCombined, FaCheck, FaArrowLeft,
  FaCalendarAlt, FaPhoneAlt, FaWhatsapp, FaTimes, FaChevronLeft, FaChevronRight
} from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { ROOMS, HOTEL_INFO } from '../constants'
import { StarButton } from '../components/common/StarButton'

export default function RoomDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const room = ROOMS.find((r) => r.slug === id)
  const [activeImage, setActiveImage] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-playfair text-3xl text-navy mb-4">Room Not Found</h2>
          <Link to="/rooms" className="btn-gold">View All Rooms</Link>
        </div>
      </div>
    )
  }

  const getLocalDateStr = () => {
    const d = new Date()
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - (offset * 60 * 1000))
    return local.toISOString().split('T')[0]
  }
  const today = getLocalDateStr()

  const handleBookNow = () => {
    const params = new URLSearchParams({ roomType: room.id, checkIn, checkOut, guests })
    navigate(`/booking?${params.toString()}`)
  }

  const prevImage = () => setActiveImage((p) => (p === 0 ? room.images.length - 1 : p - 1))
  const nextImage = () => setActiveImage((p) => (p === room.images.length - 1 ? 0 : p + 1))

  return (
    <div className="min-h-screen bg-lightbg">
      {/* Page Header */}
      <div
        className="relative py-20 md:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.8), rgba(8,17,31,0.8)), url('${room.images[0]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { label: 'Rooms', path: '/rooms' },
                { label: room.name, path: `/rooms/${room.slug}` },
              ]}
            />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mt-4">
            {room.name}
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-poppins text-gray-300">
            <span className="flex items-center gap-2">
              <FaUsers size={12} className="text-gold" />
              {room.minGuests}–{room.guests} Guests
            </span>
            <span className="flex items-center gap-2">
              <FaBed size={12} className="text-gold" />
              {room.bedType}
            </span>
            <span className="flex items-center gap-2">
              <FaRulerCombined size={12} className="text-gold" />
              {room.size} sq.ft
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              {/* Main Image */}
              <div className="relative h-72 md:h-96 cursor-pointer" onClick={() => setLightbox(true)}>
                <img
                  src={room.images[activeImage]}
                  alt={`${room.name} - Image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage() }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 
                             rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition"
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage() }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 
                             rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition"
                >
                  <FaChevronRight size={14} />
                </button>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs 
                               font-poppins px-2 py-1 rounded">
                  {activeImage + 1} / {room.images.length}
                </div>
                <span className="absolute top-3 left-3 bg-gold text-white text-xs font-bold font-poppins px-3 py-1">
                  {room.badge}
                </span>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-sm overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="font-playfair font-bold text-2xl text-navy mb-4">About This Room</h2>
              <p className="font-poppins text-gray-700 text-sm leading-relaxed mb-6">
                {room.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-lightbg rounded-sm">
                  <p className="font-poppins text-xs text-gray-500 mb-1">Floor</p>
                  <p className="font-poppins text-sm font-semibold text-navy">{room.floor}</p>
                </div>
                <div className="text-center p-3 bg-lightbg rounded-sm">
                  <p className="font-poppins text-xs text-gray-500 mb-1">View</p>
                  <p className="font-poppins text-sm font-semibold text-navy">{room.view}</p>
                </div>
                <div className="text-center p-3 bg-lightbg rounded-sm">
                  <p className="font-poppins text-xs text-gray-500 mb-1">Bed Type</p>
                  <p className="font-poppins text-sm font-semibold text-navy">{room.bedType}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="font-playfair font-bold text-2xl text-navy mb-6">Room Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-lightbg rounded-sm"
                  >
                    <div className="w-7 h-7 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck size={10} className="text-white" />
                    </div>
                    <span className="font-poppins text-sm text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="font-playfair font-bold text-2xl text-navy mb-4">Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-poppins">
                {[
                  { label: 'Check-in', value: 'From 12:00 PM' },
                  { label: 'Check-out', value: 'By 11:00 AM' },
                  { label: 'Cancellation', value: '24 hours notice' },
                  { label: 'Pets', value: 'Not allowed' },
                  { label: 'Smoking', value: 'Not allowed' },
                  { label: 'Extra Bed', value: 'Available on request' },
                ].map((p, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{p.label}</span>
                    <span className="text-navy font-medium">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-card p-6 sticky top-24">
              {/* Price */}
              <div className="text-center pb-5 border-b border-gray-100 mb-5">
                <span className="font-playfair text-4xl font-bold text-gold">
                  ₹{room.price.toLocaleString()}
                </span>
                <span className="font-poppins text-sm text-gray-500"> /night</span>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="label-text flex items-center gap-2">
                    <FaCalendarAlt size={11} className="text-gold" />
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text flex items-center gap-2">
                    <FaCalendarAlt size={11} className="text-gold" />
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text flex items-center gap-2">
                    <FaUsers size={11} className="text-gold" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="select-field"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <StarButton
                  onClick={handleBookNow}
                  className="w-full py-4 text-center uppercase tracking-wider"
                >
                  Book This Room
                </StarButton>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${HOTEL_INFO.phone1}`}
                    className="flex items-center justify-center gap-2 border border-gray-200 
                               rounded-sm py-3 font-poppins text-sm text-navy hover:border-gold 
                               transition-colors"
                  >
                    <FaPhoneAlt size={12} className="text-gold" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${HOTEL_INFO.whatsapp.replace(/[\s+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-gray-200 
                               rounded-sm py-3 font-poppins text-sm text-navy hover:border-green-400 
                               transition-colors"
                  >
                    <FaWhatsapp size={12} className="text-green-500" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gold bg-opacity-10 rounded-sm border border-gold border-opacity-20">
                <p className="font-poppins text-xs text-gray-600 text-center">
                  ✓ Best price guaranteed &nbsp; ✓ No hidden charges
                </p>
              </div>
            </div>

            {/* Other Rooms */}
            <div className="mt-6 bg-white rounded-sm shadow-card p-5">
              <h4 className="font-playfair font-semibold text-navy text-base mb-4">Other Rooms</h4>
              <div className="space-y-3">
                {ROOMS.filter((r) => r.id !== room.id).map((r) => (
                  <Link
                    key={r.id}
                    to={`/rooms/${r.slug}`}
                    className="flex gap-3 group hover:bg-lightbg p-2 rounded-sm transition-colors"
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-16 h-12 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins text-sm font-medium text-navy group-hover:text-gold 
                                   transition-colors truncate">
                        {r.name}
                      </p>
                      <p className="font-poppins text-xs text-gold font-bold">
                        ₹{r.price.toLocaleString()}/night
                      </p>                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button
            className="absolute top-4 right-4 text-white z-10 bg-white bg-opacity-20 p-2 rounded-full"
            onClick={() => setLightbox(false)}
          >
            <FaTimes size={20} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white bg-opacity-20 p-3 rounded-full z-10">
            <FaChevronLeft size={20} />
          </button>
          <img
            src={room.images[activeImage]}
            alt=""
            className="max-w-4xl max-h-[85vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white bg-opacity-20 p-3 rounded-full z-10">
            <FaChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
