"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cover_2.png"
          alt="Mount Hood landscape"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/50 to-zinc-900/70 dark:from-black/80 dark:via-black/60 dark:to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-6 inline-block"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-amber-500/80 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-500 rounded-full" />
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Monroe Stephenson
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 text-stone-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Software Engineer • Mathematician • Fulbright Scholar
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Button
            size="lg"
            className="bg-amber-700 hover:bg-amber-800 text-white border-none"
            onClick={() => {
              document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Explore <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 1 },
          y: { delay: 1.5, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
        }}
      >
        <ArrowDown className="h-6 w-6 text-white" />
      </motion.div>
    </section>
  )
}

