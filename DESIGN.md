# DESIGN.md — Steam Dark Profile

Visual contract for this landing page. Follow it when changing UI.

## Intent

- **Subject:** personal profile hub (identity → work → links).
- **Audience:** recruiters, collaborators, curious visitors.
- **Job of the page:** one dark “storefront” that feels like Steam’s store/profile — not a generic portfolio template.
- **Signature:** full-bleed banner hero + Steam-style project **capsules** on a library shelf.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| `--bg-deep` | `#0e1419` | Page depth / footer bleed |
| `--bg-header` | `#171a21` | Top bar, footer |
| `--bg-store` | `#1b2838` | Store midtone |
| `--bg-panel` | `#16202d` | Section panels |
| `--bg-capsule` | `#233447` | Project rows |
| `--accent` | `#66c0f4` | Links, marks, focus accents |
| `--accent-hot` | `#1a9fff` | Primary CTA gradient end |
| `--accent-green` | `#a4d007` | Status / “active” labels |
| `--text` | `#c7d5e0` | Body |
| `--text-muted` | `#8f98a0` | Secondary |
| `--text-bright` | `#ffffff` | Titles |

Do **not** introduce purple/indigo gradients, cream paper backgrounds, or soft “AI portfolio” pastels. Stay in Steam’s blue-gray + cyan accent family.

## Typography

| Role | Face | Notes |
|------|------|--------|
| Display | **Exo 2** | Titles, brand, buttons — uppercase / tracked |
| Body | **Source Sans 3** | Paragraphs, blurbs |

Avoid Inter / Roboto / system-only stacks for primary UI.

## Layout

```
┌─────────────────────────────────────┐
│ sticky topbar (brand · nav · status)│
├─────────────────────────────────────┤
│ FULL-BLEED BANNER                   │
│  avatar + name + tagline + CTAs     │  ← first viewport: brand-first
├─────────────────────────────────────┤
│ panel: О себе                       │
│ panel: Стек (focus + tech chips)    │
│ panel: Проекты (capsule shelf)      │
│ panel: Интересы (chips + Letterboxd + Backloggd)│
│ panel: Ссылки (Linktree hub + grid)            │
│ panel: Комментарии (шуточная форма)            │
├─────────────────────────────────────┤
│ footer                              │
└─────────────────────────────────────┘
```

### Rules (hard)

- First viewport = brand + one role line + tagline + CTA group + dominant banner. No stats strips, no card grid in the hero.
- Panels may use subtle borders/backgrounds (Steam store chrome). Project capsules are interactive containers — that is intentional.
- One job per section: About / Stack / Projects / Interests / Links / Comments (joke).
- Max content width ~`1100px`, aligned with Steam’s readable store column.

## Motion

Ship only purposeful motion:

1. Banner subtle scale-in on load.
2. Hero identity rise-in.
3. Hero tech balls: fall-in with physics, drag & collide (skipped / static under `prefers-reduced-motion`).
4. Section / capsule reveal on scroll (`IntersectionObserver`).
5. Avatar speech bubble typewriter after prolonged physics play (nudge at 20, join-in + avatar spawn at 30).
6. Language switch: drop a flag square into the hero physics layer (static placement under `prefers-reduced-motion`).
7. Stack “favorite library” card: scroll proximity drives a one-way 3D flip from React → Vue (locked to Vue under `prefers-reduced-motion`).
8. Interests: portrait posters lift on hover.

Respect `prefers-reduced-motion: reduce` (already wired in CSS/JS).

## Imagery

- Banner: wide atmospheric art (edge-to-edge), not an inset card.
- Avatar: square, framed like a Steam profile portrait.
- Prefer real photos/art over abstract filler once available.

## Content tone

- Direct, first-person or plain third-person — no buzzword soup.
- Project blurbs: what it is + why it exists, plus a few concrete highlights.
- Capsules show platform mark, kind, status, tags, and a GitHub CTA.
- Link labels: recognizable product names (GitHub, Telegram), not “Click here”.

## Accessibility

- Skip link, focus-visible rings, semantic landmarks.
- Sufficient contrast on cyan-on-dark; don’t lighten text into mud.
- Decorative SVG/CSS must not block keyboard or screen readers.
