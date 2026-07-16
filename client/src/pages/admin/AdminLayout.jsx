import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTachometerAlt, FaCalendarAlt, FaBed, FaImages, FaUsers,
  FaStar, FaChartBar, FaCog, FaBars, FaTimes,
  FaSignOutAlt, FaBell, FaChevronLeft, FaExternalLinkAlt, FaCalendarDay
} from 'react-icons/fa'
import { useAuth, authAxios } from '../../context/AuthContext'
import { API_BASE_URL } from '../../constants'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
  { path: '/admin/bookings', label: 'Bookings', icon: FaCalendarAlt },
  { path: '/admin/calendar', label: 'Calendar', icon: FaCalendarDay },
  { path: '/admin/rooms', label: 'Rooms', icon: FaBed },
  { path: '/admin/gallery', label: 'Gallery', icon: FaImages },
  { path: '/admin/customers', label: 'Customers', icon: FaUsers },
  { path: '/admin/reviews', label: 'Reviews', icon: FaStar },
  { path: '/admin/reports', label: 'Reports', icon: FaChartBar },
  { path: '/admin/notifications', label: 'Notifications', icon: FaBell },
  { path: '/admin/settings', label: 'Settings', icon: FaCog },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const currentPage = navItems.find((n) => isActive(n))?.label || 'Dashboard'

  const [hasPending, setHasPending] = useState(false)

  useEffect(() => {
    const checkRealtimeNotifications = async () => {
      try {
        const [bookingsRes, contactRes] = await Promise.all([
          authAxios.get(`${API_BASE_URL}/bookings?status=pending&limit=1`),
          authAxios.get(`${API_BASE_URL}/contact?status=new&limit=1`),
        ]).catch(() => [null, null])

        const pendingCount = bookingsRes?.data?.total || 0
        const newMsgCount = contactRes?.data?.total || 0
        setHasPending(pendingCount > 0 || newMsgCount > 0)
      } catch {
        setHasPending(false)
      }
    }

    checkRealtimeNotifications()
    const interval = setInterval(checkRealtimeNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

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
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="bell-btn" 
              style={{
                width: 40, height: 40,
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgb(44,44,44)',
                borderRadius: '50%',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '2px 2px 10px rgba(0,0,0,0.13)',
                transition: 'transform 0.1s, background-color 0.3s',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 448 512" className="bell-icon" style={{ width: 16, height: 16 }}>
                <path fill="white" d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"/>
              </svg>
              {/* Gold notification dot */}
              {hasPending && (
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8,
                  background: '#C9A227',
                  borderRadius: '50%',
                  border: '1.5px solid white',
                }} />
              )}
            </button>

            {/* Bell animation styles */}
            <style>{`
              .bell-btn:hover { background-color: rgb(56,56,56) !important; }
              .bell-btn:active { transform: scale(0.8); }
              .bell-btn:hover .bell-icon { animation: bellRing 0.9s both; }
              @keyframes bellRing {
                0%,100% { transform-origin: top; }
                15%  { transform: rotateZ(10deg); }
                30%  { transform: rotateZ(-10deg); }
                45%  { transform: rotateZ(5deg); }
                60%  { transform: rotateZ(-5deg); }
                75%  { transform: rotateZ(2deg); }
              }
            `}</style>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-navy leading-tight">{user.name || 'Admin'}</p>
                {(user.role && (user.role.toLowerCase() !== (user.name || '').toLowerCase())) && (
                  <p className="text-xs text-gray-500 capitalize">{user.role || 'admin'}</p>
                )}
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
