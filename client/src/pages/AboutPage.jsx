import { motion } from 'framer-motion'
import { FaStar, FaHeart, FaShieldAlt, FaLeaf, FaUsers } from 'react-icons/fa'
import Breadcrumb from '../components/common/Breadcrumb'
import { HOTEL_INFO, REVIEWS } from '../constants'

const VALUES = [
  { icon: FaStar, title: 'Excellence', desc: 'We strive for excellence in every aspect of hospitality.' },
  { icon: FaHeart, title: 'Warmth', desc: 'Every guest is treated like family with genuine care.' },
  { icon: FaShieldAlt, title: 'Reliability', desc: 'Consistent quality and trustworthy service, every stay.' },
  { icon: FaLeaf, title: 'Cleanliness', desc: 'Immaculate standards of hygiene and cleanliness.' },
]

const TIMELINE = [
  { year: '2019', title: 'Founded', desc: 'Arlinjai Paradise opened its doors in Kanyakumari.' },
  { year: '2020', title: 'Expansion', desc: 'Added new room categories to serve diverse travelers.' },
  { year: '2021', title: 'Recognition', desc: 'Recognized as a top-rated hotel by guests on multiple platforms.' },
  { year: '2023', title: 'Renovation', desc: 'Complete renovation and upgrade of all rooms and facilities.' },
  { year: '2024', title: 'Growing', desc: '500+ satisfied guests and counting. Continuing to grow.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(8,17,31,0.8), rgba(8,17,31,0.8)), url('/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="font-poppins text-gray-300 max-w-xl mx-auto">
            Discover the story behind Arlinjai Paradise and our commitment to exceptional hospitality.
          </p>
          <div className="mt-6 flex justify-center">
            <Breadcrumb items={[{ label: 'About Us', path: '/about' }]} />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-subtitle mb-3">Our Story</p>
              <h2 className="section-title mb-6">A Home Away From Home</h2>
              <div className="gold-divider-left" />
              <div className="space-y-4 mt-6 font-poppins text-gray-700 text-sm leading-relaxed">
                <p>
                  Arlinjai Paradise was born from a simple dream – to create a place where every traveler 
                  visiting the sacred land of Kanyakumari feels truly welcomed and cared for. 
                </p>
                <p>
                  Located at the southern tip of India, where the Bay of Bengal, Arabian Sea, and Indian 
                  Ocean converge, Kanyakumari has been a pilgrimage destination for centuries. We recognized 
                  the need for comfortable, clean, and affordable accommodation in this spiritual city.
                </p>
                <p>
                  Our hotel, nestled on Beach Road just steps from Kumari Amman Temple and a short walk 
                  from the iconic Vivekananda Rock Memorial, offers the perfect base for exploring this 
                  magnificent destination.
                </p>
                <p>
                  Our team of dedicated hospitality professionals ensures that every guest – whether 
                  a pilgrim, a family on vacation, or a solo traveler – experiences the warmth of 
                  Tamil Nadu's famed hospitality.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="/B791C280-016C-4109-AD3A-787851527299.JPG.jpeg"
                alt="Arlinjai Paradise"
                className="rounded-sm shadow-card-hover w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold p-6 rounded-sm shadow-gold-lg 
                             hidden md:block">
                <p className="font-playfair text-white font-bold text-4xl">5+</p>
                <p className="font-poppins text-white text-sm">Years of Service</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-lightbg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Our Mission',
                content: 'To provide every guest with an exceptional stay experience that combines comfort, cleanliness, and genuine care. We aim to be the preferred choice for travelers visiting Kanyakumari by offering the best value for their money.',
                bg: 'bg-navy',
                titleColor: 'text-gold',
                textColor: 'text-gray-300',
              },
              {
                title: 'Our Vision',
                content: 'To become the most trusted and beloved hotel in Kanyakumari – a place where guests return time and again, and recommend to their loved ones. We envision Arlinjai Paradise as a symbol of genuine South Indian hospitality.',
                bg: 'bg-gold',
                titleColor: 'text-white',
                textColor: 'text-white text-opacity-90',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`${item.bg} rounded-sm p-10`}
              >
                <h3 className={`font-playfair font-bold text-2xl mb-4 ${item.titleColor}`}>
                  {item.title}
                </h3>
                <div className={`w-12 h-1 ${i === 0 ? 'bg-gold' : 'bg-white bg-opacity-50'} mb-5`} />
                <p className={`font-poppins text-sm leading-relaxed ${item.textColor}`}>
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle mb-3">What Drives Us</p>
            <h2 className="section-title">Our Core Values</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-8 bg-lightbg rounded-sm hover:shadow-card 
                             transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-full flex items-center justify-center 
                                 mx-auto mb-5 group-hover:bg-gold transition-colors duration-300">
                    <Icon size={22} className="text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-playfair font-bold text-lg text-navy mb-3">{value.title}</h3>
                  <p className="font-poppins text-sm text-gray-600">{value.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-poppins text-gold uppercase tracking-widest text-sm mb-3">Our Journey</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white">Our History</h2>
            <div className="gold-divider" />
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gold bg-opacity-30" />
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-6 mb-10 ${
                  i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className={`bg-white bg-opacity-5 border border-white border-opacity-10 
                                  rounded-sm p-5 hover:border-gold hover:border-opacity-30 transition-colors
                                  ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                    <p className="font-poppins font-bold text-gold text-sm mb-1">{item.year}</p>
                    <h4 className="font-playfair font-bold text-white text-lg mb-2">{item.title}</h4>
                    <p className="font-poppins text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center 
                               flex-shrink-0 relative z-10 shadow-gold">
                  <span className="text-white font-bold text-xs">{i + 1}</span>
                </div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Contact Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subtitle mb-3">Get in Touch</p>
          <h2 className="section-title mb-6">We'd Love to Hear From You</h2>
          <div className="gold-divider" />
          <p className="font-poppins text-gray-600 text-sm max-w-xl mx-auto mt-6 mb-8">
            Have questions about your stay or want to make a reservation? 
            Our team is available 24/7 to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${HOTEL_INFO.phone1}`} className="btn-gold">
              Call {HOTEL_INFO.phone1}
            </a>
            <a href={`mailto:${HOTEL_INFO.email}`} className="btn-outline-gold">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
