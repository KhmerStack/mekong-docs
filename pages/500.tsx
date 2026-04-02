import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { ServerCrash, ArrowLeft, RefreshCw } from 'lucide-react'

export default function ServerError() {
  return (
    <>
      <Head>
        <title>500 – Server Error · MekongTunnel</title>
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
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50">
            <ServerCrash className="h-10 w-10 text-red-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-red-500 mb-2">
            500
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Server error</h1>
          <p className="text-muted-foreground max-w-sm mb-8">
            Something went wrong on our end. Please try refreshing the page or come back in a moment.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh page
            </button>
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            If this keeps happening, please{' '}
            <a
              href="https://github.com/mekongtunnel/docs/issues/new"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              open an issue
            </a>
            .
          </p>
        </main>
      </div>
    </>
  )
}
