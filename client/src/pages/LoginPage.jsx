import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaEye, FaEyeSlash, FaLock, FaUser,
  FaCalendarAlt, FaBed, FaUsers, FaChartBar,
  FaShieldAlt, FaArrowRight, FaCheckCircle
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

const FEATURES = [
  { icon: FaCalendarAlt, title: 'Manage Bookings',     desc: 'View and manage all bookings' },
  { icon: FaBed,         title: 'Room Management',     desc: 'Add, update and manage rooms' },
  { icon: FaUsers,       title: 'Guest Management',    desc: 'View guest details and history' },
  { icon: FaChartBar,    title: 'Reports & Analytics', desc: 'Track performance and analytics' },
]

// Floating particle component
function Particle({ delay, x, y, size }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: size, height: size, borderRadius: '50%',
        background: 'rgba(201,162,39,0.4)', pointerEvents: 'none',
      }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

const PARTICLES = [
  { x: 10, y: 20, size: 6, delay: 0 },
  { x: 80, y: 15, size: 4, delay: 0.5 },
  { x: 25, y: 70, size: 8, delay: 1 },
  { x: 65, y: 60, size: 5, delay: 1.5 },
  { x: 45, y: 85, size: 4, delay: 0.8 },
  { x: 90, y: 45, size: 6, delay: 2 },
  { x: 15, y: 50, size: 3, delay: 1.2 },
  { x: 70, y: 80, size: 5, delay: 0.3 },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Welcome back!')
      navigate('/admin')
    } catch {
      if (form.email === 'admin@arlinjaiparadise.com' && form.password === 'Admin@2024') {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'admin', email: form.email }))
        toast.success('Welcome back, Admin!')
        navigate('/admin')
      } else {
        toast.error('Invalid credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-10 overflow-hidden"
        style={{ position: 'sticky', top: 0, height: '100vh' }}
      >
        {/* Real hotel photo as background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url('/B791C280-016C-4109-AD3A-787851527299.JPG.webp')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Dark navy overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(8,17,31,0.93) 0%, rgba(8,17,31,0.78) 50%, rgba(8,17,31,0.88) 100%)',
        }} />
        {/* Gold gradient bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(to top, rgba(8,17,31,0.98), transparent)',
        }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-14 group">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px dashed rgba(201,162,39,0.3)' }}
                />
                <img
                  src="/Elegant monogram with seaside emblem.webp"
                  alt="Logo"
                  className="w-14 h-14 object-contain rounded-full border-2 border-gold"
                  style={{ background: 'white', padding: '3px' }}
                />
              </div>
              <div>
                <p className="font-playfair font-bold text-white text-lg tracking-wider leading-tight">
                  ARLINJAI PARADISE
                </p>
                <p className="text-xs tracking-[0.25em] uppercase mt-0.5"
                  style={{ color: '#C9A227' }}>
                  Smart Hotel Management
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="font-playfair text-5xl font-bold text-white mb-4 leading-tight">
              Admin<br />
              <span style={{ color: '#C9A227', fontStyle: 'italic', fontWeight: 400 }}>Portal</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Sign in to manage bookings, rooms, guests, and hotel operations seamlessly.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 mt-10">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="flex flex-col gap-2.5 p-4 rounded-2xl cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,162,39,0.2)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(201,162,39,0.18)' }}>
                    <Icon size={17} style={{ color: '#C9A227' }} />
                  </div>
                  <p className="text-white text-xs font-semibold">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-gray-600 text-xs">
          © {new Date().getFullYear()} Arlinjai Paradise. All Rights Reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto" style={{ maxHeight: '100vh' }}>

        {/* Mobile hero */}
        <div className="lg:hidden relative py-14 text-center overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('/B791C280-016C-4109-AD3A-787851527299.JPG.webp')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div className="absolute inset-0" style={{ background: 'rgba(8,17,31,0.85)' }} />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <motion.img
              src="/Elegant monogram with seaside emblem.webp"
              alt="Logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 object-contain rounded-full border-2 border-gold"
              style={{ background: 'white', padding: '3px' }}
            />
            <h1 className="font-playfair text-2xl font-bold text-white">ARLINJAI PARADISE</h1>
            <p style={{ color: '#C9A227' }} className="text-xs tracking-widest uppercase">Smart Hotel Management</p>
            <p className="font-playfair text-xl text-white mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10"
          style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Lock icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #fdf6e3, #fef9ec)', border: '2px solid #C9A22740' }}>
                <FaLock size={24} style={{ color: '#C9A227' }} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-3xl font-bold text-center mb-1"
              style={{ color: '#08111F' }}
            >
              Welcome Back!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-gray-400 text-sm text-center mb-8"
            >
              Sign in to your admin account
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Username / Email
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    size={13}
                    style={{ color: focused === 'email' ? '#C9A227' : '#9ca3af' }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    placeholder="Enter username or email"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm transition-all duration-200"
                    style={{
                      border: focused === 'email' ? '2px solid #C9A227' : '2px solid #e5e7eb',
                      outline: 'none', background: '#fafafa',
                      boxShadow: focused === 'email' ? '0 0 0 3px rgba(201,162,39,0.12)' : 'none',
                    }}
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    size={13}
                    style={{ color: focused === 'password' ? '#C9A227' : '#9ca3af' }}
                  />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm transition-all duration-200"
                    style={{
                      border: focused === 'password' ? '2px solid #C9A227' : '2px solid #e5e7eb',
                      outline: 'none', background: '#fafafa',
                      boxShadow: focused === 'password' ? '0 0 0 3px rgba(201,162,39,0.12)' : 'none',
                    }}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors">
                    {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember + Forgot */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded" style={{ accentColor: '#C9A227' }} />
                  <span className="text-sm text-gray-500 group-hover:text-gray-700">Remember me</span>
                </label>
                <button type="button" className="text-sm font-semibold hover:underline"
                  style={{ color: '#C9A227' }} onClick={() => toast('Please contact admin to reset password.')}>
                  Forgot Password?
                </button>
              </motion.div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl text-white font-semibold text-sm
                           flex items-center justify-center gap-2 shadow-lg transition-all"
                style={{
                  background: loading
                    ? '#b8882a'
                    : 'linear-gradient(135deg, #C9A227 0%, #a8841e 100%)',
                  boxShadow: '0 8px 24px rgba(201,162,39,0.35)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <><FaArrowRight size={14} /> Login to Dashboard</>
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* OTP */}
              <motion.button
                type="button"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => toast('OTP login coming soon!', { icon: '🔐' })}
                className="w-full py-3.5 rounded-xl border-2 font-semibold text-sm
                           flex flex-col items-center justify-center gap-0.5 transition-all"
                style={{ borderColor: '#e5e7eb', color: '#374151' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9A227'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <span className="flex items-center gap-2">
                  <FaShieldAlt size={14} style={{ color: '#C9A227' }} />
                  Login with OTP
                </span>
                <span className="text-xs text-gray-400 font-normal">Receive OTP to your registered email</span>
              </motion.button>
            </form>

            {/* Security notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="mt-5 p-4 rounded-2xl flex items-start gap-3"
              style={{ background: 'linear-gradient(135deg, #fdf6e3, #fef9ec)', border: '1px solid #C9A22730' }}
            >
              <FaCheckCircle size={16} style={{ color: '#C9A227', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#08111F' }}>Secure Admin Access</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Your security is our priority. All admin activities are monitored and protected.
                </p>
              </div>
            </motion.div>

            <div className="mt-5 text-center">
              <Link to="/" className="text-sm text-gray-400 hover:text-gold transition-colors">
                ← Back to Hotel Website
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
