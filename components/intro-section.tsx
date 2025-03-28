"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { FileText, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function IntroSection() {
  return (
    <div>
      <SectionHeader
        title="Introduction"
        subtitle="Software engineer with a passion for building scalable, cloud-based applications and contributing to open-source projects."
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-lg">
            <Image src="/monroe_profile.jpg" alt="Monroe Stephenson at Reed College" fill className="object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="space-y-6">
            <p className="text-lg">
              Hello, I'm Monroe Stephenson. I specialize in designing and deploying scalable, cloud-based applications
              with expertise in Python development, RESTful APIs, and containerization on AWS.
            </p>

            <p className="text-lg">
              My background in mathematics provides me with a strong analytical foundation, while my passion for
              technology drives me to continuously explore new tools and methodologies.
            </p>

            <p className="text-lg">
              I'm currently pursuing my M.S. in Computer Science at Georgia Institute of Technology, focusing on
              Distributed Systems, Cloud Computing, and Advanced Machine Learning.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                  <FileText className="mr-2 h-4 w-4" /> Download Resume
                </Button>
              </Link>

              <Link href="https://github.com/monroestephenson" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-amber-700 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-zinc-800"
                >
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Button>
              </Link>

              <Link href="https://linkedin.com/in/monroe-stephenson" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-amber-700 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-zinc-800"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

