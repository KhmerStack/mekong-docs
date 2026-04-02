import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import type { NextPageContext } from 'next'

interface ErrorPageProps {
  statusCode?: number
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const is404 = statusCode === 404
  const title = is404 ? 'Page not found' : 'Something went wrong'
  const description = is404
    ? "We couldn't find the page you were looking for."
    : `An unexpected error occurred${statusCode ? ` (${statusCode})` : ''}. Please try again.`

  return (
    <>
      <Head>
        <title>{`${statusCode ?? 'Error'} – ${title} · MekongTunnel`}</title>
      </Head>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Navbar */}
        <header className="border-b border-border px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <Image src="/MekongNoBG.png" alt="MekongTunnel" width={32} height={32} />
            <span className="text-base">MekongTunnel</span>
          </Link>
        </header>

        {/* Body */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/50">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
          </div>

          {statusCode && (
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500 mb-2">
              {statusCode}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
          <p className="text-muted-foreground max-w-sm mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}
