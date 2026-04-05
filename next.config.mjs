import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  flexsearch: true,
  readingTime: true,
})

/**
 * When adding a new latest version, update LATEST_VERSION below
 * to match the first entry in lib/versions.ts
 */
const LATEST_VERSION = 'v1.0.0'

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      // ── Old flat docs URLs → versioned ──────────────────────────────
      // Matches /docs/<page> but NOT /docs/v1/... or /docs/v1.0.0/...
      // The negative lookahead (?!v\d) excludes already-versioned paths.
      {
        source: '/docs/:slug((?!v\\d)[\\w-]+)',
        destination: `/docs/${LATEST_VERSION}/:slug`,
        permanent: true,
      },
      // Nested framework pages: /docs/node/express → /docs/v1.0.0/node/express
      {
        source: '/docs/:section(node|python)/:slug',
        destination: `/docs/${LATEST_VERSION}/:section/:slug`,
        permanent: true,
      },

      // ── Legacy slug formats ──────────────────────────────────────────
      {
        source: '/docs/node-:slug',
        destination: `/docs/${LATEST_VERSION}/node/:slug`,
        permanent: true,
      },
      {
        source: '/docs/python-:slug',
        destination: `/docs/${LATEST_VERSION}/python/:slug`,
        permanent: true,
      },

      // ── Old index redirects ──────────────────────────────────────────
      {
        source: '/docs/index.html',
        destination: `/docs/${LATEST_VERSION}/getting-started`,
        permanent: true,
      },
    ]
  },
})
