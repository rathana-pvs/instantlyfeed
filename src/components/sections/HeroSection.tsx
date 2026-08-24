'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types'
import { AuthorChip } from '@/components/ui/AuthorChip'
import { BreakingBadge } from '@/components/ui/BreakingBadge'
import { dict } from '@/lib/i18n'

interface HeroSectionProps {
  hero: Article | null
  secondary: Article[]
}

export function HeroSection({ hero, secondary }: HeroSectionProps) {
  if (!hero) return null

  const heroImage = hero.coverImage?.url || 'https://picsum.photos/seed/hero/1200/800'
  const heroCategory = typeof hero.category === 'object' && hero.category !== null ? hero.category.name : 'Top Story'

  const secondaryTop = secondary[0]
  const secondaryOthers = secondary.slice(1, 4)

  return (
    <section className="w-full py-6 md:py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-[var(--border)]">
          
          {/* Main Hero Article (7 of 12 columns) */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/article/${hero.slug}`} className="group block">
              <div className="relative w-full rounded-2xl overflow-hidden mb-5 bg-[var(--bg-hover)] border border-[var(--border-subtle)] shadow-sm" style={{ aspectRatio: '16/10' }}>
                <Image
                  src={heroImage}
                  alt={hero.coverImage?.alt || hero.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                {hero.isBreaking && (
                  <div className="absolute top-4 left-4 z-10">
                    <BreakingBadge />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-red)] font-ui">
                    {heroCategory}
                  </span>
                  <span className="text-[var(--text-muted)] text-xs">·</span>
                  <span className="text-xs font-medium text-[var(--text-muted)] font-ui">
                    Lead Editorial
                  </span>
                </div>

                <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] leading-tight mb-3.5 group-hover:text-[var(--accent-red)] transition-colors">
                  {hero.title}
                </h1>

                {hero.excerpt && (
                  <p className="font-body text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-3">
                    {hero.excerpt}
                  </p>
                )}

                <AuthorChip
                  author={hero.author || null}
                  date={hero.publishedAt}
                  readTime={hero.readTime}
                  size="md"
                />
              </div>
            </Link>
          </motion.div>

          {/* Secondary Column (5 of 12 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--border)] pt-6 lg:pt-0 lg:pl-8">
            
            {/* Top Secondary Story (with image) */}
            {secondaryTop && (
              <motion.div
                className="pb-6 border-b border-[var(--border)]"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
              >
                <Link href={`/article/${secondaryTop.slug}`} className="group block">
                  <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-[var(--bg-hover)] border border-[var(--border-subtle)]" style={{ aspectRatio: '16/9' }}>
                    <Image
                      src={secondaryTop.coverImage?.url || 'https://picsum.photos/seed/sec/600/400'}
                      alt={secondaryTop.coverImage?.alt || secondaryTop.title}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {secondaryTop.isBreaking && (
                      <div className="absolute top-3 left-3 z-10">
                        <BreakingBadge />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-red)] font-ui mb-1.5 inline-block">
                      {typeof secondaryTop.category === 'object' && secondaryTop.category !== null ? secondaryTop.category.name : 'Spotlight'}
                    </span>
                    <h2 className="font-card-title text-lg sm:text-xl font-bold leading-snug text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-red)] transition-colors">
                      {secondaryTop.title}
                    </h2>
                    {secondaryTop.excerpt && (
                      <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 mb-3 leading-relaxed">
                        {secondaryTop.excerpt}
                      </p>
                    )}
                    <AuthorChip
                      author={secondaryTop.author || null}
                      date={secondaryTop.publishedAt}
                      size="sm"
                    />
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Compact Secondary List */}
            <div className="flex flex-col divide-y divide-[var(--border)] pt-2">
              {secondaryOthers.map((article, i) => {
                const cat = typeof article.category === 'object' && article.category !== null ? article.category.name : 'Update'
                return (
                  <motion.div
                    key={article.id}
                    className="py-3.5 first:pt-2 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.1, duration: 0.4 }}
                  >
                    <Link href={`/article/${article.slug}`} className="group flex gap-4 items-start">
                      <span className="font-display font-black text-xl text-[var(--accent-red)] opacity-80 leading-none pt-0.5">
                        0{i + 2}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-red)] font-ui">
                            {cat}
                          </span>
                        </div>
                        <h3 className="font-card-title text-sm sm:text-base font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-ui mt-1.5">
                          {article.author && typeof article.author === 'object' && (
                            <span className="font-medium text-[var(--text-secondary)]">
                              {article.author.name}
                            </span>
                          )}
                          {article.readTime && <span>· {article.readTime} min read</span>}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

