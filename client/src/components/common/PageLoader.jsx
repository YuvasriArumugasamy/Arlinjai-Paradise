import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-navy z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">

        {/* Hotel name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-playfair text-white text-2xl font-bold tracking-wider">
            ARLINJAI PARADISE
          </h2>
          <p className="font-poppins text-gold text-xs tracking-[0.3em] uppercase mt-1">
            For Pleasant Stay
          </p>
        </motion.div>

        {/* Dot spinner — gold color matching website */}
        <div className="dot-spinner">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="dot-spinner__dot" />
          ))}
        </div>

      </div>

      {/* Dot spinner styles */}
      <style>{`
        .dot-spinner {
          --uib-size: 2.8rem;
          --uib-speed: .9s;
          --uib-color: #C9A227;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: var(--uib-size);
          width: var(--uib-size);
        }
        .dot-spinner__dot {
          position: absolute;
          top: 0; left: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          width: 100%;
        }
        .dot-spinner__dot::before {
          content: '';
          height: 20%;
          width: 20%;
          border-radius: 50%;
          background-color: var(--uib-color);
          transform: scale(0);
          opacity: 0.5;
          animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.4);
        }
        .dot-spinner__dot:nth-child(2) { transform: rotate(45deg); }
        .dot-spinner__dot:nth-child(2)::before { animation-delay: calc(var(--uib-speed) * -0.875); }
        .dot-spinner__dot:nth-child(3) { transform: rotate(90deg); }
        .dot-spinner__dot:nth-child(3)::before { animation-delay: calc(var(--uib-speed) * -0.75); }
        .dot-spinner__dot:nth-child(4) { transform: rotate(135deg); }
        .dot-spinner__dot:nth-child(4)::before { animation-delay: calc(var(--uib-speed) * -0.625); }
        .dot-spinner__dot:nth-child(5) { transform: rotate(180deg); }
        .dot-spinner__dot:nth-child(5)::before { animation-delay: calc(var(--uib-speed) * -0.5); }
        .dot-spinner__dot:nth-child(6) { transform: rotate(225deg); }
        .dot-spinner__dot:nth-child(6)::before { animation-delay: calc(var(--uib-speed) * -0.375); }
        .dot-spinner__dot:nth-child(7) { transform: rotate(270deg); }
        .dot-spinner__dot:nth-child(7)::before { animation-delay: calc(var(--uib-speed) * -0.25); }
        .dot-spinner__dot:nth-child(8) { transform: rotate(315deg); }
        .dot-spinner__dot:nth-child(8)::before { animation-delay: calc(var(--uib-speed) * -0.125); }
        @keyframes pulse0112 {
          0%, 100% { transform: scale(0); opacity: 0.5; }
          50%       { transform: scale(1); opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
