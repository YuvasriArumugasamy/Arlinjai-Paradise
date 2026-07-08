import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ScrollToTop from './components/common/ScrollToTop'
import WhatsAppButton from './components/common/WhatsAppButton'
import PageLoader from './components/common/PageLoader'
import { useFCM } from './hooks/useFCM'

import HomePage from './pages/HomePage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailsPage from './pages/RoomDetailsPage'
import GalleryPage from './pages/GalleryPage'
import ExplorePage from './pages/ExplorePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import BookingsPage from './pages/admin/BookingsPage'
import CalendarPage from './pages/admin/CalendarPage'
import RoomsAdminPage from './pages/admin/RoomsAdminPage'
import GalleryAdminPage from './pages/admin/GalleryAdminPage'
import CustomersPage from './pages/admin/CustomersPage'
import ReviewsAdminPage from './pages/admin/ReviewsAdminPage'
import MessagesPage from './pages/admin/MessagesPage'
import ReportsPage from './pages/admin/ReportsPage'
import SettingsPage from './pages/admin/SettingsPage'

const ScrollRestoration = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const isAdminRoute = (pathname) => pathname.startsWith('/admin')

const Layout = ({ children }) => {
  const { pathname } = useLocation()
  const admin = isAdminRoute(pathname)

  return (
    <div style={{ overflowX: 'hidden', maxWidth: '100vw', position: 'relative' }}>
      {!admin && <Navbar />}
      <main>{children}</main>
      {!admin && <Footer />}
      {!admin && <ScrollToTop />}
      {!admin && <WhatsAppButton />}
    </div>
  )
}

function App() {
  useFCM() // Initialize Firebase Cloud Messaging

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#08111F',
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            borderRadius: '4px',
          },
          success: {
            iconTheme: {
              primary: '#C9A227',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ScrollRestoration />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="rooms" element={<RoomsAdminPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="reviews" element={<ReviewsAdminPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
