import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-navy z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <h2 className="font-playfair text-white text-2xl font-bold tracking-wider">
            ARLINJAI PARADISE
          </h2>
          <p className="font-poppins text-gold text-xs tracking-[0.3em] uppercase mt-1">
            For Pleasant Stay
          </p>
        </motion.div>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-gold rounded-full"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
