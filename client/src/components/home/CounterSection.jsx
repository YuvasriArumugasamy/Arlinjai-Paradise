import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { FaSmile, FaBed, FaMapMarkerAlt, FaAward } from 'react-icons/fa'
import { STATS } from '../../constants'

const iconMap = [FaSmile, FaBed, FaMapMarkerAlt, FaAward]

function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function CounterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 bg-gold" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = iconMap[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center 
                               mb-4 group-hover:bg-opacity-30 transition-all duration-300">
                  <Icon size={22} className="text-white" />
                </div>
                <div className="font-playfair text-4xl md:text-5xl font-bold text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <p className="font-poppins text-sm text-white text-opacity-85 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
