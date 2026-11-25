import { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

// Rendered per request (the DB isn't reachable at build time), but the article
// query below is cached, so crawlers no longer hit Postgres on every fetch.
export const dynamic = 'force-dynamic'

const getSitemapArticles = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'articles',
      // The Local API bypasses access control, so filter explicitly —
      // drafts and archived articles must not be advertised to crawlers.
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    })
    return docs
      .filter((d: any) => d.slug)
      .map((d: any) => ({ slug: d.slug, updatedAt: d.updatedAt }))
  },
  ['sitemap-articles'],
  // Busted immediately when an article is saved (afterChange revalidates the
  // 'articles' tag); otherwise refreshed at most every 10 minutes.
  { tags: ['articles'], revalidate: 600 }
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://instantlyfeed.com'

  const staticPages = ['', '/about', '/contact', '/privacy', '/live', '/search']
  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: page === '' ? 1 : 0.8,
  }))

  let articles: { slug: string; updatedAt: string }[] = []
  try {
    articles = await getSitemapArticles()
  } catch (error) {
    // Still serve the static pages rather than a 500 if the DB is down.
    console.warn('⚠️ sitemap: failed to load articles:', error instanceof Error ? error.message : error)
  }

  for (const article of articles) {
    sitemapEntries.push({
      url: `${siteUrl}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  }

  return sitemapEntries
}
