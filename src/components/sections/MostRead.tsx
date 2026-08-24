'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Article } from '@/types'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { formatDate } from '@/lib/utils'
import { dict } from '@/lib/i18n'

interface MostReadProps {
  editorPicks: Article[]
  mostRead: Article[]
}

export function MostRead({ editorPicks, mostRead }: MostReadProps) {
  return (
    <section className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Editor's Picks — 7 of 12 columns */}
          <div className="lg:col-span-7">
            <SectionDivider
              title="Editor's Selection"
              subtitle="Curated in-depth reporting & features"
              viewAllHref="/search"
              viewAllText="Explore More"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {editorPicks.slice(0, 3).map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  size="md"
                  index={i}
                  showExcerpt={false}
                />
              ))}
            </div>
          </div>

          {/* Most Read — 5 of 12 columns */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[var(--border)] pt-8 lg:pt-0 lg:pl-8">
            <SectionDivider
              title="Most Read"
              subtitle="Trending dispatches this week"
            />

            <div className="flex flex-col divide-y divide-[var(--border)]">
              {mostRead.slice(0, 5).map((article, i) => {
                const cat = typeof article.category === 'object' && article.category !== null ? article.category.name : 'Trending'
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      href={`/article/${article.slug}`}
                      className="flex items-start gap-4 py-4 group transition-colors"
                    >
                      {/* Big Numeral */}
                      <span
                        className="font-display font-black text-3xl sm:text-4xl flex-shrink-0 leading-none pt-0.5"
                        style={{ color: i === 0 ? 'var(--accent-red)' : 'var(--text-muted)', opacity: i === 0 ? 1 : 0.4 }}
                      >
                        0{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-red)] font-ui mb-1 block">
                          {cat}
                        </span>
                        <h3 className="font-card-title text-sm sm:text-[15px] font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-ui mt-1.5">
                          {article.author && typeof article.author === 'object' && (
                            <span className="font-medium text-[var(--text-secondary)]">
                              {article.author.name}
                            </span>
                          )}
                          {article.publishedAt && (
                            <span suppressHydrationWarning>· {formatDate(article.publishedAt, 'MMM d')}</span>
                          )}
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

