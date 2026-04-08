import type { AppProps } from 'next/app'
import { Kantumruy_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { OfflineBanner } from '@/components/OfflineBanner'

const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kantumruy',
  display: 'swap',
})

export default function AppShell({ Component, pageProps }: AppProps) {
  return (
    <main className={`${kantumruyPro.variable} font-sans`}>
      <Component {...pageProps} />
      <Analytics />
      <OfflineBanner />
    </main>
  )
}
