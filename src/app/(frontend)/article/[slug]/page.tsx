import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArticle, getArticles, getRelatedArticles } from '@/lib/api-server'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { AuthorChip } from '@/components/ui/AuthorChip'
import { ReadingBar } from '@/components/ui/ReadingBar'
import { RichText } from '@/components/RichText'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'
import { RelatedArticles } from '@/components/article/RelatedArticles'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const articles = await getArticles({ limit: 30 })
    return articles.docs.map((a) => ({ slug: a.slug }))
  } catch (error) {
    console.warn('⚠️ Postgres connection failed in generateStaticParams (expected during build):', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article Not Found' }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://instantlyfeed.com'
  const title = article.meta?.title || article.title
  const description = article.meta?.description || article.excerpt
  const ogImageUrl = article.coverImage?.url

  return {
    title,
    description,
    alternates: {
      canonical: `/article/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/article/${slug}`,
      siteName: 'InstantlyFeed',
      publishedTime: article.publishedAt ?? undefined,
      authors: [article.author?.name || 'InstantlyFeed Staff'],
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export const revalidate = 60

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://instantlyfeed.com'
  
  const widgetSidebar = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR || ''
  const widgetInArticle1 = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1 || ''
  const widgetInArticle2 = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2 || ''
  const widgetFeed = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED || ''
  const widgetUnderArticle = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_UNDER_ARTICLE || ''
  const widgetBottomFeed = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_BOTTOM_FEED || ''

  const article = await getArticle(slug)
  if (!article) notFound()

  const relatedArticles = await getRelatedArticles(article.id)
  const heroImage = article.coverImage?.url || 'https://picsum.photos/seed/article/1400/900'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${slug}`,
    },
    headline: article.title,
    description: article.excerpt,
    image: [
      {
        '@type': 'ImageObject',
        url: heroImage,
        width: article.coverImage?.width ?? 1400,
        height: article.coverImage?.height ?? 900,
      },
    ],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [{
      '@type': 'Person',
      name: article.author?.name || 'InstantlyFeed Staff',
      url: `${siteUrl}/about`,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'InstantlyFeed',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingBar />

      {/* Article Page Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-3 sm:pt-6 pb-6 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 xl:gap-16">
          
          {/* Main Article Column */}
          <article className="lg:col-span-8">
            {/* Category & Breaking Badge */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              {article.category && (
                <CategoryBadge name={article.category.name} size="md" />
              )}
              {article.isBreaking && (
                <span className="font-mono font-bold text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent-red)' }}>
                   · BREAKING
                </span>
              )}
            </div>

            {/* Main Headline (NYT Playfair Serif Style) */}
            <h1
              className="article-title-nyt font-display font-black leading-tight mb-2 sm:mb-4 tracking-tighter"
              style={{ fontSize: 'clamp(24px, 4.5vw, 42px)', color: 'var(--text-primary)' }}
            >
              {article.title}
            </h1>

            {/* Author & Date Chip */}
            <div className="flex flex-wrap items-center gap-4 mb-3 sm:mb-6">
               <AuthorChip
                  author={article.author || null}
                  date={article.publishedAt}
                  readTime={article.readTime}
                  size="lg"
                  className="article-hero-chip"
                />
            </div>

            {/* Full Uncropped 16:9 Featured Image (Compact Mobile Height) */}
            <div className="relative w-full aspect-video max-h-[190px] sm:max-h-none rounded-xl overflow-hidden mb-4 sm:mb-6 bg-[var(--bg-surface)] shadow-sm">
              <Image
                src={heroImage}
                alt={article.coverImage?.alt || article.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 840px"
                className="object-cover"
              />
            </div>

            {/* Lead Excerpt (Executive Briefing Card Style) */}
            {article.excerpt && (
              <div 
                className="border-l-4 border-[var(--accent-red)] pl-4 pr-4 py-3 mb-4 sm:mb-6 rounded-r-lg shadow-xs"
                style={{ background: 'var(--accent-red-dim)' }}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-red)] mb-1 block font-sans">
                  EXECUTIVE SUMMARY
                </span>
                <p
                  className="article-excerpt-nyt text-base sm:text-lg leading-relaxed font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* Rich Text Body with Phased In-Article Ads */}
            <div className="article-body prose prose-invert prose-lg max-w-none mb-4 sm:mb-12">
              {article.content ? (
                <RichText
                  content={article.content}
                  articleTitle={article.title}
                  adWidgetId={widgetInArticle1}
                  adWidgetId2={widgetInArticle2}
                  feedWidgetId={widgetFeed}
                />
              ) : (
                <p className="text-xl leading-relaxed mt-4 italic opacity-50">
                  Content coming soon...
                </p>
              )}
            </div>

            {/* Attribution / Source */}
            {article.credit && (
               <div className="mb-12 py-6 border-t border-b border-[var(--border)] flex items-center gap-4">
                  <span className="font-mono font-bold text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-red)' }}>
                    SOURCE
                  </span>
                  <p className="font-mono text-xs italic" style={{ color: 'var(--text-muted)' }}>
                    {article.credit}
                  </p>
               </div>
            )}

            {/* Under-article Native Recommendations Widget (Desktop Only) */}
            <AdskeeperWidget widgetId={widgetUnderArticle} onlyShowOn="desktop" className="hidden lg:block my-8" />

            {/* Feed Bottom Content Widget - Inside main content column */}
            <div className="mt-8 border-t border-[var(--border)] pt-4">
               <AdskeeperWidget widgetId={widgetBottomFeed} className="!my-0" />
            </div>
          </article>

          {/* Sidebar Area - Hidden on Mobile */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Related / Trending Sidebar Ad */}
              <AdskeeperWidget widgetId={widgetSidebar} adType="sidebar" onlyShowOn="desktop" />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
