---
name: Dynamic Ideation System
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
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#8127cf'
  on-secondary: '#ffffff'
  secondary-container: '#9c48ea'
  on-secondary-container: '#fffbff'
  tertiary: '#00534a'
  on-tertiary: '#ffffff'
  tertiary-container: '#006d62'
  on-tertiary-container: '#69f1de'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is built to bridge the gap between rigorous project management and the spontaneous energy of a creative brainstorm. It targets professional clients and internal teams who need to move quickly from "blank page" to "actionable concept."

The visual language follows a **Modern Corporate** foundation infused with **Gamification Light** elements. This is achieved through high-energy accent colors and soft, tactile UI components that reward interaction without feeling juvenile. The emotional goal is to evoke a sense of momentum, clarity, and collaborative "flow."

- **Core Aesthetic:** Spacious, high-contrast, and vibrantly accented.
- **Visual Strategy:** Use deep stable tones for navigation and structure, while reserving "Electric" accents for user contributions, new ideas, and achievement states.

## Colors

The palette is anchored by **Deep Indigo** and **Slate** to provide a sense of professional stability and institutional trust. This grounded base allows the high-vibrancy accents to function as functional signifiers.

- **Primary (Indigo):** Used for primary actions, active navigation states, and structural branding.
- **Secondary (Electric Purple):** Reserved for "Idea Creation," collaboration triggers, and "Contribution Streaks."
- **Tertiary (Bright Teal):** Used for "Success" states, "Completed" milestones, and positive feedback loops.
- **Neutral (Slate & Gray):** Used for text hierarchy and subtle borders to maintain a clean, organized workspace.

The default mode is **Light**, utilizing a clean off-white background to ensure high readability and a "fresh" canvas feel.

## Typography

This design system utilizes a dual-font strategy to balance character with utility. 

**Montserrat** is used for headlines and display text. Its geometric construction and bold weights provide the "inspiring" and "modern" energy required for project ideation. **Inter** is used for all body copy, inputs, and labels. Its high legibility and neutral tone keep complex project data readable and professional.

For mobile, scale down large display titles while maintaining generous line heights to prevent visual crowding. Use `label-sm` in all-caps for metadata and category tags to create a clear visual distinction from body text.

## Layout & Spacing

The layout philosophy emphasizes **Spacious Clarity**. By using a generous 8px-based scale, the UI remains easy to scan, reducing the cognitive load during collaborative sessions.

- **Grid:** Use a 12-column fluid grid for desktop and a 4-column grid for mobile.
- **Scanning:** Maintain high vertical rhythm. Grouped elements (like a user comment and their avatar) should use `sm` spacing, while distinct sections should use `lg` spacing to create clear "islands" of content.
- **Mobile:** Increase standard touch targets to 48px. Use `margin-mobile` for page edges to ensure content doesn't feel cramped on smaller screens.

## Elevation & Depth

To achieve the "Gamification Light" look, this design system avoids heavy, dark shadows in favor of **Ambient Shadows** and **Tonal Layers**.

- **Surfaces:** Use three primary tiers. Level 0 is the background. Level 1 is the primary content card. Level 2 is for floating elements like modals or active idea bubbles.
- **Shadows:** Use a "soft-glow" technique. Shadows should have a large blur radius (16px–24px) and very low opacity (5–8%). For interactive elements, tint the shadow slightly with the `primary_color` (Indigo) to create a subtle sense of energy.
- **Interactivity:** On hover or press, elements should "lift" slightly (increase shadow spread) rather than just changing color, reinforcing the tactile, game-like feel.

## Shapes

The shape language is consistently **Rounded**. This softens the professional "Slate" tones and makes the application feel approachable.

- **Default (0.5rem):** Used for standard input fields, cards, and list items.
- **Large (1rem):** Used for containers that house "Ideation" content or "New Project" prompts to make them feel more prominent and welcoming.
- **Pill (Full):** Used exclusively for buttons, status tags, and user avatars. The pill shape signifies an action or a discrete piece of metadata.

## Components

### Buttons
Primary buttons use the Indigo background with white text and a pill-shape. "Action" buttons (like "Add Idea") should use the Electric Purple to stand out. Use a subtle shadow to give them a "clickable" volume.

### Chips & Tags
Use Bright Teal for positive status (e.g., "Approved", "Trending") and Purple for collaborative markers (e.g., "3 New Comments"). Chips should have a light background tint of the accent color with high-contrast bold text.

### Input Fields
Fields should have a `Slate-100` background and a 1px border. On focus, the border transitions to Indigo with a 2px width. Use Inter for input text to ensure maximum clarity during typing.

### Ideation Cards
Cards are the heart of the system. They use white backgrounds, Level 1 shadows, and a `left-border` accent color (Teal or Purple) to categorize the idea type at a glance.

### Gamification Elements
- **Contribution Streaks:** Use a small circular badge with the Electric Purple gradient and white iconography.
- **Progress Bars:** Use a thick 8px track with a Bright Teal fill to indicate project completion milestones.
- **Avatars:** Always rounded (circle) with a 2px Indigo border if the user is currently "Active" or "Online."