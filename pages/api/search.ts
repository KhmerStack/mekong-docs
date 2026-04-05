import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type SearchResult = {
  id: string
  route: string
  title: string
  pageTitle: string
  excerpt: string
  version?: string
}

// ─── MDX text extraction ──────────────────────────────────────────

function stripMdx(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')      // fenced code blocks
    .replace(/`[^`\n]+`/g, ' ')           // inline code
    .replace(/^import\s.+$/gm, '')        // import statements
    .replace(/<[A-Za-z][^>]*\/>/g, ' ')   // self-closing JSX
    .replace(/<[A-Za-z][^>]*>[\s\S]*?<\/[A-Za-z]+>/g, ' ') // JSX blocks
    .replace(/^#{1,6}\s+/gm, '')          // headings markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')    // bold
    .replace(/\*([^*]+)\*/g, '$1')        // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
    .replace(/^\s*[-*>]\s+/gm, '')        // bullets / blockquotes
    .replace(/\s+/g, ' ')
    .trim()
}

function getExcerpt(text: string, query: string, windowSize = 160): string {
  const lc = text.toLowerCase()
  const idx = lc.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, windowSize)
  const start = Math.max(0, idx - 60)
  return (start > 0 ? '…' : '') + text.slice(start, start + windowSize).trim()
}

// ─── File walking ─────────────────────────────────────────────────

type DocFile = { filePath: string; route: string; version: string }

function walkDocs(dir: string, rootDir: string): DocFile[] {
  const results: DocFile[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      results.push(...walkDocs(full, rootDir))
    } else if (/\.mdx?$/.test(entry.name) && entry.name !== 'index.mdx') {
      const rel = path.relative(rootDir, full).replace(/\\/g, '/')
      const route = '/docs/' + rel.replace(/\.mdx?$/, '')
      // Extract version segment (first path segment after pages/docs/)
      const version = rel.split('/')[0] ?? ''
      results.push({ filePath: full, route, version })
    }
  }

  return results
}

// ─── Handler ──────────────────────────────────────────────────────

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = ((req.query.q as string) ?? '').trim()
  const versionFilter = ((req.query.v as string) ?? '').trim()
  const searchAll = req.query.all === '1'

  if (!q || q.length < 2) {
    return res.status(200).json([])
  }

  const docsDir = path.join(process.cwd(), 'pages', 'docs')
  const allFiles = walkDocs(docsDir, docsDir)
  // searchAll=true → home page, search across all versions (results show version label)
  // versionFilter set → on a specific version page, filter to that version only
  const files = searchAll
    ? allFiles
    : versionFilter
      ? allFiles.filter(f => f.version === versionFilter)
      : allFiles
  const lq = q.toLowerCase()
  const results: SearchResult[] = []

  for (const { filePath, route, version } of files) {
    let raw: string
    try { raw = fs.readFileSync(filePath, 'utf8') } catch { continue }

    const { data, content } = matter(raw)
    const pageTitle: string = data.title ?? path.basename(filePath, path.extname(filePath))
    const plainText = stripMdx(content)
    const combined = `${pageTitle} ${plainText}`.toLowerCase()

    if (!combined.includes(lq)) continue

    const titleScore = pageTitle.toLowerCase().includes(lq) ? 2 : 0
    const score = titleScore + (plainText.toLowerCase().includes(lq) ? 1 : 0)

    results.push({
      id: route,
      route,
      title: pageTitle,
      pageTitle,
      excerpt: getExcerpt(plainText, q),
      version,
    })

    // Attach score for sorting (removed before response)
    ;(results[results.length - 1] as any)._score = score
  }

  results.sort((a, b) => (b as any)._score - (a as any)._score)
  results.forEach(r => delete (r as any)._score)

  return res.status(200).json(results.slice(0, 12))
}
