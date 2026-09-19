'use client'

import React, { useState } from 'react'
import { serializeLexical } from './serialize'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'

export type RichTextProps = {
  content: any
  className?: string
  articleTitle?: string          // Main article title for deduplication
  adWidgetId?: string            // Top in-article ad (before Continue Reading blur)
  adWidgetId2?: string           // Mid in-article ad (first ad in expanded section)
  secondAdWidgetId?: string      // Alias for adWidgetId2
  adWidgetId3?: string           // Lower in-article ad (lower ad in expanded section)
  underArticleWidgetId?: string  // Under-article native ad grid
  feedWidgetId?: string          // Feed widget
}

function extractNodeText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractNodeText).join(' ')
  }
  return ''
}

export const RichText = ({
  content,
  className,
  articleTitle,
  adWidgetId,
  adWidgetId2,
  secondAdWidgetId,
  adWidgetId3,
  underArticleWidgetId,
  feedWidgetId,
}: RichTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!content) return null

  // Lexical content structure: { root: { children: [...] } }
  const rawNodes = content.root?.children || []

  // Filter out any top nodes that duplicate articleTitle (checks top 3 blocks)
  let nodes = rawNodes
  if (articleTitle && rawNodes.length > 0) {
    const cleanTitle = articleTitle.trim().toLowerCase()
    const titlePrefix = cleanTitle.substring(0, Math.min(25, cleanTitle.length))
    nodes = rawNodes.filter((node: any, idx: number) => {
      if (idx >= 3) return true
      const text = extractNodeText(node).trim().toLowerCase()
      if (!text) return true
      if (
        text === cleanTitle || 
        (titlePrefix.length > 5 && text.startsWith(titlePrefix)) || 
        (text.length > 5 && cleanTitle.startsWith(text.substring(0, 25)))
      ) {
        return false
      }
      return true
    })
  }

  const primaryWidgetId =
    adWidgetId || process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1 || '2073352'

  const secondaryWidgetId =
    adWidgetId2 || secondAdWidgetId || process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2 || '2073357'

  const tertiaryWidgetId =
    adWidgetId3 || process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_3 || ''

  const resolvedFeedWidgetId =
    feedWidgetId || process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED || ''

  // Count total paragraphs and find exact paragraph boundary indices
  let paragraphCount = 0
  let p1EndIndex = nodes.length // index after paragraph 1
  let p2EndIndex = nodes.length // index after paragraph 2
  let p3EndIndex = nodes.length // index after paragraph 3

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].type === 'paragraph') {
      paragraphCount++
      if (paragraphCount === 1) p1EndIndex = i + 1
      if (paragraphCount === 2) p2EndIndex = i + 1
      if (paragraphCount === 3) p3EndIndex = i + 1
    }
  }

  // If article is very short (less than 3 nodes or less than 3 paragraphs), render plain
  if (nodes.length < 3 || paragraphCount < 3) {
    return (
      <div className={`rich-text ${className || ''}`}>
        {serializeLexical(nodes)}
      </div>
    )
  }

  // ─── Assemble topElements (shown before "Continue Reading") ───
  const topElements: React.ReactNode[] = []

  // Paragraph 1
  topElements.push(...serializeLexical(nodes.slice(0, p1EndIndex), 'top-p1'))

  // In-Article Ad 1
  if (primaryWidgetId) {
    topElements.push(
      <div key={`ad-inarticle-1-wrap`} className="my-3 w-full flex justify-center items-center">
        <AdskeeperWidget key={`ad-inarticle-1`} widgetId={primaryWidgetId} className="!my-0" />
      </div>
    )
  }

  // Paragraph 2 (Fully visible before Continue Reading button)
  const p2Nodes = nodes.slice(p1EndIndex, p2EndIndex)
  if (p2Nodes.length > 0) {
    topElements.push(...serializeLexical(p2Nodes, 'top-p2'))
  }

  // ─── Assemble bottomElements (shown when expanded) ───
  const bottomElements: React.ReactNode[] = []

  // Paragraph 3
  const p3Nodes = nodes.slice(p2EndIndex, p3EndIndex)
  if (p3Nodes.length > 0) {
    bottomElements.push(...serializeLexical(p3Nodes, 'bot-p3'))
  }

  // In-Article Ad 2 (Rendered after Paragraph 3)
  if (secondaryWidgetId) {
    bottomElements.push(
      <div key={`ad-inarticle-2-wrap`} className="my-4 w-full flex justify-center items-center">
        <AdskeeperWidget key={`ad-inarticle-2`} widgetId={secondaryWidgetId} className="!my-0" />
      </div>
    )
  }

  // Paragraph 4+
  const restNodes = nodes.slice(p3EndIndex)
  if (restNodes.length > 0) {
    bottomElements.push(...serializeLexical(restNodes, 'bot-p4-plus'))
  }

  // ─── Collapsed state: teaser preview on Paragraph 3 + Continue Reading button ───
  if (!isExpanded) {
    const teaserNodes = p3Nodes.length > 0 ? serializeLexical(p3Nodes, 'teaser-p3') : []
    const teaserElement = teaserNodes[0]

    return (
      <div className={`rich-text relative ${className || ''}`}>
        {topElements}

        {/* Teaser text with blur filter and gradient shading mask (on Paragraph 3) */}
        {teaserElement && (
          <div className="relative overflow-hidden h-[5.5rem] max-h-[90px] mt-4 mb-3 select-none pointer-events-none">
            <div className="blur-[1.5px] opacity-75 line-clamp-3">
              {teaserElement}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/80 to-[var(--bg-primary)]" />
          </div>
        )}

        {/* Solid Red Pill Continue Reading CTA */}
        <div className="w-full flex justify-center pt-2 pb-3 mt-2 mb-1">
          <button
            onClick={() => setIsExpanded(true)}
            className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full cursor-pointer font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg hover:brightness-110"
            style={{
              background: 'var(--accent-red)',
            }}
          >
            <span>Continue Reading</span>
            <svg
              className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // ─── Expanded state: full article with phased ads ───
  return (
    <div className={`rich-text ${className || ''}`}>
      {topElements}
      {bottomElements}
    </div>
  )
}
