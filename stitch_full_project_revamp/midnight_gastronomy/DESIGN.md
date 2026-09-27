---
name: Midnight Gastronomy
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#e8bcb9'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#af8785'
  outline-variant: '#5e3f3d'
  surface-tint: '#ffb3af'
  primary: '#ffb3af'
  on-primary: '#68000e'
  primary-container: '#ff5356'
  on-primary-container: '#5c000b'
  inverse-primary: '#bf0022'
  secondary: '#ffb4ab'
  on-secondary: '#690004'
  secondary-container: '#931011'
  on-secondary-container: '#ff9f93'
  tertiary: '#ffb77a'
  on-tertiary: '#4c2700'
  tertiary-container: '#d37b20'
  on-tertiary-container: '#432100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#930018'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#900d0f'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a high-octane, nocturnal culinary experience tailored for modern food delivery. The interface combines deep, velvety obsidian backgrounds with vivid, high-energy crimson signatures. It targets dynamic urbanites and late-night foodies seeking fast, premium, and visually enticing dining experiences.

The visual direction merges refined modern minimalism with dark-mode tactile depth and atmospheric crimson radiance. High-contrast typography paired with fully-curved pill geometries yields a swift, fluid, and intuitive browsing experience that spotlights vibrant culinary imagery while keeping controls prominent and tactile.

## Colors

The palette leverages a stepped scale of deep warm-charcoals and pure dark pigments to construct architectural depth without harsh contrast lines:

- **Background Canvas (`#121214`):** The foundational substrate for the entire viewport.
- **Surface Level 1 (`#1A1A1E`):** Resting cards, inactive panels, and list groups.
- **Surface Level 2 (`#242429`):** Elevated overlays, bottom sheets, search inputs, and hovering cards.
- **Surface Level 3 (`#2C2C34`):** Popovers, active toggle chips, floating navigation bars, and active state indicators.
- **Primary Brand Accent (`#FF1E38`):** The signature vibrant crimson used for primary calls to action, badges, and focal interactive states. Emits an ambient low-spread glow when elevated.
- **Secondary Flame (`#FF6154`):** Supporting coral-red for promotions, discounts, and highlights.
- **Tertiary Saffron (`#FF9F43`):** Warm amber reserved for culinary ratings, prep timers, and chef special flags.
- **Text & Foreground Hierarchy:**
  - Primary text: `#FFFFFF` (pure white, maximum contrast)
  - Secondary text: `#A1A1AA` (zinc-400, muted details, descriptions, subtitles)
  - Tertiary / Disabled text: `#71717A` (zinc-500, metadata, timestamps, non-interactive glyphs)

## Typography

Plus Jakarta Sans is implemented globally across display, body, and label roles. Its geometric roundness reinforces the pill-shaped visual motif, while high x-height and open counters maintain legibility on dark surfaces.

- **Weight System:** Keep editorial copy strictly at 400 for maximum clarity against dark grounds. Use 600 for item names and card titles to provide authoritative scannability. Reserve 700 and 800 for marquee brand messages, pricing callouts, and promotions.
- **Letter Spacing:** Apply tight negative letter spacing to titles larger than 24px to impart a sleek, editorial feel. Use subtle positive tracking on `label-md` and `label-sm` to maintain clarity in badges and dietary micro-tags.

## Layout & Spacing

The layout is built on an adaptive fluid-grid framework optimized for one-handed handheld touch interaction and responsive multi-column layouts on larger screens:

- **Mobile (< 768px):** 4-column layout with `1rem` outer margins and `1rem` gutters. Horizontal carousels snap dynamically past viewport edges with edge-to-edge content bleed.
- **Tablet (768px - 1024px):** 8-column layout with `2rem` outer margins and `1rem` gutters. Menus split into dual-column card grids.
- **Desktop (> 1024px):** 12-column layout capped at a maximum width of `1280px`, centered with `3rem` margins and `1.5rem` gutters. Sticky sidebars host delivery address switchers and dynamic cart drawers.

Content relies on consistent spacing multiples (4px/8px rhythm). Dense food items utilize `space-sm` for element groupings, while macro sections apply `space-xl` to let hero photography breathe.

## Elevation & Depth

Visual depth is achieved through layered dark tone transitions, subtle border definition, and selective neon light diffusion rather than heavy dark shadows:

- **Level 0 (Canvas):** Pure resting ground (`#121214`).
- **Level 1 (Surface Cards):** `#1A1A1E` with a hairline edge border (`1px solid rgba(255, 255, 255, 0.06)`).
- **Level 2 (Active Panels / Trays):** `#242429` accompanied by soft ambient drop shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
- **Level 3 (Modals / Floating Bottom Sheets):** `#2C2C34` backed by a 12px blur backdrop layer (`backdrop-filter: blur(12px)`) and a `1px solid rgba(255, 255, 255, 0.1)` perimeter rim.
- **Crimson Luminescence (Accent Elevation):** Primary action triggers and active delivery progress points emit a distinct brand glow: `box-shadow: 0 4px 20px 0 rgba(255, 30, 56, 0.35)`.

## Shapes

The design system embraces a fully rounded, organic pill geometry across interactive controls and content boundaries:

- **Buttons & Pills:** All standard buttons, input fields, tags, and chips feature maximum radius (`rounded-full` / 9999px), creating smooth, frictionless touch targets.
- **Cards & Image Containers:** Structural cards adopt `2rem` corner radiuses (`rounded-lg`), softening the interface while complementing the circular pill elements within.
- **Modals & Bottom Drawers:** Sheet headers and sheet corners utilize `2.5rem` to `3rem` rounded tops for smooth pull-to-refresh and sheet-drag interactions.

## Components

### Buttons
- **Primary:** Full pill radius, solid `#FF1E38` background, `#FFFFFF` bold typography. Features an interactive crimson drop glow (`0 4px 20px rgba(255, 30, 56, 0.35)`). Active state applies a scale transform (`0.98`) with intensified glow.
- **Secondary:** Transparent fill with `1.5px solid #2C2C34`, `#FFFFFF` label text. On hover/press, fills with `#1A1A1E` and shifts border to `rgba(255, 255, 255, 0.15)`.
- **Icon / Floating Action:** Circular pill (`rounded-full`), `#242429` surface, centered white glyph, paired with Level 2 elevation.

### Chips & Filter Pills
- **Inactive:** `#1A1A1E` background, `#A1A1AA` text, surrounded by a faint 1px line of `rgba(255, 255, 255, 0.05)`.
- **Active:** Deep `#FF1E38` tint with bright `#FFFFFF` text, paired with a subtle inner glow. Pill-shaped padding: `8px 16px`.

### Input Fields
- **Search & Text Inputs:** Pill-shaped capsules (`rounded-full`), `#1A1A1E` background, `1px solid #242429`. Focused state shifts border directly to `#FF1E38` with an ambient glow (`box-shadow: 0 0 0 3px rgba(255, 30, 56, 0.2)`). Text color is `#FFFFFF` with `#71717A` placeholder styling.

### Cards (Menu Items & Restaurant Tiles)
- **Dish Card:** Built on `#1A1A1E` with `2rem` rounded corners and a `1px solid rgba(255, 255, 255, 0.05)` border. Contains an edge-to-edge top image container, high-contrast title in `#FFFFFF`, ingredients in `#A1A1AA`, and price formatted prominently in `headline-sm`. Includes a floating pill counter or `+` quick-add button in the bottom right corner.
- **Promo Card:** Utilizes a subtle diagonal gradient from `#242429` to `#1A1A1E` with a bright `#FF1E38` accent border tag denoting flash sales or delivery discounts.

### Checkboxes & Radio Buttons
- **Radio / Checkbox Shell:** Pill-like circular outlines (`rounded-full`), `#242429` background with a `1.5px solid #71717A` rim.
- **Selected State:** Shifts background to `#FF1E38` with a crisp white checkmark or inner dot, surrounded by a crimson glow halo.

### Application-Specific Components
- **Cart Float Bar:** Floating pill-shaped dock anchored at the bottom viewport: `#242429` surface with `backdrop-filter: blur(16px)`, `1px solid rgba(255, 255, 255, 0.1)`. Houses item counter badge in `#FF1E38`, total price in bold `#FFFFFF`, and a nested crimson "Checkout" button.
- **Live Order Tracker:** Linear horizontal tracker where completed stages connect via glowing crimson lines, while unfulfilled stages remain `#2C2C34`.