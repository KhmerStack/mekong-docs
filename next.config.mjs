import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  flexsearch: true,
  readingTime: true,
})

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docs/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docs/node-:slug',
        destination: '/docs/node/:slug',
        permanent: true,
      },
      {
        source: '/docs/python-:slug',
        destination: '/docs/python/:slug',
        permanent: true,
      },
    ]
  },
})
