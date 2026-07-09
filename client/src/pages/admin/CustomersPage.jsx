import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaPhoneAlt, FaEnvelope, FaUser } from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'

// Derive customer list from localStorage bookings (offline fallback)
function deriveCustomersFromLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem('arlinjai_bookings') || '[]')
    if (!raw.length) return []

    // Group by phone number to deduplicate
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
      // Keep most recent checkIn as lastVisit
      if (new Date(b.checkIn) > new Date(map[phone].lastVisit)) {
        map[phone].lastVisit = b.checkIn
      }
    })

    const list = Object.values(map)
    // Mark as VIP if 3+ bookings
    list.forEach((c) => { if (c.totalBookings >= 3) c.status = 'VIP' })
    return list.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
  } catch {
    return []
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      try {
        // Try to get customers from bookings API
        const res = await axios.get(`${API_BASE_URL}/dashboard/recent-bookings`, { headers })
        const bookings = res.data.bookings || []

        // Group bookings by guest phone to build customer records
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
          if (new Date(b.checkIn) > new Date(map[phone].lastVisit)) {
            map[phone].lastVisit = b.checkIn
          }
        })

        const list = Object.values(map)
        list.forEach((c) => { if (c.totalBookings >= 3) c.status = 'VIP' })
        setCustomers(list.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit)))
      } catch {
        // Fallback: derive from localStorage
        setCustomers(deriveCustomersFromLocal())
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone && c.phone.includes(search))
  )

  const totalRevenue = customers.reduce((s, c) => s + (c.totalSpent || 0), 0)
  const avgSpend = customers.length > 0 ? Math.round(totalRevenue / customers.length) : 0
  const vipCount = customers.filter((c) => c.status === 'VIP').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Customers</h2>
          <p className="font-poppins text-sm text-gray-500">{customers.length} registered customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'VIP Guests', value: vipCount },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}` },
          { label: 'Avg. Spend', value: `₹${avgSpend.toLocaleString()}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-card">
            <p className="font-poppins text-sm text-gray-500">{stat.label}</p>
            <p className="font-playfair text-2xl font-bold text-navy mt-1">{stat.value}</p>
          </div>
        ))}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-lightbg">
                {['Customer', 'Contact', 'City', 'Bookings', 'Total Spent', 'Last Visit', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-poppins text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 font-poppins text-sm">
                      <svg className="animate-spin h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <FaUser className="text-gray-200 mx-auto mb-3" size={36} />
                    <p className="font-poppins text-sm text-gray-400 font-medium">No customers found</p>
                    <p className="font-poppins text-xs text-gray-300 mt-1">
                      Customers will appear here once bookings are made
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-lightbg transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center
                                       text-white font-bold font-poppins text-sm flex-shrink-0">
                          {(customer.name || '?')[0].toUpperCase()}
                        </div>
                        <p className="font-poppins text-sm font-medium text-navy">{customer.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {customer.email && customer.email !== '—' && (
                        <p className="font-poppins text-xs text-gray-600 flex items-center gap-1.5">
                          <FaEnvelope size={10} className="text-gold" /> {customer.email}
                        </p>
                      )}
                      <p className="font-poppins text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                        <FaPhoneAlt size={10} className="text-gold" /> {customer.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-poppins text-sm text-gray-600">{customer.city}</td>
                    <td className="px-5 py-4 font-poppins text-sm text-navy font-semibold text-center">
                      {customer.totalBookings}
                    </td>
                    <td className="px-5 py-4 font-poppins text-sm font-bold text-navy">
                      ₹{(customer.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-poppins text-sm text-gray-600">
                      {customer.lastVisit
                        ? new Date(customer.lastVisit).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-poppins text-xs font-medium px-2.5 py-1 rounded-full
                        ${customer.status === 'VIP'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'}`}>
                        {customer.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
