import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { REVIEWS, API_BASE_URL } from '../../constants'
import { authAxios } from '../../context/AuthContext'

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const res = await authAxios.get(`${API_BASE_URL}/reviews?limit=100`)
      if (res.data?.success && res.data?.reviews) {
        const mapped = res.data.reviews.map(r => ({
          ...r,
          id: r._id,
          avatar: r.name ? r.name.charAt(0).toUpperCase() : 'G'
        }))
        setReviews(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleApprove = async (id) => {
    try {
      const res = await authAxios.patch(`${API_BASE_URL}/reviews/${id}/approve`, { approved: true })
      if (res.data?.success) {
        toast.success('Review approved and published')
        fetchReviews()
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async (id) => {
    if (window.confirm('Delete this review permanently?')) {
      try {
        const res = await authAxios.delete(`${API_BASE_URL}/reviews/${id}`)
        if (res.data?.success) {
          toast.success('Review deleted')
          fetchReviews()
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to delete review')
      }
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-navy">Reviews Management</h2>
          <p className="font-poppins text-sm text-gray-500">{reviews.length} reviews total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Average Rating', value: avgRating, icon: '⭐' },
          { label: 'Total Reviews', value: reviews.length, icon: '💬' },
          { label: 'Approved', value: reviews.filter((r) => r.approved).length, icon: '✅' },
          { label: '5-Star Reviews', value: reviews.filter((r) => r.rating === 5).length, icon: '🌟' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-card">
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className="font-playfair text-2xl font-bold text-navy">{s.value}</p>
            <p className="font-poppins text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center 
                                 text-white font-bold font-poppins text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-navy text-sm">{review.name}</p>
                    <p className="font-poppins text-xs text-gray-500">{review.city} · {review.date}</p>
                  </div>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, j) => (
                      <FaStar key={j} size={12} className={j < review.rating ? 'text-gold' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="font-poppins text-sm text-gray-700 italic">"{review.review}"</p>
                <p className="font-poppins text-xs text-gray-400 mt-2">Room: {review.roomType}</p>
              </div>

              <div className="flex gap-2 sm:flex-col">
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-1.5 bg-green-100 text-green-700 font-poppins text-xs 
                               font-medium px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <FaCheck size={10} /> Approve
                  </button>
                )}
                {review.approved && (
                  <span className="flex items-center gap-1.5 bg-green-100 text-green-700 font-poppins text-xs 
                                  font-medium px-3 py-2 rounded-lg">
                    <FaCheck size={10} /> Published
                  </span>
                )}
                <button
                  onClick={() => handleReject(review.id)}
                  className="flex items-center gap-1.5 bg-red-100 text-red-700 font-poppins text-xs 
                             font-medium px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTrash size={10} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
