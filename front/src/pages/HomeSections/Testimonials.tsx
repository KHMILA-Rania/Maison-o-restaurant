"use client"

import { useEffect, useRef, useState } from "react"

const styles = `
.tes-item {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

[data-visible="true"] .tes-item {
  opacity: 1;
  transform: translateY(0);
}

/* Featured quotes are stacked in one grid cell so height never jumps */
.tes-slide {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(18px);
  filter: blur(6px);
  pointer-events: none;
  transition:
    opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 1100ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 1100ms ease;
}

.tes-slide[data-active="true"] {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  pointer-events: auto;
}

.tes-bar {
  transform: scaleX(0);
  transform-origin: left;
  animation: tes-fill var(--dur, 8000ms) linear forwards;
}

.tes-wrap[data-paused="true"] .tes-bar {
  animation-play-state: paused;
}

@keyframes tes-fill {
  to { transform: scaleX(1); }
}

/* Cards: gold rule draws across the top */
.tes-card .tes-line {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1400ms cubic-bezier(0.77, 0, 0.175, 1);
  transition-delay: var(--delay, 0ms);
}

[data-visible="true"] .tes-card .tes-line {
  transform: scaleX(1);
}

/* The section edge: a soft curve so it reads as its own room */
.tes-edge {
  position: absolute;
  inset: 0 0 auto 0;
  height: 64px;
  background: #111512;
  clip-path: ellipse(60% 100% at 50% 0%);
}

@media (prefers-reduced-motion: reduce) {
  .tes-item,
  .tes-slide,
  .tes-card .tes-line {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
  .tes-slide:not([data-active="true"]) { opacity: 0 !important; }
  .tes-bar { animation: none !important; transform: scaleX(0) !important; }
}
`

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` } as React.CSSProperties)

type Review = { quote: string; name: string; occasion: string }

/* Placeholder reviews: replace with real guest quotes (with permission). */
const featured: Review[] = [
  {
    quote:
      "We came for a birthday and stayed three hours. The food was simple and exact, and nobody ever made us feel rushed.",
    name: "Amira B.",
    occasion: "Birthday dinner",
  },
  {
    quote:
      "You can taste that the menu follows the season. Every plate felt considered, and the room is the kind you don't want to leave.",
    name: "Karim S.",
    occasion: "Dinner for two",
  },
  {
    quote:
      "Warm service, a beautiful table and a kitchen that clearly cares. We have already booked again for the whole family.",
    name: "Leila M.",
    occasion: "Family lunch",
  },
]

const small: Review[] = [
  {
    quote: "Honest cooking in a lovely room. Exactly what we hoped for.",
    name: "Yassine T.",
    occasion: "Friends' night out",
  },
  {
    quote: "The staff remembered our anniversary and made it feel special.",
    name: "Sana & Omar",
    occasion: "Anniversary",
  },
  {
    quote: "Our new favourite. Calm, generous and beautifully run.",
    name: "Nour H.",
    occasion: "Weekend lunch",
  },
]

const Stars = () => (
  <div className="flex gap-1 text-[#c48a2a]" aria-label="Five out of five stars" role="img">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
      </svg>
    ))}
  </div>
)

const arrowBtn =
  "flex h-11 w-11 items-center justify-center rounded-full border border-[#111512]/20 text-[#111512]/70 transition hover:border-[#111512] hover:bg-[#111512] hover:text-[#efe7d8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a6a1c]"

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

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

  const go = (n: number) =>
    setIndex((n + featured.length) % featured.length)

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative overflow-hidden bg-[#efe7d8] text-[#161b17]"
    >
      <style>{styles}</style>
      <div className="tes-edge" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-40 lg:px-16">
        {/* Split: heading + controls on the left, featured quote on the right */}
        <div
          className="tes-wrap grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
          data-paused={paused || undefined}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="tes-item" style={delay(100)}>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9a6a1c]">
              What guests say
            </p>

            <h2 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Kind words,
              <span className="block italic text-[#9a6a1c]">
                from your tables.
              </span>
            </h2>

            {/* Controls */}
            <div className="mt-10 flex items-center gap-5 lg:mt-14">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous review"
                className={arrowBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next review"
                className={arrowBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="ml-2 flex items-center gap-2" role="tablist" aria-label="Choose a review">
                {featured.map((r, i) => (
                  <button
                    key={r.name}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Review from ${r.name}`}
                    onClick={() => go(i)}
                    className="flex h-6 w-10 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a6a1c]"
                  >
                    <span className="relative block h-px w-full overflow-hidden bg-[#111512]/20">
                      {i === index && (
                        <span
                          key={index}
                          className="tes-bar absolute inset-0 block bg-[#9a6a1c]"
                          style={
                            reduced
                              ? { transform: "scaleX(1)", animation: "none" }
                              : undefined
                          }
                          onAnimationEnd={() => go(index + 1)}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured quote */}
          <div className="tes-item relative" style={delay(300)}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-16 select-none font-serif text-[9rem] leading-none text-[#c48a2a]/25 sm:-top-20 sm:text-[12rem]"
            >
              “
            </span>

            <div className="relative grid" aria-live={paused ? "polite" : "off"}>
              {featured.map((r, i) => (
                <figure
                  key={r.name}
                  className="tes-slide flex flex-col items-start"
                  data-active={i === index}
                  aria-hidden={i !== index}
                >
                  <div className="mb-7">
                    <Stars />
                  </div>

                  <blockquote className="font-serif text-2xl italic leading-relaxed sm:text-3xl lg:text-[2.4rem] lg:leading-[1.35]">
                    {r.quote}
                  </blockquote>

                  <figcaption className="mt-8 text-sm text-[#161b17]/60">
                    <span className="font-serif text-base not-italic text-[#161b17]">
                      {r.name}
                    </span>
                    <span className="mx-3 text-[#9a6a1c]">/</span>
                    {r.occasion}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* More voices: paper cards, gently staggered */}
        <div className="mt-24 grid gap-6 sm:mt-32 md:grid-cols-3 md:gap-8">
          {small.map((r, i) => (
            <figure
              key={r.name}
              className={`tes-card tes-item bg-[#f8f3e9] p-8 shadow-[0_1px_0_rgba(17,21,18,0.06)] sm:p-10 ${
                i === 1 ? "md:mt-12" : i === 2 ? "md:mt-24" : ""
              }`}
              style={delay(300 + i * 180)}
            >
              <div
                className="tes-line mb-8 h-px w-10 bg-[#c48a2a]"
                style={delay(500 + i * 180)}
              />

              <blockquote className="font-serif text-xl leading-relaxed sm:text-2xl">
                {r.quote}
              </blockquote>

              <figcaption className="mt-6 text-sm text-[#161b17]/60">
                <span className="text-[#161b17]">{r.name}</span>
                <span className="mx-3 text-[#9a6a1c]">/</span>
                {r.occasion}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials