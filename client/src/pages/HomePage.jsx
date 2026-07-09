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

export default function HomePage() {
  useSEO({
    title: 'Your Home in Kanyakumari',
    description: 'Experience premium comfort, cleanliness, and care at Arlinjai Paradise Hotel, Kanyakumari. Steps away from the beach. Book your stay now!',
    keywords: 'Arlinjai Paradise, hotel Kanyakumari, beach hotel Kanyakumari, luxury rooms Kanyakumari, accommodation in Kanyakumari'
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
