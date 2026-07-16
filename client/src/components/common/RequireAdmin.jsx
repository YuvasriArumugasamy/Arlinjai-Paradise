import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')
  let user = null
  try {
    user = rawUser ? JSON.parse(rawUser) : null
  } catch (e) {
    user = null
  }
  const location = useLocation()

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  if (!user || (user.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
