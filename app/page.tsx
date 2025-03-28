import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { IntroSection } from "@/components/intro-section"
import { WorkSection } from "@/components/work-section"
import { ProjectsSection } from "@/components/projects-section"
import { ResearchSection } from "@/components/research-section"
import { PersonalSection } from "@/components/personal-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
      <Navbar />
      <Hero />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <section id="intro" className="py-20 md:py-28">
          <IntroSection />
        </section>

        <section id="work" className="py-20 md:py-28">
          <WorkSection />
        </section>

        <section id="projects" className="py-20 md:py-28">
          <ProjectsSection />
        </section>

        <section id="research" className="py-20 md:py-28">
          <ResearchSection />
        </section>

        <section id="personal" className="py-20 md:py-28">
          <PersonalSection />
        </section>

        <section id="contact" className="py-20 md:py-28">
          <ContactSection />
        </section>
      </div>

      <Footer />
    </main>
  )
}

