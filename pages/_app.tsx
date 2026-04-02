import type { AppProps } from 'next/app'
import { Kantumruy_Pro } from 'next/font/google'
import { OfflineBanner } from '@/components/OfflineBanner'
import '@/styles/globals.css'

const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kantumruy',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${kantumruyPro.variable} font-sans`}>
      <Component {...pageProps} />
      <OfflineBanner />
    </main>
  )
}
