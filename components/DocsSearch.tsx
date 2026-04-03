import { startTransition, useDeferredValue, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Search as SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_LOCALE = 'en-US'
const MAX_RESULTS = 12

type SearchProps = {
  className?: string
  directories?: unknown[]
}

type SearchData = Record<
  string,
  {
    title: string
    data: Record<string, string>
  }
>

type SearchResult = {
  excerpt?: string
  id: string
  route: string
  title: string
  pageTitle?: string
}

type SearchMatch = {
  entry: SearchEntry
  isRootPage: boolean
  score: number
}

type SearchEntry = {
  compactPageTitle: string
  compactPageRoute: string
  compactRoute: string
  compactSectionTitle: string
  content: string
  excerpt: string
  id: string
  isRootPage: boolean
  keywords: string[]
  normalizedContent: string
  normalizedPageTitle: string
  normalizedPageRoute: string
  normalizedRoute: string
  normalizedSectionTitle: string
  pageRoute: string
  pageTitle: string
  route: string
  sectionTitle: string
  titleKeywords: string[]
}

const indexCache = new Map<string, Promise<SearchEntry[]>>()

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compactText(value: string) {
  return normalizeText(value).replace(/\s+/g, '')
}

function extractKeywords(...values: string[]) {
  const keywords = new Set<string>()

  for (const value of values) {
    const normalized = normalizeText(value)

    if (!normalized) {
      continue
    }

    keywords.add(normalized)

    for (const token of normalized.split(' ')) {
      if (token.length >= 2) {
        keywords.add(token)
      }
    }
  }

  return Array.from(keywords)
}

function damerauLevenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0))

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost)
      }
    }
  }

  return matrix[a.length][b.length]
}

function maxEditDistance(length: number) {
  if (length <= 4) {
    return 1
  }

  if (length <= 8) {
    return 2
  }

  return 3
}

function fuzzyKeywordScore(token: string, keywords: string[]) {
  let best = 0

  for (const keyword of keywords) {
    if (keyword === token) {
      return 1
    }

    if (keyword.includes(token) || token.includes(keyword)) {
      best = Math.max(best, 0.92 - Math.abs(keyword.length - token.length) * 0.02)
    }

    const distance = damerauLevenshtein(token, keyword)
    const longest = Math.max(token.length, keyword.length)

    if (distance <= maxEditDistance(longest)) {
      best = Math.max(best, 1 - distance / longest)
    }
  }

  return best >= 0.45 ? best : 0
}

function buildIndex(searchData: SearchData): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const [route, structurizedData] of Object.entries(searchData)) {
    const pageTitle = structurizedData.title
    let pageExcerpt = pageTitle
    let pageContent = ''
    let rootContent = ''

    for (const [key, content] of Object.entries(structurizedData.data)) {
      const [headingId, headingValue] = key.split('#')
      const url = route + (headingId ? `#${headingId}` : '')
      const sectionTitle = headingValue || pageTitle
      const excerpt =
        content
          .split('\n')
          .map(line => line.trim())
          .find(Boolean) ?? sectionTitle

      if (pageExcerpt === pageTitle && excerpt) {
        pageExcerpt = excerpt
      }

      pageContent += `\n${sectionTitle}\n${content}`

      if (!headingId) {
        rootContent += `\n${content}`
        continue
      }

      entries.push({
        compactPageTitle: compactText(pageTitle),
        compactPageRoute: compactText(route),
        compactSectionTitle: compactText(sectionTitle),
        compactRoute: compactText(url),
        id: `${url}::${sectionTitle}`,
        isRootPage: !headingId,
        route: url,
        pageRoute: route,
        pageTitle,
        sectionTitle,
        content,
        excerpt,
        keywords: extractKeywords(pageTitle, sectionTitle, url, excerpt),
        titleKeywords: extractKeywords(pageTitle, sectionTitle),
        normalizedPageTitle: normalizeText(pageTitle),
        normalizedPageRoute: normalizeText(route),
        normalizedSectionTitle: normalizeText(sectionTitle),
        normalizedContent: normalizeText(`${pageTitle}\n${sectionTitle}\n${content}`),
        normalizedRoute: normalizeText(url),
      })
    }

    const rootSearchContent = rootContent.trim() ? `${pageTitle}\n${rootContent}` : pageContent

    entries.push({
      compactPageTitle: compactText(pageTitle),
      compactPageRoute: compactText(route),
      compactSectionTitle: compactText(pageTitle),
      compactRoute: compactText(route),
      id: `${route}::root`,
      isRootPage: true,
      route,
      pageRoute: route,
      pageTitle,
      sectionTitle: pageTitle,
      content: rootSearchContent,
      excerpt: pageExcerpt,
      keywords: extractKeywords(pageTitle, route, pageExcerpt),
      titleKeywords: extractKeywords(pageTitle),
      normalizedPageTitle: normalizeText(pageTitle),
      normalizedPageRoute: normalizeText(route),
      normalizedSectionTitle: normalizeText(pageTitle),
      normalizedContent: normalizeText(rootSearchContent),
      normalizedRoute: normalizeText(route),
    })
  }

  return entries
}

async function loadIndexes(basePath: string, locale: string): Promise<SearchEntry[]> {
  const key = `${basePath}@${locale}`

  if (indexCache.has(key)) {
    return indexCache.get(key)!
  }

  const promise = fetch(`${basePath}/_next/static/chunks/nextra-data-${locale}.json`)
    .then(async response => {
      if (!response.ok) {
        throw new Error(`Failed to load search data for locale "${locale}"`)
      }

      return buildIndex((await response.json()) as SearchData)
    })
    .catch(error => {
      indexCache.delete(key)
      throw error
    })

  indexCache.set(key, promise)
  return promise
}

function shouldPreferRootMatch(rootMatch: SearchMatch, bestMatch: SearchMatch, normalizedQuery: string, compactQuery: string) {
  const rootEntry = rootMatch.entry
  const directTitleMatch =
    rootEntry.normalizedPageTitle === normalizedQuery || rootEntry.normalizedPageTitle.includes(normalizedQuery)
  const directRouteMatch =
    rootEntry.normalizedPageRoute === normalizedQuery || rootEntry.normalizedPageRoute.includes(normalizedQuery)
  const pageTitlePhraseScore = fuzzyKeywordScore(compactQuery, [rootEntry.compactPageTitle, rootEntry.normalizedPageTitle])
  const pageRoutePhraseScore = fuzzyKeywordScore(compactQuery, [rootEntry.compactPageRoute, rootEntry.normalizedPageRoute])

  if (directTitleMatch || directRouteMatch) {
    return true
  }

  if (pageTitlePhraseScore >= 0.75 || pageRoutePhraseScore >= 0.75) {
    return true
  }

  return rootMatch.score >= bestMatch.score * 0.72
}

function searchIndexes(indexes: SearchEntry[], query: string): SearchResult[] {
  const normalizedQuery = normalizeText(query.trim())
  const compactQuery = compactText(query)

  if (!normalizedQuery) {
    return []
  }

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
  const matches = indexes
    .map(entry => {
      const tokenScores = tokens.map(token => fuzzyKeywordScore(token, entry.keywords))
      const titleTokenScores = tokens.map(token => fuzzyKeywordScore(token, entry.titleKeywords))
      const hasTokenCoverage = tokenScores.every(score => score > 0)
      const directPhraseMatch =
        entry.normalizedPageTitle.includes(normalizedQuery) ||
        entry.normalizedSectionTitle.includes(normalizedQuery) ||
        entry.normalizedContent.includes(normalizedQuery) ||
        entry.normalizedRoute.includes(normalizedQuery)
      const compactPhraseScore = Math.max(
        fuzzyKeywordScore(compactQuery, [entry.compactPageTitle, entry.compactSectionTitle, entry.compactRoute]),
        fuzzyKeywordScore(normalizedQuery, [entry.normalizedPageTitle, entry.normalizedSectionTitle, entry.normalizedRoute])
      )

      if (!directPhraseMatch && !hasTokenCoverage && compactPhraseScore === 0) {
        return null
      }

      let score = 0
      const pageTitlePhraseScore = fuzzyKeywordScore(compactQuery, [entry.compactPageTitle, entry.normalizedPageTitle])
      const pageRoutePhraseScore = fuzzyKeywordScore(compactQuery, [entry.compactPageRoute, entry.normalizedPageRoute])
      const sectionTitlePhraseScore = fuzzyKeywordScore(compactQuery, [entry.compactSectionTitle, entry.normalizedSectionTitle])

      if (entry.normalizedPageTitle === normalizedQuery) {
        score += 300
      }
      if (entry.normalizedSectionTitle === normalizedQuery) {
        score += 280
      }
      if (entry.normalizedRoute.includes(normalizedQuery)) {
        score += 160
      }
      if (entry.normalizedPageRoute.includes(normalizedQuery)) {
        score += 140
      }
      if (entry.normalizedPageTitle.includes(normalizedQuery)) {
        score += 220
      }
      if (entry.normalizedSectionTitle.includes(normalizedQuery)) {
        score += 200
      }
      if (entry.normalizedContent.includes(normalizedQuery)) {
        score += 120
      }
      if (compactPhraseScore > 0) {
        score += Math.round(compactPhraseScore * 140)
      }
      if (pageTitlePhraseScore > 0) {
        score += Math.round(pageTitlePhraseScore * 180)
      }
      if (pageRoutePhraseScore > 0) {
        score += Math.round(pageRoutePhraseScore * 130)
      }
      if (sectionTitlePhraseScore > 0) {
        score += Math.round(sectionTitlePhraseScore * 120)
      }
      if (entry.isRootPage) {
        score += 35
      }
      if (entry.isRootPage && (pageTitlePhraseScore > 0 || entry.normalizedPageTitle.includes(normalizedQuery))) {
        score += 80
      }
      if (entry.isRootPage && (pageRoutePhraseScore > 0 || entry.normalizedPageRoute.includes(normalizedQuery))) {
        score += 80
      }

      for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i]
        const tokenScore = tokenScores[i]
        const titleTokenScore = titleTokenScores[i]

        if (entry.normalizedPageTitle.includes(token)) {
          score += 50
        }
        if (entry.normalizedSectionTitle.includes(token)) {
          score += 45
        }
        if (entry.normalizedRoute.includes(token)) {
          score += 30
        }
        if (entry.normalizedPageRoute.includes(token)) {
          score += 40
        }
        if (entry.normalizedContent.includes(token)) {
          score += 10
        }
        score += Math.round(tokenScore * 60)
        score += Math.round(titleTokenScore * 75)
        if (entry.isRootPage) {
          score += Math.round(titleTokenScore * 110)
        }
      }

      return {
        isRootPage: entry.isRootPage,
        score,
        entry,
      }
    })
    .filter((value): value is SearchMatch => value !== null)
    .sort((a, b) => b.score - a.score || Number(b.isRootPage) - Number(a.isRootPage) || a.entry.route.localeCompare(b.entry.route))

  const groupedMatches = new Map<string, SearchMatch[]>()

  for (const match of matches) {
    const existing = groupedMatches.get(match.entry.pageRoute)

    if (existing) {
      existing.push(match)
      continue
    }

    groupedMatches.set(match.entry.pageRoute, [match])
  }

  return Array.from(groupedMatches.values())
    .map(group => {
      const bestMatch = group[0]
      const rootMatch = group.find(match => match.entry.isRootPage)

      if (rootMatch && shouldPreferRootMatch(rootMatch, bestMatch, normalizedQuery, compactQuery)) {
        return rootMatch
      }

      return bestMatch
    })
    .sort((a, b) => b.score - a.score || Number(b.isRootPage) - Number(a.isRootPage) || a.entry.route.localeCompare(b.entry.route))
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => ({
      id: entry.id,
      route: entry.route,
      title: entry.sectionTitle,
      pageTitle: entry.pageTitle,
      excerpt: entry.excerpt,
    }))
}

export default function DocsSearch({ className }: SearchProps) {
  const router = useRouter()
  const { asPath, basePath = '', defaultLocale = DEFAULT_LOCALE, locale = defaultLocale } = router
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const deferredQuery = useDeferredValue(query.trim())
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setQuery('')
    setResults([])
    setActiveIndex(0)
  }, [asPath])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }

    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable

      if (event.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
        return
      }

      if (isTypingTarget) {
        return
      }

      if (event.key === '/' || (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleShortcut)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [])

  useEffect(() => {
    setActiveIndex(0)
  }, [deferredQuery])

  useEffect(() => {
    if (!focused && !deferredQuery) {
      setOpen(false)
      setLoading(false)
      setError('')
      startTransition(() => {
        setResults([])
      })
      return
    }

    if (!deferredQuery) {
      setError('')
      setLoading(false)
      setOpen(focused)
      startTransition(() => {
        setResults([])
      })
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    setOpen(true)

    loadIndexes(basePath, locale)
      .then(indexes => {
        if (cancelled) {
          return
        }

        const nextResults = searchIndexes(indexes, deferredQuery)

        startTransition(() => {
          setResults(nextResults)
        })
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setError('Failed to load search index.')
        startTransition(() => {
          setResults([])
        })
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [basePath, deferredQuery, focused, locale])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(index => Math.min(index + 1, results.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index => Math.max(index - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      const activeResult = results[activeIndex]

      if (activeResult) {
        void router.push(activeResult.route)
      }
    }
  }

  return (
    <div ref={rootRef} className={cn('docs-search-wrapper nextra-search hidden md:block', className)}>
      <div className="docs-search-shell relative w-full">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search docs..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          name="mekong-docs-search"
          onChange={event => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            setFocused(true)
            setOpen(true)
          }}
          onBlur={() => {
            setFocused(false)
          }}
          onKeyDown={handleKeyDown}
          className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-14 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground">
          ESC
        </kbd>

        {open ? (
          <div className="docs-search-panel absolute left-1/2 top-full z-30 mt-3 w-full -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            {loading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-destructive">{error}</div>
            ) : deferredQuery && results.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No results found.</div>
            ) : deferredQuery ? (
              <ul className="max-h-[24rem] overflow-y-auto p-2">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      href={result.route}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setOpen(false)
                        setQuery('')
                      }}
                      className={cn(
                        'block rounded-xl px-3 py-3 transition',
                        index === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60'
                      )}
                    >
                      {result.pageTitle && result.pageTitle !== result.title ? (
                        <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          {result.pageTitle}
                        </div>
                      ) : null}
                      <div className="mt-1 text-sm font-semibold text-foreground">{result.title}</div>
                      {result.excerpt ? (
                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{result.excerpt}</div>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">Type to search the docs.</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
