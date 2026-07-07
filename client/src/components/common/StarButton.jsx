import { Link } from 'react-router-dom'

const StarSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    version="1.1"
    style={{
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'optimizeQuality',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    }}
    viewBox="0 0 784.11 815.53"
  >
    <g id="Layer_x0020_1">
      <path
        style={{ fill: '#C9A227' }}
        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
      />
    </g>
  </svg>
)

// Link version (for navigation)
export function StarButtonLink({ to, children, className = '', outline = false }) {
  return (
    <Link to={to} className={`star-btn ${outline ? 'star-btn-outline' : 'star-btn-gold'} ${className}`}>
      {children}
      <div className="star-1"><StarSVG /></div>
      <div className="star-2"><StarSVG /></div>
      <div className="star-3"><StarSVG /></div>
      <div className="star-4"><StarSVG /></div>
      <div className="star-5"><StarSVG /></div>
      <div className="star-6"><StarSVG /></div>
    </Link>
  )
}

// Button version (for forms/actions)
export function StarButton({ onClick, children, className = '', outline = false, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`star-btn ${outline ? 'star-btn-outline' : 'star-btn-gold'} ${className}`}
    >
      {children}
      <div className="star-1"><StarSVG /></div>
      <div className="star-2"><StarSVG /></div>
      <div className="star-3"><StarSVG /></div>
      <div className="star-4"><StarSVG /></div>
      <div className="star-5"><StarSVG /></div>
      <div className="star-6"><StarSVG /></div>
    </button>
  )
}

export default StarButtonLink
