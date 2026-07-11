import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaEye, FaEyeSlash, FaLock, FaUser,
  FaCalendarAlt, FaBed, FaUsers, FaChartBar, FaShieldAlt, FaArrowRight
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

const FEATURES = [
  { icon: FaCalendarAlt, title: 'Manage Bookings',    desc: 'View and manage all bookings' },
  { icon: FaBed,         title: 'Room Management',    desc: 'Add, update and manage rooms' },
  { icon: FaUsers,       title: 'Guest Management',   desc: 'View guest details and history' },
  { icon: FaChartBar,    title: 'Reports & Analytics',desc: 'Track performance and analytics' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

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
    } catch (err) {
      // Fallback for demo — allow admin@arlinjaiparadise.com / Admin@2024
      if (form.email === 'admin@arlinjaiparadise.com' && form.password === 'Admin@2024') {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'admin', email: form.email }))
        toast.success('Welcome back, Admin!')
        navigate('/admin')
      } else {
        toast.error(err?.response?.data?.message || 'Invalid credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── LEFT PANEL (hidden on mobile) ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-10 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #08111F 0%, #0d1e35 50%, #08111F 100%)',
        }}
      >
        {/* Background hotel image with overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
          }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(8,17,31,0.92) 0%, rgba(8,17,31,0.75) 100%)',
        }} />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <img
              src="/Elegant monogram with seaside emblem.webp"
              alt="Logo"
              className="w-14 h-14 object-contain rounded-full border-2 border-gold"
              style={{ background: 'white', padding: '4px' }}
            />
            <div>
              <p className="font-playfair font-bold text-white text-lg leading-tight tracking-wider">
                ARLINJAI PARADISE
              </p>
              <p className="text-gold text-xs tracking-[0.2em] uppercase mt-0.5">
                Smart Hotel Management
              </p>
            </div>
          </Link>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-playfair text-4xl font-bold text-white mb-4 leading-tight">
              Admin Portal
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Sign in to manage bookings, rooms, guests, and hotel operations seamlessly.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex flex-col gap-2 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.15)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(201,162,39,0.15)' }}>
                    <Icon size={16} style={{ color: '#C9A227' }} />
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

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile hero */}
        <div
          className="lg:hidden relative py-16 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #08111F 0%, #0d1e35 100%)',
          }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2,
          }} />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <img src="/Elegant monogram with seaside emblem.webp" alt="Logo"
              className="w-16 h-16 object-contain rounded-full border-2 border-gold"
              style={{ background: 'white', padding: '4px' }} />
            <h1 className="font-playfair text-2xl font-bold text-white">ARLINJAI PARADISE</h1>
            <p className="text-gold text-xs tracking-widest uppercase">Smart Hotel Management</p>
            <p className="font-playfair text-xl text-white mt-2">Admin Portal</p>
            <p className="text-gray-400 text-xs max-w-xs px-4">
              Sign in to manage bookings, rooms, guests, and hotel operations seamlessly.
            </p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 bg-white lg:bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: '#fdf6e3', border: '2px solid #C9A22733' }}>
                <FaLock size={24} style={{ color: '#C9A227' }} />
              </div>
            </div>

            <h2 className="font-playfair text-3xl font-bold text-navy text-center mb-1">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Sign in to your admin account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username / Email
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter username or email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                               focus:outline-none focus:border-gold transition-colors bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm
                               focus:outline-none focus:border-gold transition-colors bg-gray-50"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors">
                    {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-gold"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm font-semibold" style={{ color: '#C9A227' }}>
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm
                           flex items-center justify-center gap-2 transition-all duration-300"
                style={{ background: loading ? '#b8882a' : 'linear-gradient(135deg, #C9A227, #a8841e)' }}
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
                  <>
                    <FaArrowRight size={14} /> Login to Dashboard
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* OTP Login (UI only) */}
              <button
                type="button"
                onClick={() => toast('OTP login coming soon!', { icon: '🔐' })}
                className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-600
                           font-semibold text-sm flex items-center justify-center gap-2
                           hover:border-gold hover:text-gold transition-colors"
              >
                <FaShieldAlt size={14} style={{ color: '#C9A227' }} />
                Login with OTP
                <span className="text-xs font-normal text-gray-400">Receive OTP to your registered email</span>
              </button>
            </form>

            {/* Secure notice */}
            <div className="mt-6 p-4 rounded-xl flex items-start gap-3"
              style={{ background: '#fdf6e3', border: '1px solid #C9A22733' }}>
              <FaShieldAlt size={16} style={{ color: '#C9A227', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-sm font-semibold text-navy">Secure Admin Access</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your security is our priority. All admin activities are monitored and protected.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
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
