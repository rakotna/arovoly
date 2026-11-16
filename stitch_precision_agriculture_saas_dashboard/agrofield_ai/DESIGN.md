---
name: AgroField AI
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  telemetry-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system targets enterprise agronomists, farm managers, and autonomous field operators who require instantaneous interpretation of high-density multispectral imaging, weather metrics, and crop yield forecasting. 

The interface is driven by a Modern Minimalist aesthetic infused with Precision Glassmorphism. Translucent, frosted glass cards float effortlessly over vivid satellite and topological terrain maps without occluding spatial context. The visual mood is dependable, scientific, and high-performance—evoking analytical clarity, organic vitality, and agricultural technological mastery. Tactile visual feedback is achieved through pill-shaped micro-controllers, luminous crop-status indicators, and disciplined, un-cluttered spatial composition.

## Colors
The palette bridges natural bio-indicators with industrial-grade warning mechanisms:

- **Primary (`#059669` / `#10B981`):** Represents optimal vegetative health (NDVI vigor), active crop status, confirmation states, and telemetry benchmarks.
- **Secondary (`#EA580C` / `#F97316`):** Deployed for high-urgency callouts, critical moisture deficits, anomaly alarms, and primary interactive trigger actions.
- **Tertiary (`#F59E0B`):** Reserved for moderate risk zones, cautionary stress indicators, and staging parameters.
- **Neutral (`#0F172A` / `#1E293B`):** Deep charcoal bases guarantee razor-sharp contrast and readability across daylight conditions and bright outdoor displays.
- **Canvas & Surface:** Built on dual sand-slate neutrals (`#F4F4F0` and `#F8FAFC`), supporting frosted white structural overlays (`rgba(255, 255, 255, 0.82)` to `rgba(255, 255, 255, 0.94)`) with backdrop saturation.

## Typography
The system balances structural personality with metric legibility. `Plus Jakarta Sans` delivers a contemporary, clean tone across major headers, sector titles, and analytic KPIs. `Inter` provides high-efficiency vertical rhythm and optical clarity across micro-telemetry feeds, dense agricultural data matrices, sensor tables, and cartographic overlays. Numeric characters within data lists and telemetry feeds should leverage tabular figures (`tnum`) to maintain structural vertical alignment across fluctuating metric values.

## Layout & Spacing
A fluid 12-column responsive grid underpins full-viewport geospatial and analytical representations. 

- **Desktop (1280px+):** Employs floating split screens or overlay dashboards. The cartographic canvas operates full-bleed, flanked by pinned or floating analytical sidebars and top-anchored pill toolbars. Desktop gutter size standardizes to `gutter-desktop` (1.5rem / 24px) with dynamic edge clearance defined by `margin-desktop` (2rem / 32px).
- **Tablet (768px - 1279px):** Columns compress to an 8-column layout. Telemetry panels collapse into expandable bottom sheets or floating drawers with `margin-tablet` (1.5rem / 24px).
- **Mobile (<768px):** Adapts to a 4-column flow. Primary controls consolidate into a floating bottom pill navigation deck and swipeable glass telemetry sheets anchored via `margin` (1rem / 16px).
- **Component rhythm:** Component internal gaps and card content padding utilize strict intervals of `space-xs` through `space-xl`.

## Elevation & Depth
Depth hierarchy is anchored through frosted glassmorphism layers and multi-stop ambient shadows, separating active UI tiers from dynamic geospatial satellite backgrounds:

- **Level 0 (Canvas Tier):** Base satellite tile layer, topological contours, and multi-spectral heatmaps.
- **Level 1 (Docked/Subsurface Panels):** `background: rgba(248, 250, 252, 0.85)`, `backdrop-filter: blur(12px)`, bordered with `1px solid rgba(255, 255, 255, 0.6)`. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Floating Action Cards & Widgets):** `background: rgba(255, 255, 255, 0.88)`, `backdrop-filter: blur(16px)`, bordered with `1px solid rgba(255, 255, 255, 0.8)`. Shadow: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Overlays, and High-Priority Alarms):** `background: rgba(255, 255, 255, 0.96)`, `backdrop-filter: blur(24px)`. Shadow: `0 20px 30px -10px rgba(15, 23, 42, 0.15)`. Critical alert modals introduce an inner glow tinted with secondary orange: `inset 0 0 0 1.5px rgba(234, 88, 12, 0.3)`.

## Shapes
A roundedness tier of `3` establishes a soft, modern physical footprint across the platform. Floating control cards, telemetry widgets, and inspection panels adopt `rounded-xl` (1.5rem to 2rem) and `rounded-2xl` boundaries, establishing smooth separation against crisp, angular field survey boundaries. Navigation segments, filtering chips, and primary callouts take fully rounded pill shapes, reinforcing a clean, high-precision instrument feel.

## Components

### Buttons
- **Primary CTAs:** Pill-shaped (`rounded-full`), clad in vivid earth orange (`#EA580C`), with white typography (`font-weight: 600`), and a directional subtle hover transition (`#C2410C`). Provides instantaneous visual priority against green-heavy imagery.
- **Secondary / Action Controls:** Pill-shaped, semi-opaque white background (`rgba(255, 255, 255, 0.9)`), crisp charcoal text (`#0F172A`), with a delicate border (`1px solid rgba(226, 232, 240, 0.8)`).
- **Icon Actions:** Circular floating action buttons with dual-state frosted backdrops for layer switching, zoom gestures, and field NDVI overlays.

### Cards & Floating Panels
- Constructed using the frosted glass baseline (`rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(16px)`).
- Bound by generous inner padding (`space-lg`), high corner radii (`rounded-2xl` / `1.5rem`), and light-catching 1px white top borders.
- Cards host organized header slots with micro-telemetry tags, analytical sparklines, and metric breakdowns.

### Chips & Telemetry Badges
- Pill-shaped status indicators with compact line heights (`label-sm`).
- **Optimal State:** Soft emerald tint (`rgba(16, 185, 129, 0.12)`) paired with solid emerald text (`#059669`) and a pulsing green focal dot.
- **Moderate Stress:** Golden amber tint (`rgba(245, 158, 11, 0.12)`) paired with amber text (`#D97706`).
- **Critical Anomaly:** Orange tint (`rgba(234, 88, 12, 0.12)`) paired with `#EA580C` text.

### Tabs & Navigation Switchers
- Encased in floating pill-track segments with translucent backgrounds (`rgba(15, 23, 42, 0.05)`).
- Active segment transitions smoothly using an extruded white pill plate elevated with a soft ambient drop shadow.

### Input Fields & Selectors
- Pill-shaped or soft-rounded (`1rem`) inputs with frosted off-white backgrounds (`rgba(255, 255, 255, 0.8)`).
- Subtle grey borders (`#E2E8F0`) that transition to a crisp emerald focus ring (`2px solid #059669`) upon active selection.

### Form Checkboxes & Radio Controls
- Circular checks and radios accented in emerald green (`#059669`), paired with smooth micro-transitions.

### Specialized Agricultural Components
- **NDVI Multi-Band Legend Bar:** A gradient scale slider mapping values (-1.0 to +1.0) with floating pill markers for sector zone analysis.
- **Field Micro-Telemetry Overlay:** Ultra-compact floating pill chips featuring an icon, live measurement value, and state indicator dot for in-situ tractor guidance and moisture monitoring.