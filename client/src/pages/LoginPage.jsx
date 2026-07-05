import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
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
      toast.error(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(8,17,31,0.85), rgba(8,17,31,0.85)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-playfair text-2xl font-bold text-white tracking-wider">
              ARLINJAI PARADISE
            </h1>
            <p className="font-poppins text-gold text-xs tracking-widest uppercase mt-1">
              Admin Portal
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-sm shadow-2xl p-8">
          <h2 className="font-playfair text-2xl font-bold text-navy mb-2">Sign In</h2>
          <p className="font-poppins text-gray-500 text-sm mb-8">
            Enter your credentials to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text flex items-center gap-2">
                <FaEnvelope size={11} className="text-gold" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@arlinjaiparadise.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-text flex items-center gap-2">
                <FaLock size={11} className="text-gold" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                >
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link to="/" className="font-poppins text-sm text-gray-500 hover:text-gold transition-colors">
              ← Back to Hotel Website
            </Link>
          </div>
        </div>

        <p className="text-center font-poppins text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Arlinjai Paradise. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
