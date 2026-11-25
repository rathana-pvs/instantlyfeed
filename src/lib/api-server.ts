import { Article, PaginatedArticles } from '@/types'
import { getPayloadClient } from './payload'
import { unstable_cache } from 'next/cache'
import { mockArticles } from './mockData'

/** Ensure a cover image URL is always properly formatted. */
function normalizeImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('/api/media/file/')) {
    return `/media/${url.replace('/api/media/file/', '')}`
  }
  if (url.startsWith('/media/')) {
    return url
  }
  return url.startsWith('/') ? url : `/${url}`
}

/** Normalize image URLs on an article document in place. */
function normalizeDoc<T>(doc: any): T {
  if (doc?.coverImage && typeof doc.coverImage === 'object') {
    doc.coverImage.url = normalizeImageUrl(doc.coverImage.url)
  }
  return doc as T
}

/**
 * Projection for list/card queries. Card views never render the rich-text body
 * or the SEO/OG groups, so leaving them out keeps the DB result, the
 * Next.js data cache entries and the RSC payload much smaller.
 */
const LIST_SELECT = { content: false, og: false, meta: false } as const

// Detect build time to bypass caching placeholder database responses
const isBuildTime =
  !process.env.DATABASE_URI ||
  process.env.DATABASE_URI.includes('placeholder')

function paginated(docs: any[], limit: number, page: number, totalDocs = docs.length): PaginatedArticles {
  return {
    docs,
    totalDocs,
    limit,
    totalPages: 1,
    page,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  } as unknown as PaginatedArticles
}

function warnDb(where: string, error: unknown) {
  console.warn(`⚠️ Postgres query failed in ${where}:`, error instanceof Error ? error.message : error)
}

type ListParams = {
  limit?: number
  page?: number
  where?: Record<string, any>
}

const cachedGetArticles = unstable_cache(
  async (params?: ListParams): Promise<PaginatedArticles> => {
    const limit = params?.limit || 12
    const page = params?.page || 1
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'articles',
        limit,
        page,
        where: {
          status: { equals: 'published' },
          ...(params?.where || {}),
        },
        depth: 2,
        sort: '-publishedAt',
        select: LIST_SELECT,
      })

      if (!result.docs || result.docs.length === 0) {
        return paginated(mockArticles.slice(0, limit), limit, page, mockArticles.length)
      }

      return { ...result, docs: result.docs.map((d: any) => normalizeDoc(d)) } as unknown as PaginatedArticles
    } catch (error) {
      warnDb('getArticles', error)
      return paginated(mockArticles.slice(0, limit), limit, page, mockArticles.length)
    }
  },
  ['articles-list'],
  { tags: ['articles'] }
)

export async function getArticles(params?: ListParams): Promise<PaginatedArticles> {
  if (isBuildTime) {
    return paginated([], params?.limit || 12, params?.page || 1)
  }
  return cachedGetArticles(params)
}

const cachedGetArticle = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      })
      const article = result.docs[0]
      return article ? normalizeDoc<Article>(article) : null
    } catch (error) {
      warnDb(`getArticle("${slug}")`, error)
      return null
    }
  },
  ['article'],
  { tags: ['articles'], revalidate: 60 }
)

export async function getArticle(slug: string): Promise<Article | null> {
  if (isBuildTime) return null
  return cachedGetArticle(slug)
}

const cachedGetFeatured = unstable_cache(
  async (): Promise<{ hero: Article | null; secondary: Article[] }> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'articles',
        where: { status: { equals: 'published' } },
        limit: 5,
        depth: 2,
        sort: '-publishedAt',
        select: LIST_SELECT,
      })
      const docs = result.docs.map((d: any) => normalizeDoc<Article>(d))
      if (docs.length > 0) {
        return { hero: docs[0] || null, secondary: docs.slice(1, 5) }
      }
    } catch (error) {
      warnDb('getFeatured', error)
    }
    return { hero: mockArticles[0] || null, secondary: mockArticles.slice(1, 5) }
  },
  ['featured-articles'],
  { tags: ['articles'] }
)

export async function getFeatured(): Promise<{ hero: Article | null; secondary: Article[] }> {
  if (isBuildTime) return { hero: null, secondary: [] }
  return cachedGetFeatured()
}

const cachedGetBreakingArticles = unstable_cache(
  async (): Promise<Article[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'articles',
        where: {
          isBreaking: { equals: true },
          status: { equals: 'published' },
        },
        limit: 5,
        depth: 2,
        sort: '-publishedAt',
        select: LIST_SELECT,
      })
      if (result.docs && result.docs.length > 0) {
        return result.docs.map((d: any) => normalizeDoc<Article>(d))
      }
    } catch (error) {
      warnDb('getBreakingArticles', error)
    }
    return mockArticles.filter((a) => a.isBreaking)
  },
  ['breaking-articles'],
  { tags: ['articles'] }
)

export async function getBreakingArticles(): Promise<Article[]> {
  if (isBuildTime) return []
  return cachedGetBreakingArticles()
}

// Keyed by slug (not id) so article pages can fetch this in parallel with the
// article itself instead of waiting for it.
const cachedGetRelatedArticles = unstable_cache(
  async (excludeSlug: string): Promise<Article[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'articles',
        where: {
          status: { equals: 'published' },
          slug: { not_equals: excludeSlug },
        },
        limit: 4,
        depth: 2,
        sort: '-publishedAt',
        select: LIST_SELECT,
      })
      return (result.docs || []).map((d: any) => normalizeDoc<Article>(d))
    } catch (error) {
      warnDb(`getRelatedArticles("${excludeSlug}")`, error)
      return []
    }
  },
  ['related-articles-by-slug'],
  { tags: ['articles'], revalidate: 60 }
)

export async function getRelatedArticles(excludeSlug: string): Promise<Article[]> {
  if (isBuildTime) return []
  return cachedGetRelatedArticles(excludeSlug)
}
