import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaUser, FaPhoneAlt, FaEnvelope, FaCalendarAlt } from 'react-icons/fa'

const MOCK_CUSTOMERS = []

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const customers = MOCK_CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

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
          { label: 'Total Customers', value: MOCK_CUSTOMERS.length },
          { label: 'VIP Guests', value: MOCK_CUSTOMERS.filter((c) => c.status === 'VIP').length },
          { label: 'Total Revenue', value: `₹${MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}` },
          { label: 'Avg. Spend', value: `₹${Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / MOCK_CUSTOMERS.length).toLocaleString()}` },
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
            placeholder="Search customers..."
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
              {customers.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-lightbg transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center 
                                     text-white font-bold font-poppins text-sm flex-shrink-0">
                        {customer.name[0]}
                      </div>
                      <p className="font-poppins text-sm font-medium text-navy">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-poppins text-xs text-gray-600 flex items-center gap-1.5">
                      <FaEnvelope size={10} className="text-gold" /> {customer.email}
                    </p>
                    <p className="font-poppins text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                      <FaPhoneAlt size={10} className="text-gold" /> {customer.phone}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-poppins text-sm text-gray-600">{customer.city}</td>
                  <td className="px-5 py-4 font-poppins text-sm text-navy font-semibold text-center">
                    {customer.totalBookings}
                  </td>
                  <td className="px-5 py-4 font-poppins text-sm font-bold text-navy">
                    ₹{customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-poppins text-sm text-gray-600">
                    {new Date(customer.lastVisit).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-poppins text-xs font-medium px-2.5 py-1 rounded-full 
                      ${customer.status === 'VIP' ? 'bg-gold bg-opacity-15 text-gold' : 'bg-gray-100 text-gray-600'}`}>
                      {customer.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
