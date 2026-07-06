import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { REVIEWS } from '../../constants'
import 'swiper/css'
import 'swiper/css/pagination'

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={14}
          className={i < rating ? 'text-gold' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-sm p-6 sm:p-8 shadow-card mx-2 relative h-full flex flex-col justify-between text-left border border-gray-200 hover:border-gold hover:shadow-card-hover transition-all duration-300">
      <div>
        <FaQuoteLeft className="text-gold opacity-20 mb-3" size={32} />
        <p className="font-poppins text-gray-700 text-sm leading-relaxed mb-4 relative z-10">
          "{review.review}"
        </p>
        <div className="mb-4">
          <StarRating rating={review.rating} />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
        <div className="w-10 h-10 bg-gold bg-opacity-10 border border-gold/20 rounded-full flex items-center justify-center 
                       font-poppins font-bold text-gold text-sm flex-shrink-0">
          {review.avatar}
        </div>
        <div>
          <p className="font-poppins font-semibold text-navy text-sm">{review.name}</p>
          <p className="font-poppins text-xs text-gray-500">
            {review.city} · {review.date}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function GuestReviews() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-20 lg:py-28 bg-lightbg" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-subtitle mb-3"
          >
            Guest Experiences
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            What Our <span className="text-gold italic font-normal">Guests Say</span>
          </motion.h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-4" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => <FaStar key={i} size={16} className="text-gold" />)}
            </div>
            <span className="font-poppins text-gray-600 text-sm">
              5.0 Rating · 500+ Happy Guests
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {REVIEWS.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
