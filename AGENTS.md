# AGENTS.md

## Project Overview

SXSW Music 2026 Explorer — a React + TypeScript app for browsing SXSW 2026 music showcases. Built with Vite, Chakra UI, and Motion.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 8
- **UI:** Chakra UI v3
- **Animation:** Motion
- **Testing:** Vitest + React Testing Library + jsdom
- **Deployment:** GitHub Pages via GitHub Actions

## Project Structure

- `src/` — application source code
  - `components/` — React components
  - `data/` — data utilities and types
  - `lib/` — shared utilities
  - `test/` — test setup
- `public/artist-images/` — artist photo assets
- `sxsw-music-2026.json` — source data (artist info, venues, descriptions)
- `.github/workflows/deploy.yml` — GitHub Pages deployment workflow

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm test` — run tests
- `npm run test:watch` — run tests in watch mode

## Conventions

- Dark theme throughout (Chakra UI color mode)
- Use Chakra UI components and design tokens for all styling
- Use Motion for animations where appropriate
- Vite `base` is set dynamically for GitHub Pages (`/sxsw-2026/` in production)
- Artist data comes from `sxsw-music-2026.json`
- Test files co-located next to source files (e.g., `App.test.tsx`)

## Deployment

Deployed to GitHub Pages via the Actions workflow on push to `main`.

**Demo:** https://mountaindrawn.com/sxsw-2026/

The custom domain (`mountaindrawn.com`) is configured at the GitHub organization/user level. The repo is deployed as a project page under `/sxsw-2026/`.
