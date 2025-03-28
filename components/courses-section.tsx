"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, BookText, Calculator } from "lucide-react"

export function CoursesSection() {
  const courses = [
    {
      title: "Statistical Methods for Data Science",
      description:
        "Advanced statistical techniques for analyzing and interpreting complex datasets, including regression analysis, hypothesis testing, and Bayesian methods.",
      icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
    },
    {
      title: "Analysis of High-Dimensional Data",
      description:
        "Techniques for working with high-dimensional data, including dimensionality reduction, feature selection, and sparse modeling approaches.",
      icon: <Calculator className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Stochastic Processes I: Discrete Time",
      description:
        "Mathematical foundations of stochastic processes in discrete time, including Markov chains, martingales, and random walks with applications.",
      icon: <BookText className="h-10 w-10 text-purple-500" />,
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {courses.map((course, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="h-full border-none shadow-lg bg-gradient-to-br from-background/80 to-background dark:from-background/50 dark:to-background/80 backdrop-blur-sm">
            <CardContent className="pt-6 flex flex-col items-center text-center h-full">
              <div className="mb-4">{course.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

