# Aditya Garg — Portfolio v2

Personal portfolio website for **Aditya Garg**, Senior Frontend Developer (SDE2) with 5+ years of experience. Built with a cinematic scroll-driven hero, glassmorphism design, and horizontal drag carousels.

**Live:** https://aditya3198.github.io *(updating soon)*

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Vite + React + TypeScript | App scaffold |
| GSAP + ScrollTrigger | Hero pinning & scroll-driven reveals |
| Framer Motion | Section animations (whileInView) |
| @studio-freight/lenis | Smooth inertial scroll |

---

## Features

- **Cinematic hero** — sticky-pinned, scroll-scrubbed text reveal with staggered character animations
- **Pure CSS background** — dot grid, animated glow blobs, scan line (no Three.js)
- **Custom typed hook** — cycles through roles without any library
- **Skills marquee** — infinite scroll rows + glass highlight cards
- **Horizontal drag carousels** — Experience and Projects sections (mouse + touch)
- **Glassmorphism UI** — dark theme with cyan/green accent gradients
- **Single page** — anchor scroll, no React Router

---

## Getting Started

```bash
npm install
npm run dev
```

```bash
npm run build    # production build
npm run preview  # preview build locally
```

---

## Project Structure

```
src/
├── App.tsx
├── components/
│   ├── Nav/
│   ├── Hero/          # Hero.tsx, HeroBackground.tsx, HeroContent.tsx, StatCards.tsx
│   ├── Skills/
│   ├── Experience/
│   ├── Projects/
│   ├── Contact/
│   └── Footer/
├── hooks/             # useLenis, useTyped, useSplitText
├── data/content.ts    # all copy, experience, projects data
└── styles/            # SCSS tokens, mixins, global styles
```
