# Vida Built — Marketing Website

## Company
- **Legal name:** PVM LLC
- **Brand name:** Vida Built
- **Tagline:** Built with life in it
- **Industry:** Cement / Concrete / Remodeling / Construction

## Hosting & Infrastructure
- **Host:** Cloudflare Pages (free tier) — auto-deploys from `main` branch
- **GitHub repo:** https://github.com/willvv/vida-built
- **Cloudflare account:** willvv@gmail.com
- **Account ID:** 6d4a109471d33214904861ba46aa5e35
- **Cloudflare project name:** vida-built
- **Server-side processing:** Cloudflare Workers (if ever needed)

## Tech Stack
- **Frontend:** Static HTML + CSS + vanilla JS (no build step, no framework)
- **Fonts:** Google Fonts CDN
- **Icons:** Heroicons or Lucide SVG inline (no emoji icons)
- **Images:** WebP format preferred (with PNG fallback), lazy-loaded
- **Deployment:** `git push origin main` → Cloudflare auto-deploys

## Git Workflow
1. Work on a feature branch (e.g., `feature/contact-section`)
2. Do NOT push until user explicitly says to
3. When told to push: push to `main` — Cloudflare auto-deploys

## Brand Colors
| Name | Hex | CSS Variable | Role |
|------|-----|--------------|------|
| Tropical Green | `#1D9E75` | `--color-green` | Primary / CTAs |
| Charcoal | `#2C2C2A` | `--color-charcoal` | Text / Dark backgrounds |
| Warm Amber | `#FAC775` | `--color-amber` | Accent / Highlights |
| Warm Cream | `#F1EFE8` | `--color-cream` | Page background / Light surfaces |

**Design intent:** Distinctive on job sites and truck wraps. Subtle warmth without being loud. Not tropical-loud — professional and grounded.

## Typography
- **Heading font:** Montserrat (700, 600) — strong, professional
- **Body font:** Inter (400, 500) — clean, readable
- **Base size:** 16px (never below 16px on mobile)
- **Line-height:** 1.6 body, 1.2 headings
- **Scale:** 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64px

## Design System
- **Style:** Minimalist with warm organic touches — not cold/corporate
- **Pattern:** Hero-centric → Features → Social Proof → CTA
- **Spacing:** 8px grid (8/16/24/32/48/64/96px)
- **Border radius:** 4px (sharp/professional, not bubbly)
- **Shadows:** Subtle — `0 2px 8px rgba(44,44,42,0.08)`
- **Transitions:** 200ms ease-out
- **Icons:** SVG only (Heroicons/Lucide), stroke-width 1.5

## UX Rules
- Mobile-first, breakpoints: 375 / 768 / 1024 / 1440px
- Contrast: minimum 4.5:1 for all body text
- Touch targets: minimum 44×44px
- No horizontal scroll on mobile
- All images: WebP + width/height declared (prevents CLS)
- Focus rings: visible, 2px, green (#1D9E75)
- prefers-reduced-motion: respected for all animations

## Site Sections (Planned)
1. **Hero** — Tagline, headline, CTA button, hero image/video
2. **Services** — Cement work, remodeling, concrete, custom builds
3. **Gallery** — Before/after project photos
4. **Why Vida Built** — Differentiators (quality, reliability, warranty)
5. **Testimonials** — Client reviews with photos
6. **Service Areas** — Map or list of locations served
7. **Contact / Quote Request** — Form (Cloudflare Worker backend if needed)
8. **Footer** — Logo, links, contact info, social media

## File Structure
```
vida-built/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles (CSS custom properties + utility classes)
├── js/
│   └── main.js         # Minimal JS (nav toggle, scroll behavior)
├── img/                # WebP images (optimized)
├── favicon.ico
├── favicon.svg
├── site.webmanifest
├── .gitignore
├── CLAUDE.md           # This file
└── .secrets            # Local credentials (gitignored)
```

## Credentials Location
Credentials stored in `.secrets` (gitignored). Never commit.
- Cloudflare API key for deployments / Workers
- GitHub token for repo operations

## Best Practices for This Project
- Never use a JS framework (React, Vue, etc.) — pure HTML/CSS/JS only
- No npm, no build step, no package.json
- All CSS in `css/style.css` using CSS custom properties
- Keep HTML semantic: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- Images always include `alt` text, `width`, and `height` attributes
- Use `loading="lazy"` on all below-fold images
- Meta tags: Open Graph, Twitter Card, description, canonical URL
- HTTPS always (Cloudflare handles this)
- No jQuery, no Bootstrap — pure modern CSS (Grid, Flexbox, Custom Props)
