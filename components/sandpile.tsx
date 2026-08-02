"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

/*
  Abelian sandpile, s = 4.

  Grains are dropped on a single cell of a square lattice. Any cell holding four
  or more grains topples, passing one grain to each of its four neighbours;
  grains that reach the boundary leave the system. The order of topplings does
  not affect the final configuration (that is the abelian part), which is what
  lets this run incrementally, a slice per frame, and still be correct.

  Cells holding zero grains are drawn as nothing at all, so the bare lattice
  shows through. States 1, 2 and 3 are the palette this site is built from.
*/

const N = 261
const CENTER = ((N / 2) | 0) * N + ((N / 2) | 0)
const INITIAL_TARGET = 90_000
const REFILL = 30_000
const FRAME_BUDGET_MS = 13

type Rgb = [number, number, number]

function readChannel(styles: CSSStyleDeclaration, name: string): Rgb {
  const raw = styles.getPropertyValue(name).trim()
  const parts = raw.split(/[\s,]+/).map(Number)
  if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
    return [parts[0], parts[1], parts[2]]
  }
  return [0, 0, 0]
}

function formatCount(n: number) {
  return n.toLocaleString("en-US")
}

export function Sandpile() {
  const { resolvedTheme } = useTheme()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<ImageData | null>(null)

  const gridRef = useRef<Int32Array | null>(null)
  const queueRef = useRef<number[]>([])
  const paletteRef = useRef<Rgb[]>([
    [0, 0, 0],
    [138, 160, 172],
    [60, 103, 133],
    [18, 41, 60],
  ])

  const droppedRef = useRef(0)
  const topplingsRef = useRef(0)
  const targetRef = useRef(INITIAL_TARGET)
  const settledRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const visibleRef = useRef(true)
  const lastPublishRef = useRef(0)

  const [counts, setCounts] = useState({ grains: 0, topplings: 0 })
  const [settled, setSettled] = useState(false)
  const [reduced, setReduced] = useState(false)

  /* ---------- rendering ---------- */

  const paint = useCallback(() => {
    const grid = gridRef.current
    const image = imageRef.current
    const offscreen = offscreenRef.current
    const canvas = canvasRef.current
    if (!grid || !image || !offscreen || !canvas) return

    const pal = paletteRef.current
    const data = image.data

    for (let i = 0, o = 0; i < grid.length; i++, o += 4) {
      const v = grid[i]
      if (v <= 0) {
        data[o + 3] = 0
        continue
      }
      const c = pal[v > 3 ? 3 : v]
      data[o] = c[0]
      data[o + 1] = c[1]
      data[o + 2] = c[2]
      data[o + 3] = 255
    }

    const octx = offscreen.getContext("2d")
    if (!octx) return
    octx.putImageData(image, 0, 0)

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)
    ctx.imageSmoothingEnabled = false
    const size = Math.min(w, h)
    ctx.drawImage(offscreen, 0, 0, N, N, (w - size) / 2, (h - size) / 2, size, size)
  }, [])

  /* ---------- simulation ---------- */

  const advance = useCallback((budgetMs: number) => {
    const grid = gridRef.current
    if (!grid) return true
    const queue = queueRef.current
    const deadline = performance.now() + budgetMs

    while (performance.now() < deadline) {
      if (queue.length === 0) {
        if (droppedRef.current >= targetRef.current) return true
        const batch = Math.min(250, targetRef.current - droppedRef.current)
        grid[CENTER] += batch
        droppedRef.current += batch
        if (grid[CENTER] >= 4) queue.push(CENTER)
      }

      let ops = 0
      while (queue.length > 0 && ops < 3000) {
        const i = queue.pop() as number
        const v = grid[i]
        if (v < 4) continue

        const t = v >> 2
        grid[i] = v - (t << 2)
        topplingsRef.current += t

        const x = i % N
        const y = (i / N) | 0

        if (x > 0) {
          const j = i - 1
          if ((grid[j] += t) >= 4) queue.push(j)
        }
        if (x < N - 1) {
          const j = i + 1
          if ((grid[j] += t) >= 4) queue.push(j)
        }
        if (y > 0) {
          const j = i - N
          if ((grid[j] += t) >= 4) queue.push(j)
        }
        if (y < N - 1) {
          const j = i + N
          if ((grid[j] += t) >= 4) queue.push(j)
        }
        ops++
      }
    }
    return false
  }, [])

  const publish = useCallback((force = false) => {
    const now = performance.now()
    if (!force && now - lastPublishRef.current < 90) return
    lastPublishRef.current = now
    setCounts({ grains: droppedRef.current, topplings: topplingsRef.current })
  }, [])

  const loop = useCallback(() => {
    if (!visibleRef.current) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }

    const done = advance(FRAME_BUDGET_MS)
    paint()
    publish()

    if (done) {
      settledRef.current = true
      publish(true)
      setSettled(true)
      rafRef.current = null
      return
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [advance, paint, publish])

  const start = useCallback(() => {
    if (rafRef.current !== null) return
    settledRef.current = false
    setSettled(false)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  /*
    Reduced-motion path. Settling 90,000 grains takes seconds of pure compute,
    so it is spread across macrotasks rather than run in a blocking loop; the
    viewer gets no animation, but the tab still responds.
  */
  const chunkTokenRef = useRef(0)
  const settleInChunks = useCallback(() => {
    const token = ++chunkTokenRef.current
    setSettled(false)
    const step = () => {
      if (token !== chunkTokenRef.current) return
      if (advance(24)) {
        paint()
        publish(true)
        settledRef.current = true
        setSettled(true)
        return
      }
      setTimeout(step, 0)
    }
    setTimeout(step, 0)
  }, [advance, paint, publish])

  /* ---------- setup ---------- */

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(prefersReduced)

    gridRef.current = new Int32Array(N * N)
    queueRef.current = []

    const offscreen = document.createElement("canvas")
    offscreen.width = N
    offscreen.height = N
    offscreenRef.current = offscreen
    const octx = offscreen.getContext("2d")
    if (octx) imageRef.current = octx.createImageData(N, N)

    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      paint()
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting && !document.hidden
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVisibility = () => {
      visibleRef.current = !document.hidden
    }
    document.addEventListener("visibilitychange", onVisibility)

    if (prefersReduced) {
      settleInChunks()
      return () => {
        // Invalidating the token stops any chunk chain still in flight.
        chunkTokenRef.current++
        ro.disconnect()
        io.disconnect()
        document.removeEventListener("visibilitychange", onVisibility)
      }
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Palette follows the theme; the simulation is untouched by it. */
  useEffect(() => {
    if (typeof window === "undefined") return
    const styles = getComputedStyle(document.documentElement)
    paletteRef.current = [
      [0, 0, 0],
      readChannel(styles, "--s1"),
      readChannel(styles, "--s2"),
      readChannel(styles, "--s3"),
    ]
    paint()
  }, [resolvedTheme, paint])

  /* ---------- controls ---------- */

  const addGrains = () => {
    targetRef.current += REFILL
    if (reduced) {
      settleInChunks()
      return
    }
    start()
  }

  const reset = () => {
    gridRef.current = new Int32Array(N * N)
    queueRef.current = []
    droppedRef.current = 0
    topplingsRef.current = 0
    targetRef.current = INITIAL_TARGET
    paint()
    publish(true)
    if (reduced) {
      settleInChunks()
      return
    }
    start()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative aspect-square w-full">
        <div className="lattice absolute inset-0" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`An abelian sandpile grown from ${formatCount(
            counts.grains,
          )} grains dropped on a single lattice site, forming a fractal of nested squares and triangles.`}
        />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        {/* Fixed columns: these numbers grow by orders of magnitude while the
            pile relaxes, and the row must not reflow underneath them. */}
        <dl className="flex gap-6 meta">
          <div className="w-[7ch]">
            <dt className="micro text-ink-muted">Grains</dt>
            <dd className="text-ink">{formatCount(counts.grains)}</dd>
          </div>
          <div className="w-[12ch]">
            <dt className="micro text-ink-muted">Topplings</dt>
            <dd className="text-ink">{formatCount(counts.topplings)}</dd>
          </div>
          <div className="w-[8ch]">
            <dt className="micro text-ink-muted">State</dt>
            <dd className={settled ? "text-ink" : "text-critical"}>
              {settled ? "stable" : "relaxing"}
            </dd>
          </div>
        </dl>

        <div className="flex gap-4 meta">
          <button
            type="button"
            onClick={addGrains}
            className="link text-ink-muted hover:text-critical"
          >
            Add {formatCount(REFILL)} grains
          </button>
          <button
            type="button"
            onClick={reset}
            className="link text-ink-muted hover:text-critical"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
