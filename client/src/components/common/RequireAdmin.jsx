import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Wait for initial token refresh check to finish
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03070e]">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if ((user.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
