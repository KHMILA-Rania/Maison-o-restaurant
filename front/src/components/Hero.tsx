"use client" // needed for Next.js App Router, harmless elsewhere

import { useEffect, useRef,useState } from "react"

import Reservation from "../pages/Reservation"


const heroStyles = `
:root { --hero-ease: cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes hero-rise  { from { opacity: 0; transform: translate3d(0, 24px, 0); } }
@keyframes hero-line  { from { transform: translate3d(0, 105%, 0); } }
@keyframes hero-fade  { from { opacity: 0; } }
@keyframes hero-draw  { from { transform: scaleX(0); } }
@keyframes hero-image { from { opacity: 0; transform: translate3d(0, 40px, 0) scale(1.08); } }
@keyframes hero-frame { from { opacity: 0; transform: translate3d(-22px, 22px, 0); } }
@keyframes hero-drift {
  from { transform: translate3d(-2%, -1%, 0) scale(1); }
  to   { transform: translate3d(2%, 1.5%, 0) scale(1.06); }
}
@keyframes hero-nudge {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(0, 6px, 0); }
}

.hero-rise  { animation: hero-rise 1500ms var(--hero-ease) backwards; }
.hero-fade  { animation: hero-fade 1800ms ease-out backwards; }
.hero-image { animation: hero-image 2200ms var(--hero-ease) backwards; }
.hero-frame { animation: hero-frame 2000ms var(--hero-ease) backwards; }
.hero-draw  { transform-origin: left center; animation: hero-draw 1500ms var(--hero-ease) backwards; }

.hero-line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
}
.hero-line > span {
  display: block;
  animation: hero-line 1800ms var(--hero-ease) backwards;
}

.hero-glow {
  will-change: transform;
  animation:
    hero-fade 2600ms ease-out backwards,
    hero-drift 18s ease-in-out 0s infinite alternate;
}

.hero-nudge {
  display: inline-block;
  animation: hero-nudge 2.8s ease-in-out 3.5s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise, .hero-fade, .hero-image, .hero-frame, .hero-draw,
  .hero-line > span, .hero-glow, .hero-nudge {
    animation: none !important;
  }
}
`

// Stagger timing lives here (ms)
const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const [booking, setBooking] = useState(false)

  /* ---------------------------------------------------------------- */
  /*  Scroll effects                                                   */
  /*  - one passive listener, only active while the hero is on screen  */
  /*  - values are eased (lerp) in rAF for a silky, inertial feel      */
  /*  - writes transform/opacity directly: no React re-renders         */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    const media = mediaRef.current
    if (!section || !text || !media) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let target = 0
    let current = 0
    let raf = 0

    const read = () => {
      const r = section.getBoundingClientRect()
      target = clamp(-r.top / r.height)
    }

    const paint = () => {
      current += (target - current) * 0.1
      if (Math.abs(target - current) < 0.0005) current = target

      // Text lags behind the scroll and fades out
      text.style.transform = `translate3d(0, ${current * 70}px, 0)`
      text.style.opacity = String(clamp(1 - current * 1.5))

      // Image lags more (depth) and eases back slightly
      media.style.transform = `translate3d(0, ${current * 110}px, 0) scale(${
        1 - current * 0.06
      })`

      raf = current !== target ? requestAnimationFrame(paint) : 0
    }

    const onScroll = () => {
      read()
      if (!raf) raf = requestAnimationFrame(paint)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
      } else {
        window.removeEventListener("scroll", onScroll)
      }
    })
    io.observe(section)

    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6 lg:p-8">
      <style>{heroStyles}</style>

      <section
        ref={sectionRef}
        id="home"
        className="relative mx-auto min-h-[720px] max-w-[1440px] overflow-hidden rounded-[30px] border border-white/10 bg-[#111512]"
      >
        {/* Ambient background lighting (slow drift) */}
        <div className="hero-glow pointer-events-none absolute -inset-[10%] bg-[radial-gradient(ellipse_at_10%_20%,rgba(117,117,73,0.18),transparent_38%),radial-gradient(ellipse_at_90%_90%,rgba(100,111,64,0.16),transparent_35%)]" />

        {/* Main hero layout */}
        <div className="relative grid min-h-[720px] items-center px-6 pb-12 pt-24 sm:px-10 lg:grid-cols-2 lg:px-14 lg:pt-24">
          {/* Text content (scroll: lags + fades) */}
          <div
            ref={textRef}
            className="relative z-10 py-10 will-change-transform lg:py-16"
          >
            <p
              className="hero-rise mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a34d]"
              style={delay(300)}
            >
              <span
                className="hero-draw h-px w-8 bg-[#d9a34d]"
                style={delay(400)}
              />
              An unforgettable dining experience
            </p>

            <h1 className="font-serif text-5xl leading-[1.12] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="hero-line">
                <span style={delay(450)}>Flavour for Every</span>
              </span>
              <span className="hero-line">
                <span style={delay(650)}>Moment with</span>
              </span>
              <span className="hero-line">
                <span className="text-[#d9823d]" style={delay(850)}>
                  Every Bite.
                </span>
              </span>
            </h1>

            <p
              className="hero-rise mt-7 max-w-md text-sm leading-7 text-white/60 sm:text-base"
              style={delay(1200)}
            >
              Discover exceptional flavours, fresh ingredients, and
              beautifully crafted dishes to bring joy, comfort, and
              unforgettable dining experiences every time.
            </p>

            <button
               onClick={() => setBooking(true)}
              className="hero-rise mt-9 inline-flex items-center gap-3 bg-[#d9a34d] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#bd8736]"
              style={delay(1450)}
            >
              Book Your Table <span aria-hidden="true">↗</span>
            </button>

            <div
              className="hero-fade mt-10 flex items-center gap-3 text-xs text-white/50"
              style={delay(1750)}
            >
              <span className="text-[#d9a34d]">★★★★★</span>
              <span>Thoughtfully prepared. Beautifully served.</span>
            </div>
          </div>

          {/* Image column (scroll: parallax depth) */}
          <div
            ref={mediaRef}
            className="relative mt-8 flex items-center justify-center will-change-transform lg:ml-8 lg:mt-0"
          >
            {/* Gold frame slides out from behind the image */}
            <div
              className="hero-frame absolute -right-3 -top-3 h-full w-full border border-[#d9a34d]/40 sm:-right-5 sm:-top-5"
              style={delay(1200)}
            />

            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90"
              alt="Freshly prepared gourmet food"
              className="hero-image relative h-[420px] w-full rounded-tl-[150px] object-cover shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.02] sm:h-[520px] lg:h-[560px]"
              style={delay(400)}
              fetchPriority="high"
              decoding="async"
            />

            {/* Decorative image overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* Scroll button */}
        <a
          href="#about"
          aria-label="Scroll to discover more"
          className="hero-fade absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-2xl transition-colors duration-300 hover:bg-[#d9a34d]"
          style={delay(2200)}
        >
          <span className="hero-nudge" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>
       <Reservation open={booking} onClose={() => setBooking(false)} />
    </main>
  )
}

export default Hero