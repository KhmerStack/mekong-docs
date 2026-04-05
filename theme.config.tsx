import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import DocsSearch from './components/DocsSearch'
import { ThemeToggle } from './components/ThemeToggle'
import { VersionSwitcher } from './components/VersionSwitcher'
import { VERSIONS, LATEST_VERSION } from './lib/versions'

/**
 * Hides its parent <li> in the sidebar via DOM walk.
 * Used to hide version folders that are not currently active.
 */
function HiddenVersionFolder() {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    let el: HTMLElement | null = ref.current?.parentElement ?? null
    while (el && el.tagName.toLowerCase() !== 'li') {
      el = el.parentElement
    }
    if (el) el.style.display = 'none'
    return () => { if (el) el.style.display = '' }
  }, [])
  return <span ref={ref} style={{ display: 'none' }} />
}

const OG_IMAGE = 'https://onhyewqcjmwup3zj.public.blob.vercel-storage.com/opengraph.png'
const SITE_URL = 'https://mekongtunnel.dev'
const DOCS_REPO_URL = 'https://github.com/KhmerStack/mekong-docs'
const DOCS_REPO_EDIT_BASE = `${DOCS_REPO_URL}/blob/main`
const DOCS_REPO_ISSUES_BASE = `${DOCS_REPO_URL}/issues/new`

type DocsIssueOptions = {
  title: string
  labels?: string
  pagePath?: string
  pageTitle?: string
}

function buildDocsIssueUrl({
  title,
  labels,
  pagePath = '/',
  pageTitle = 'Documentation page',
}: DocsIssueOptions) {
  const params = new URLSearchParams({
    title,
    ...(labels ? { labels } : {}),
    body: [
      'Page details',
      '',
      `- Title: ${pageTitle}`,
      `- Path: ${pagePath}`,
      `- URL: ${SITE_URL}${pagePath}`,
      '',
      'What would you like to report or change?',
      '<!-- Add details here -->',
    ].join('\n'),
  })

  return `${DOCS_REPO_ISSUES_BASE}?${params.toString()}`
}

const config: DocsThemeConfig = {
  logo: (
    <span className="flex items-center gap-2.5 font-bold tracking-tight">
      <img
        src="/MekongNoBG.png"
        alt="MekongTunnel"
        width={36}
        height={36}
        className="shrink-0"
      />
      <span className="text-base sm:text-lg">MekongTunnel</span>
    </span>
  ),

  project: {
    link: DOCS_REPO_URL,
  },

  docsRepositoryBase: DOCS_REPO_EDIT_BASE,

  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return { titleTemplate: '%s · MekongTunnel' }
    }
    return { title: 'MekongTunnel — Expose localhost in one command' }
  },

  head: () => {
    const { frontMatter } = useConfig()
    const { asPath } = useRouter()

    const pageTitle = frontMatter.title
      ? `${frontMatter.title} · MekongTunnel`
      : 'MekongTunnel — Expose localhost in one command'
    const pageDescription =
      frontMatter.description ??
      'Open-source SSH tunnel server. Expose your local server to the internet instantly — no signup, no config. Built by Ing Muyleang.'
    const canonicalUrl = `${SITE_URL}${asPath}`

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="ssh tunnel, localhost tunnel, ngrok alternative, open source, go" />
        <meta name="author" content="Ing Muyleang" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MekongTunnel" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="MekongTunnel — Expose localhost in one command" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="canonical" href={canonicalUrl} />
      </>
    )
  },

  // Navbar — theme toggle + website link side by side
  navbar: {
    extraContent: (
      <div className="flex items-center gap-1">
        <VersionSwitcher />
        <ThemeToggle />
        <a
          href={SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex h-9 items-center px-3 rounded-lg text-sm font-medium
                     text-gray-600 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-white
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     border border-transparent hover:border-gray-200 dark:hover:border-gray-700
                     transition-all duration-150"
        >
          mekongtunnel.dev ↗
        </a>
      </div>
    ),
  },

  // Sidebar
  sidebar: {
    titleComponent({ title, type }) {
      const { asPath } = useRouter()
      const [mounted, setMounted] = React.useState(false)
      React.useEffect(() => { setMounted(true) }, [])

      // Only hide on client to avoid SSR hydration mismatch
      if (mounted && VERSIONS.some(v => v.id === title)) {
        const activeId =
          VERSIONS.find(v => asPath.startsWith(`/docs/${v.id}/`) || asPath === `/docs/${v.id}`)?.id
          ?? LATEST_VERSION
        if (title !== activeId) {
          return <HiddenVersionFolder />
        }
      }

      if (type === 'separator') {
        return (
          <span className="nx-cursor-default nx-flex nx-items-center nx-gap-2">
            {title}
          </span>
        )
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: Infinity,
    toggleButton: true,
  },

  // Table of contents
  toc: {
    backToTop: true,
    title: 'On this page',
  },

  search: {
    component: DocsSearch,
    placeholder: 'Search docs...',
  },

  feedback: {
    content: 'Raise issue',
    labels: 'feedback',
    useLink() {
      const config = useConfig()
      const { asPath } = useRouter()
      const pageTitle =
        typeof config.title === 'string'
          ? config.title
          : typeof config.frontMatter?.title === 'string'
            ? config.frontMatter.title
            : 'Documentation page'

      return buildDocsIssueUrl({
        title: `Docs feedback: ${pageTitle}`,
        labels: config.feedback.labels,
        pagePath: asPath,
        pageTitle,
      })
    },
  },

  editLink: {
    text: 'Suggest edits',
  },

  footer: {
    text: (
      <div className="nx-flex nx-flex-col sm:nx-flex-row nx-items-start sm:nx-items-center nx-justify-between nx-gap-4 nx-w-full">
        <span className="nx-text-sm nx-text-gray-500 dark:nx-text-gray-400">
          © {new Date().getFullYear()} MekongTunnel. All rights reserved.
        </span>
        <div className="nx-flex nx-items-center nx-gap-4 nx-text-sm nx-text-gray-500 dark:nx-text-gray-400">
          <a href="/docs/terms" className="hover:nx-text-gray-900 dark:hover:nx-text-white">Terms</a>
          <a href="/docs/privacy" className="hover:nx-text-gray-900 dark:hover:nx-text-white">Privacy</a>
          <a href={SITE_URL} className="hover:nx-text-gray-900 dark:hover:nx-text-white">Website</a>
        </div>
      </div>
    ),
  },

  darkMode: true,
  primaryHue: 221,
  primarySaturation: 83,
}

export default config
