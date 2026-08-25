import type { Metadata } from 'next'
import Script from 'next/script'
import '@/app/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@next/third-parties/google'
import { NavigationProgress } from '@/components/layout/NavigationProgress'

const envUrl = process.env.NEXT_PUBLIC_SITE_URL
const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://instantlyfeed.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'InstantlyFeed — Real-Time Global & Political News',
    template: '%s — InstantlyFeed',
  },
  description: 'InstantlyFeed delivers fast, independent global news, political investigations, elections, and policy coverage.',
  keywords: ['news', 'politics', 'elections', 'parliament', 'world news', 'instantlyfeed'],
  openGraph: {
    siteName: 'InstantlyFeed',
    type: 'website',
    url: siteUrl,
    // opengraph-image.tsx auto-injects the og:image tag
  },
  twitter: {
    card: 'summary_large_image',
    // opengraph-image.tsx auto-injects twitter:image tag
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon_192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon_512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <NavigationProgress />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Script src={`https://jsc.adskeeper.com/site/${process.env.NEXT_PUBLIC_ADS_KEEPER_SITE_ID || '1109214'}.js`} strategy="afterInteractive" />
      </body>
    </html>
  )
}
