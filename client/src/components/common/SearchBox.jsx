/**
 * Reusable SearchBox — styled with website navy/gold colors
 * Props: value, onChange, onSearch, placeholder, className
 */
export default function SearchBox({ value, onChange, onSearch, placeholder = 'Search...', className = '' }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' && onSearch) onSearch()
  }

  return (
    <>
      <div className={`search-box-container ${className}`}>
        <div className="search-box-inner">
          <input
            className="search-box-input"
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={handleKey}
            placeholder={placeholder}
          />
          <svg
            viewBox="0 0 24 24"
            className="search-box-icon"
            onClick={onSearch}
            style={{ cursor: onSearch ? 'pointer' : 'default' }}
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        .search-box-container {
          position: relative;
          background: linear-gradient(135deg, #08111F 0%, #0d1e35 100%);
          border-radius: 1000px;
          padding: 6px;
          display: grid;
          place-content: center;
          z-index: 0;
        }
        .search-box-inner {
          position: relative;
          width: 100%;
          border-radius: 50px;
          background: linear-gradient(135deg, #0f1f38 0%, #132840 100%);
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .search-box-inner::before {
          content: '';
          width: 100%; height: 100%;
          border-radius: inherit;
          position: absolute;
          top: -1px; left: -1px;
          background: linear-gradient(0deg, #1a2f4a 0%, #243d5a 100%);
          z-index: -1;
        }
        .search-box-inner::after {
          content: '';
          width: 100%; height: 100%;
          border-radius: inherit;
          position: absolute;
          bottom: -1px; right: -1px;
          background: linear-gradient(0deg, #C9A22755 0%, #C9A22733 100%);
          box-shadow: rgba(201, 162, 39, 0.5) 3px 3px 5px 0px,
                      rgba(201, 162, 39, 0.3) 5px 5px 20px 0px;
          z-index: -2;
        }
        .search-box-input {
          padding: 8px 12px;
          width: 100%;
          background: linear-gradient(135deg, #0f1f38 0%, #132840 100%);
          border: none;
          color: #C9A227;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          border-radius: 50px;
        }
        .search-box-input::placeholder {
          color: #5a7a9a;
          font-size: 13px;
        }
        .search-box-input:focus {
          outline: none;
          background: linear-gradient(135deg, #132840 0%, #1a3352 100%);
        }
        .search-box-icon {
          width: 42px;
          aspect-ratio: 1;
          border-left: 2px solid #C9A227;
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
          border-radius: 50%;
          padding-left: 10px;
          margin-right: 8px;
          flex-shrink: 0;
          transition: border-left 0.2s;
        }
        .search-box-icon:hover {
          border-left: 3px solid #C9A227;
        }
        .search-box-icon path {
          fill: #C9A227;
        }
      `}</style>
    </>
  )
}
