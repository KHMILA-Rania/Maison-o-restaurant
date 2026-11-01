"use client"

import { useEffect, useRef, useState } from "react"

const styles = `
.gal-item {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

[data-visible="true"] .gal-item {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- Pinned stage: photos arrive two at a time ---------- */
.gal-pair {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.gal-pair[data-state="active"] {
  pointer-events: auto;
}

.gal-shot {
  clip-path: inset(100% 0 0 0);
  opacity: 0;
  transform: translateY(48px);
  transition:
    clip-path 1300ms cubic-bezier(0.77, 0, 0.175, 1),
    opacity 900ms ease,
    transform 1300ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

.gal-shot img {
  transform: scale(1.18);
  transition: transform 2400ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

.gal-pair[data-state="active"] .gal-shot {
  clip-path: inset(0 0 0 0);
  opacity: 1;
  transform: translateY(0);
}

.gal-pair[data-state="active"] .gal-shot img {
  transform: scale(1);
}

/* Leaving: lift away and fade, no stagger */
.gal-pair[data-state="past"] .gal-shot {
  clip-path: inset(0 0 0 0);
  opacity: 0;
  transform: translateY(-48px);
  transition-delay: 0ms;
  transition-duration: 900ms;
}

.gal-pair[data-state="past"] .gal-shot img {
  transform: scale(1.06);
  transition-delay: 0ms;
}

.gal-progress {
  transform: scaleX(var(--p, 0));
  transform-origin: left;
}

/* ---------- Slow photo strip ---------- */
.gal-marquee {
  display: flex;
  width: max-content;
  gap: 1rem;
  animation: gal-slide 90s linear infinite;
}

.gal-marquee-wrap:hover .gal-marquee {
  animation-play-state: paused;
}

@keyframes gal-slide {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-50% - 0.5rem)); }
}

@media (prefers-reduced-motion: reduce) {
  .gal-item { opacity: 1 !important; transform: none !important; transition: none !important; }
  .gal-track { height: auto !important; }
  .gal-stage { position: static !important; height: auto !important; padding: 1rem 0 !important; }
  .gal-pairs { height: auto !important; display: grid; gap: 2rem; }
  .gal-pair { position: relative !important; }
  .gal-shot, .gal-shot img {
    clip-path: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .gal-hud { display: none !important; }
  .gal-marquee { animation: none !important; }
}
`

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` } as React.CSSProperties)

type Photo = { src: string; alt: string; label: string }

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`

/*
  Each pair is shown together, then replaced by the next one as you scroll.
  Swap the URLs for your own photos any time.
*/
const pairs: [Photo, Photo][] = [
  [
    {
      src: u("photo-1517248135467-4c7edcad34c4"),
      alt: "The dining room in warm evening light",
      label: "The dining room",
    },
    {
      src: u("photo-1424847651672-bf20a4b0982b"),
      alt: "A table set for dinner with candles and glassware",
      label: "The table, set",
    },
  ],
  [
    {
      src: u("photo-1556910103-1c02745aae4d"),
      alt: "The open kitchen at work",
      label: "The kitchen",
    },
    {
      src: u("photo-1577219491135-ce391730fb2c"),
      alt: "A chef plating a dish at the pass",
      label: "At the pass",
    },
  ],
  [
    {
      src: u("photo-1528605248644-14dd04022da1"),
      alt: "Friends sharing a meal around the table",
      label: "Around the table",
    },
    {
      src: u("photo-1555396273-367ea4eb4db5"),
      alt: "The bar and seating area",
      label: "The bar",
    },
  ],
]

const strip: Photo[] = [
  { src: u("photo-1414235077428-338989a2e8c0", 900), alt: "Plated dish", label: "From the kitchen" },
  { src: u("photo-1466978913421-dad2ebd01d17", 900), alt: "Cooks in the kitchen", label: "Prep, before service" },
  { src: u("photo-1559339352-11d035aa65de", 900), alt: "Dining room tables", label: "Before the doors open" },
  { src: u("photo-1600891964092-4316c288032e", 900), alt: "A main course on the pass", label: "On the pass" },
  { src: u("photo-1528605248644-14dd04022da1", 900), alt: "Guests laughing together", label: "Our guests" },
]

const pad = (n: number) => String(n).padStart(2, "0")

const Gallery = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState(false)

  // Heading reveal
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.setAttribute("data-visible", "true")
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Scroll drives which pair is on stage
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    let last = -1

    const update = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const range = rect.height - vh
      const p = Math.max(0, Math.min(1, -rect.top / range))

      // First pair appears as soon as the pinned stage is mostly on screen
      setStarted(rect.top < vh * 0.35)

      const index = Math.min(pairs.length - 1, Math.floor(p * pairs.length))
      if (index !== last) {
        last = index
        setActive(index)
      }
      barRef.current?.style.setProperty("--p", String(p))
    }

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          update()
          raf = 0
        })
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const stateOf = (i: number) =>
    !started ? "future" : i < active ? "past" : i === active ? "active" : "future"

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative bg-[#0d100e] text-white"
    >
      <style>{styles}</style>

      {/* Heading (kept tight so the photos follow right away) */}
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16">
        <div className="gal-item text-center" style={delay(100)}>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9a34d]">
            The room
          </p>

          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-7xl">
            Come in.
            <span className="block italic text-[#d9a34d]">
              Stay a while.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            Low light, warm wood, a kitchen you can watch and a table that
            invites you to linger. Keep scrolling and walk through it.
          </p>
        </div>
      </div>

      {/* Pinned stage: scroll to bring in the next two photos */}
      <div
        ref={trackRef}
        className="gal-track relative -mt-4 sm:-mt-8"
        style={{ height: `${100 + pairs.length * 75}vh` }}
      >
        <div className="gal-stage sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="gal-pairs relative mx-auto h-[68vh] w-full max-w-6xl sm:h-[72vh]">
            {pairs.map((pair, i) => (
              <div
                key={i}
                data-state={stateOf(i)}
                className="gal-pair px-4 sm:px-8 lg:px-16"
                aria-hidden={i !== active}
              >
                <div
                  className={`grid h-full w-full items-center gap-3 sm:gap-6 md:gap-10 ${
                    i % 2 === 0
                      ? "grid-cols-[1.25fr_1fr]"
                      : "grid-cols-[1fr_1.25fr]"
                  }`}
                >
                  {pair.map((photo, k) => (
                    <figure
                      key={photo.src}
                      className={`gal-shot ${
                        k === 0 ? "self-start" : "self-end"
                      }`}
                      style={delay(k * 220)}
                    >
                      <div className="overflow-hidden bg-white/5">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          className={`w-full object-cover ${
                            k === 0
                              ? "h-[44vh] sm:h-[54vh]"
                              : "h-[38vh] sm:h-[46vh]"
                          }`}
                        />
                      </div>
                      <figcaption className="mt-3 font-serif text-base italic text-white/70 sm:text-lg">
                        {photo.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Counter + progress */}
          <div className="gal-hud mt-6 flex items-center justify-center gap-4 text-white/60 sm:mt-8">
            <span className="font-serif text-sm tabular-nums">
              {pad(active + 1)}
            </span>
            <div className="h-px w-28 bg-white/15 sm:w-40">
              <div
                ref={barRef}
                className="gal-progress h-full bg-[#d9a34d]"
              />
            </div>
            <span className="font-serif text-sm tabular-nums">
              {pad(pairs.length)}
            </span>
          </div>
        </div>
      </div>

      {/* Slow photo strip */}
      <div className="gal-marquee-wrap overflow-hidden pb-24 pt-10 sm:pb-32">
        <div className="gal-marquee" aria-label="Photo strip of the restaurant">
          {[...strip, ...strip].map((photo, i) => (
            <figure
              key={i}
              aria-hidden={i >= strip.length}
              className="group relative h-[240px] w-[320px] shrink-0 overflow-hidden bg-white/5 sm:h-[320px] sm:w-[440px]"
            >
              <img
                src={photo.src}
                alt={i >= strip.length ? "" : photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[0.25em] text-white/80">
                {photo.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery