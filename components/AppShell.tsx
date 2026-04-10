import type { AppProps } from 'next/app'
import { Kantumruy_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { OfflineBanner } from '@/components/OfflineBanner'
import Script from 'next/script'

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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z54V293HG9"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z54V293HG9');
        `}
      </Script>
    </main>
  )
}
