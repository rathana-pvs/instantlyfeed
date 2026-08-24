import { ImageResponse } from 'next/og'
import { getArticle } from '@/lib/api-server'

export const runtime = 'nodejs'
export const alt = 'Article Open Graph Image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)

  const title = article?.title || 'InstantlyFeed Article'
  const excerpt = article?.excerpt || ''
  const authorName = article?.author?.name || 'InstantlyFeed Staff'
  let coverUrl =
    typeof article?.coverImage === 'object' ? (article.coverImage as any)?.url : null

  // Ensure coverUrl is an absolute URL for Satori image fetching
  if (coverUrl) {
    if (coverUrl.startsWith('//')) {
      coverUrl = `https:${coverUrl}`
    } else if (coverUrl.startsWith('/')) {
      const envUrl = process.env.NEXT_PUBLIC_SITE_URL
      const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://instantlyfeed.com'
      const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
      coverUrl = `${normalizedSiteUrl}${coverUrl}`
    }
  }

  // Truncate title if too long
  const displayTitle = title.length > 80 ? title.slice(0, 77) + '…' : title
  const displayExcerpt = excerpt.length > 120 ? excerpt.slice(0, 117) + '…' : excerpt

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
          background: '#0a0a0a',
        }}
      >
        {/* Cover image background (blurred) */}
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
        )}

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,0,0,0.85) 60%, rgba(20,0,0,0.9) 100%)',
          }}
        />

        {/* Red accent top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #d92b3a, #f87171, #d92b3a)',
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '5px',
            bottom: 0,
            width: '5px',
            background: 'rgba(217,43,58,0.4)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 64px 48px 72px',
            width: '100%',
          }}
        >
          {/* Top: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(217,43,58,0.15)',
                border: '1px solid rgba(217,43,58,0.4)',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#d92b3a',
                }}
              >
                IF
              </span>
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.5px',
              }}
            >
              INSTANTLY<span style={{ color: '#d92b3a' }}>FEED</span>
            </span>
          </div>

          {/* Middle: Title + Excerpt */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center', padding: '20px 0' }}>
            <p
              style={{
                fontSize: displayTitle.length > 60 ? '40px' : '48px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-1px',
              }}
            >
              {displayTitle}
            </p>
            {displayExcerpt && (
              <p
                style={{
                  fontSize: '22px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {displayExcerpt}
              </p>
            )}
          </div>

          {/* Bottom: Author + site */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Author avatar placeholder */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(217,43,58,0.2)',
                  border: '2px solid rgba(217,43,58,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#d92b3a',
                }}
              >
                {authorName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                {authorName}
              </span>
            </div>
            <span
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.5px',
              }}
            >
              instantlyfeed.com
            </span>
          </div>
        </div>

        {/* Right side: cover image panel */}
        {coverUrl && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '5px',
              width: '380px',
              bottom: 0,
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <img
              src={coverUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.7,
              }}
            />
            {/* Gradient fade left */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #0a0a0a 0%, transparent 40%)',
              }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
