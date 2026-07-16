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
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true until initial refresh check done

  // Prevent multiple simultaneous refresh calls
  const refreshPromiseRef = useRef(null)

  // ── Core: get a valid access token (refresh if needed) ──────────────────
  const getValidToken = useCallback(async () => {
    if (accessToken) return accessToken

    // De-duplicate: if a refresh is already in-flight, wait for it
    if (refreshPromiseRef.current) return refreshPromiseRef.current

    refreshPromiseRef.current = axios
      .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken)
        setUser(res.data.user)
        return res.data.accessToken
      })
      .catch(() => {
        setAccessToken(null)
        setUser(null)
        return null
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
    setAccessToken(res.data.accessToken)
    setUser(res.data.user)
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
  }

  // ── axios interceptors ───────────────────────────────────────────────────
  useEffect(() => {
    // REQUEST: attach access token to every authAxios call
    const reqId = authAxios.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
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
