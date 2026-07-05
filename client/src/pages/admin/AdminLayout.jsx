import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTachometerAlt, FaCalendarAlt, FaBed, FaImages, FaUsers,
  FaStar, FaEnvelope, FaChartBar, FaCog, FaBars, FaTimes,
  FaSignOutAlt, FaBell, FaChevronLeft, FaExternalLinkAlt
} from 'react-icons/fa'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
  { path: '/admin/bookings', label: 'Bookings', icon: FaCalendarAlt },
  { path: '/admin/rooms', label: 'Rooms', icon: FaBed },
  { path: '/admin/gallery', label: 'Gallery', icon: FaImages },
  { path: '/admin/customers', label: 'Customers', icon: FaUsers },
  { path: '/admin/reviews', label: 'Reviews', icon: FaStar },
  { path: '/admin/messages', label: 'Messages', icon: FaEnvelope },
  { path: '/admin/reports', label: 'Reports', icon: FaChartBar },
  { path: '/admin/settings', label: 'Settings', icon: FaCog },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin","role":"admin"}')

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const currentPage = navItems.find((n) => isActive(n))?.label || 'Dashboard'

  return (
    <div className="flex h-screen bg-lightbg overflow-hidden font-poppins">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col bg-navy text-white flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="p-4 border-b border-white border-opacity-10 flex items-center justify-between">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-playfair font-bold text-sm text-white leading-tight">
                  ARLINJAI PARADISE
                </span>
                <span className="text-gold text-xs font-poppins mt-0.5">Admin Panel</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1.5"
          >
            <FaChevronLeft
              size={14}
              className={`transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-sm mb-0.5
                  transition-all duration-200 group
                  ${active
                    ? 'bg-gold text-white'
                    : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'
                  }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={16} className="flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* Bottom: View Site + Logout */}
        <div className="p-3 border-t border-white border-opacity-10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 mx-0 rounded-sm text-gray-400 
                       hover:bg-white hover:bg-opacity-5 hover:text-white transition-all duration-200"
          >
            <FaExternalLinkAlt size={14} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">View Website</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-gray-400 
                       hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 transition-all duration-200"
          >
            <FaSignOutAlt size={14} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-navy text-white z-50 flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-white border-opacity-10 flex items-center justify-between">
                <div>
                  <span className="font-playfair font-bold text-sm text-white">ARLINJAI PARADISE</span>
                  <p className="text-gold text-xs mt-0.5">Admin Panel</p>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <FaTimes size={18} />
                </button>
              </div>
              <nav className="flex-1 py-4 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-sm mb-0.5
                        ${active ? 'bg-gold text-white' : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'}`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
              <div className="p-3 border-t border-white border-opacity-10">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400">
                  <FaSignOutAlt size={14} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-navy p-1.5"
            >
              <FaBars size={18} />
            </button>
            <div>
              <h1 className="font-playfair font-bold text-navy text-lg">{currentPage}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-navy transition-colors p-2">
              <FaBell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-navy leading-tight">{user.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
