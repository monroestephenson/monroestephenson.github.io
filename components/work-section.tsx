"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Database, Code } from "lucide-react"

export function WorkSection() {
  const workExperience = [
    {
      company: "CloudSquid.io",
      role: "Founding Engineer",
      period: "2025 - Present",
      description:
        "Working as a founding engineer to build scalable cloud infrastructure solutions. Developing microservices architecture and implementing DevOps best practices for continuous deployment and monitoring.",
      skills: ["AWS", "Kubernetes", "Microservices", "CI/CD", "Terraform"],
      icon: <Cloud className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
    {
      company: "Project Eaden",
      role: "Software Engineer - Data",
      period: "2024 - 2025",
      description:
        "Developed Python-based REST APIs and automated CI/CD pipelines using AWS (Lambda, Docker), reducing deployment time by 50%. Built scalable data processing workflows using FastAPI and serverless components.",
      skills: ["Python", "FastAPI", "AWS Lambda", "Docker", "Serverless"],
      icon: <Database className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
    {
      company: "Telis Energy",
      role: "Software Engineering Intern",
      period: "2024",
      description:
        "Implemented Python scripts for data ingestion pipelines, cutting manual processing by 40%. Deployed containerized applications in Docker and orchestrated workloads with Kubernetes for improved scalability.",
      skills: ["Python", "Docker", "Kubernetes", "Data Processing"],
      icon: <Code className="h-8 w-8 text-amber-700 dark:text-amber-500" />,
    },
  ]

  return (
    <div>
      <SectionHeader
        title="Work Experience"
        subtitle="My professional journey building scalable software solutions and cloud infrastructure."
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
                    <h3 className="text-xl font-semibold">{job.company}</h3>
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

