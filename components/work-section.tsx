"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Database, Code, Cpu } from "lucide-react"

export function WorkSection() {
  const workExperience = [
    {
      company: "Cloudsquid",
      location: "Berlin, Germany",
      role: "Founding Engineer",
      period: "Apr 2024 - Present",
      description:
        "Architecting and optimizing real-time, event-driven AI data pipelines in Go, enhancing observability and explainability for large-scale unstructured data processing. Building high-throughput systems with gRPC, Kafka, and ClickHouse, enabling scalable infrastructure for ML model deployment and monitoring. Driving technical strategy with the founding team, shaping product direction and ensuring reliability, scalability, and performance from prototype to production.",
      skills: ["Go", "gRPC", "Kafka", "ClickHouse", "AI Pipelines", "Data Engineering"],
      icon: <Cloud className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
    {
      company: "Project Eaden",
      location: "Berlin, Germany",
      role: "Software Engineer",
      period: "Aug 2024 - Apr 2025",
      description:
        "Implemented advanced ML models (PyTorch, TensorFlow) for high-dimensional data analysis in food tech R&D, improving predictive accuracy of product performance by 25%. Deployed scalable APIs (FastAPI, gRPC) and CICD pipelines on AWS (Terraform, Docker), reducing model iteration cycles from days to hours. Led cross-functional collaborations, integrating complex ML pipelines with business metrics, contributing to a 15% reduction in production costs.",
      skills: ["PyTorch", "TensorFlow", "FastAPI", "gRPC", "AWS", "Terraform", "Docker"],
      icon: <Database className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
    {
      company: "Telis Energy",
      location: "Remote",
      role: "Software Engineering Intern (Research & Analytics)",
      period: "Mar 2024 - Oct 2024",
      description:
        "Developed Python and PyQGIS scripts automating wind turbine layouts, enabling data-driven site planning and boosting renewable energy output efficiency by 30%. Implemented large-scale data ingestion and transformation pipelines (Apache Spark, Airflow) to handle multimodal datasets, accelerating environmental simulations by 40%.",
      skills: ["Python", "PyQGIS", "Apache Spark", "Airflow", "Data Engineering"],
      icon: <Code className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
    {
      company: "Max Planck Institute MiS",
      location: "Leipzig, Germany",
      role: "Machine Learning Researcher (Fulbright Scholarship)",
      period: "Fall 2023 - Fall 2024",
      description:
        "Pioneered research on non-independent component analysis and interpretability in algebraic statistics for complex ML systems. Published findings in top-tier statistics journals (e.g., under review at Algebraic Statistics), presented at international conferences.",
      skills: ["Machine Learning", "Algebraic Statistics", "Research", "Component Analysis"],
      icon: <Cpu className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
  ]

  return (
    <div>
      <SectionHeader
        title="Work Experience"
        subtitle="My professional journey building scalable software solutions and AI systems across Europe and remotely."
      />

      <div className="space-y-8">
        {workExperience.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-stone-200 dark:border-zinc-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-stone-100 dark:bg-zinc-800/50 pb-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-stone-200 dark:bg-zinc-700 rounded-md">{job.icon}</div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-semibold">{job.company}</h3>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{job.location}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                      <p className="font-medium text-amber-800 dark:text-amber-500">{job.role}</p>
                      <span className="hidden sm:inline text-zinc-400">•</span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{job.period}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <p>{job.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {job.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

