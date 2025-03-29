"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, MessageSquare, Database, Cpu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ProjectsSection() {
  const projects = [
    {
      title: "Sprawl",
      description:
        "A distributed, scalable pub/sub messaging system with intelligent routing and DHT-based topic distribution.",
      image: "/sprawl_logo.png",
      tags: ["Go", "Distributed Systems", "Pub/Sub", "DHT"],
      githubUrl: "https://github.com/monroestephenson/sprawl",
      liveUrl: "",
      icon: <MessageSquare className="h-10 w-10 text-amber-700 dark:text-amber-500" />,
      features: [
        "Distributed Hash Table (DHT) for topic management",
        "Gossip protocol for node discovery",
        "Tiered storage (Memory, RocksDB, MinIO/S3)",
        "AI-powered traffic analysis and load prediction",
      ],
      bgColor: "bg-gradient-to-br from-amber-50 to-stone-200 dark:from-amber-950/30 dark:to-zinc-900",
    },
    {
      title: "Hegemon",
      description: "A powerful and secure command-line tool for managing database backups, written in modern C++.",
      image: "/hegemon.png",
      tags: ["C++", "CLI", "Database", "Backup"],
      githubUrl: "https://github.com/monroestephenson/hegemon",
      liveUrl: "",
      icon: <Database className="h-10 w-10 text-amber-700 dark:text-amber-500" />,
      features: [
        "Support for MySQL, PostgreSQL, and SQLite",
        "Compression and encryption options",
        "Local and cloud storage integration",
        "Retention policy management",
      ],
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-900",
    },
    {
      title: "Simulife",
      description:
        "An existential clicker browser game that evolves from a standard incremental clicker into an existential experience.",
      image: "/placeholder.svg",
      tags: ["React", "TypeScript", "Game", "Philosophy"],
      githubUrl: "https://github.com/monroestephenson/simulife",
      liveUrl: "https://simulife-demo.vercel.app",
      icon: <Cpu className="h-10 w-10 text-amber-700 dark:text-amber-500" />,
      features: [
        "Evolving gameplay mechanics",
        "Existential themes and humor",
        "UI decay that mirrors player progression",
        "LLM integration for dynamic content",
      ],
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30",
    },
  ]

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Open-source projects I've created and contributed to." />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col overflow-hidden border-stone-200 dark:border-zinc-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className={`relative h-48 w-full overflow-hidden ${project.bgColor}`}>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {project.title === "Sprawl" || project.title === "Hegemon" ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={300}
                      height={150}
                      className="object-contain max-h-40"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      {project.icon}
                      <h3 className="text-xl font-semibold mt-2 text-zinc-800 dark:text-zinc-200">{project.title}</h3>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                </div>
              </div>

              <CardContent className="flex-grow pt-6 space-y-4">
                <p>{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="border-t border-stone-200 dark:border-zinc-800 pt-4 flex gap-4">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-amber-700 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-zinc-800"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </Link>

                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-amber-700 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-zinc-800"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="https://github.com/monroestephenson" target="_blank" rel="noopener noreferrer">
          <Button className="bg-amber-700 hover:bg-amber-800 text-white">
            <Github className="mr-2 h-4 w-4" />
            View More on GitHub
          </Button>
        </Link>
      </div>
    </div>
  )
}

