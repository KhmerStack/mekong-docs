# MekongTunnel Docs — Release Plan
**Target:** Sunday, April 5, 2026

---

## Milestones

- [ ] **Milestone 1 — Content Complete**
  - [ ] Getting Started / Installation final
  - [ ] CLI Reference final
  - [ ] All framework guides complete (Node.js + Python)
  - [ ] Advanced section complete (Auth, Stats API, Self-Hosting, Security, Cookies)
  - [ ] Legal pages final (FAQ, Terms, Privacy)

- [ ] **Milestone 2 — Site Ready for Release**
  - [ ] Navigation (`_meta.json`) matches all pages
  - [ ] Site builds without errors (`next build`)
  - [ ] All internal links resolve correctly
  - [ ] Mobile layout reviewed
  - [ ] Deployment configured + custom domain live

---

## Implementation

- [ ] **Site Structure & Navigation**
  - [ ] Finalize `_meta.json` sidebar order and labels
  - [ ] Verify `node/_meta.json` and `python/_meta.json`

- [ ] **Components & UI**
  - [ ] `MDXComponents.tsx` — all custom components render
  - [ ] `Callout.tsx` — info / warning / danger variants
  - [ ] `FrameworkCard.tsx` — homepage grid
  - [ ] Dark mode / theme toggle works

- [ ] **Build & Deployment**
  - [ ] `next build` — zero errors
  - [ ] Connect repo to deployment provider (Vercel / self-hosted)
  - [ ] Configure custom domain (`docs.mekongtunnel.dev`)
  - [ ] Add `sitemap.xml` / `robots.txt`
  - [ ] Test production build end-to-end

---

## Documentation

- [ ] **Core Pages**
  - [ ] `getting-started.mdx`
  - [ ] `installation.mdx`
  - [ ] `how-it-works.mdx`
  - [ ] `configuration.mdx`
  - [ ] `cli-reference.mdx`
  - [ ] `npm-cli.mdx`
  - [ ] `vscode-extension.mdx`

- [ ] **Node.js Guides**
  - [ ] Express
  - [ ] Next.js
  - [ ] Vite
  - [ ] Remix
  - [ ] SvelteKit
  - [ ] Nuxt
  - [ ] Astro

- [ ] **Python Guides**
  - [ ] Overview (`python/index.mdx`)
  - [ ] FastAPI
  - [ ] Flask
  - [ ] Django
  - [ ] Starlette
  - [ ] Uvicorn

- [ ] **Advanced**
  - [ ] `authentication.mdx`
  - [ ] `stats-api.mdx`
  - [ ] `self-hosting.mdx`
  - [ ] `security.mdx`
  - [ ] `cookies.mdx`

- [ ] **Legal**
  - [ ] `faq.mdx`
  - [ ] `terms.mdx`
  - [ ] `privacy.mdx`

---

## Pre-Release Checklist

- [ ] All pages reviewed for typos and accuracy
- [ ] Code examples tested and working
- [ ] All links (internal + external) verified
- [ ] OG / meta tags set on key pages
- [ ] Announce release
