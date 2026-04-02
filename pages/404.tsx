import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { FileQuestion, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 – Page Not Found · MekongTunnel</title>
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
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
            404
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Page not found</h1>
          <p className="text-muted-foreground max-w-sm mb-8">
            Sorry, we couldn&apos;t find the page you were looking for. It may have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="h-4 w-4" />
              Browse Docs
            </Link>
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-12 border-t border-border pt-8 w-full max-w-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Popular pages
            </p>
            <nav className="flex flex-col gap-2 text-sm">
              {[
                { href: '/docs/getting-started', label: 'Getting Started' },
                { href: '/docs/installation', label: 'Installation' },
                { href: '/docs/cli-reference', label: 'CLI Reference' },
                { href: '/docs/self-hosting', label: 'Self-Hosting' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label} →
                </Link>
              ))}
            </nav>
          </div>
        </main>
      </div>
    </>
  )
}
