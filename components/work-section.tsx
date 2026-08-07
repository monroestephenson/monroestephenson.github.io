import { SectionHeader } from "@/components/section-header"

const positions = [
  {
    company: "Superchat",
    role: "Backend engineer, AI features",
    location: "Berlin",
    period: "Since May 2026",
    current: true,
    description:
      "On the AI team, in Kotlin and Quarkus: voice agents, chatbots and automation over an inbox that folds WhatsApp, social and email into a single thread. More than 10,000 businesses run their customer conversations on it, on German infrastructure, under GDPR. It is the best room I have worked in.",
    stack: "Kotlin · Quarkus · Voice agents · GDPR-bound systems",
  },
  {
    company: "cloudsquid",
    role: "Founding engineer",
    location: "Berlin",
    period: "Apr 2025 to May 2026",
    description:
      "Event-driven pipelines in Go for pulling structure out of unstructured documents.",
    stack: "Go · gRPC · Kafka",
  },
  {
    company: "Project Eaden",
    role: "Software engineer",
    location: "Berlin",
    period: "Aug 2024 to Apr 2025",
    description:
      "Models for high-dimensional data in food-tech R&D, raising predictive accuracy of product performance by 25%. Put the serving and CI paths on solid ground, cutting model iteration from days to hours.",
    stack: "PyTorch · TensorFlow · FastAPI · AWS · Terraform",
  },
  {
    company: "Telis Energy",
    role: "Software engineering intern, research & analytics",
    location: "Remote",
    period: "Mar 2024 to Oct 2024",
    description:
      "Automated wind-turbine layout generation in PyQGIS so site planning could be driven by data rather than by hand, improving output efficiency by 30%. Built the ingestion path for the multimodal datasets behind the environmental simulations.",
    stack: "Python · PyQGIS · Spark · Airflow",
  },
  {
    company: "Max Planck Institute for Mathematics in the Sciences",
    role: "Machine learning researcher, Fulbright scholar",
    location: "Leipzig",
    period: "2023 to 2024",
    description:
      "Algebraic statistics and interpretability: what the higher cumulants of a mixed signal reveal about the independent sources beneath it. Published, and presented at international conferences.",
    stack: "Algebraic statistics · Independent component analysis",
  },
]

export function WorkSection() {
  return (
    <div>
      <SectionHeader label="Work" count={`${positions.length} positions`} title="Where the work has been.">
        <p>
          Research first, then startups, and lately the two have converged on
          the same problem, which is getting structure out of data that arrives
          without any.
        </p>
      </SectionHeader>

      <ol className="border-t border-rule">
        {positions.map((position) => (
          <li
            key={position.company}
            className="grid gap-x-10 gap-y-4 border-b border-rule py-8 md:grid-cols-12 md:py-10"
          >
            <div className="md:col-span-3">
              <p className="meta text-ink-muted">
                {position.current && (
                  <span
                    aria-hidden="true"
                    className="mr-2 inline-block h-[7px] w-[7px] translate-y-[-1px] bg-critical align-middle"
                  />
                )}
                {position.period}
              </p>
              <p className="micro mt-2 text-ink-muted">{position.location}</p>
            </div>

            <div className="md:col-span-9">
              <h3 className="text-h3">
                {position.company}
                {position.current && <span className="sr-only"> (current position)</span>}
              </h3>
              <p className={`meta mt-1 ${position.current ? "text-critical" : "text-ink-muted"}`}>
                {position.role}
              </p>
              <p className="mt-4 max-w-measure text-ink-muted">{position.description}</p>
              <p className="meta mt-4 text-ink-muted">{position.stack}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
