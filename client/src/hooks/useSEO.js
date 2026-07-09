import { useEffect } from 'react'

export default function useSEO({ title, description, keywords }) {
  useEffect(() => {
    // Set Page Title
    const previousTitle = document.title
    if (title) {
      document.title = `${title} | Arlinjai Paradise`
    }

    // Set Page Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    const previousDesc = metaDesc ? metaDesc.getAttribute('content') : ''
    if (description && metaDesc) {
      metaDesc.setAttribute('content', description)
    }

    // Set Page Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    const previousKeywords = metaKeywords ? metaKeywords.getAttribute('content') : ''
    if (keywords && metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    }

    // Restore original values when page unmounts
    return () => {
      document.title = previousTitle
      if (metaDesc && previousDesc) {
        metaDesc.setAttribute('content', previousDesc)
      }
      if (metaKeywords && previousKeywords) {
        metaKeywords.setAttribute('content', previousKeywords)
      }
    }
  }, [title, description, keywords])
}
