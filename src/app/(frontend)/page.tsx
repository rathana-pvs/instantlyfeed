import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { LatestNewsGrid } from '@/components/sections/LatestNewsGrid'
import { CategoryHighlight } from '@/components/sections/CategoryHighlight'
import { OpinionSection } from '@/components/sections/OpinionSection'
import { MostRead } from '@/components/sections/MostRead'
import { BreakingTicker } from '@/components/layout/BreakingTicker'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'
import { getArticles, getFeatured } from '@/lib/api-server'
import { Article } from '@/types'
import { mockArticles } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'InstantlyFeed — Real-Time Global & Political News',
  description: 'Fast, independent coverage of elections, parliament, international affairs, defense, and policy.',
}

export const revalidate = 60

export default async function HomePage() {
  const [{ hero: dbHero, secondary: dbSecondary }, allArticles] = await Promise.all([
    getFeatured(),
    getArticles({ limit: 40 }),
  ])

  // Use database articles if present; otherwise fallback to rich dummy articles
  const articles: Article[] = (allArticles.docs && allArticles.docs.length > 0)
    ? (allArticles.docs as Article[])
    : mockArticles

  const hero = dbHero || articles[0] || null
  const secondary = (dbSecondary && dbSecondary.length >= 4)
    ? dbSecondary
    : articles.filter((a) => a.id !== hero?.id).slice(0, 4)

  // Breaking news for ticker
  const breakingArticles = articles.filter((a) => a.isBreaking)

  // Opinion articles
  const opinionArticles = articles.filter((a) => {
    if (!a.category) return false
    if (typeof a.category === 'object') {
      return a.category.slug === 'opinion' || a.category.name?.toLowerCase().includes('opinion')
    }
    return false
  })

  // Fallback opinion articles if no explicit opinion category
  const opinions = opinionArticles.length >= 3 ? opinionArticles : articles.slice(8, 11)

  // Editor's picks (first 3 non-featured)
  const nonFeatured = articles.filter((a) => !a.isFeatured)
  const editorPicks = nonFeatured.length >= 3 ? nonFeatured.slice(0, 3) : articles.slice(3, 6)

  // Most read top 5
  const mostRead = articles.slice(0, 5)

  return (
    <>
      {/* Breaking News Marquee */}
      {breakingArticles.length > 0 && <BreakingTicker articles={breakingArticles} />}

      {/* Hero Section */}
      <HeroSection hero={hero} secondary={secondary} />

      {/* Latest News Grid */}
      <LatestNewsGrid articles={articles.slice(0, 6)} />

      {/* Category Beat Explorer */}
      <CategoryHighlight articles={articles} />

      {/* Adskeeper Feed Widget */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 my-6">
        <AdskeeperWidget widgetId="2043075" />
      </div>

      {/* Opinion & Commentary */}
      <OpinionSection articles={opinions} />

      {/* Most Read + Editor's Selection */}
      <MostRead editorPicks={editorPicks} mostRead={mostRead} />
    </>
  )
}

