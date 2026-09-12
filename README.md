# Nexus

Product workspace for issues, knowledge, and planning — a lightweight Linear + Notion surface.

The repo is a **single Next.js app** (no monorepo). The marketing landing page is in place; the workspace product (Kanban, list, cycles) comes next.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui, Magic UI
- Motion, next-themes
- pnpm

## Setup

Requires Node 20+.

```bash
pnpm install
pnpm dev
```

App: [http://localhost:3000](http://localhost:3000)

```bash
pnpm build
pnpm typecheck
pnpm lint
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

## Add UI

shadcn:

```bash
pnpm dlx shadcn@latest add accordion
```

Magic UI:

```bash
pnpm dlx shadcn@latest add @magicui/marquee
```

Import from `@/components/ui`.

## Layout

```
app/                    routes, metadata, OG image
src/components/brand    NEXUS wordmark (SVG)
src/components/landing  marketing page
src/components/ui       shadcn + Magic UI
src/styles              Apple-derived tokens
public/brand            OG image, favicon
```


