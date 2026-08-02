import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { IntroSection } from "@/components/intro-section"
import { WorkSection } from "@/components/work-section"
import { ResearchSection } from "@/components/research-section"
import { ProjectsSection } from "@/components/projects-section"
import { PersonalSection } from "@/components/personal-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-rule focus:bg-paper focus:px-4 focus:py-2 focus:meta"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />

        <div className="mx-auto max-w-page px-5 sm:px-8">
          <section id="about" className="scroll-mt-24 py-20 md:py-28">
            <IntroSection />
          </section>

          <section id="work" className="scroll-mt-24 border-t border-rule py-20 md:py-28">
            <WorkSection />
          </section>

          <section id="research" className="scroll-mt-24 border-t border-rule py-20 md:py-28">
            <ResearchSection />
          </section>

          <section id="projects" className="scroll-mt-24 border-t border-rule py-20 md:py-28">
            <ProjectsSection />
          </section>

          <section id="plates" className="scroll-mt-24 border-t border-rule py-20 md:py-28">
            <PersonalSection />
          </section>

          <section id="contact" className="scroll-mt-24 border-t border-rule py-20 md:py-28">
            <ContactSection />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
