---
name: Food Bites System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5e3f3d'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#936e6c'
  outline-variant: '#e8bcb9'
  surface-tint: '#bf0022'
  primary: '#bb0021'
  on-primary: '#ffffff'
  primary-container: '#ea002c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3af'
  secondary: '#895100'
  on-secondary: '#ffffff'
  secondary-container: '#fd9d1a'
  on-secondary-container: '#663b00'
  tertiary: '#00685f'
  on-tertiary: '#ffffff'
  tertiary-container: '#008379'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#930018'
  secondary-fixed: '#ffdcbc'
  secondary-fixed-dim: '#ffb86b'
  on-secondary-fixed: '#2c1700'
  on-secondary-fixed-variant: '#683d00'
  tertiary-fixed: '#70f8e8'
  tertiary-fixed-dim: '#4fdbcc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies an appetite-stimulating, high-energy, and frictionless food ordering experience. Built for quick decisions and high conversion, it couples vibrant culinary energy with seamless, intuitive utility.

### Emotional Tone & Character
- **Appetizing & Energetic:** Dominated by a bold crimson red that stimulates appetite and urgency without feeling aggressive.
- **Approachable & Inviting:** Fluid pill geometry, generous curves, and tactile cards create a warm, friendly mobile atmosphere.
- **Effortless Clarity:** Ultra-clean product presentations, large legible pricing, immediate ratings, and instant additive counters remove friction between discovery and checkout.

### Design Style Movement
A modern blend of **High-Contrast Bold UI** and **Soft Modern Tactility**. Crisp pure white cards sit on delicate neutral-tinted underlays, accented by warm ambient shadows, saturated red hero headers, and pill-shaped interactive anchors.

## Colors

The color architecture is built around conversion mechanics and sensory stimulation. The bold crimson primary drives attention to key interactions, supported by savory amber accents for ratings and offers.

### Role Breakdown
- **Primary (`#FF1E38`):** The signature brand crimson. Used for high-priority CTA buttons ("Add to Cart", "Check Out"), hero header canvases, active navigation states, and discount badges.
- **Secondary (`#FF9F1C`):** Warm golden-amber reserved for star ratings, estimated preparation tags, and loyalty markers.
- **Tertiary (`#2EC4B6`):** Vibrant mint teal used selectively for dietary certifications (vegan, gluten-free), live delivery tracking pulses, and positive status states.
- **Neutral Core (`#121212`):** Near-black for razor-sharp typography hierarchy. Paired with soft graphite shades (`#6B7280`) for secondary ingredients and supporting metadata.
- **Surface Palette:** Pure white (`#FFFFFF`) for elevated cards, modal drawers, and segment pills, layered over an appetizing soft warm canvas tint (`#FBF9F9`).

## Typography

The type system is powered entirely by **Plus Jakarta Sans**, offering geometric clarity, contemporary warmth, and wide legibility across high-density mobile menus.

### Typographic Hierarchy
- **Brand Titles & Key Screen Headers:** Set in `headline-xl` and `headline-lg` with an extra-bold weight (`800`/`700`). Creates immediate clarity atop high-energy red surfaces or white card headers.
- **Product & Merchant Titles:** Use `headline-sm` with tight vertical metrics (`24px`) to preserve line efficiency in dual-column or stacked card lists.
- **Ingredient & Sub-details:** Formatted with `body-md` in regular weight (`400`) and a subdued carbon tone to maintain high readability without competing with item pricing.
- **Numerical Pricing & Action Badges:** Set in `label-lg` and `label-sm` with heavy weights (`700`), ensuring rapid scannability during cart totals and promotional triggers.

## Layout & Spacing

A mobile-first fluid layout optimized for single-thumb navigation, rapid vertical scanning, and natural top-to-bottom checkout flow.

### Grid & Density Rules
- **Canvas Margins:** Fixed at `1.25rem` (`20px`) for standard mobile viewports, tapering to `1rem` on narrow screens.
- **Vertical Rhythm:** 4px base increment. Card lists preserve an active vertical separation of `space-md` (`16px`) to distinguish discrete touch targets.
- **Category Carousels:** Edge-to-edge bleed layouts using `gutter-sm` between circular culinary categories, aligned with the outer page margin at their starting offset.
- **Sticky Bottom Action Zones:** Persistent bottom CTA bars pad their interiors by `space-lg` (`24px`) horizontally and float safely above device home indicators.

## Elevation & Depth

Visual hierarchy leverages crisp surface separation through soft warm ambient shadows and sheet layering rather than harsh borders.

### Elevation Hierarchy
- **Level 0 (Backdrop Base):** Soft off-white canvas `#FBF9F9` providing warmth beneath product imagery.
- **Level 1 (Menu Cards & Chips):** Pure white `#FFFFFF` cards elevated with subtle, warm ambient shadows: `0px 4px 16px rgba(0, 0, 0, 0.05)`.
- **Level 2 (Floating Cart / Quantity Selectors):** Floating bottom navigation and quantity controls elevated at `0px 8px 24px rgba(0, 0, 0, 0.08)`.
- **Level 3 (Product Detail Sheets & Modals):** Top-rounded sheet containers sliding over the canvas, accented by an ambient shadow `0px -8px 32px rgba(255, 30, 56, 0.08)`.
- **Level 4 (Primary Action Buttons):** Filled crimson buttons utilize a warm glow shadow: `0px 8px 20px rgba(255, 30, 56, 0.28)` for prominent visual hierarchy.

## Shapes

The design system relies on friendly, organic pill shapes and generously rounded rectangular cards to produce an approachable culinary aesthetic.

### Geometry Specifications
- **Pill Geometry (Buttons, Search, Badges):** Standard action buttons, pill filters, discount tags, and top search fields use total circular radii (`9999px`), giving them a tactile, buttoned-down feel.
- **Product & Container Cards:** Content cards and cart summaries feature `rounded-lg` (`2rem` / `32px` on bottom sheets, `1.25rem` / `20px` on menu cards).
- **Food Imagery & Circular Highlights:** Category shortcuts use 1:1 circular masks (`50%` radius) bordered with soft white elevation rims.

## Components

### Primary Action Buttons
- **Style:** Full-width or inline pill forms (`border-radius: 9999px`) in solid primary crimson `#FF1E38` with crisp `#FFFFFF` text.
- **Typography:** `label-lg`, center-aligned, with a minimum touch height of `56px`.
- **Hover/Active:** Subtle scale transform (`scale(0.98)`) and deep red shade `#E0152D`.

### Category & Filter Chips
- **Style:** Circular category items with circular culinary photography above high-contrast bold titles. Segment tabs use rounded pill containers (`border-radius: 9999px`) on an elevated white bar with an active red underline indicator or filled red capsule.

### Product & Merchant Cards
- **Structure:** Clean white card background with rounded corners (`1.25rem`). Horizontal layout displays the dish/restaurant thumbnail on the left (`88x88px` or `100x100px`, `1rem` radius) with title, rating stars, cuisine subtitle, and price on the right.
- **Action Accessory:** Circular quick-add button (`+`) positioned at the bottom right corner with a soft graphite or primary red fill.

### Food Order & Promotion Badges
- **Style:** High-visibility pill capsules (`border-radius: 9999px`) with bright red fill and white uppercase text (`label-sm`).
- **Placement:** Positioned over banner images or floating adjacent to item titles (e.g., "20% OFF", "POPULAR").

### Star Ratings & Metadata
- **Stars:** Filled `#FF9F1C` star glyphs arranged inline with bold numeric ratings (`4.5`) followed by review counts and preparation durations ("30-40 min").

### Stepper Quantity Controls
- **Style:** Compact pill-shaped counter module featuring a minus button (`-`), clear centered quantity numeral, and a plus button (`+`). Filled in soft neutral grey (`#F3F4F6`) or crisp white outline with tactile circular glyphs.

### Navigation Bars
- **Header:** Energetic solid red brand hero block featuring high-contrast white navigational titles and inverted search bars.
- **Bottom Navigation:** Clean white floating bar housing iconic glyphs (Home, Search, Orders, Cart) in neutral slate `#9CA3AF`, shifting to vibrant brand crimson `#FF1E38` for active tabs.