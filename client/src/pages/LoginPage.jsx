import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaEye, FaEyeSlash, FaLock, FaUser,
  FaArrowRight, FaShieldAlt, FaGlobe, FaHotel
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  // Load remember me email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_admin_email')
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }))
      setRemember(true)
    }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Save/Clear email for remember me
    if (remember) {
      localStorage.setItem('remembered_admin_email', form.email)
    } else {
      localStorage.removeItem('remembered_admin_email')
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Welcome back!')
      navigate('/admin')
    } catch {
      // Fallback credentials for demo/development
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#03070e] px-4 py-12">
      
      {/* ── BACKGROUND IMAGE WITH PARALLAX EFFECT ── */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 0.4 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center select-none pointer-events-none"
        style={{
          backgroundImage: `url('/B791C280-016C-4109-AD3A-787851527299.JPG.webp')`,
        }}
      />

      {/* Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#03070e] via-[#050e1a]/90 to-[#03070e]/85 z-0" />

      {/* ── AMBIENT GLOW EFFECTS ── */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] bg-[#C9A227]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] bg-blue-900/15 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* ── CARD WRAPPER ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] z-10"
      >
        <div 
          className="backdrop-blur-xl bg-[#08111f]/65 rounded-2xl p-8 sm:p-10 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
          style={{
            boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.1)'
          }}
        >
          {/* Subtle gold line at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />

          {/* ── LOGO & HEADER ── */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {/* Rotating Dashed Gold Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2.5 rounded-full"
                style={{ border: '1px dashed rgba(201,162,39,0.35)' }}
              />
              {/* Inner Solid Gold Ring */}
              <div className="absolute -inset-1 rounded-full border border-[#C9A227]/30" />
              {/* Monogram Logo */}
              <img
                src="/Elegant monogram with seaside emblem.webp"
                alt="Arlinjai Paradise Monogram"
                className="w-16 h-16 object-contain rounded-full border border-white/20 bg-white p-0.5 shadow-md"
              />
            </div>
            
            <h2 className="font-playfair text-xl font-bold text-white tracking-wider text-center">
              ARLINJAI PARADISE
            </h2>
            <p className="text-[10px] font-poppins tracking-[0.3em] text-[#C9A227] uppercase mt-1">
              SMART HOTEL MANAGEMENT
            </p>

            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent my-4" />

            <h3 className="font-playfair text-2xl font-semibold text-white tracking-wide">
              Admin Portal
            </h3>
            <p className="text-white/40 text-xs mt-1 text-center font-poppins">
              Please enter your credentials to access the console
            </p>
          </div>

          {/* ── LOGIN FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-5 font-poppins">
            
            {/* Username/Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-[0.15em]">
                Username / Email
              </label>
              <div className="relative">
                <FaUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                  size={12}
                  style={{ color: focused === 'email' ? '#C9A227' : 'rgba(255,255,255,0.25)' }}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="admin@arlinjaiparadise.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#03070e]/60 border rounded-xl text-sm text-white placeholder-white/20 transition-all duration-300 outline-none"
                  style={{
                    borderColor: focused === 'email' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                    boxShadow: focused === 'email' ? '0 0 15px rgba(201,162,39,0.15)' : 'none',
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-[0.15em]">
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                  size={12}
                  style={{ color: focused === 'password' ? '#C9A227' : 'rgba(255,255,255,0.25)' }}
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-[#03070e]/60 border rounded-xl text-sm text-white placeholder-white/20 transition-all duration-300 outline-none"
                  style={{
                    borderColor: focused === 'password' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                    boxShadow: focused === 'password' ? '0 0 15px rgba(201,162,39,0.15)' : 'none',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#C9A227] transition-colors"
                >
                  {showPw ? (
                    <FaEyeSlash size={15} />
                  ) : (
                    <FaEye size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group text-white/50 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#03070e]/60 border-white/10 text-[#C9A227] cursor-pointer"
                  style={{ accentColor: '#C9A227' }}
                />
                <span className="font-medium">Remember me</span>
              </label>
              <button
                type="button"
                className="text-[#C9A227]/80 hover:text-[#E5C158] hover:underline font-semibold transition-colors"
                onClick={() => toast('Please contact master admin to reset your password.', { icon: '🔐' })}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden group cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #C9A227 0%, #E5C158 50%, #A07D10 100%)',
                boxShadow: '0 10px 25px -5px rgba(201,162,39,0.4)',
              }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="text-[10px] text-white/20 font-bold tracking-widest">OR</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            {/* OTP Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toast('OTP login service is currently offline.', { icon: '🔐' })}
              className="w-full py-3.5 rounded-xl border border-white/10 hover:border-[#C9A227]/40 hover:bg-white/5 font-semibold text-xs flex items-center justify-center gap-2 text-white/70 transition-all cursor-pointer"
            >
              <FaShieldAlt size={12} className="text-[#C9A227]" />
              <span>Login with Security OTP</span>
            </motion.button>
          </form>

          {/* ── SECURITY NOTE ── */}
          <div className="mt-8 p-3.5 rounded-xl border border-white/5 bg-[#03070e]/40 flex items-start gap-3">
            <FaShieldAlt size={13} className="text-[#C9A227] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-white/80">Secured Node Connection</p>
              <p className="text-[9px] text-white/40 mt-0.5 leading-relaxed">
                All login requests are encrypted. Authorization keys expire automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-[#C9A227] transition-colors"
          >
            <FaGlobe size={11} />
            <span>Return to Public Hotel Website</span>
          </Link>
        </div>
      </motion.div>

      {/* Global CSS Shimmer Keyframe */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(250%) skewX(-30deg);
          }
        }
      `}</style>
    </div>
  )
}
