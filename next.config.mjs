import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
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
    ]
  },
})
