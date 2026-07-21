import { useEffect } from 'react'

const SITE_URL = 'https://arlinjaiparadise.in'
const DEFAULT_IMAGE = `${SITE_URL}/Modern%20hotel%20bedroom%20with%20tropical%20view.webp`

export default function useSEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  schema,
} = {}) {
  useEffect(() => {
    // 1. Page Title
    const previousTitle = document.title
    if (title) {
      document.title = `${title} | Arlinjai Paradise`
    }

    // Helper: update or create meta tag
    const setMeta = (attr, attrValue, content) => {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, attrValue)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Helper: update or create link tag
    const setLink = (rel, href) => {
      if (!href) return
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    const currentUrl = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : window.location.href
    const imageToUse = ogImage ? (ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`) : DEFAULT_IMAGE

    // 2. Standard Meta Tags
    setMeta('name', 'description', description || 'Arlinjai Paradise - Luxury & Budget AC Rooms in Kanyakumari near beach. Best family residency with free WiFi & 24/7 service.')
    setMeta('name', 'keywords', keywords || 'Arlinjai Paradise, hotel Kanyakumari, luxury hotel, beach hotel, budget hotel Kanyakumari, rooms near Kanyakumari beach')
    setMeta('name', 'robots', 'index, follow')

    // 3. Canonical Link
    setLink('canonical', currentUrl)

    // 4. OpenGraph Tags
    setMeta('property', 'og:title', title ? `${title} | Arlinjai Paradise` : 'Arlinjai Paradise | Your Home in Kanyakumari')
    setMeta('property', 'og:description', description || 'Comfortable and luxury hotel in Kanyakumari, Tamil Nadu.')
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:url', currentUrl)
    setMeta('property', 'og:image', imageToUse)

    // 5. Twitter Card Tags
    setMeta('property', 'twitter:card', 'summary_large_image')
    setMeta('property', 'twitter:title', title ? `${title} | Arlinjai Paradise` : 'Arlinjai Paradise | Your Home in Kanyakumari')
    setMeta('property', 'twitter:description', description || 'Experience premium comfort and care at Arlinjai Paradise Hotel, Kanyakumari.')
    setMeta('property', 'twitter:image', imageToUse)

    // 6. Dynamic JSON-LD Structured Data Schema Insertion
    let scriptTag = null
    if (schema) {
      scriptTag = document.createElement('script')
      scriptTag.type = 'application/ld+json'
      scriptTag.id = 'dynamic-page-schema'
      scriptTag.text = JSON.stringify(schema)
      document.head.appendChild(scriptTag)
    }

    // Cleanup when component unmounts / changes
    return () => {
      document.title = previousTitle
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag)
      }
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schema])
}
