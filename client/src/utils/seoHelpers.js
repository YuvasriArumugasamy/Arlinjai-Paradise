/**
 * SEO Helper Utilities and JSON-LD Schema Generators for Arlinjai Paradise Hotel
 */

export const SITE_URL = 'https://arlinjaiparadise.in'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/Modern%20hotel%20bedroom%20with%20tropical%20view.webp`

export const HOTEL_DETAILS = {
  name: 'Arlinjai Paradise',
  description: 'Experience premium comfort, cleanliness, and care at Arlinjai Paradise Hotel in Kanyakumari, Tamil Nadu. Book Deluxe AC, Normal AC, and Non-AC rooms near Kanyakumari beach.',
  url: SITE_URL,
  phone: '+919486271234',
  email: 'info@arlinjaiparadise.com',
  address: {
    streetAddress: 'No. 5/69, Beach Road',
    addressLocality: 'Kanyakumari',
    addressRegion: 'Tamil Nadu',
    postalCode: '629702',
    addressCountry: 'IN',
  },
  geo: {
    latitude: 8.0883,
    longitude: 77.535,
  },
  priceRange: '₹1500 - ₹5000',
  ratingValue: '4.6',
  reviewCount: '128',
}

/**
 * Generate Hotel Schema (JSON-LD)
 */
export function generateHotelSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    'name': HOTEL_DETAILS.name,
    'url': HOTEL_DETAILS.url,
    'image': DEFAULT_OG_IMAGE,
    'description': HOTEL_DETAILS.description,
    'telephone': HOTEL_DETAILS.phone,
    'email': HOTEL_DETAILS.email,
    'priceRange': HOTEL_DETAILS.priceRange,
    'address': {
      '@type': 'PostalAddress',
      ...HOTEL_DETAILS.address,
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': HOTEL_DETAILS.geo.latitude,
      'longitude': HOTEL_DETAILS.geo.longitude,
    },
    'starRating': {
      '@type': 'Rating',
      'ratingValue': HOTEL_DETAILS.ratingValue,
      'bestRating': '5',
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': HOTEL_DETAILS.ratingValue,
      'reviewCount': HOTEL_DETAILS.reviewCount,
      'bestRating': '5',
      'worstRating': '1',
    },
    'amenityFeature': [
      { '@type': 'LocationFeatureSpecification', 'name': 'Free High-Speed WiFi', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Air Conditioning', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Free Parking', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': '24/7 Room Assistance', 'value': true },
    ],
  }
}

/**
 * Generate Individual Room Product Schema
 */
export function generateRoomSchema(room) {
  if (!room) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': `${room.name} - Arlinjai Paradise`,
    'image': room.image ? `${SITE_URL}${room.image}` : DEFAULT_OG_IMAGE,
    'description': room.description || `Book ${room.name} at Arlinjai Paradise, Kanyakumari. Equipped with modern amenities, free WiFi, and beach proximity.`,
    'brand': {
      '@type': 'Brand',
      'name': 'Arlinjai Paradise',
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'INR',
      'price': room.price || 2000,
      'availability': 'https://schema.org/InStock',
      'url': `${SITE_URL}/rooms`,
    },
  }
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${SITE_URL}${item.path}`,
    })),
  }
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs = []) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}
