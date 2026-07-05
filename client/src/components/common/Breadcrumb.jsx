import { Link } from 'react-router-dom'
import { FaChevronRight, FaHome } from 'react-icons/fa'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 font-poppins text-sm" aria-label="Breadcrumb">
      <Link
        to="/"
        className="text-gray-400 hover:text-gold transition-colors flex items-center gap-1"
      >
        <FaHome size={12} />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FaChevronRight size={10} className="text-gray-400" />
          {index === items.length - 1 ? (
            <span className="text-gold font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-400 hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
