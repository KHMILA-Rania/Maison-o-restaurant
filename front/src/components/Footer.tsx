"use client"
import { useState } from "react"
import { useEffect, useRef } from "react"
import Reservation from "../pages/Reservation"

/* Placeholders: replace with your real details */
const NAME = "MaisonOlive"
const ADDRESS = "123 King Street West, Toronto, ON M5H 1A1, Canada"
const PHONE = " +1 (416) 0000-0000"
const EMAIL = "hello@restaurant.com"
const HOURS = "Tue to Sun, 12:00 to 23:00"
const MAP_URL = "https://maps.google.com"

const explore = [
  { label: "About", href: "#about" },
  { label: "The room", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Directions", href: MAP_URL },
]

const follow = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
]

const styles = `
.ft-item {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

[data-visible="true"] .ft-item {
  opacity: 1;
  transform: translateY(0);
}

.ft-terrain {
  opacity: 0;
  transition: opacity 2200ms ease;
  -webkit-mask-image: linear-gradient(to bottom, transparent 18%, #000 52%);
  mask-image: linear-gradient(to bottom, transparent 18%, #000 52%);
}

[data-visible="true"] .ft-terrain {
  opacity: 1;
}

.ft-link {
  position: relative;
  display: inline-block;
}

.ft-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  height: 1px;
  width: 100%;
  background: #d9a34d;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ft-link:hover::after,
.ft-link:focus-visible::after {
  transform: scaleX(1);
  transform-origin: left;
}

.ft-pill {
  transition: background-color 500ms ease, transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ft-pill:hover,
.ft-pill:focus-visible {
  background-color: #f1d9a8;
  transform: scale(1.04);
}

.ft-pill .ft-arrow {
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ft-pill:hover .ft-arrow,
.ft-pill:focus-visible .ft-arrow {
  transform: translateX(6px);
}

@media (prefers-reduced-motion: reduce) {
  .ft-item,
  .ft-terrain {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .ft-pill,
  .ft-pill .ft-arrow,
  .ft-link::after {
    transition: none !important;
  }
}
`

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` } as React.CSSProperties)

/* ------------------------------------------------------------------ */
/* Wireframe terrain: a slowly flowing mesh of mountains, drawn on a   */
/* canvas. Pauses when off screen, draws one still frame when the      */
/* visitor prefers reduced motion.                                     */
/* ------------------------------------------------------------------ */
function Terrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const COLS = 72
    const ROWS = 46
    const xs = new Float32Array(COLS * ROWS)
    const ys = new Float32Array(COLS * ROWS)

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    const start = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      draw(reduce ? 0 : (performance.now() - start) / 1000)
    }

    const height = (x: number, z: number) =>
      Math.sin(x * 0.9 + z * 0.35) * 0.5 +
      Math.sin(x * 0.4 - z * 0.6 + 1.3) * 0.7 +
      Math.sin(x * 1.7 + z * 0.9) * 0.22 +
      Math.sin(z * 0.22 + x * 0.15) * 0.9

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const horizon = h * 0.34
      const cx = w / 2
      const amp = h * 0.075
      const speed = 0.55

      for (let r = 0; r < ROWS; r++) {
        const u = r / (ROWS - 1) // 0 far, 1 near
        const v = Math.pow(u, 1.75)
        const rowY = horizon + (h * 1.02 - horizon) * v
        const sc = 0.45 + 1.15 * v
        const nz = (1 - v) * 18 + t * speed

        for (let c = 0; c < COLS; c++) {
          const xn = (c / (COLS - 1)) * 2 - 1
          const x = xn * 6
          let n = height(x, nz)
          // a broad ridge that rises on the right, like the reference
          n += 1.2 * Math.exp(-((xn - 0.62) * (xn - 0.62)) / 0.14) * (0.7 + Math.sin(nz * 0.3) * 0.3)
          const i = r * COLS + c
          xs[i] = cx + xn * w * 0.78 * sc
          ys[i] = rowY - (n + 0.6) * amp * sc
        }
      }

      ctx.lineWidth = 0.8
      ctx.strokeStyle = "rgba(217, 163, 77, 0.3)"

      // rows
      ctx.beginPath()
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c
          if (c === 0) ctx.moveTo(xs[i], ys[i])
          else ctx.lineTo(xs[i], ys[i])
        }
      }
      ctx.stroke()

      // columns
      ctx.strokeStyle = "rgba(217, 163, 77, 0.2)"
      ctx.beginPath()
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          const i = r * COLS + c
          if (r === 0) ctx.moveTo(xs[i], ys[i])
          else ctx.lineTo(xs[i], ys[i])
        }
      }
      ctx.stroke()
    }

    const loop = () => {
      if (visible) draw((performance.now() - start) / 1000)
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    let io: IntersectionObserver | undefined
    if (!reduce) {
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
      })
      io.observe(canvas)
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io?.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="ft-terrain pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}

const Footer = () => {
  const ref = useRef<HTMLElement>(null)
 const [booking, setBooking] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "true")
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-[#0d100e] text-white"
    >
      <style>{styles}</style>

      <Terrain />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between px-6 pb-8 pt-24 sm:px-10 sm:pt-32 lg:min-h-[92vh] lg:px-16">
        {/* Statement */}
        <div className="ft-item text-center" style={delay(100)}>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9a34d]">
            {NAME}
          </p>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-7xl">
            Your table is
            <span className="block italic text-[#d9a34d]">waiting.</span>
          </h2>
        </div>

        <div className="mt-20 lg:mt-32">
          {/* Three-part row: details, call to action, links */}
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
            <div className="ft-item order-2 lg:order-none" style={delay(250)}>
              <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a34d]">
                Visit us
              </h3>
              <ul className="space-y-2 text-sm leading-6 text-white/75">
                <li>
                  <span className="text-white">Address:</span> {ADDRESS}
                </li>
                <li>
                  <span className="text-white">Hours:</span> {HOURS}
                </li>
                <li>
                  <span className="text-white">Phone:</span>{" "}
                  <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="ft-link">
                    {PHONE}
                  </a>
                </li>
                <li>
                  <span className="text-white">E-mail:</span>{" "}
                  <a href={`mailto:${EMAIL}`} className="ft-link">
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            <div
              className="ft-item order-1 flex justify-center lg:order-none"
              style={delay(400)}
            >
              <button
                 onClick={() => setBooking(true)}
                className="ft-pill inline-flex items-center gap-5 rounded-full bg-[#d9a34d] px-10 py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#111512] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9a34d]"
              >
                Reserve a table
                <svg
                  className="ft-arrow"
                  width="22"
                  height="12"
                  viewBox="0 0 26 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M0 7h24M18 1l6 6-6 6" />
                </svg>
              </button>
            </div>

            <div
              className="ft-item order-3 grid grid-cols-2 gap-8 lg:order-none lg:justify-self-end lg:gap-20"
              style={delay(550)}
            >
              <nav aria-label="Footer">
                <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a34d]">
                  Explore
                </h3>
                <ul className="space-y-3 text-sm text-white/85">
                  {explore.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="ft-link">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a34d]">
                  Follow us
                </h3>
                <ul className="space-y-3 text-sm text-white/85">
                  {follow.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="ft-link">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="ft-item mt-16 flex flex-col items-center justify-between gap-4 text-xs text-white/55 sm:flex-row lg:mt-24"
            style={delay(700)}
          >
            <div className="flex items-center gap-6">
              <p>
                © {new Date().getFullYear()} {NAME}
              </p>
              <a href="#" className="ft-link">
                Privacy policy
              </a>
            </div>

            <button
              type="button"
              onClick={toTop}
              className="ft-link text-[#d9a34d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9a34d]"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
       <Reservation open={booking} onClose={() => setBooking(false)} />
    </footer>
  )
}

export default Footer