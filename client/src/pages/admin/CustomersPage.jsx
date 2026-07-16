import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaPhoneAlt, FaEnvelope, FaUser, FaCalendarAlt, FaRupeeSign, FaStar } from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'

const STATUS_STYLES = {
  VIP:     { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Regular: { bg: 'bg-gray-100',   text: 'text-gray-600'   },
}

// Derive customer list from localStorage bookings (offline fallback)
function deriveCustomersFromLocal() {
  return []
    const map = {}
    raw.forEach((b) => {
      const phone = b.phone || b.guest?.phone || 'unknown'
      if (!map[phone]) {
        map[phone] = {
          id: phone,
          name: b.guest?.name || b.guest || '—',
          email: b.email || b.guest?.email || '—',
          phone,
          city: b.city || '—',
          totalBookings: 0,
          totalSpent: 0,
          lastVisit: b.checkIn,
          status: 'Regular',
        }
      }
      map[phone].totalBookings += 1
      map[phone].totalSpent += b.amount || b.pricing?.finalAmount || 0
      if (new Date(b.checkIn) > new Date(map[phone].lastVisit)) {
        map[phone].lastVisit = b.checkIn
      }
    })
    const list = Object.values(map)
    list.forEach((c) => { if (c.totalBookings >= 3) c.status = 'VIP' })
    return list.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
  } catch { return [] }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/recent-bookings`, { headers })
        const bookings = res.data.bookings || []
        const map = {}
        bookings.forEach((b) => {
          const phone = b.guest?.phone || 'unknown'
          if (!map[phone]) {
            map[phone] = {
              id: b._id || phone,
              name: b.guest?.name || '—',
              email: b.guest?.email || '—',
              phone,
              city: b.guest?.city || '—',
              totalBookings: 0,
              totalSpent: 0,
              lastVisit: b.checkIn,
              status: 'Regular',
            }
          }
          map[phone].totalBookings += 1
          map[phone].totalSpent += b.pricing?.finalAmount || 0
          if (new Date(b.checkIn) > new Date(map[phone].lastVisit)) map[phone].lastVisit = b.checkIn
        })
        const list = Object.values(map)
        list.forEach((c) => { if (c.totalBookings >= 3) c.status = 'VIP' })
        setCustomers(list.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit)))
      } catch {
        toast.error('Unable to load customer data from the server. Please check your network and login status.')
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return !q ||
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q))
  })

  const totalRevenue = customers.reduce((s, c) => s + (c.totalSpent || 0), 0)
  const avgSpend = customers.length > 0 ? Math.round(totalRevenue / customers.length) : 0
  const vipCount = customers.filter((c) => c.status === 'VIP').length

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Customers</h2>
          <p className="font-poppins text-sm text-gray-500">{customers.length} registered customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length,               icon: FaUser,       color: 'bg-blue-500' },
          { label: 'VIP Guests',      value: vipCount,                       icon: FaStar,       color: 'bg-yellow-400' },
          { label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString()}`, icon: FaRupeeSign,  color: 'bg-gold' },
          { label: 'Avg. Spend',      value: `₹${avgSpend.toLocaleString()}`, icon: FaCalendarAlt, color: 'bg-green-500' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-poppins text-sm text-gray-500">{stat.label}</p>
                  <p className="font-playfair text-2xl font-bold text-navy mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-card p-10 flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-gold" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="font-poppins text-sm text-gray-400">Loading customers...</span>
        </div>
      )}

      {/* ── DESKTOP TABLE (md and above) ──────────────────────── */}
      {!loading && (
        <div className="hidden lg:block bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-lightbg">
                  {['Customer', 'Contact', 'City', 'Bookings', 'Total Spent', 'Last Visit', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-poppins text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <FaUser className="text-gray-200 mx-auto mb-3" size={32} />
                      <p className="font-poppins text-sm text-gray-400">
                        {customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
                      </p>
                    </td>
                  </tr>
                ) : filtered.map((c, i) => {
                  const st = STATUS_STYLES[c.status] || STATUS_STYLES.Regular
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-lightbg transition-colors cursor-pointer"
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center
                                         text-white font-bold font-poppins text-sm flex-shrink-0">
                            {(c.name || '?')[0].toUpperCase()}
                          </div>
                          <p className="font-poppins text-sm font-medium text-navy">{c.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {c.email && c.email !== '—' && (
                          <p className="font-poppins text-xs text-gray-600 flex items-center gap-1.5">
                            <FaEnvelope size={10} className="text-gold flex-shrink-0" /> {c.email}
                          </p>
                        )}
                        <p className="font-poppins text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                          <FaPhoneAlt size={10} className="text-gold flex-shrink-0" /> {c.phone}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-poppins text-sm text-gray-600">{c.city}</td>
                      <td className="px-5 py-4 font-poppins text-sm font-semibold text-navy text-center">{c.totalBookings}</td>
                      <td className="px-5 py-4 font-poppins text-sm font-bold text-navy">₹{(c.totalSpent || 0).toLocaleString()}</td>
                      <td className="px-5 py-4 font-poppins text-sm text-gray-600">{fmt(c.lastVisit)}</td>
                      <td className="px-5 py-4">
                        <span className={`font-poppins text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                          {c.status}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MOBILE CARDS (below md) ──────────────────────────────── */}
      {!loading && (
        <div className="lg:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <FaUser className="text-gray-200 mx-auto mb-3" size={32} />
              <p className="font-poppins text-sm text-gray-400">
                {customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
              </p>
            </div>
          ) : filtered.map((c, i) => {
            const st = STATUS_STYLES[c.status] || STATUS_STYLES.Regular
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelected(c)}
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center
                                   text-white font-bold font-poppins text-sm flex-shrink-0">
                      {(c.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-semibold text-navy">{c.name}</p>
                      <p className="font-poppins text-xs text-gray-400">{c.city}</p>
                    </div>
                  </div>
                  <span className={`font-poppins text-[10px] font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                    {c.status}
                  </span>
                </div>

                {/* Contact */}
                <div className="space-y-1.5 mb-3">
                  {c.email && c.email !== '—' && (
                    <p className="font-poppins text-xs text-gray-500 flex items-center gap-2">
                      <FaEnvelope size={10} className="text-gold flex-shrink-0" /> {c.email}
                    </p>
                  )}
                  <p className="font-poppins text-xs text-gray-500 flex items-center gap-2">
                    <FaPhoneAlt size={10} className="text-gold flex-shrink-0" /> {c.phone}
                  </p>
                </div>

                {/* Bottom stats */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="font-poppins text-xs text-gray-400">Bookings</p>
                    <p className="font-poppins text-sm font-bold text-navy">{c.totalBookings}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-poppins text-xs text-gray-400">Total Spent</p>
                    <p className="font-poppins text-sm font-bold text-gold">₹{(c.totalSpent || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-poppins text-xs text-gray-400">Last Visit</p>
                    <p className="font-poppins text-xs font-medium text-gray-600">{fmt(c.lastVisit)}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── DETAIL MODAL ─────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gold rounded-full flex items-center justify-center text-white font-bold font-poppins">
                  {(selected.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-playfair font-bold text-navy text-lg leading-tight">{selected.name}</p>
                  <span className={`font-poppins text-[10px] font-semibold px-2 py-0.5 rounded-full
                    ${STATUS_STYLES[selected.status]?.bg} ${STATUS_STYLES[selected.status]?.text}`}>
                    {selected.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light"
              >✕</button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              {[
                { icon: FaEnvelope,    label: 'Email',          value: selected.email },
                { icon: FaPhoneAlt,    label: 'Phone',          value: selected.phone },
                { icon: FaUser,        label: 'City',           value: selected.city },
                { icon: FaCalendarAlt, label: 'Last Visit',     value: fmt(selected.lastVisit) },
                { icon: FaCalendarAlt, label: 'Total Bookings', value: selected.totalBookings },
                { icon: FaRupeeSign,   label: 'Total Spent',    value: `₹${(selected.totalSpent || 0).toLocaleString()}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-lightbg rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="font-poppins text-sm font-medium text-navy">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
