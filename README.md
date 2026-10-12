# Afan Baihaqi Portfolio

A React, Vite, and TypeScript single page portfolio using React Router.

## Install and run

```bash
npm install
npm run dev
npm run check
npm test
npm run build
npm run preview
```

## Source structure

- `src/pages/` — Home, About, Projects, Tech, and Contact route pages.
- `src/components/` — shared and section-specific UI components.
- `src/data/site.ts` — single source of truth for personal and global details.
- `src/data/projects.ts` — project cards, screenshots, technologies, and links.
- `src/data/certificates.ts` — certificate details and verification links.
- `src/data/` — remaining structured content, including navigation, home cards, tech stack, and tools.
- `src/styles/index.css` — all site styling.
- `public/assets/` — existing images, fonts, SVGs, CV, and screenshots.

## Edit content

Update personal information in `src/data/site.ts`. Add or edit a project in `src/data/projects.ts` and place any new images under `public/assets/`. Add or edit certificate records in `src/data/certificates.ts`. Update visual styles in `src/styles/index.css`.

Page content is directly editable in its `src/pages/*.tsx` file. Shared components such as `Navbar`, `MobileMenu`, `Footer`, `ChapterHeader`, `NextChapters`, and the project and certificate components keep repeated UI consistent. `App.tsx` defines routes and the shared page shell; `usePortfolioInteractions` initializes existing interactions after each route change.

## Tech: development workflow

The Tech hero and intro retain their existing content. The former stack diagram is replaced by a procedural development machine:

`IDEA → PLANNING → DESIGN → FRONTEND → BACKEND → TEST → DEPLOY → LIVE PRODUCT`

- `src/data/developmentFlow.ts` remains the unmodified source of every stage name, action, technology, tool, output and tagline.
- `DevelopmentFlow3D.tsx` owns React selection, playback controls, accessible stage buttons, responsive mode and loading/WebGL fallback UI.
- `developmentScene.ts` owns the Three.js lifecycle, reusable procedural geometry, station mechanisms, conveyors, product artifact, picking, cameras and rendering.
- `DevelopmentFlowOverlay.tsx` presents the selected data record as a keyboard-accessible, non-modal information panel. Escape and Close return focus to its stage button.
- All styles remain under `/* TECH — DEVELOPMENT FLOW 3D */` in `src/styles/index.css`.

### Controls and behavior

Use **Run journey** to follow the build to its live output, **Pause journey** to stop, and **Replay journey** to restart after completion. Select a machine station or numbered HTML button to inspect its details. **Overview** and **Top view** restore a full view without reloading. Desktop dragging is constrained; panning and wheel zoom are disabled so the page keeps its normal scrolling behavior.

On small screens the same sequence is rebuilt as a two-column, four-row serpentine machine, with a full-width bottom detail panel. Reduced motion disables continuous mechanical/artifact movement and replaces automatic playback with **Next stage**. Camera changes become immediate. Offscreen and hidden-tab rendering pauses. WebGL failure leaves all seven HTML stage controls and information panels available.

The scene lazily loads on the Tech route, caps pixel ratio (1.75 desktop / 1.35 mobile), shares geometry/materials and disables mobile shadows. Cleanup disposes controls, textures, materials, geometries, renderer/context, observers, listeners and scheduled frames. No external models, images or 3D services are needed.

### Dependencies and checks

Three.js was already installed. Only `@types/three` was added as a development dependency for strict typing; no new runtime library was added.

```bash
npm ci
npm run check
npm test
npm run build
```

The workflow tests verify server-rendered accessible stage order, preservation of each record in the React overlay, and the tools/actions display for stages without technologies. These tests do not exercise WebGL, raycasting, camera animation or visual layout. Manual browser checks at 1440×900, 1024×768 and 390×844 remain necessary for visual sign-off.

## Apple hello preloader

The home intro now uses the exact English SVG lettering supplied in the reference,
animated with Motion. No handwriting font download is needed. The old percentage
counter, progress bar, and imperative loader timer have been removed.

- Component: `src/components/ui/apple-hello-effect.tsx`
- Integration / exit timing: `src/components/layout/Preloader.tsx`
- Background / responsive sizing: `src/styles/index.css` (`PRELOADER`)
- `speed={1}` writes in 3.5 seconds; smaller values write faster.
- Reduced motion shows the complete word and dismisses the intro promptly.
- Intro runs on the home page mount; inner pages remain directly accessible.

### Setup

```sh
npm install
npm run dev
npm run build
```

TypeScript was already present. Motion, Tailwind CSS (Vite plugin), clsx, and
tailwind-merge are now installed and recorded in the lockfile. `@/` resolves to
`src/`. `components.json` configures the shadcn-compatible location
`src/components/ui` (the project's source-root equivalent of `/components/ui`).
This keeps reusable UI components separate from page/layout components and lets
future shadcn additions resolve imports consistently. No shadcn init is required.
Tailwind theme and utilities are enabled without Preflight to preserve the
portfolio's existing CSS. Optional future components: `npx shadcn@latest add button`.

The uploaded archive was missing `scripts/clean-dist.mjs`, referenced by prebuild;
that script is restored so `npm run build` works.

Personalized intro: “Welcome to my space” appears above hello; name and role
use `src/data/site.ts` and fade in as handwriting finishes. The finished word
holds for 1.1 seconds before the exit transition.
