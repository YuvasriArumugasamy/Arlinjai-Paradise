import React, { useState, useEffect } from 'react'

let _placeholderCache = null

export default function LazyImage({ src, alt = '', className = '', width, height, style = {}, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const [placeholder, setPlaceholder] = useState(null)

  // Reserve space to avoid layout shift when width/height provided
  const wrapperStyle = { display: 'inline-block', position: 'relative', overflow: 'hidden' }
  if (width && height) {
    wrapperStyle.width = width
    wrapperStyle.height = height
  }

  useEffect(() => {
    const loadPlaceholders = async () => {
      if (!_placeholderCache) {
        try {
          const res = await fetch('/placeholders.json')
          if (res.ok) _placeholderCache = await res.json()
          else _placeholderCache = {}
        } catch (e) {
          _placeholderCache = {}
        }
      }
      const name = src?.split('/')?.pop()
      const val = _placeholderCache?.[name] || _placeholderCache?.[decodeURIComponent(name)]
      if (val) setPlaceholder(val)
    }
    loadPlaceholders()
  }, [src])

  return (
    <span style={wrapperStyle} className={`lazy-image-wrapper ${!loaded ? 'loading' : ''}`}>
      {/* low-quality placeholder as background to reduce CLS */}
      {!loaded && placeholder && (
        <img
          src={placeholder}
          alt={alt}
          aria-hidden
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            filter: 'blur(6px) saturate(0.9)', transform: 'scale(1.05)'
          }}
        />
      )}

      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 300ms ease', width: '100%', height: '100%', objectFit: 'cover', ...style }}
        {...rest}
      />
    </span>
  )
}
