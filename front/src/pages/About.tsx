
"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"
import { Link } from "react-router-dom"

const styles = `
.about-section {
  background:
    radial-gradient(ellipse at 65% 48%, rgba(130, 135, 95, 0.10), transparent 35%),
    #252b23;
}

.about-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

.about-photo {
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 1300ms ease,
    transform 1300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.about-photo img {
  transition: transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.about-photo:hover img {
  transform: scale(1.035);
}

[data-about-visible="true"] .about-reveal,
[data-about-visible="true"] .about-photo {
  opacity: 1;
  transform: translateY(0);
}

.about-scroll-image {
  opacity: var(--scroll-opacity, 1);
  transform: translate3d(0, var(--scroll-y, 0px), 0)
    scale(var(--scroll-scale, 1));
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .about-reveal,
  .about-photo,
  .about-scroll-image {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` } as CSSProperties)

const About = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const foodImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.setAttribute("data-about-visible", "true")
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Slow scroll fade for the lower food image
  useEffect(() => {
    const image = foodImageRef.current
    if (!image) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    let raf = 0

    const update = () => {
      const rect = image.getBoundingClientRect()
      const vh = window.innerHeight

      // Fade gradually as the image travels upward
      const start = vh * 0.65
      const end = -rect.height * 1.1

      const progress = Math.max(
        0,
        Math.min(1, (start - rect.top) / (start - end))
      )

      const eased = progress * progress * (3 - 2 * progress)

      image.style.setProperty("--scroll-opacity", String(1 - eased))
      image.style.setProperty("--scroll-y", `${-eased * 70}px`)
      image.style.setProperty("--scroll-scale", String(1 - eased * 0.04))
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
      className="about-section relative overflow-hidden text-[#e8e5d9]"
    >
      <style>{styles}</style>

      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[25%] select-none font-serif text-[240px] leading-none text-white/[0.025] sm:text-[360px]"
      >
        C
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">

        {/* Top: Chef portrait + restaurant story */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Chef portrait */}
          <div className="lg:col-span-5">
            <div
              className="about-photo max-w-[390px]"
              style={delay(100)}
            >
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85"
                alt="Chef working in the restaurant kitchen"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div
              className="about-reveal mt-4"
              style={delay(250)}
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#b6b39f]">
                Our chef
              </p>
              <p className="mt-1 font-serif text-sm tracking-wide">
                The heart behind every dish
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-7 lg:pt-10">
            <p
              className="about-reveal mb-6 text-[10px] uppercase tracking-[0.3em] text-[#c5a66b]"
              style={delay(200)}
            >
              The story behind the flavour
            </p>

            <h2
              className="about-reveal max-w-2xl font-serif text-3xl leading-[1.2] sm:text-4xl lg:text-[46px]"
              style={delay(300)}
            >
              A restaurant shaped by passion, tradition, and a love for
              bringing people together.
            </h2>

            <div
              className="about-reveal mt-8 max-w-xl space-y-5 text-xs leading-6 text-[#c1c2b7] sm:text-sm sm:leading-7"
              style={delay(450)}
            >
              <p>
                What began with a love for cooking has grown into a place
                where every ingredient has a purpose and every plate tells
                a story. We believe great food starts with respect for
                tradition and the courage to create something new.
              </p>

              <p>
                Our kitchen celebrates seasonal ingredients, thoughtful
                preparation, and the simple pleasure of sharing a meal.
                From the first taste to the last, we want every visit to
                feel personal, welcoming, and memorable.
              </p>
            </div>

            <div
              className="about-reveal mt-8 flex items-center gap-4"
              style={delay(600)}
            >
              <span className="h-px w-10 bg-[#c5a66b]" />
              <span className="font-serif text-sm italic text-[#c5a66b]">
                Made with care, served with heart.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Menu introduction + food image */}
        <div className="mt-24 grid items-end gap-12 lg:mt-32 lg:grid-cols-12 lg:gap-16">

          {/* Menu text */}
          <div className="lg:col-span-6 lg:pb-10">
            <p
              className="about-reveal mb-5 text-[10px] uppercase tracking-[0.3em] text-[#c5a66b]"
              style={delay(200)}
            >
              From our kitchen
            </p>

            <h2
              className="about-reveal font-serif text-5xl uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl"
              style={delay(300)}
            >
              A taste
              <span className="block">of something</span>
              <span className="block italic text-[#c5a66b]">
                unforgettable.
              </span>
            </h2>

            <p
              className="about-reveal mt-6 max-w-md text-xs leading-6 text-[#c1c2b7] sm:text-sm sm:leading-7"
              style={delay(450)}
            >
              Discover a menu inspired by seasonal flavours, honest
              ingredients, and the dishes we love to share. Every plate
              is an invitation to experience something special.
            </p>

            <Link
              to="/menu"
              className="about-reveal mt-7 inline-flex items-center gap-3 rounded-full border border-[#c5a66b]/50 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#c5a66b] transition-all duration-300 hover:bg-[#c5a66b] hover:text-[#252b23]"
              style={delay(550)}
            >
              View menu <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* Food image with scroll fade */}
          <div className="lg:col-span-6">
            <div
              ref={foodImageRef}
              className="about-scroll-image"
            >
              <div
                className="about-photo"
                style={delay(350)}
              >
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90"
                  alt="A beautifully prepared dish from our menu"
                  loading="lazy"
                  decoding="async"
                  className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[480px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom signature */}
        <div className="mt-20 border-t border-white/10 pt-6">
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
            A place for good food and good company
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
