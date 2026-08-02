"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { SectionHeader } from "@/components/section-header"

/*
  Numbered as plates, in the sense a monograph means it: an image you can cite
  by number. That is the one place on this site where a sequence is real.
*/
const plates = [
  { src: "/mount_hood.jpg", title: "Mount Hood", place: "Oregon" },
  { src: "/mount_hood_snow.jpg", title: "Mount Hood, winter", place: "Oregon" },
  { src: "/reed_canyon.jpg", title: "Reed Canyon", place: "Portland, Oregon" },
  { src: "/reed_cherry_blossums.jpg", title: "Cherry blossom, Reed", place: "Portland, Oregon" },
  { src: "/reed_snowy.jpeg", title: "Snow on campus", place: "Portland, Oregon" },
  { src: "/portland_overview.jpg", title: "Portland", place: "Oregon" },
  { src: "/ship_wreck_oregon.jpg", title: "Peter Iredale", place: "Oregon coast" },
  { src: "/oregon_cost_eagle_point.jpg", title: "Eagle Point", place: "Oregon coast" },
  { src: "/oregon_coast_2.jpeg", title: "Coast", place: "Oregon" },
  { src: "/olympic_national_waterfall.jpg", title: "Falls, Olympic", place: "Washington" },
  { src: "/trout_lake.jpg", title: "Trout Lake", place: "Washington" },
  { src: "/red_wood.jpg", title: "Redwoods", place: "California" },
  { src: "/malibu.jpg", title: "Malibu", place: "California" },
  { src: "/arizona.jpg", title: "Desert", place: "Arizona" },
  { src: "/chicago.jpg", title: "Chicago", place: "Illinois" },
  { src: "/vancouver_island_river.jpg", title: "River, Vancouver Island", place: "British Columbia" },
  { src: "/budapest.jpg", title: "Budapest", place: "Hungary" },
  { src: "/rostock.jpg", title: "Rostock", place: "Germany" },
  { src: "/schwarzwald.jpeg", title: "Schwarzwald", place: "Germany" },
  { src: "/stein_am_rhein.JPG", title: "Stein am Rhein", place: "Switzerland" },
  { src: "/rome_overview.jpg", title: "Rome", place: "Italy" },
  { src: "/rome_overview2.jpg", title: "Rome, again", place: "Italy" },
  { src: "/venice_canel.jpg", title: "Canal", place: "Venice" },
  { src: "/jerusalem_north.jpg", title: "Jerusalem, north", place: "Israel" },
  { src: "/jerusalem_south.jpg", title: "Jerusalem, south", place: "Israel" },
  { src: "/jerusalem_hostel.jpg", title: "Hostel", place: "Jerusalem" },
  { src: "/wailing_wall.jpg", title: "Western Wall", place: "Jerusalem" },
  { src: "/tel_aviv.jpg", title: "Tel Aviv", place: "Israel" },
]

function plateNumber(index: number) {
  return String(index + 1).padStart(2, "0")
}

export function PersonalSection() {
  const [open, setOpen] = useState<number | null>(null)
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([])
  const returnFocusRef = useRef<number | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setOpen(null)
  }, [])

  const move = useCallback((delta: number) => {
    setOpen((current) => {
      if (current === null) return current
      return (current + delta + plates.length) % plates.length
    })
  }, [])

  useEffect(() => {
    if (open === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        move(1)
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        move(-1)
      }
    }

    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close, move])

  /* Send focus back to the thumbnail the viewer came from. */
  useEffect(() => {
    if (open === null && returnFocusRef.current !== null) {
      triggersRef.current[returnFocusRef.current]?.focus()
      returnFocusRef.current = null
    }
  }, [open])

  const current = open === null ? null : plates[open]

  return (
    <div>
      <SectionHeader label="Plates" count={`${plates.length} photographs`} title="Places I have stood.">
        <p>
          Taken between Oregon and Jerusalem, mostly on the way to or from
          somebody&rsquo;s mathematics department. I am generally after the same
          thing in all of them: dense forest, weather, and the feeling of being a
          long way from a city.
        </p>
      </SectionHeader>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {plates.map((plate, index) => (
          <li key={plate.src}>
            <button
              type="button"
              ref={(node) => {
                triggersRef.current[index] = node
              }}
              onClick={() => {
                returnFocusRef.current = index
                setOpen(index)
              }}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden border border-rule">
                <Image
                  src={plate.src}
                  alt={`${plate.title}, ${plate.place}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-opacity duration-200 group-hover:opacity-85"
                />
              </span>
              <span className="mt-2 flex items-baseline gap-3">
                <span className="micro text-ink-muted">{plateNumber(index)}</span>
                <span className="meta text-ink">{plate.title}</span>
              </span>
              <span className="micro mt-1 block text-ink-muted">{plate.place}</span>
            </button>
          </li>
        ))}
      </ul>

      {current !== null && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Plate ${plateNumber(open)}, ${current.title}`}
          className="fixed inset-0 z-[60] flex flex-col bg-paper"
        >
          <div className="flex items-center justify-between gap-6 border-b border-rule px-5 py-4 sm:px-8">
            <p className="meta text-ink">
              <span className="micro mr-3 text-ink-muted">Plate {plateNumber(open)}</span>
              {current.title}
              <span className="text-ink-muted">, {current.place}</span>
            </p>
            <button
              type="button"
              ref={closeRef}
              onClick={close}
              className="micro text-ink-muted transition-colors hover:text-critical"
            >
              Close
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              src={current.src}
              alt={`${current.title}, ${current.place}`}
              fill
              sizes="100vw"
              className="object-contain p-4 sm:p-8"
            />
          </div>

          <div className="flex items-center justify-between gap-6 border-t border-rule px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => move(-1)}
              className="micro text-ink-muted transition-colors hover:text-critical"
            >
              ← Previous
            </button>
            <p className="micro text-ink-muted">
              {plateNumber(open)} / {plates.length}
            </p>
            <button
              type="button"
              onClick={() => move(1)}
              className="micro text-ink-muted transition-colors hover:text-critical"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
