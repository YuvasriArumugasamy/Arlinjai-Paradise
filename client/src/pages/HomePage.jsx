import HeroSection from '../components/home/HeroSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import RoomPreview from '../components/home/RoomPreview'
import AmenitiesSection from '../components/home/AmenitiesSection'
import NearbyAttractions from '../components/home/NearbyAttractions'
import GalleryPreview from '../components/home/GalleryPreview'
import GuestReviews from '../components/home/GuestReviews'
import CallToAction from '../components/home/CallToAction'
import MapSection from '../components/home/MapSection'
import useSEO from '../hooks/useSEO'
import { generateHotelSchema } from '../utils/seoHelpers'

export default function HomePage() {
  useSEO({
    title: 'Your Home in Kanyakumari | Best Hotel near Beach',
    description: 'Experience premium comfort, cleanliness, and care at Arlinjai Paradise Hotel, Kanyakumari. Located near Beach Road & Sunset Point. Book AC & Non-AC rooms now!',
    keywords: 'Arlinjai Paradise, hotel Kanyakumari, beach hotel Kanyakumari, luxury rooms Kanyakumari, accommodation in Kanyakumari, budget hotel Kanyakumari, best place to stay in Kanyakumari',
    canonicalUrl: '/',
    schema: generateHotelSchema()
  })

  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <RoomPreview />
      <AmenitiesSection />
      <NearbyAttractions />
      <GalleryPreview />
      <GuestReviews />
      <CallToAction />
      <MapSection />
    </>
  )
}
