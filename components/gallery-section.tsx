"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export function GallerySection() {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      src: "/placeholder.svg?height=600&width=800",
      alt: "Nature photo 1",
      title: "Mountain Sunrise",
      location: "Cascade Range, Washington",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=600&width=800",
      alt: "Nature photo 2",
      title: "Desert Bloom",
      location: "Joshua Tree National Park, California",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=600&width=800",
      alt: "Nature photo 3",
      title: "Coastal Fog",
      location: "Big Sur, California",
    },
  ])

  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)

      // Simulate upload delay
      setTimeout(() => {
        const newPhotos = Array.from(e.target.files!).map((file, index) => ({
          id: photos.length + index + 1,
          src: URL.createObjectURL(file),
          alt: file.name,
          title: file.name.split(".")[0].replace(/_/g, " "),
          location: "Custom Upload",
        }))

        setPhotos([...photos, ...newPhotos])
        setIsUploading(false)
      }, 1500)
    }
  }

  const openLightbox = (id: number) => {
    setSelectedPhoto(id)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhoto === null) return

    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedPhoto(photos[newIndex].id)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-lg text-muted-foreground">
          A collection of nature photographs I've taken during my travels.
        </p>

        <div className="relative">
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handlePhotoUpload}
          />
          <Button variant="outline" className="relative">
            {isUploading ? "Uploading..." : "Upload Photos"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="cursor-pointer"
            onClick={() => openLightbox(photo.id)}
          >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background/80 to-background dark:from-background/50 dark:to-background/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{photo.title}</h3>
                  <p className="text-sm text-muted-foreground">{photo.location}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={() => navigatePhoto("prev")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh]">
            {photos.find((photo) => photo.id === selectedPhoto) && (
              <Image
                src={photos.find((photo) => photo.id === selectedPhoto)!.src || "/placeholder.svg"}
                alt={photos.find((photo) => photo.id === selectedPhoto)!.alt}
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto object-contain"
              />
            )}
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={() => navigatePhoto("next")}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <h3 className="text-xl font-medium">{photos.find((photo) => photo.id === selectedPhoto)?.title}</h3>
            <p className="text-sm opacity-80">{photos.find((photo) => photo.id === selectedPhoto)?.location}</p>
          </div>
        </div>
      )}
    </div>
  )
}

