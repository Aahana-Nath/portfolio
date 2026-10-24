import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import WorkSection from '@/components/WorkSection'
import ExperienceSection from '@/components/ExperienceSection'
import ToolkitSection from '@/components/ToolkitSection'
import ThinkingSection from '@/components/ThinkingSection'
import ScrollTransition from '@/components/ScrollTransition'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <main>
      <Navbar />
      <ScrollTransition>
        <HeroSection />
        <ToolkitSection />
        <WorkSection />
      </ScrollTransition>
      <ExperienceSection />
      <ScrollTransition>
        <ThinkingSection />
      </ScrollTransition>
      <ContactSection />
    </main>
  )
}
