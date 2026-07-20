/**
 * AuthContext — centralized auth state
 *
 * - accessToken lives in memory (React state) only — never localStorage
 * - refreshToken lives in HttpOnly cookie (server sets it, JS cannot read it)
 * - On every app load, we call /api/auth/refresh with the cookie to restore session
 * - axios interceptor auto-retries failed requests after token refresh
 */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

const AuthContext = createContext(null)

// Shared axios instance used by all admin API calls
export const authAxios = axios.create({ baseURL: API_BASE_URL, withCredentials: true })

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('token') || null
  })
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true) // true until initial refresh check done

  // Prevent multiple simultaneous refresh calls
  const refreshPromiseRef = useRef(null)

  // ── Core: get a valid access token (refresh if needed) ──────────────────
  const getValidToken = useCallback(async () => {
    const currentToken = accessToken || localStorage.getItem('token')

    // De-duplicate: if a refresh is already in-flight, wait for it
    if (refreshPromiseRef.current) return refreshPromiseRef.current

    const storedRefreshToken = localStorage.getItem('refreshToken')

    refreshPromiseRef.current = axios
      .post(`${API_BASE_URL}/auth/refresh`, { refreshToken: storedRefreshToken }, { withCredentials: true })
      .then((res) => {
        const newAccessToken = res.data.accessToken
        const newUser = res.data.user
        const newRefreshToken = res.data.refreshToken

        if (newAccessToken) {
          setAccessToken(newAccessToken)
          localStorage.setItem('token', newAccessToken)
        }
        if (newUser) {
          setUser(newUser)
          localStorage.setItem('user', JSON.stringify(newUser))
        }
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }
        return newAccessToken || currentToken
      })
      .catch((err) => {
        // Only clear session if server explicitly returns 401/403
        if (err.response?.status === 401 || err.response?.status === 403) {
          setAccessToken(null)
          setUser(null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          return null
        }
        return currentToken
      })
      .finally(() => {
        refreshPromiseRef.current = null
      })

    return refreshPromiseRef.current
  }, [accessToken])

  // ── Initial session restore on app mount ────────────────────────────────
  useEffect(() => {
    getValidToken().finally(() => setLoading(false))
  }, []) // run once on mount

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    )
    const { accessToken: newToken, refreshToken: newRefreshToken, user: newUser } = res.data

    setAccessToken(newToken)
    setUser(newUser)

    if (newToken) localStorage.setItem('token', newToken)
    if (newUser) localStorage.setItem('user', JSON.stringify(newUser))
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)

    return res.data
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true })
    } catch (_) {
      // ignore network errors on logout
    }
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
  }

  // ── axios interceptors ───────────────────────────────────────────────────
  useEffect(() => {
    // REQUEST: attach access token to every authAxios call
    const reqId = authAxios.interceptors.request.use((config) => {
      const token = accessToken || localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    })

    // RESPONSE: on 401, try one silent refresh then retry original request
    const resId = authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config
        if (error.response?.status === 401 && !original._retried) {
          original._retried = true
          const newToken = await getValidToken()
          if (newToken) {
            original.headers['Authorization'] = `Bearer ${newToken}`
            return authAxios(original)
          }
          // Refresh also failed → redirect to login
          setAccessToken(null)
          setUser(null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )

    return () => {
      authAxios.interceptors.request.eject(reqId)
      authAxios.interceptors.response.eject(resId)
    }
  }, [accessToken, getValidToken])

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, logout, getValidToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
