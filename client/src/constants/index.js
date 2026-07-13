// ============================================================
// LOCAL PHOTOS — client/public/ folder
// ============================================================
export const LOCAL_PHOTOS = {
  // Real hotel room photos
  room1: '/IMG_0435.JPG.webp',
  room2: '/IMG_0436.JPG.webp',
  room3: '/IMG_0437.JPG.webp',
  room4: '/IMG_0472.JPG.webp',
  room5: '/IMG_0594.PNG',
  newRoom1: '/ChatGPT Image Jul 5, 2026, 12_17_37 PM.webp',
  newRoom2: '/ChatGPT Image Jul 5, 2026, 12_17_46 PM.webp',
  newRoom3: '/Modern hotel bedroom with tropical view.webp',
  newRoom4: '/ChatGPT Image Jul 5, 2026, 05_45_18 PM.webp',
  // Hotel exterior / building
  exterior1: '/B791C280-016C-4109-AD3A-787851527299.JPG.webp',
  exterior2: '/5863B492-600A-44F6-A748-648253CC120F.JPG.webp',
  exterior3: '/F4798201-8137-497F-8E6E-AD6C465C3079.JPG.webp',
  // Screenshots (website / amenities previews)
  ss1: '/Screenshot 2026-07-04 222653.webp',
  ss2: '/Screenshot 2026-07-04 222718.webp',
  ss3: '/Screenshot 2026-07-04 222739.webp',
  ss4: '/Screenshot 2026-07-04 222803.webp',
  ss5: '/Screenshot 2026-07-04 222838.webp',
  ss6: '/Screenshot 2026-07-04 222912.webp',
  ss7: '/Screenshot 2026-07-04 222931.webp',
  ss8: '/Screenshot 2026-07-04 222950.webp',
  ss9: '/Screenshot 2026-07-04 223013.webp',
  ss10: '/Screenshot 2026-07-04 223050.webp',
  ss11: '/Screenshot 2026-07-04 223125.webp',
  ss12: '/Screenshot 2026-07-04 223154.webp',
  ss13: '/Screenshot 2026-07-04 223231.webp',
}

// Hotel Information
export const HOTEL_INFO = {
  name: 'Arlinjai Paradise',
  tagline: 'Comfort, Cleanliness, and Care – Your Home in Kanyakumari',
  shortTagline: 'For Pleasant Stay',
  location: 'Kanyakumari, Tamil Nadu, India',
  address: 'No. 5/69, Beach Road, Kanyakumari – 629702, Tamil Nadu, India',
  phone1: '9486271234',
  phone2: '04652 271234',
  whatsapp: '+91 9486271234',
  email: 'info@arlinjaiparadise.com',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.9!2d77.535!3d8.0883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDUnMTcuOSJOIDc3wrAzMicwNi4wIkU!5e0!3m2!1sen!2sin!4v1',
  googleMapsLink: 'https://maps.google.com/?q=Arlinjai+Paradise+Kanyakumari',
  checkInTime: '12:00 PM',
  checkOutTime: '11:00 AM',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
}

// Room Data
export const ROOMS = [
  {
    id: 'deluxe-ac',
    slug: 'deluxe-ac-room',
    name: 'Deluxe AC Room',
    category: 'deluxe',
    badge: 'PREMIUM',
    get price() {
      const isPeak = typeof window !== 'undefined' && localStorage.getItem('isPeakSeason') === 'true'
      return isPeak ? 5000 : 2500
    },
    highSeasonPrice: 5000,
    highSeasonLabel: 'Dec–Jan',
    guests: 4,
    minGuests: 2,
    size: 240,
    bedType: '1 Double Bed',
    floor: '2nd & 3rd Floor',
    view: 'City & Partial Sea View',
    image: '/ChatGPT Image Jul 5, 2026, 05_45_18 PM.webp',
    images: [
      '/ChatGPT Image Jul 5, 2026, 05_45_18 PM.webp',
      '/IMG_0435.JPG.webp',
      '/IMG_0436.JPG.webp',
      '/IMG_0472.JPG.webp',
    ],
    description:
      'Our most premium offering, the Deluxe AC Room offers spacious comfort with elegant furnishings and modern amenities. Enjoy the perfect blend of luxury and functionality with a stunning city view and all the comforts of home.',
    features: [
      'Air Conditioning',
      'Smart TV',
      'Hot Water',
      'Free WiFi',
      'Wardrobe',
      'Study Table',
      'Balcony',
      '24x7 Room Service',
      'Daily Housekeeping',
      'Power Backup',
      'Ample Parking',
      'Attached Bathroom',
    ],
    amenityIcons: ['ac', 'tv', 'wifi', 'hotwater', 'balcony', 'parking'],
    popular: true,
  },
  {
    id: 'normal-ac',
    slug: 'normal-ac-room',
    name: 'Normal AC Room',
    category: 'standard',
    badge: 'VALUE',
    get price() {
      const isPeak = typeof window !== 'undefined' && localStorage.getItem('isPeakSeason') === 'true'
      return isPeak ? 4000 : 2000
    },
    highSeasonPrice: 4000,
    highSeasonLabel: 'Dec–Jan',
    guests: 4,
    minGuests: 2,
    size: 200,
    bedType: '1 Double Bed',
    floor: '1st & 2nd Floor',
    view: 'Garden & City View',
    image: '/Modern hotel bedroom with tropical view.webp',
    images: [
      '/Modern hotel bedroom with tropical view.webp',
      '/IMG_0436.JPG.webp',
      '/IMG_0594.PNG',
    ],
    description:
      'The Normal AC Room combines affordability with comfort. Equipped with essential modern amenities, it provides a clean and refreshing stay for travelers and families exploring Kanyakumari.',
    features: [
      'Air Conditioning',
      'Smart TV',
      'Hot Water',
      'Free WiFi',
      'Wardrobe',
      'Attached Bathroom',
      'Daily Housekeeping',
      'Power Backup',
      '24x7 Room Service',
    ],
    amenityIcons: ['ac', 'tv', 'wifi', 'hotwater'],
    popular: false,
  },
  {
    id: 'non-ac',
    slug: 'non-ac-room',
    name: 'Non AC Room',
    category: 'budget',
    badge: 'BUDGET',
    get price() {
      const isPeak = typeof window !== 'undefined' && localStorage.getItem('isPeakSeason') === 'true'
      return isPeak ? 3000 : 1500
    },
    highSeasonPrice: 3000,
    highSeasonLabel: 'Dec–Jan',
    guests: 4,
    minGuests: 2,
    size: 180,
    bedType: '1 Double Bed',
    floor: 'Ground & 1st Floor',
    view: 'Garden View',
    image: '/ChatGPT Image Jul 5, 2026, 12_17_37 PM.webp',
    images: [
      '/ChatGPT Image Jul 5, 2026, 12_17_37 PM.webp',
      '/ChatGPT Image Jul 5, 2026, 12_17_46 PM.webp',
      '/IMG_0437.JPG.webp',
      '/IMG_0472.JPG.webp',
    ],
    description:
      'Our budget-friendly Non AC Room is perfect for the cost-conscious traveler who still wants a clean and comfortable stay. Simple, well-maintained, and conveniently located near all major Kanyakumari attractions.',
    features: [
      'Ceiling Fan',
      'Television',
      'Hot Water',
      'Free WiFi',
      'Wardrobe',
      'Attached Bathroom',
      'Daily Housekeeping',
      'Power Backup',
    ],
    amenityIcons: ['fan', 'tv', 'wifi', 'hotwater'],
    popular: false,
  },
]

// Amenities List
export const AMENITIES = [
  { icon: 'wifi', label: 'Free High-Speed WiFi', description: 'Complimentary WiFi throughout the property' },
  { icon: 'ac', label: 'Air Conditioning', description: 'Available in Deluxe & Normal AC rooms' },
  { icon: 'tv', label: 'Smart Television', description: '32" Smart TV with cable channels' },
  { icon: 'water', label: '24/7 Hot Water', description: 'Round-the-clock hot water supply' },
  { icon: 'parking', label: 'Free Parking', description: 'Ample secured parking space' },
  { icon: 'housekeeping', label: 'Daily Housekeeping', description: 'Fresh linens and towels daily' },
  { icon: 'roomservice', label: '24/7 Room Service', description: 'Meals and beverages at your door' },
  { icon: 'power', label: 'Power Backup', description: 'Uninterrupted power backup' },
  { icon: 'reception', label: '24/7 Reception', description: 'Always available to assist you' },
  { icon: 'security', label: 'CCTV Security', description: 'Round-the-clock CCTV surveillance' },
  { icon: 'checkin', label: 'Flexible Check-in', description: 'Check-in from 12 PM onwards' },
  { icon: 'travel', label: 'Travel Assistance', description: 'Local tours and transport help' },
]

// Guest Reviews
export const REVIEWS = [
  {
    id: 1,
    name: 'Priya S.',
    city: 'Chennai',
    rating: 5,
    review:
      'Very clean rooms, friendly staff and excellent location! Had a pleasant stay with my family. Highly recommended!',
    avatar: 'PS',
    date: 'December 2024',
    roomType: 'Deluxe AC Room',
  },
  {
    id: 2,
    name: 'Rahul K.',
    city: 'Mumbai',
    rating: 5,
    review:
      'Great value for money. The deluxe room was spacious and very comfortable. Will definitely come back.',
    avatar: 'RK',
    date: 'November 2024',
    roomType: 'Deluxe AC Room',
  },
  {
    id: 3,
    name: 'Anitha R.',
    city: 'Bangalore',
    rating: 5,
    review:
      'Perfect location near the beach. The staff was very helpful and the room was clean and well-maintained.',
    avatar: 'AR',
    date: 'October 2024',
    roomType: 'Normal AC Room',
  },
  {
    id: 4,
    name: 'James W.',
    city: 'USA',
    rating: 5,
    review:
      'Beautiful hotel near all major attractions. Excellent hospitality and comfortable rooms.',
    avatar: 'JW',
    date: 'January 2025',
    roomType: 'Deluxe AC Room',
  },
  {
    id: 5,
    name: 'Meena T.',
    city: 'Coimbatore',
    rating: 5,
    review:
      'Wonderful stay! The room was clean, the staff was friendly and the location is perfect for exploring Kanyakumari.',
    avatar: 'MT',
    date: 'September 2024',
    roomType: 'Normal AC Room',
  },
]

// Nearby Attractions
export const ATTRACTIONS = [
  {
    id: 1,
    name: 'Sunrise Point',
    distance: '1.3 km',
    description:
      'Kanyakumari is especially popular for its spectacular sunrise. The confluence of three ocean bodies makes the sunrise and sunset even more special.',
    image: '/Screenshot 2026-07-05 100058.webp',
    category: 'Nature',
    timings: 'Best at 5:30 AM – 7:00 AM',
    entryFee: 'Free',
    highlight: true,
  },
  {
    id: 2,
    name: 'Kanyakumari Beach',
    distance: '1.2 km',
    description:
      'The southernmost tip of India where the Bay of Bengal, Arabian Sea, and Indian Ocean meet. A walk on the soft sands while watching the orange sun set across the horizon is an experience.',
    image: '/Screenshot 2026-07-05 100133.webp',
    category: 'Beach',
    timings: 'Open 24 hours',
    entryFee: 'Free',
    highlight: true,
  },
  {
    id: 3,
    name: 'Thiruvalluvar Statue',
    distance: '1.6 km',
    description:
      'The gigantic statue of Tamil Poet Thiruvalluvar, standing atop an island few metres into the sea. Standing tall at 133 feet, the statue was opened to the public in 2000.',
    image: '/image.webp',
    category: 'Heritage',
    timings: '7:00 AM – 4:00 PM',
    entryFee: '₹20',
    highlight: true,
  },
  {
    id: 4,
    name: 'Vivekananda Rock Memorial',
    distance: '1.5 km',
    description:
      'A famous monument built to commemorate the great religious reformer Swami Vivekananda. Opened to the public in 1970, it is a major tourist attraction in Kanyakumari.',
    image: '/Screenshot 2026-07-05 094606.webp',
    category: 'Heritage',
    timings: '7:00 AM – 4:00 PM',
    entryFee: '₹20',
    highlight: true,
  },
  {
    id: 5,
    name: 'Gandhi Memorial Mandapam',
    distance: '1.0 km',
    description:
      'Built in memory of the Father of the Nation, his ashes were immersed in the Triveni Sangam here in Kanyakumari. The architecture of the memorial closely resembles Hindu Shrines of Central India.',
    image: '/Screenshot 2026-07-05 104852.webp',
    category: 'Heritage',
    timings: '7:00 AM – 7:00 PM',
    entryFee: 'Free',
    highlight: true,
  },
  {
    id: 6,
    name: 'Our Lady of Ransom Church',
    distance: '0.8 km',
    description:
      'Dedicated to Mother Mary, this is one of the most revered places of worship in Kanyakumari. The surrounding Gothic architecture of the church always leaves everyone in awe.',
    image: '/Screenshot 2026-07-05 103958.webp',
    category: 'Church',
    timings: '6:00 AM – 8:00 PM',
    entryFee: 'Free',
    highlight: false,
  },
  {
    id: 7,
    name: 'Wax Museum',
    distance: '1.1 km',
    description:
      'A one-of-a-kind experience for kids and all ages. Get clicked with wax statues of worldly famous personalities. Also boasts several 3D paintings on walls and floor.',
    image: '/Screenshot 2026-07-05 104138.webp',
    category: 'Entertainment',
    timings: '9:00 AM – 7:00 PM',
    entryFee: '₹150',
    highlight: false,
  },
  {
    id: 8,
    name: 'Eco Park',
    distance: '2.0 km',
    description:
      'Well maintained government park with kids play area. More than an acre land with green. Entrance ticket for adult is ₹20. Worthy visit with kids and family.',
    image: '/Screenshot 2026-07-05 104220.webp',
    category: 'Nature',
    timings: '9:00 AM – 6:00 PM',
    entryFee: '₹20',
    highlight: false,
  },
  {
    id: 9,
    name: 'Bhagavathi Amman Temple',
    distance: '0.5 km',
    description:
      'Situated on the seashore of Kanyakumari, this Kumari Amman Temple is dedicated to the virgin Goddess Devi Kanyakumari. Said to be over 3000 years old.',
    image: '/Screenshot 2026-07-05 104506.webp',
    category: 'Temple',
    timings: '4:30 AM – 12:30 PM, 4:00 PM – 8:00 PM',
    entryFee: 'Free',
    highlight: true,
  },
  {
    id: 10,
    name: 'Bharat Matha Temple',
    distance: '1.2 km',
    description:
      'A kind of museum where the whole Ramayana is described in pictorial as well as in short story form. The paintings are so beautiful and realistic. A must-visit cultural destination.',
    image: '/Screenshot 2026-07-05 104703.webp',
    category: 'Temple',
    timings: '8:00 AM – 8:00 PM',
    entryFee: '₹10',
    highlight: false,
  },
  {
    id: 11,
    name: 'Vattakottai Fort',
    distance: '6.0 km',
    description:
      'The fort is beautiful and a great place for picnic. Mostly surrounded by the sea, watching from the fort is very pleasant. Picturesque view of sea on one side and Western Ghats on the other.',
    image: '/Screenshot 2026-07-05 094204.webp',
    category: 'Heritage',
    timings: '9:00 AM – 6:00 PM',
    entryFee: 'Free',
    highlight: false,
  },
  {
    id: 12,
    name: 'Padmanabhapuram Palace',
    distance: '35 km',
    description:
      'The green Veli hills form the perfect backdrop for this magnificent white and brown palace. The largest wooden palace in Asia, standing since centuries, providing a glimpse into the golden past of the Travancore rulers.',
    image: '/Screenshot 2026-07-05 111951.webp',
    category: 'Heritage',
    timings: '9:00 AM – 5:00 PM (Closed Monday)',
    entryFee: '₹30',
    highlight: true,
  },
  {
    id: 13,
    name: 'Thirparappu Water Falls',
    distance: '55 km',
    description:
      'Enjoy a boat ride at leisure or relax on the petite rocky island. You can also pay a visit to the famous Mahadeva Temple at the entrance of the falls.',
    image: '/WhatsApp Image 2026-07-05 at 11.24.58.webp',
    category: 'Nature',
    timings: '8:00 AM – 6:00 PM',
    entryFee: '₹10',
    highlight: false,
  },
  {
    id: 14,
    name: 'Kanyakumari Pier',
    distance: '1.0 km',
    description:
      'An extension of about 500 metres from Kanyakumari into the sea. You can take your bikes on this pier till almost the end. A relatively unexplored area where only locals come here.',
    image: '/Screenshot 2026-07-05 105005.webp',
    category: 'Beach',
    timings: 'Open 24 hours',
    entryFee: 'Free',
    highlight: false,
  },
  {
    id: 15,
    name: 'Mathoor Aqueduct',
    distance: '30 km',
    description:
      'A scenic hanging bridge over the river with stunning natural surroundings. One of the largest aqueducts in Asia, surrounded by lush green forests and beautiful landscapes.',
    image: '/Screenshot 2026-07-05 095713.webp',
    category: 'Nature',
    timings: 'Open 24 hours',
    entryFee: 'Free',
    highlight: false,
  },
  {
    id: 16,
    name: 'Baywatch Theme Park',
    distance: '2.5 km',
    description:
      'A fun-filled theme park in Kanyakumari with exciting rides, attractions, and entertainment for the whole family. Perfect for a day of fun and adventure.',
    image: '/Screenshot 2026-07-05 095509.webp',
    category: 'Entertainment',
    timings: '10:00 AM – 7:00 PM',
    entryFee: '₹200',
    highlight: false,
  },
]

// Gallery Images
export const GALLERY_IMAGES = [
  {
    id: 1,
    url: '/B791C280-016C-4109-AD3A-787851527299.JPG.webp',
    title: 'Hotel Exterior',
    category: 'exterior',
    span: 'col-span-2',
  },
  {
    id: 2,
    url: '/ChatGPT Image Jul 5, 2026, 05_45_18 PM.webp',
    title: 'Deluxe AC Room',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 3,
    url: '/Modern hotel bedroom with tropical view.webp',
    title: 'Normal AC Room',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 4,
    url: '/ChatGPT Image Jul 5, 2026, 12_17_37 PM.webp',
    title: 'Non AC Room',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 5,
    url: '/ChatGPT Image Jul 5, 2026, 12_17_46 PM.webp',
    title: 'Executive Double Bed',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 6,
    url: '/IMG_0472.JPG.webp',
    title: 'Hotel Interior',
    category: 'interior',
    span: 'col-span-1',
  },
  {
    id: 7,
    url: '/5863B492-600A-44F6-A748-648253CC120F.JPG.webp',
    title: 'Hotel Building',
    category: 'exterior',
    span: 'col-span-1',
  },
  {
    id: 8,
    url: '/F4798201-8137-497F-8E6E-AD6C465C3079.JPG.webp',
    title: 'Hotel Entrance',
    category: 'exterior',
    span: 'col-span-1',
  },
  {
    id: 9,
    url: '/WhatsApp Image 2026-07-05 at 17.53.29.webp',
    title: 'Comfort Double Room',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 10,
    url: '/WhatsApp Image 2026-07-05 at 17.53.30.webp',
    title: 'Cozy Room Setup',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 11,
    url: '/WhatsApp Image 2026-07-05 at 17.53.55.webp',
    title: 'Spacious Family Bed',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 12,
    url: '/Screenshot 2026-07-04 222950.webp',
    title: 'Classic Double Room',
    category: 'rooms',
    span: 'col-span-1',
  },
  {
    id: 13,
    url: '/Screenshot 2026-07-04 222718.webp',
    title: 'Hotel Reception',
    category: 'interior',
    span: 'col-span-1',
  },
  {
    id: 14,
    url: '/Screenshot 2026-07-04 222803.webp',
    title: 'Premium Double Bed',
    category: 'rooms',
    span: 'col-span-1',
  },
]

// Stats for Counter Section
export const STATS = [
  { value: 500, label: 'Happy Guests', suffix: '+' },
  { value: 3, label: 'Room Types', suffix: '' },
  { value: 6, label: 'Nearby Attractions', suffix: '' },
  { value: 5, label: 'Years of Service', suffix: '+' },
]

// Why Choose Us Features
export const WHY_CHOOSE_US = [
  {
    icon: 'location',
    title: 'Prime Location',
    description: 'Steps away from Kanyakumari Beach, Kumari Amman Temple, and all major attractions.',
  },
  {
    icon: 'clean',
    title: 'Immaculate Cleanliness',
    description: 'Daily housekeeping and thorough sanitization ensure a hygienic stay every time.',
  },
  {
    icon: 'price',
    title: 'Best Value Pricing',
    description: 'Competitive rates with no hidden charges. Best price guaranteed on direct booking.',
  },
  {
    icon: 'service',
    title: '24/7 Service',
    description: 'Round-the-clock reception, room service, and assistance for all your needs.',
  },
  {
    icon: 'wifi',
    title: 'Free High-Speed WiFi',
    description: 'Stay connected with complimentary high-speed WiFi throughout your stay.',
  },
  {
    icon: 'family',
    title: 'Family Friendly',
    description: 'Safe, comfortable environment perfect for families, couples, and solo travelers.',
  },
]

// Booking Steps
export const BOOKING_STEPS = [
  { step: 1, label: 'Select Room' },
  { step: 2, label: 'Your Details' },
  { step: 3, label: 'Review & Pay' },
  { step: 4, label: 'Confirmation' },
]

// API Base URL
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // If accessed via local IP address (e.g. 192.168.1.15) on Wi-Fi
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      if (/^[0-9.]+$/.test(hostname)) {
        return `http://${hostname}:5000/api`
      }
    }
  }
  return 'http://localhost:5000/api'
}

export const API_BASE_URL = getApiBaseUrl()
