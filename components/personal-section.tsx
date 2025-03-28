"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import Image from "next/image"

export function PersonalSection() {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      src: "/mount_hood.jpg",
      alt: "Mount Hood",
      title: "Mount Hood",
      location: "Oregon, USA",
    },
    {
      id: 2,
      src: "/mount_hood_snow.jpg",
      alt: "Mount Hood in winter",
      title: "Snowy Mount Hood",
      location: "Oregon, USA",
    },
    {
      id: 3,
      src: "/reed_canyon.jpg",
      alt: "Reed College Canyon",
      title: "Reed College Canyon",
      location: "Portland, Oregon",
    },
    {
      id: 4,
      src: "/reed_cherry_blossums.jpg",
      alt: "Cherry blossoms at Reed College",
      title: "Reed Cherry Blossoms",
      location: "Portland, Oregon",
    },
    {
      id: 5,
      src: "/reed_snowy.jpeg",
      alt: "Reed College in winter",
      title: "Winter at Reed",
      location: "Portland, Oregon",
    },
    {
      id: 6,
      src: "/budapest.jpg",
      alt: "Budapest cityscape",
      title: "Budapest",
      location: "Hungary",
    },
    {
      id: 7,
      src: "/ship_wreck_oregon.jpg",
      alt: "Shipwreck on Oregon coast",
      title: "Oregon Shipwreck",
      location: "Oregon Coast, USA",
    },
    {
      id: 8,
      src: "/arizona.jpg",
      alt: "Arizona landscape",
      title: "Arizona",
      location: "USA",
    },
    {
      id: 9,
      src: "/jerusalem_north.jpg",
      alt: "Northern Jerusalem",
      title: "Jerusalem North",
      location: "Israel",
    },
    {
      id: 10,
      src: "/wailing_wall.jpg",
      alt: "Wailing Wall in Jerusalem",
      title: "Western Wall",
      location: "Jerusalem, Israel",
    },
    {
      id: 11,
      src: "/rome_overview.jpg",
      alt: "Overview of Rome",
      title: "Rome",
      location: "Italy",
    },
    {
      id: 12,
      src: "/venice_canel.jpg",
      alt: "Venice Canal",
      title: "Venice Canal",
      location: "Italy",
    },
    {
      id: 13,
      src: "/chicago.jpg",
      alt: "Chicago cityscape",
      title: "Chicago",
      location: "Illinois, USA",
    },
    {
      id: 14,
      src: "/jerusalem_hostel.jpg",
      alt: "Hostel in Jerusalem",
      title: "Jerusalem Hostel",
      location: "Jerusalem, Israel",
    },
    {
      id: 15,
      src: "/jerusalem_south.jpg",
      alt: "Southern Jerusalem",
      title: "Jerusalem South",
      location: "Israel",
    },
    {
      id: 16,
      src: "/malibu.jpg",
      alt: "Malibu coastline",
      title: "Malibu",
      location: "California, USA",
    },
    {
      id: 17,
      src: "/olympic_national_waterfall.jpg",
      alt: "Waterfall in Olympic National Park",
      title: "Olympic National Waterfall",
      location: "Washington, USA",
    },
    {
      id: 18,
      src: "/oregon_cost_eagle_point.jpg",
      alt: "Eagle Point on Oregon Coast",
      title: "Oregon Coast Eagle Point",
      location: "Oregon, USA",
    },
    {
      id: 19,
      src: "/oregon_coast_2.jpeg",
      alt: "Oregon coastline",
      title: "Oregon Coast",
      location: "Oregon, USA",
    },
    {
      id: 20,
      src: "/portland_overview.jpg",
      alt: "Overview of Portland",
      title: "Portland Overview",
      location: "Oregon, USA",
    },
    {
      id: 21,
      src: "/red_wood.jpg",
      alt: "Redwood forest",
      title: "Redwood Forest",
      location: "California, USA",
    },
    {
      id: 22,
      src: "/rome_overview2.jpg",
      alt: "Another view of Rome",
      title: "Rome Vista",
      location: "Italy",
    },
    {
      id: 23,
      src: "/rostock.jpg",
      alt: "City of Rostock",
      title: "Rostock",
      location: "Germany",
    },
    {
      id: 24,
      src: "/schwarzwald.jpeg",
      alt: "Black Forest",
      title: "Schwarzwald (Black Forest)",
      location: "Germany",
    },
    {
      id: 25,
      src: "/stein_am_rhein.JPG",
      alt: "Stein am Rhein",
      title: "Stein am Rhein",
      location: "Switzerland",
    },
    {
      id: 26,
      src: "/tel_aviv.jpg",
      alt: "Tel Aviv cityscape",
      title: "Tel Aviv",
      location: "Israel",
    },
    {
      id: 27,
      src: "/trout_lake.jpg",
      alt: "Trout Lake",
      title: "Trout Lake",
      location: "Washington, USA",
    },
    {
      id: 28,
      src: "/vancouver_island_river.jpg",
      alt: "River on Vancouver Island",
      title: "Vancouver Island River",
      location: "British Columbia, Canada",
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
    <div>
      <SectionHeader
        title="Travel Photography"
        subtitle="A collection of nature photographs I've taken during my travels."
      />

      <div className="mb-8 flex justify-between items-center">
        <p className="text-zinc-600 dark:text-zinc-400 italic">
          "Study nature, love nature, stay close to nature. It will never fail you." — Frank Lloyd Wright
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
          <Button
            variant="outline"
            className="relative border-amber-700 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-zinc-800"
          >
            {isUploading ? "Uploading..." : "Upload Photos"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Masonry-style gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`cursor-pointer ${index % 3 === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            onClick={() => openLightbox(photo.id)}
          >
            <Card className="overflow-hidden border-stone-200 dark:border-zinc-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-lg font-medium text-white">{photo.title}</h3>
                      <p className="text-sm text-stone-200">{photo.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-stone-300 dark:border-zinc-700 rounded-lg">
          <Camera className="h-12 w-12 mx-auto text-stone-400 dark:text-zinc-600 mb-4" />
          <h3 className="text-xl font-medium mb-2">No photos yet</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">Upload your nature photography to display here</p>
          <Button
            variant="outline"
            className="relative border-amber-700 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-zinc-800"
          >
            Upload Photos
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

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

