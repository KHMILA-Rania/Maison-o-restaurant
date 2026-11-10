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
  { label: "About", href: "/#about" },
  { label: "The room", href: "/#gallery" },
  { label: "Reviews", href: "/#reviews" },
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
/* Drifting olive leaves (fits "MaisonOlive"): outlined leaves in the  */
/* same gold line style as before, tumbling slowly with a 3D flip,     */
/* plus a few warm dust specks like candlelight. Pauses off screen,    */
/* draws one still frame when the visitor prefers reduced motion.      */
/*                                                                     */
/* Replace the old `height` helper + `Terrain` function with this.     */
/* Keep the `.ft-terrain` class on the canvas so the fade-in + mask    */
/* from your CSS still works. Nothing else in the footer changes.      */
/* ------------------------------------------------------------------ */
type Leaf = {
  x: number
  y: number
  size: number // half-length in px
  depth: number // 0 far, 1 near
  vy: number
  swayAmp: number
  swayFreq: number
  phase: number
  rot: number
  vr: number
  flip: number
  vf: number
}

type Dust = { x: number; y: number; r: number; vy: number; tw: number; ph: number }

function Terrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let last = performance.now()
    let leaves: Leaf[] = []
    let dust: Dust[] = []

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const makeLeaf = (spawnAbove: boolean): Leaf => {
      const depth = Math.random()
      return {
        x: rand(-0.05, 1.05) * w,
        y: spawnAbove ? rand(-0.2, -0.02) * h : rand(0, 1) * h,
        size: 10 + depth * 30,
        depth,
        vy: 8 + depth * 22, // px per second, near leaves fall faster
        swayAmp: rand(14, 48) * (0.5 + depth),
        swayFreq: rand(0.25, 0.6),
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.35, 0.35),
        flip: rand(0, Math.PI * 2),
        vf: rand(0.4, 1.1),
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const count = w < 640 ? 16 : 30
      leaves = Array.from({ length: count }, () => makeLeaf(false))
      // draw far leaves first so near ones overlap them
      leaves.sort((a, b) => a.depth - b.depth)
      dust = Array.from({ length: w < 640 ? 24 : 50 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 1.8),
        vy: rand(-6, -2), // dust drifts up like heat from the kitchen
        tw: rand(0.5, 1.5),
        ph: rand(0, Math.PI * 2),
      }))
      draw(0)
    }

    const drawLeaf = (l: Leaf, t: number) => {
      const sway = Math.sin(t * l.swayFreq + l.phase) * l.swayAmp
      const x = l.x + sway
      const fx = Math.cos(l.flip) // squashes the leaf like it is turning in the air
      const L = l.size
      const W = l.size * 0.28

      ctx.save()
      ctx.translate(x, l.y)
      ctx.rotate(l.rot)
      ctx.scale(Math.max(Math.abs(fx), 0.12), 1)

      const alpha = 0.16 + l.depth * 0.5

      // leaf body
      ctx.beginPath()
      ctx.moveTo(0, -L)
      ctx.bezierCurveTo(W * 1.5, -L * 0.45, W * 1.3, L * 0.5, 0, L)
      ctx.bezierCurveTo(-W * 1.3, L * 0.5, -W * 1.5, -L * 0.45, 0, -L)
      ctx.closePath()
      ctx.fillStyle = `rgba(217, 163, 77, ${alpha * 0.12})`
      ctx.fill()
      ctx.lineWidth = 0.9
      ctx.strokeStyle = `rgba(217, 163, 77, ${alpha})`
      ctx.stroke()

      // midrib + a few veins
      ctx.beginPath()
      ctx.moveTo(0, -L * 0.9)
      ctx.lineTo(0, L * 1.1) // tiny stem
      for (let k = -2; k <= 2; k++) {
        const py = k * L * 0.3
        ctx.moveTo(0, py)
        ctx.lineTo(W * 0.9, py - L * 0.16)
        ctx.moveTo(0, py)
        ctx.lineTo(-W * 0.9, py - L * 0.16)
      }
      ctx.strokeStyle = `rgba(217, 163, 77, ${alpha * 0.6})`
      ctx.lineWidth = 0.6
      ctx.stroke()

      ctx.restore()
    }

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      for (const l of leaves) drawLeaf(l, t)

      for (const d of dust) {
        const a = 0.15 + 0.3 * (0.5 + 0.5 * Math.sin(t * d.tw + d.ph))
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(241, 217, 168, ${a})`
        ctx.fill()
      }
    }

    const step = (dt: number) => {
      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i]
        l.y += l.vy * dt
        l.rot += l.vr * dt
        l.flip += l.vf * dt
        if (l.y - l.size > h) leaves[i] = makeLeaf(true)
      }
      for (const d of dust) {
        d.y += d.vy * dt
        if (d.y < -4) {
          d.y = h + 4
          d.x = rand(0, w)
        }
      }
    }

    let elapsed = 0
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (visible) {
        elapsed += dt
        step(dt)
        draw(elapsed)
      }
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