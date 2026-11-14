import { MotionConfig } from 'framer-motion'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Estimator } from './components/Estimator'
import { AreaCheck, Checklist, FaqNotes, Marquee, Plans, Supplies } from './components/Sections'
import { Booking } from './components/Booking'
import { BigCta, Footer, Nav } from './components/Chrome'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#build">Skip to prices</a>
      <Nav />
      <main>
        <Hero />
        <Marquee items={['Kitchens', 'Bathrooms', 'Bedrooms', 'Move-out cleans', 'Deep cleans', 'Ovens', 'Fridges', 'Windows', 'Laundry']} />
        <HowItWorks />
        <Estimator />
        <Plans />
        <Checklist />
        <Marquee tone="navy" reverse items={['Plant-based products', 'HEPA vacuums', 'Same crew when possible', '48-hour redo guarantee', 'No contracts']} />
        <Supplies />
        <AreaCheck />
        <FaqNotes />
        <BigCta />
      </main>
      <Footer />
      <Booking />
    </MotionConfig>
  )
}
