import { useState } from 'react'
import { Link } from 'react-router-dom'

type NavbarProps = {
  onBook: () => void
}

const Navbar = ({ onBook }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  // "Book a Table" is no longer a page, so it is not in this list anymore
  const links = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/aboutUs' },
    { label: 'Why Choose', to: '/about#why-us' },
  ]

  const handleBook = () => {
    closeMenu()
    onBook()
  }

  const linkClass =
    'whitespace-nowrap text-xs uppercase tracking-wider text-white transition-colors duration-300 hover:text-[#d9a34d]'

  return (
    <header className="relative z-50 w-full border-b border-white/15 bg-[#111512] animate-fade-in">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 font-serif text-2xl tracking-wide text-white"
          onClick={closeMenu}
        >
          Maison<span className="text-[#d9a34d]">.</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.label} to={link.to} className={linkClass}>
              {link.label}
            </Link>
          ))}

          {/* Opens the reservation panel */}
          <button type="button" onClick={handleBook} className={linkClass}>
            Book a Table
          </button>
        </div>

        {/* Desktop CTA (one element only: no <a> inside <Link>) */}
        <Link
          to="/menu"
          className="hidden shrink-0 bg-[#d9a34d] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#bd8736] md:inline-flex"
        >
          View Menu
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#d9a34d] hover:text-[#d9a34d] md:hidden"
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#111512] px-5 pb-6 pt-3 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:text-[#d9a34d]"
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleBook}
              className="border-b border-white/10 py-4 text-left text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:text-[#d9a34d]"
            >
              Book a Table
            </button>

            <Link
              to="/menu"
              onClick={closeMenu}
              className="mt-5 bg-[#d9a34d] px-5 py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#bd8736]"
            >
              View Menu
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar