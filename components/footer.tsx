"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-100 dark:bg-zinc-800/50 border-t border-stone-200 dark:border-zinc-800 mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link
              href="/"
              className="text-2xl font-playfair font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-500 dark:to-amber-700"
            >
              gramscian
            </Link>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xs">
              Software engineer with a passion for building scalable, cloud-based applications and contributing to
              open-source projects.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#intro"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                >
                  Introduction
                </Link>
              </li>
              <li>
                <Link
                  href="#work"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                >
                  Work Experience
                </Link>
              </li>
              <li>
                <Link
                  href="#projects"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="#research"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                >
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="#personal"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                >
                  Photography
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Connect</h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/monroestephenson"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-stone-200 dark:bg-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-amber-200 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/mostephenreed"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-stone-200 dark:bg-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-amber-200 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>

              <motion.a
                href="mailto:stephensonmonroe@gmail.com"
                className="p-2 bg-stone-200 dark:bg-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-amber-200 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {currentYear} gramscian.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

