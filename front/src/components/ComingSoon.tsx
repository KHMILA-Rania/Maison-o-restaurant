"use client"

import { useEffect, useState } from "react"

/* Placeholders: replace with your real details */
const NAME = "MaisonOlive"
const CITY = "Canada"
const OPENING_DATE = "2026-12-20T19:00:00+01:00" // opening night
const EMAIL = "hello@restaurant.com"

const social = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
]

const styles = `
.cs-item {
  opacity: 0;
  transform: translateY(26px);
  animation: cs-rise 1300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay, 0ms);
}

@keyframes cs-rise {
  to { opacity: 1; transform: translateY(0); }
}

/* Slow candle-light glows drifting behind everything */
.cs-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.55;
  animation: cs-drift 22s ease-in-out infinite alternate;
}

.cs-glow.b {
  animation-duration: 28s;
  animation-direction: alternate-reverse;
}

@keyframes cs-drift {
  from { transform: translate3d(-6%, -4%, 0) scale(1); }
  to   { transform: translate3d(8%, 6%, 0) scale(1.15); }
}

/* Frame draws itself in */
.cs-frame {
  clip-path: inset(0 100% 100% 0);
  animation: cs-frame 2200ms cubic-bezier(0.77, 0, 0.175, 1) 200ms forwards;
}

@keyframes cs-frame {
  to { clip-path: inset(0 0 0 0); }
}

.cs-num {
  animation: cs-tick 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cs-tick {
  from { opacity: 0.2; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cs-link {
  position: relative;
  display: inline-block;
}

.cs-link::after {
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

.cs-link:hover::after,
.cs-link:focus-visible::after {
  transform: scaleX(1);
  transform-origin: left;
}

.cs-btn {
  transition: background-color 500ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cs-btn:hover,
.cs-btn:focus-visible {
  background-color: #f1d9a8;
  transform: scale(1.03);
}

@media (prefers-reduced-motion: reduce) {
  .cs-item,
  .cs-frame {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
    animation: none !important;
  }
  .cs-glow,
  .cs-num {
    animation: none !important;
  }
  .cs-btn,
  .cs-link::after {
    transition: none !important;
  }
}
`

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` } as React.CSSProperties)

const pad = (n: number) => String(n).padStart(2, "0")

type Left = { days: number; hours: number; minutes: number; seconds: number }

function getLeft(): Left | null {
  const diff = new Date(OPENING_DATE).getTime() - Date.now()
  if (diff <= 0) return null
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const ComingSoon = () => {
  const [left, setLeft] = useState<Left | null>(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  // Countdown (client only, so server and browser never disagree)
  useEffect(() => {
    setLeft(getLeft())
    setReady(true)
    const id = setInterval(() => setLeft(getLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    /* TODO: send `email` to your mailing list or API here */
    setSent(true)
  }

  const units = left
    ? [
        { label: "Days", value: left.days },
        { label: "Hours", value: left.hours },
        { label: "Minutes", value: left.minutes },
        { label: "Seconds", value: left.seconds },
      ]
    : []

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d100e] px-6 py-20 text-white">
      <style>{styles}</style>

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="cs-glow left-[-10%] top-[-15%] h-[55vw] w-[55vw] max-h-[620px] max-w-[620px] bg-[#d9a34d]/25" />
        <div className="cs-glow b bottom-[-20%] right-[-10%] h-[50vw] w-[50vw] max-h-[560px] max-w-[560px] bg-[#8a5a1c]/30" />
      </div>

      <div
        className="cs-frame pointer-events-none absolute inset-3 border border-white/10 sm:inset-6"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <p
          className="cs-item font-serif text-lg italic text-white/70 sm:text-xl"
          style={delay(300)}
        >
          {NAME}
        </p>

        <p
          className="cs-item mb-6 mt-10 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9a34d]"
          style={delay(500)}
        >
          Opening soon in {CITY}
        </p>

        <h1
          className="cs-item font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-8xl"
          style={delay(650)}
        >
          Something good
          <span className="block italic text-[#d9a34d]">
            is on its way.
          </span>
        </h1>

        <p
          className="cs-item mx-auto mt-8 max-w-md text-sm leading-7 text-white/55 sm:text-base"
          style={delay(850)}
        >
          Seasonal events, a warm atmosphere and unforgettable moments.
           We are putting the final touches on it and cannot wait to welcome you.
        </p>

        {/* Countdown */}
        <div
          className="cs-item mt-14 min-h-[5.5rem] sm:min-h-[7rem]"
          style={delay(1050)}
          role="timer"
          aria-label="Time until opening"
        >
          {ready && left && (
            <div className="mx-auto grid max-w-xl grid-cols-4 divide-x divide-white/10">
              {units.map((u) => (
                <div key={u.label} className="px-2 sm:px-4">
                  <div
                    key={u.value}
                    className="cs-num font-serif text-4xl tabular-nums sm:text-6xl"
                  >
                    {pad(u.value)}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/45">
                    {u.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ready && !left && (
            <p className="font-serif text-3xl italic text-[#d9a34d] sm:text-4xl">
              We are open. Come in.
            </p>
          )}
        </div>

        {/* Notify form */}
        <div className="cs-item mx-auto mt-14 max-w-md" style={delay(1250)}>
          {sent ? (
            <p
              role="status"
              className="font-serif text-xl italic text-[#d9a34d]"
            >
              Thank you. We will write to you before opening night.
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <label
                htmlFor="cs-email"
                className="mb-4 block text-sm text-white/60"
              >
                Be the first to know when the doors open.
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="cs-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "cs-error" : undefined}
                  className="w-full rounded-full border border-white/20 bg-transparent px-6 py-4 text-sm text-white placeholder:text-white/35 focus:border-[#d9a34d] focus:outline-none"
                />
                <button
                  type="submit"
                  className="cs-btn shrink-0 rounded-full bg-[#d9a34d] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#111512] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9a34d]"
                >
                  Notify me
                </button>
              </div>

              {error && (
                <p id="cs-error" role="alert" className="mt-3 text-xs text-[#e8a08a]">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer line */}
        <div
          className="cs-item mt-16 flex flex-col items-center justify-center gap-4 text-xs text-white/45 sm:flex-row sm:gap-8"
          style={delay(1450)}
        >
          <a href={`mailto:${EMAIL}`} className="cs-link">
            {EMAIL}
          </a>
          <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden="true" />
          <ul className="flex gap-6">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="cs-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default ComingSoon