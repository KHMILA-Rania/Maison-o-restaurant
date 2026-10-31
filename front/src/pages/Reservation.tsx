"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

/* ─────────────────────────  SETTINGS (edit me)  ───────────────────────── */

const CLOSED_WEEKDAYS = [1] // 0 = Sunday ... 1 = Monday
const MONTHS_AHEAD = 3
const MAX_PARTY = 8 // the last chip is "8+" and asks guests to call
const PHONE_FOR_GROUPS = "+000 00 000 000" // shown for large groups

const LUNCH = ["12:00", "12:30", "13:00", "13:30", "14:00"]
const DINNER = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]

const STEP_TITLES = [
  "How many are coming?",
  "Which day suits you?",
  "What time?",
  "Who should we book it under?",
]

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/* ─────────────────────────────  HELPERS  ───────────────────────────── */

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  const suffix = h >= 12 ? "pm" : "am"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` } as CSSProperties)

const chip = (state: "idle" | "selected" | "disabled") =>
  [
    "rounded-full border px-5 py-3 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a66b]",
    state === "selected" && "border-[#c5a66b] bg-[#c5a66b] text-[#2a1115]",
    state === "idle" &&
      "border-white/15 text-[#f3e9df] hover:border-[#c5a66b]/70",
    state === "disabled" &&
      "cursor-not-allowed border-white/5 text-white/20 line-through",
  ]
    .filter(Boolean)
    .join(" ")

/* ─────────────────────────────  STYLES  ───────────────────────────── */

const styles = `
.r-panel {
  background:
    radial-gradient(ellipse at 80% 10%, rgba(170, 62, 74, 0.28), transparent 40%),
    #2a1115;
  clip-path: inset(0 0 100% 0);
  opacity: 0;
  transition:
    clip-path 900ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 400ms ease;
}
.r-panel[data-shown="true"] { clip-path: inset(0 0 0 0); opacity: 1; }

@keyframes r-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.r-step { animation: r-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.r-line { animation: r-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--delay, 0ms); }

@keyframes r-draw { to { stroke-dashoffset: 0; } }
.r-circle { stroke-dasharray: 170; stroke-dashoffset: 170; animation: r-draw 1100ms cubic-bezier(0.16, 1, 0.3, 1) 200ms forwards; }
.r-check  { stroke-dasharray: 40;  stroke-dashoffset: 40;  animation: r-draw 700ms ease 900ms forwards; }

.r-field {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding: 10px 0;
  font-size: 16px;
  color: #f3e9df;
  outline: none;
  transition: border-color 400ms ease;
}
.r-field:focus { border-bottom-color: #c5a66b; }
.r-field::placeholder { color: rgba(232,229,217,0.3); }

@media (prefers-reduced-motion: reduce) {
  .r-panel { transition: none; clip-path: none; }
  .r-step, .r-line { animation: none; }
  .r-circle, .r-check { animation: none; stroke-dashoffset: 0; }
}
`

/* ─────────────────────────────  COMPONENT  ───────────────────────────── */

type Props = { open: boolean; onClose: () => void }

const Reservation = ({ open, onClose }: Props) => {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  const [step, setStep] = useState(0) // 0..3 = steps, 4 = confirmation
  const [party, setParty] = useState<number | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({})
  const [sending, setSending] = useState(false)
  const [ref, setRef] = useState("")

  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), 1)
  })

  const dialogRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => startOfDay(new Date()), [open])
  const lastMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD, 1),
    [today]
  )

  /* open / close with a short exit animation, and reset on reopen */
  useEffect(() => {
    if (open) {
      setStep(0)
      setParty(null)
      setDate(null)
      setTime(null)
      setName("")
      setContact("")
      setNote("")
      setErrors({})
      setSending(false)
      setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
      setMounted(true)
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true))
      )
      return () => cancelAnimationFrame(raf)
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), 700)
    return () => clearTimeout(t)
  }, [open, today])

  /* scroll lock, Escape to close, focus the dialog */
  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [mounted, onClose])

  if (!mounted) return null

  /* ── derived data ── */

  const isLarge = party === MAX_PARTY

  const slotUnavailable = (t: string, index: number) => {
    if (!date) return true
    // demo logic: a few slots look taken so every state is visible
    if ((date.getDate() + index) % 4 === 0) return true
    if (sameDay(date, today)) {
      const [h, m] = t.split(":").map(Number)
      const now = new Date()
      if (h * 60 + m <= now.getHours() * 60 + now.getMinutes() + 60) return true
    }
    return false
  }

  const calendarCells = (() => {
    const y = viewMonth.getFullYear()
    const m = viewMonth.getMonth()
    const offset = (new Date(y, m, 1).getDay() + 6) % 7 // Monday first
    const days = new Date(y, m + 1, 0).getDate()
    const cells: (Date | null)[] = Array(offset).fill(null)
    for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d))
    return cells
  })()

  const dayDisabled = (d: Date) =>
    d < today || CLOSED_WEEKDAYS.includes(d.getDay())

  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    viewMonth.getMonth() > today.getMonth()
  const canGoNext = viewMonth < lastMonth

  const canContinue =
    (step === 0 && party !== null && !isLarge) ||
    (step === 1 && date !== null) ||
    (step === 2 && time !== null) ||
    step === 3

  /* ── actions ── */

  const next = () => {
    if (step < 3) {
      setStep(step + 1)
      return
    }

    // step 3: validate, then fake-submit
    const e: { name?: string; contact?: string } = {}
    if (name.trim().length < 2) e.name = "Add the name for the booking."
    const digits = contact.replace(/\D/g, "")
    const looksEmail = /^\S+@\S+\.\S+$/.test(contact.trim())
    const looksPhone = digits.length >= 7 && /^[+\d\s().-]+$/.test(contact.trim())
    if (!looksEmail && !looksPhone)
      e.contact = "Add a phone number or email so we can reach you."
    setErrors(e)
    if (Object.keys(e).length) return

    setSending(true)
    // TODO: replace this timeout with your real request later
    setTimeout(() => {
      setRef(
        "T-" + Math.random().toString(36).slice(2, 6).toUpperCase()
      )
      setSending(false)
      setStep(4)
    }, 1200)
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  const closedNames = CLOSED_WEEKDAYS.map(
    (d) => ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"][d]
  ).join(", ")

  const summary: { label: string; value: string | null }[] = [
    {
      label: "Guests",
      value:
        party === null ? null : isLarge ? `${MAX_PARTY}+ guests` : `${party} ${party === 1 ? "guest" : "guests"}`,
    },
    { label: "Date", value: date ? formatDate(date) : null },
    { label: "Time", value: time ? formatTime(time) : null },
  ]

  const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex items-baseline justify-between gap-6 border-b border-white/10 py-4">
      <span className="text-[9px] uppercase tracking-[0.2em] text-[#b99f95]">
        {label}
      </span>
      <span className="text-right font-serif text-lg">{children}</span>
    </div>
  )

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Book a table"
      tabIndex={-1}
      data-shown={shown}
      className="r-panel fixed inset-0 z-50 overflow-y-auto text-[#f3e9df] outline-none"
    >
      <style>{styles}</style>

      {/* Progress line */}
      <div className="fixed left-0 top-0 z-10 h-px w-full bg-white/10">
        <div
          className="h-px bg-[#c5a66b] transition-transform duration-700 ease-out"
          style={{
            transform: `scaleX(${Math.min(step, 4) / 4})`,
            transformOrigin: "left",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-lg text-[#f3e9df] transition-colors duration-300 hover:border-[#c5a66b] hover:text-[#c5a66b] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a66b] sm:right-8 sm:top-8"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="mx-auto grid min-h-full max-w-[1200px] lg:grid-cols-12">
        {/* ───────── Left: live summary ───────── */}
        <aside className="px-6 pb-6 pt-20 sm:px-10 lg:col-span-5 lg:border-r lg:border-white/10 lg:py-24 lg:pr-14">
          <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[#c5a66b]">
            Book a table
          </p>
          <h2 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
            Reserve your evening.
          </h2>

          <div className="mt-10 border-t border-white/10">
            {summary.map((s) => (
              <Row key={s.label} label={s.label}>
                {s.value ? (
                  <span className="text-[#c5a66b]">{s.value}</span>
                ) : (
                  <span className="text-white/20">Not chosen yet</span>
                )}
              </Row>
            ))}
          </div>

          <p className="mt-8 max-w-xs text-xs leading-6 text-[#d3bfb4]">
            Lunch {formatTime(LUNCH[0])} to {formatTime(LUNCH[LUNCH.length - 1])}.
            Dinner {formatTime(DINNER[0])} to {formatTime(DINNER[DINNER.length - 1])}.
            Closed {closedNames}.
          </p>
        </aside>

        {/* ───────── Right: steps ───────── */}
        <div className="px-6 pb-16 pt-6 sm:px-10 lg:col-span-7 lg:py-24 lg:pl-16">
          {step < 4 ? (
            <div key={step} className="r-step">
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#b99f95]">
                Step {step + 1} of 4
              </p>
              <h3 className="font-serif text-3xl leading-tight sm:text-4xl">
                {STEP_TITLES[step]}
              </h3>

              <div className="mt-10">
                {/* STEP 1: party size */}
                {step === 0 && (
                  <>
                    <div className="flex flex-wrap gap-3">
                      {Array.from({ length: MAX_PARTY }, (_, i) => i + 1).map(
                        (n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setParty(n)}
                            aria-pressed={party === n}
                            className={`${chip(party === n ? "selected" : "idle")} h-14 w-14 !px-0 font-serif text-lg`}
                          >
                            {n === MAX_PARTY ? `${n}+` : n}
                          </button>
                        )
                      )}
                    </div>

                    {isLarge && (
                      <p className="r-step mt-8 max-w-sm border-l border-[#c5a66b] pl-4 text-sm leading-7 text-[#d3bfb4]">
                        For groups of {MAX_PARTY} or more, please call us on{" "}
                        <a
                          href={`tel:${PHONE_FOR_GROUPS.replace(/\s/g, "")}`}
                          className="text-[#c5a66b] underline underline-offset-4"
                        >
                          {PHONE_FOR_GROUPS}
                        </a>{" "}
                        so we can prepare the table properly.
                      </p>
                    )}
                  </>
                )}

                {/* STEP 2: date */}
                {step === 1 && (
                  <div className="max-w-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <button
                        type="button"
                        aria-label="Previous month"
                        disabled={!canGoPrev}
                        onClick={() =>
                          setViewMonth(
                            new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 hover:border-[#c5a66b] disabled:opacity-20 disabled:hover:border-white/15"
                      >
                        <span aria-hidden="true">‹</span>
                      </button>
                      <p className="font-serif text-xl">
                        {viewMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <button
                        type="button"
                        aria-label="Next month"
                        disabled={!canGoNext}
                        onClick={() =>
                          setViewMonth(
                            new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 hover:border-[#c5a66b] disabled:opacity-20 disabled:hover:border-white/15"
                      >
                        <span aria-hidden="true">›</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-1 text-center">
                      {WEEKDAYS.map((w) => (
                        <span
                          key={w}
                          className="pb-3 text-[9px] uppercase tracking-[0.15em] text-[#b99f95]"
                        >
                          {w}
                        </span>
                      ))}

                      {calendarCells.map((d, i) => {
                        if (!d) return <span key={`e${i}`} />
                        const disabled = dayDisabled(d)
                        const selected = !!date && sameDay(d, date)
                        return (
                          <button
                            key={d.toISOString()}
                            type="button"
                            disabled={disabled}
                            aria-pressed={selected}
                            aria-label={formatDate(d)}
                            onClick={() => {
                              setDate(d)
                              setTime(null)
                            }}
                            className={[
                              "mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a66b]",
                              selected
                                ? "bg-[#c5a66b] text-[#2a1115]"
                                : disabled
                                  ? "cursor-not-allowed text-white/20"
                                  : "hover:bg-white/10",
                              sameDay(d, today) && !selected
                                ? "border border-[#c5a66b]/50"
                                : "",
                            ].join(" ")}
                          >
                            {d.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: time */}
                {step === 2 && (
                  <div className="space-y-10">
                    {[
                      { label: "Lunch", slots: LUNCH, offset: 0 },
                      { label: "Dinner", slots: DINNER, offset: LUNCH.length },
                    ].map((group) => (
                      <div key={group.label}>
                        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c5a66b]">
                          {group.label}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {group.slots.map((t, i) => {
                            const off = slotUnavailable(t, group.offset + i)
                            return (
                              <button
                                key={t}
                                type="button"
                                disabled={off}
                                aria-pressed={time === t}
                                onClick={() => setTime(t)}
                                className={chip(
                                  off ? "disabled" : time === t ? "selected" : "idle"
                                )}
                              >
                                {formatTime(t)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-white/40">
                      Struck-through times are fully booked.
                    </p>
                  </div>
                )}

                {/* STEP 4: details */}
                {step === 3 && (
                  <div className="max-w-md space-y-8">
                    <div>
                      <label
                        htmlFor="r-name"
                        className="text-[10px] uppercase tracking-[0.2em] text-[#b99f95]"
                      >
                        Name
                      </label>
                      <input
                        id="r-name"
                        className="r-field"
                        value={name}
                        autoComplete="name"
                        onChange={(e) => setName(e.target.value)}
                        aria-invalid={!!errors.name}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="mt-2 text-xs text-[#f2b8a6]">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="r-contact"
                        className="text-[10px] uppercase tracking-[0.2em] text-[#b99f95]"
                      >
                        Phone or email
                      </label>
                      <input
                        id="r-contact"
                        className="r-field"
                        value={contact}
                        autoComplete="email"
                        onChange={(e) => setContact(e.target.value)}
                        aria-invalid={!!errors.contact}
                        placeholder="Where we send the confirmation"
                      />
                      {errors.contact && (
                        <p className="mt-2 text-xs text-[#f2b8a6]">{errors.contact}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="r-note"
                        className="text-[10px] uppercase tracking-[0.2em] text-[#b99f95]"
                      >
                        Allergies or occasion (optional)
                      </label>
                      <textarea
                        id="r-note"
                        rows={2}
                        className="r-field resize-none"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="A birthday, a nut allergy, a quiet corner"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-14 flex items-center gap-6">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="text-[10px] uppercase tracking-[0.25em] text-[#b99f95] transition-colors duration-300 hover:text-[#c5a66b]"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue || sending}
                  className="rounded-full border border-[#c5a66b] bg-[#c5a66b] px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#2a1115] transition-all duration-300 hover:bg-transparent hover:text-[#c5a66b] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/25"
                >
                  {step === 3 ? (sending ? "Sending..." : "Send request") : "Continue"}
                </button>
              </div>
            </div>
          ) : (
            /* ───────── Confirmation ───────── */
            <div className="max-w-md">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
                className="mb-8"
              >
                <circle
                  className="r-circle"
                  cx="32"
                  cy="32"
                  r="27"
                  stroke="#c5a66b"
                  strokeWidth="1.5"
                />
                <path
                  className="r-check"
                  d="M21 33l8 8 15-17"
                  stroke="#c5a66b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h3 className="r-line font-serif text-4xl leading-tight" style={delay(300)}>
                Request received.
              </h3>
              <p
                className="r-line mt-4 text-sm leading-7 text-[#d3bfb4]"
                style={delay(450)}
              >
                Thank you, {name.trim().split(" ")[0]}. We will confirm your table by
                message shortly. It is not confirmed until you hear from us.
              </p>

              <div className="mt-10 border-t border-white/10">
                {[
                  ["Guests", summary[0].value],
                  ["Date", summary[1].value],
                  ["Time", summary[2].value],
                  ["Contact", contact.trim()],
                  ["Reference", ref],
                ].map(([label, value], i) => (
                  <div
                    key={label}
                    className="r-line"
                    style={delay(600 + i * 130)}
                  >
                    <Row label={label as string}>{value}</Row>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="r-line mt-12 rounded-full border border-[#c5a66b]/50 px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#c5a66b] transition-all duration-300 hover:bg-[#c5a66b] hover:text-[#2a1115]"
                style={delay(1400)}
              >
                Back to the menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reservation