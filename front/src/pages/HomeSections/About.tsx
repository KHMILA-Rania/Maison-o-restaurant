
"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const styles = `
.about-item {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

.about-photo {
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1400ms ease;
}

.about-scroll-image {
  opacity: var(--scroll-opacity, 1);
  transform: translate3d(
    0,
    var(--scroll-y, 0px),
    0
  ) scale(var(--scroll-scale, 1));
  will-change: transform, opacity;
}

[data-visible="true"] .about-item {
  opacity: 1;
  transform: translateY(0);
}

[data-visible="true"] .about-photo {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .about-item,
  .about-photo {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` } as React.CSSProperties)

const story = [
  {
    number: "01",
    title: "Seasonal ingredients",
    description:
      "We let the seasons guide our kitchen, choosing fresh ingredients and allowing their natural flavours to shine.",
  },
  {
    number: "02",
    title: "Crafted with care",
    description:
      "Every dish is prepared with attention, patience, and a genuine love for the art of cooking.",
  },
  {
    number: "03",
    title: "A place to gather",
    description:
      "From intimate dinners to shared celebrations, our table is a place for connection and memorable moments.",
  },
]

const About = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
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


 useEffect(() => {
  const image = imageRef.current
  if (!image) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return
  }

  let raf = 0

 const update = () => {
  const rect = image.getBoundingClientRect()
  const vh = window.innerHeight

  // Start fading when the image reaches the middle of the screen
  const fadeStart = vh * 0.55

  // Fade gradually over a much longer scroll distance
  const fadeEnd = -rect.height * 1.8

  let progress = (fadeStart - rect.top) / (fadeStart - fadeEnd)

  progress = Math.max(0, Math.min(1, progress))

  // Smooth easing for a gradual fade
  const eased = progress * progress * (3 - 2 * progress)

  image.style.setProperty(
    "--scroll-opacity",
    String(1 - eased)
  )

  image.style.setProperty(
    "--scroll-y",
    `${-eased * 80}px`
  )

  image.style.setProperty(
    "--scroll-scale",
    String(1 - eased * 0.06)
  )
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
  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-[#111512] text-white"
    >
      <style>{styles}</style>

      {/* Section heading */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-24 sm:px-10 sm:pt-32 lg:px-16">
        <div className="about-item text-center" style={delay(100)}>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9a34d]">
            The heart of our restaurant
          </p>

          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-7xl">
            Good food.
            <span className="block italic text-[#d9a34d]">
              Good company.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            A restaurant built around the simple things that matter:
            honest ingredients, thoughtful cooking, and the joy of
            bringing people together.
          </p>
        </div>
      </div>

      {/* Full-width panoramic image */}
      {/* Full-width panoramic image */}
<div className="relative mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
  <div
    ref={imageRef}
    className="about-scroll-image"
  >
    <div className="about-photo relative h-[280px] overflow-hidden sm:h-[420px] lg:h-[560px]">
      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=90"
        alt="The warm atmosphere of our restaurant"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      <p className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.25em] text-white/80 sm:bottom-10 sm:left-10">
        A taste of something special
      </p>
    </div>
    
<div className="flex justify-center">
  <Link to="/about-us">
  <button
    className="hero-rise mt-9 inline-flex items-center gap-3 bg-[#d9a34d] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#bd8736]"
    style={delay(1450)}
  >
    Discover more about us <span aria-hidden="true">↗</span>
  </button>
  </Link>
</div>
  </div>
</div>


      {/* Philosophy columns */}
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {story.map((item, index) => (
            <div
              key={item.number}
              className="about-item border-t border-white/15 pt-6"
              style={delay(200 + index * 150)}
            >
              <p className="mb-8 font-serif text-sm text-[#d9a34d]">
                {item.number}
              </p>

              <h3 className="font-serif text-2xl sm:text-3xl">
                {item.title}
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing quote */}
        <div
          className="about-item mt-20 border-t border-white/10 pt-12 text-center sm:mt-28"
          style={delay(700)}
        >
          <p className="font-serif text-2xl italic leading-relaxed text-white/80 sm:text-3xl lg:text-4xl">
            "Every table has a story.
            <br />
            We're happy to be part of yours."
          </p>

          <div className="mx-auto mt-7 h-px w-12 bg-[#d9a34d]" />
        </div>
      </div>
    </section>
  )
}

export default About
