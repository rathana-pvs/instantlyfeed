'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dict } from '@/lib/i18n'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) => {
    if (!pathname) return false
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Elections', href: '/search?category=elections' },
    { name: 'Parliament', href: '/search?category=parliament' },
    { name: 'International', href: '/search?category=international' },
    { name: 'Policy & Law', href: '/search?category=policy' },
    { name: 'Defense', href: '/search?category=defense' },
    { name: 'Opinion', href: '/search?category=opinion' },
    { name: 'Live Wire', href: '/live' },
  ]

  const isArticlePage = Boolean(pathname && pathname.startsWith('/article'))

  if (isArticlePage) {
    return (
      <header className="sticky top-0 z-50 w-full bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border)] transition-all">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-13 sm:h-14 flex items-center justify-between">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent-red)] text-[var(--text-primary)] hover:text-[var(--accent-red)] transition-all duration-200 shadow-2xs group active:scale-[0.97]"
            aria-label="Back to Home"
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--bg-surface)] group-hover:bg-[var(--accent-red)] text-[var(--text-secondary)] group-hover:text-white transition-all duration-200 shadow-2xs">
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
                className="group-hover:-translate-x-0.5 transition-transform duration-200"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-ui text-xs font-bold uppercase tracking-wider hidden sm:inline">
              Back to Home
            </span>
            <span className="font-ui text-xs font-bold uppercase tracking-wider sm:hidden">
              Home
            </span>
          </Link>

          {/* Minimal Centered Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-[var(--text-primary)]">
              INSTANTLY
            </span>
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-[var(--accent-red)]">
              FEED
            </span>
          </Link>

          {/* Right Action: Search */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-red)] hover:border-[var(--accent-red)] transition-all bg-[var(--bg-primary)] shadow-xs"
              aria-label="Search"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className="w-full z-50 bg-[var(--bg-surface)] border-b border-[var(--border)] transition-all duration-200"
      >
        {/* Top Utility Strip */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs text-[var(--text-muted)]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between font-ui">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[var(--text-secondary)]">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <span className="hidden sm:inline text-[var(--border)]">|</span>
              <span className="hidden sm:inline tracking-wide font-medium text-[11px] text-[var(--text-muted)]">
                Today&apos;s Edition
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/live"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold text-[var(--accent-red)] hover:bg-[var(--accent-red-dim)] transition-colors"
              >
                <span className="live-dot w-2 h-2 rounded-full bg-[var(--accent-red)] inline-block" />
                <span>LIVE WIRE</span>
              </Link>
              <span className="text-[var(--border)]">|</span>
              <Link href="/about" className="hover:text-[var(--text-primary)] transition-colors text-[11px] font-medium hidden md:inline">
                About
              </Link>
              <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors text-[11px] font-medium hidden md:inline">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Main Brand & Masthead Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 md:py-4.5">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger (Left on mobile) */}
            <div className="lg:hidden flex items-center">
              <button
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Centered Brand Title */}
            <div className="flex-1 text-center">
              <Link href="/" className="inline-flex items-center group">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display font-black text-2xl sm:text-3xl md:text-[34px] tracking-tight text-[var(--text-primary)] leading-none">
                    INSTANTLY
                  </span>
                  <span className="font-display font-black text-2xl sm:text-3xl md:text-[34px] tracking-tight text-[var(--accent-red)] leading-none">
                    FEED
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Action (Search) */}
            <div className="flex items-center justify-end">
              <Link
                href="/search"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] text-[var(--text-secondary)] text-xs font-medium transition-all bg-[var(--bg-primary)] shadow-sm"
                aria-label={dict.search}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="hidden md:inline">Search</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Navigation Bar (Sticky Desktop Nav) */}
        <nav
          className={`hidden lg:block border-t border-[var(--border)] bg-[var(--bg-surface)] ${
            scrolled ? 'sticky top-0 shadow-sm' : ''
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center justify-center gap-7 h-11">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-[var(--accent-red)] py-2.5 ${
                      active ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--accent-red)] rounded-t-sm" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] flex flex-col bg-[var(--bg-surface)] shadow-2xl border-r border-[var(--border)] z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--bg-primary)]">
              <Link href="/" className="flex items-center gap-1">
                <span className="font-display font-black text-xl text-[var(--text-primary)]">
                  INSTANTLY<span className="text-[var(--accent-red)]">FEED</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Nav Links */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 font-ui">
              <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                Sections
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-[var(--accent-red-dim)] text-[var(--accent-red)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-xs opacity-40">›</span>
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  Information
                </div>
                <Link
                  href="/about"
                  className="flex items-center px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg"
                >
                  About InstantlyFeed
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg"
                >
                  Contact & Tips
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg"
                >
                  Privacy Policy
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

