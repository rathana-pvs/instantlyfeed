import Link from 'next/link'
import { dict } from '@/lib/i18n'
import { VisitorCounter } from './VisitorCounter'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] mt-16 font-ui">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="font-display font-black text-2xl tracking-tight text-[var(--text-primary)]">
                INSTANTLY<span className="text-[var(--accent-red)]">FEED</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-6">
              {dict.footerTagline}
            </p>
            <VisitorCounter />
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 pb-1 border-b border-[var(--border)]">
              News Sections
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/search?category=elections" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                Elections & Voting
              </Link>
              <Link href="/search?category=parliament" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                Parliament & Governance
              </Link>
              <Link href="/search?category=international" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                International Affairs
              </Link>
              <Link href="/search?category=policy" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                Policy & Law
              </Link>
              <Link href="/search?category=defense" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                Defense & Security
              </Link>
              <Link href="/live" className="text-[var(--accent-red)] font-semibold hover:underline">
                ● Live Wire Updates
              </Link>
            </div>
          </div>

          {/* Col 3: Company & Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 pb-1 border-b border-[var(--border)]">
              Company
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                {dict.aboutUs}
              </Link>
              <Link href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                {dict.contactUs}
              </Link>
              <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                {dict.privacyPolicy}
              </Link>
              <Link href="/search" className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors">
                Search Archives
              </Link>
            </div>
          </div>

          {/* Col 4: Social & Follow */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 pb-1 border-b border-[var(--border)]">
              {dict.followUs}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Get immediate alerts on breaking stories and developments worldwide.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Twitter / X', href: 'https://twitter.com', icon: '𝕏' },
                { name: 'Facebook', href: 'https://facebook.com', icon: 'f' },
                { name: 'YouTube', href: 'https://youtube.com', icon: '▶' },
                { name: 'Telegram', href: 'https://telegram.org', icon: '✈' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-all text-xs font-medium text-[var(--text-secondary)]"
                >
                  <span className="font-bold">{social.icon}</span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} InstantlyFeed Media. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--accent-red)] transition-colors">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-[var(--accent-red)] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[var(--accent-red)] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

