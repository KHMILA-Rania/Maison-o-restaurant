"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import Reservation from "./Reservation"

/* ─────────────────────────  CONTENT (edit me)  ───────────────────────── */

const CURRENCY = "$"

type Dish = {
  name: string
  desc: string
  price: number
  image: string
  note?: string
}

type Category = {
  id: string
  title: string
  intro: string
  dishes: Dish[]
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`
/*
  ALTERNATIVE HEADER: "The arch opens"

  Idea: a tall arched photo sits between two big words. As you scroll,
  the words slide apart and fade, the arch grows until the photo fills
  the screen, then the first category scrolls up over it.

  HOW TO USE (nothing else in Menu.tsx changes):
  1. Paste the <HeroArch /> component below anywhere above `const Menu`.
  2. In Menu, replace the whole <header ...> ... </header> block with:

       <header ref={heroRef}>
         <HeroArch />
       </header>

     Keep ref={heroRef}. Your progress bar effect needs it.
  3. `useEffect` and `useRef` are already imported in Menu.tsx.
*/

function HeroArch() {
  const pinRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = pinRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0

    const update = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      el.style.setProperty("--p", p.toFixed(4))
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

  const word =
    "font-serif text-5xl uppercase leading-none tracking-tight sm:text-7xl lg:text-8xl"

  return (
    // Tall wrapper = the scroll distance for the effect
    <div
      ref={pinRef}
      className="h-[170vh] motion-reduce:h-auto"
      style={{ "--p": 0 } as CSSProperties}
    >
      {/* Stays pinned under the category nav while the wrapper scrolls */}
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden motion-reduce:static motion-reduce:min-h-[80vh] motion-reduce:py-20">
        <p
          className="m-reveal mb-8 text-[10px] uppercase tracking-[0.3em] text-[#c5a66b]"
          style={delay(100)}
        >
          Our menu
        </p>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-14">
          {/* Left word slides out to the left */}
          <div className="m-reveal" style={delay(300)}>
            <span
              className={`${word} block`}
              style={{
                transform: "translate3d(calc(var(--p) * -45vw), 0, 0)",
                opacity: "calc(1 - var(--p) * 1.7)",
              }}
            >
              Seasonal
            </span>
          </div>

          {/* The arch grows until it fills the screen */}
          <div className="m-reveal order-first lg:order-none" style={delay(450)}>
            <div
              className="h-[220px] w-[150px] overflow-hidden rounded-t-full sm:h-[320px] sm:w-[220px] lg:h-[380px] lg:w-[260px]"
              style={{
                transform: "scale(calc(1 + var(--p) * 3.2))",
                transformOrigin: "50% 60%",
                willChange: "transform",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85"
                alt="A plated dish from our kitchen"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ transform: "scale(calc(1.25 - var(--p) * 0.25))" }}
              />
            </div>
          </div>

          {/* Right word slides out to the right */}
          <div className="m-reveal" style={delay(300)}>
            <span
              className={`${word} block`}
              style={{
                transform: "translate3d(calc(var(--p) * 45vw), 0, 0)",
                opacity: "calc(1 - var(--p) * 1.7)",
              }}
            >
              Plates
            </span>
          </div>
        </div>

        {/* Tagline fades first */}
        <p
          className="m-reveal mt-10 font-serif text-lg italic text-[#c5a66b] sm:text-2xl"
          style={delay(650)}
        >
          <span
            className="block"
            style={{ opacity: "calc(1 - var(--p) * 3)" }}
          >
            made to be shared.
          </span>
        </p>

        <div
          className="m-reveal mt-10 flex items-center gap-4"
          style={delay(800)}
        >
          <span className="m-line h-px w-10 bg-[#c5a66b]" style={delay(1000)} />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40">
            Scroll to open
          </span>
        </div>
      </div>
    </div>
  )
}

const MENU: Category[] = [
  {
    id: "starters",
    title: "To begin",
    intro: "Small plates for the table, built around what the market offers this week.",
    dishes: [
      {
        name: "Roasted tomato soup",
        desc: "Slow-roasted tomatoes, basil oil, warm sourdough.",
        price: 9,
        note: "Vegetarian",
        image: img("photo-1547592180-85f173990554"),
      },
      {
        name: "Garden salad",
        desc: "Young leaves, shaved fennel, citrus dressing, toasted seeds.",
        price: 11,
        note: "Vegan",
        image: img("photo-1540189549336-e6e99c3679fe"),
      },
      {
        name: "Egg on toast",
        desc: "Soft egg, whipped butter, charred country bread, chives.",
        price: 10,
        image: img("photo-1482049016688-2d3e1b311543"),
      },
    ],
  },
  {
    id: "mains",
    title: "The main plates",
    intro: "Cooked over fire and finished to order. Take your time with these.",
    dishes: [
      {
        name: "Seared salmon",
        desc: "Crisp skin, lemon butter, steamed greens, new potatoes.",
        price: 26,
        image: img("photo-1467003909585-2f8a72700288"),
      },
      {
        name: "Hand-cut pasta",
        desc: "Egg pasta, slow tomato ragù, aged hard cheese.",
        price: 21,
        image: img("photo-1473093295043-cdd812d0e601"),
      },
      {
        name: "Grilled skewers",
        desc: "Marinated lamb, grilled peppers, herbed yoghurt, flatbread.",
        price: 24,
        note: "Signature",
        image: img("photo-1555939594-58d7cb561ad1"),
      },
    ],
  },
  {
    id: "desserts",
    title: "To finish",
    intro: "Something sweet to close the evening. Best shared, rarely is.",
    dishes: [
      {
        name: "Honey cake",
        desc: "Layered sponge, whipped cream, a thread of warm honey.",
        price: 9,
        image: img("photo-1565958011703-44f9829ba187"),
      },
      {
        name: "Glazed doughnuts",
        desc: "Brioche dough, vanilla glaze, seasonal fruit compote.",
        price: 8,
        image: img("photo-1551024601-bec78aea704b"),
      },
    ],
  },
]

/* ─────────────────────────────  STYLES  ───────────────────────────── */

const styles = `
.menu-page {
  background:
    radial-gradient(ellipse at 20% 12%, rgba(130, 135, 95, 0.10), transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(130, 135, 95, 0.08), transparent 40%),
    #252b23;
}

.m-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 1000ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}
.m-reveal.is-in { opacity: 1; transform: none; }

/* divider that draws itself */
.m-line {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1400ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}
.is-in .m-line, .m-line.is-in { transform: scaleX(1); }

/* stacked images crossfade as the active dish changes */
.m-frame { position: relative; overflow: hidden; }
.m-frame img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0;
  transform: scale(1.08);
  transition:
    opacity 900ms ease,
    transform 1600ms cubic-bezier(0.16, 1, 0.3, 1);
}
.m-frame img[data-active="true"] { opacity: 1; transform: scale(1); }

/* dish text dims when it is not the one in focus */
.m-dish-inner {
  opacity: 0.38;
  transition: opacity 700ms ease, transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
}
.m-dish[data-active="true"] .m-dish-inner { opacity: 1; transform: translateX(10px); }
.m-dish .m-name { transition: color 500ms ease; }
.m-dish[data-active="true"] .m-name { color: #c5a66b; }

/* nav */
.m-nav-link { position: relative; }
.m-nav-link::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px;
  background: #c5a66b; transform: scaleX(0); transform-origin: left;
  transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.m-nav-link[data-active="true"] { color: #c5a66b; }
.m-nav-link[data-active="true"]::after { transform: scaleX(1); }

.m-parallax {
  opacity: var(--hero-o, 1);
  transform: translate3d(0, var(--hero-y, 0px), 0);
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .m-reveal, .m-line, .m-frame img, .m-dish-inner, .m-parallax {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .m-frame img:not([data-active="true"]) { opacity: 0 !important; }
  .m-dish-inner { opacity: 1 !important; }
}
`

const delay = (ms: number) => ({ "--delay": `${ms}ms` } as CSSProperties)

/* ──────────────────────────  CATEGORY BLOCK  ────────────────────────── */

function CategorySection({ category }: { category: Category }) {
  const [active, setActive] = useState(0)
  const rows = useRef<(HTMLLIElement | null)[]>([])

  // The dish crossing the middle of the screen becomes the active one
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = rows.current.indexOf(entry.target as HTMLLIElement)
            if (i !== -1) setActive(i)
          }
        })
      },
      { rootMargin: "-42% 0px -48% 0px" }
    )
    rows.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])


  return (
    <section
      id={category.id}
      data-category
      className="scroll-mt-24 border-t border-white/10 py-20 first:border-t-0 lg:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Sticky: title + image that follows the dishes */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p
              className="m-reveal mb-5 text-[10px] uppercase tracking-[0.3em] text-[#c5a66b]"
              style={delay(100)}
            >
              {category.dishes.length} dishes
            </p>

            <h2
              className="m-reveal font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
              style={delay(200)}
            >
              {category.title}
            </h2>

            <p
              className="m-reveal mt-5 max-w-sm text-xs leading-6 text-[#c1c2b7] sm:text-sm sm:leading-7"
              style={delay(300)}
            >
              {category.intro}
            </p>

            <div
              className="m-reveal m-frame mt-8 aspect-[16/10] max-w-[440px] lg:aspect-[4/5]"
              style={delay(400)}
            >
              {category.dishes.map((dish, i) => (
                <img
                  key={dish.name}
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  decoding="async"
                  data-active={i === active}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dish list */}
        <ul className="lg:col-span-7 lg:pt-6">
          {category.dishes.map((dish, i) => (
            <li
              key={dish.name}
              ref={(el) => {
                rows.current[i] = el
              }}
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
              className="m-dish m-reveal outline-none focus-visible:ring-1 focus-visible:ring-[#c5a66b]/60"
            >
              <span
                className="m-line block h-px w-full bg-white/10"
                style={delay(100)}
              />

              <div className="m-dish-inner py-9 sm:py-12">
                
<div className="flex w-full min-w-0 items-baseline gap-2 sm:gap-4">
  <h3 className="m-name min-w-0 font-serif text-xl leading-tight sm:text-3xl">
    {dish.name}
  </h3>

  <span
    aria-hidden="true"
    className="min-w-2 flex-1 translate-y-[-4px] border-b border-dotted border-white/20"
  />

  <span className="shrink-0 whitespace-nowrap font-serif text-lg italic text-[#c5a66b] sm:text-xl">
    {CURRENCY}{dish.price}
  </span>
</div>


                <p className="mt-3 max-w-md text-xs leading-6 text-[#c1c2b7] sm:text-sm sm:leading-7">
                  {dish.desc}
                </p>

                {dish.note && (
                  <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#b6b39f]">
                    {dish.note}
                  </p>
                )}
              </div>
            </li>
          ))}
          <li aria-hidden="true">
            <span className="m-line m-reveal block h-px w-full bg-white/10" />
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ─────────────────────────────  PAGE  ───────────────────────────── */

const Menu = () => {
  const rootRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [activeCat, setActiveCat] = useState(MENU[0].id)
  
  const [booking, setBooking] = useState(false)

  // Reveal everything marked .m-reveal once it enters the viewport
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    root.querySelectorAll(".m-reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Scroll spy for the sticky nav
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCat(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )

    root
      .querySelectorAll("[data-category]")
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Reading progress line + hero parallax fade
  useEffect(() => {
    const root = rootRef.current
    const hero = heroRef.current
    const bar = barRef.current
    if (!root || !hero || !bar) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0

    const update = () => {
      const rect = root.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      bar.style.transform = `scaleX(${progress})`

      if (!reduced) {
        const p = Math.min(1, Math.max(0, -rect.top / (window.innerHeight * 0.8)))
        hero.style.setProperty("--hero-y", `${p * 120}px`)
        hero.style.setProperty("--hero-o", String(1 - p))
      }
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

  const goTo = (id: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  }

  return (
    <main
      ref={rootRef}
      id="menu"
      className="menu-page relative text-[#e8e5d9]"
    >
      <style>{styles}</style>

      {/* Sticky category nav with scroll progress */}
      <nav
        aria-label="Menu categories"
        className="sticky top-0 z-30 border-b border-white/10 bg-[#252b23]/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-8 overflow-x-auto px-6 py-5 sm:px-10 lg:px-16">
          <span className="hidden font-serif text-sm italic text-[#c5a66b] sm:block">
            Menu
          </span>
          <span className="hidden h-px w-8 bg-[#c5a66b]/60 sm:block" />
          {MENU.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => goTo(cat.id)}
              data-active={activeCat === cat.id}
              className="m-nav-link shrink-0 text-[10px] uppercase tracking-[0.25em] text-[#b6b39f] transition-colors duration-500 hover:text-[#e8e5d9]"
            >
              {cat.title}
            </button>
          ))}
        </div>
        <div
          ref={barRef}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#c5a66b]"
          style={{ transform: "scaleX(0)" }}
        />
      </nav>

      {/* Big decorative letter, same trick as the About page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-[14%] select-none font-serif text-[260px] leading-none text-white/[0.025] sm:text-[420px]"
      >
        M
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Hero */}
        <header ref={heroRef}><HeroArch /></header>

        {/* Categories */}
        {MENU.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* Footer note + CTA */}
        <div className="border-t border-white/10 py-16 lg:py-24">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div className="m-reveal max-w-sm">
              <p className="font-serif text-2xl leading-snug sm:text-3xl">
                Allergies or dietary needs? Tell us and we will cook around them.
              </p>
            </div>

            <button
              onClick={() => setBooking(true)}
              className="m-reveal inline-flex items-center gap-3 rounded-full border border-[#c5a66b]/50 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#c5a66b] transition-all duration-300 hover:bg-[#c5a66b] hover:text-[#252b23]"
              style={delay(200)}
            >
              Book a table <span aria-hidden="true">↗</span>
            </button>
          </div>

          <p className="mt-16 text-[9px] uppercase tracking-[0.25em] text-white/35">
            A place for good food and good company
          </p>
        </div>
      </div>
      <Reservation open={booking} onClose={() => setBooking(false)} />
    </main>
  )
}

export default Menu