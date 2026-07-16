import React, { useState } from 'react'

export default function LazyImage({ src, alt = '', className = '', width, height, style = {}, ...rest }) {
  const [loaded, setLoaded] = useState(false)

  // Reserve space to avoid layout shift when width/height provided
  const wrapperStyle = { display: 'inline-block', position: 'relative' }
  if (width && height) {
    wrapperStyle.width = width
    wrapperStyle.height = height
  }

  return (
    <span style={wrapperStyle} className={`lazy-image-wrapper ${!loaded ? 'loading' : ''}`}>
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
