# MekongTunnel Docs

Documentation site for [MekongTunnel](https://mekongtunnel.dev) — built with [Nextra](https://nextra.site) + Next.js.

---

## Versioning

Docs are versioned. Each version lives in its own folder under `pages/docs/`.

```
pages/docs/
  v1/          ← current version (beta)
    _meta.json
    getting-started.mdx
    ...
    node/
    python/
  v2/          ← future version (add here)
    ...
```

### Adding a new version

**Step 1** — Copy the previous version's folder:

```bash
cp -r pages/docs/v1 pages/docs/v2
```

**Step 2** — Edit the new pages inside `pages/docs/v2/`.

**Step 3** — Register it in `lib/versions.ts` (add to the FRONT of the array):

```ts
export const VERSIONS = [
  { id: 'v2', label: 'v2', beta: false },
  { id: 'v2', label: 'v2', beta: false },  // ← new latest
  { id: 'v1', label: 'v1', beta: false },
] satisfies VersionEntry[]
```

That's it. The version switcher in the navbar and the `/docs` redirect both update automatically.

### Version badge options

| Field | Effect |
|---|---|
| `beta: true` | Shows an amber **beta** badge |
| `beta: false` (or omitted) | Shows a green **latest** badge on the first entry |

---

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```
