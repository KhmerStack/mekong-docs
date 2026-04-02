import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import Image from 'next/image'

const OG_IMAGE = 'https://onhyewqcjmwup3zj.public.blob.vercel-storage.com/opengraph.png'
const SITE_URL = 'https://mekongtunnel.dev'

const config: DocsThemeConfig = {
  logo: (
    <span className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <Image src="/MekongNoBG.png" alt="MekongTunnel" width={28} height={28} />
      <span>MekongTunnel</span>
    </span>
  ),

  project: {
    link: 'https://github.com/mekongtunnel',
  },

  docsRepositoryBase: 'https://github.com/mekongtunnel/docs/blob/main',

  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return { titleTemplate: '%s · MekongTunnel' }
    }
    return { title: 'MekongTunnel — Expose localhost in one command' }
  },

  head: () => {
    const { frontMatter, title } = useConfig()
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
        <meta
          name="keywords"
          content="ssh tunnel, localhost tunnel, ngrok alternative, open source, go"
        />
        <meta name="author" content="Ing Muyleang" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MekongTunnel" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="MekongTunnel — Expose localhost in one command"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />
      </>
    )
  },

  // Top navigation
  navbar: {
    extraContent: (
      <a
        href={SITE_URL}
        target="_blank"
        rel="noreferrer"
        className="hidden sm:inline-flex nx-text-sm nx-font-medium nx-text-gray-600 dark:nx-text-gray-400 hover:nx-text-gray-900 dark:hover:nx-text-white nx-transition-colors"
      >
        mekongtunnel.dev ↗
      </a>
    ),
  },

  // Sidebar
  sidebar: {
    titleComponent({ title, type }) {
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
    extraContent: (
      <div className="nx-mt-6 nx-pt-4 nx-border-t nx-border-gray-200 dark:nx-border-gray-700">
        <a
          href="https://github.com/mekongtunnel/docs/issues/new"
          target="_blank"
          rel="noreferrer"
          className="nx-text-xs nx-text-gray-500 dark:nx-text-gray-400 hover:nx-text-blue-500 dark:hover:nx-text-blue-400 nx-transition-colors"
        >
          Report a bug or request a feature ↗
        </a>
      </div>
    ),
  },

  // Search
  search: {
    placeholder: 'Search docs...',
  },

  // Feedback
  feedback: {
    content: 'Was this page helpful?',
    labels: 'feedback',
  },

  // Edit link
  editLink: {
    text: 'Edit this page on GitHub',
  },

  // Footer
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
