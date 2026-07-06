import HeroSection from '../components/home/HeroSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import RoomPreview from '../components/home/RoomPreview'
import AmenitiesSection from '../components/home/AmenitiesSection'
import NearbyAttractions from '../components/home/NearbyAttractions'
import GalleryPreview from '../components/home/GalleryPreview'
import GuestReviews from '../components/home/GuestReviews'
import CallToAction from '../components/home/CallToAction'
import MapSection from '../components/home/MapSection'

export default function HomePage() {
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
