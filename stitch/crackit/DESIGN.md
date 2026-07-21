---
name: CrackIt
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#454653'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#757684'
  outline-variant: '#c6c5d5'
  surface-tint: '#4454be'
  primary: '#4151bb'
  on-primary: '#ffffff'
  primary-container: '#5b6bd6'
  on-primary-container: '#fffbff'
  inverse-primary: '#bbc3ff'
  secondary: '#9f4122'
  on-secondary: '#ffffff'
  secondary-container: '#fd8863'
  on-secondary-container: '#722104'
  tertiary: '#006762'
  on-tertiary: '#ffffff'
  tertiary-container: '#00837c'
  on-tertiary-container: '#f3fffd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000d5f'
  on-primary-fixed-variant: '#293aa5'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#7f2a0d'
  tertiary-fixed: '#7cf6ec'
  tertiary-fixed-dim: '#5dd9d0'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504c'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is built on the narrative of the "Friendly Professional"—a mentor-like interface that balances the high stakes of interview preparation with the gamified encouragement of a language learning app. The aesthetic is a hybrid of **Minimalism** and **Tactile Modernism**, prioritizing warmth and approachability to lower the user's performance anxiety. 

The visual language avoids the sterile, "robotic" nature of many AI platforms. Instead, it uses organic shapes, generous whitespace, and a high-degree of softness to create a supportive environment. The emotional response should be one of "calm focus" mixed with "delightful progress."

## Colors
This design system utilizes a warm, sophisticated palette that moves away from standard "tech blue" and "stark white."

- **Background & Base:** The primary surface is a warm cream (#FAF7F2), providing a softer contrast for the eyes than pure white.
- **Primary (Indigo-Blue):** Used for primary actions, branding elements, and active navigation states. It represents credibility and depth.
- **Secondary (Coral):** Reserved for high-conversion CTAs and "Hero" moments to create a vibrant focal point.
- **Success (Mint):** Used for completed milestones, correct answers, and positive feedback loops.
- **Warning/Streaks (Yellow):** Used for engagement features like daily streaks and badges to evoke energy and urgency without being alarming.

## Typography
The typography pairing reinforces the brand's "Friendly Productivity" persona. 

- **Headlines:** Plus Jakarta Sans is used for its open apertures and friendly, rounded terminals. Headlines should be set with tight tracking and heavy weights to appear confident and modern.
- **Body:** Inter provides a utilitarian balance, ensuring that technical feedback and interview transcripts remain highly legible across all devices.
- **Usage:** Maintain significant hierarchy between headlines and body text. Use "Headline-XL" sparingly for hero sections and achievement screens to celebrate user wins.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a soft, 8px spatial cadence. 

- **Rhythm:** Use 16px (2u) for internal component padding and 32px-48px (4u-6u) for vertical section spacing to maintain an airy, un-cramped feel.
- **Grid:** On desktop, use a 12-column grid with wide 24px gutters. On mobile, transition to a single column with 16px side margins.
- **Safe Areas:** Ensure interactive elements (like voice recording buttons) have a minimum 48px touch target and are placed within easy reach of the thumb on mobile devices.

## Elevation & Depth
This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a sense of soft tactility.

- **Surface Strategy:** Background elements sit on the Cream base. Cards and containers use pure white (#FFFFFF) to "pop" forward.
- **Shadows:** Avoid harsh, black shadows. Use soft, diffused shadows with a tint of the Primary color (e.g., `box-shadow: 0 10px 30px rgba(108, 124, 232, 0.08)`).
- **Interactivity:** Elements should feel "pressable." Use a slight downward translation (2px) on active button states to mimic physical feedback.

## Shapes
The shape language is "generously rounded." 

- **Corners:** Default components use a 16px radius (rounded-lg). Larger containers, such as dashboard cards, should utilize a 24px radius (rounded-xl) to emphasize the friendly, non-threatening aesthetic.
- **Organic Geometry:** Supplement the layout with hand-drawn, organic blob shapes in the background using low-opacity Primary or Secondary colors to break up the rigidity of the grid.

## Components
Consistent component styling ensures the interface feels like a cohesive "tool" rather than a collection of pages.

- **Buttons:** Primary buttons should be pill-shaped with bold typography. Use the Secondary Coral for "Start Interview" or "Upgrade" actions, and Primary Indigo for standard navigation.
- **Progress Bars:** Use thick, pill-shaped tracks (12px height) with a rounded inner progress indicator. Background tracks should be a 10% opacity version of the progress color.
- **Activity Heatmaps:** Inspired by GitHub, but using rounded squares with a 4px border radius. Colors scale from the Neutral Cream to the Success Mint.
- **Cards:** White backgrounds, soft ambient shadows, and 24px corner radius. No borders; depth is strictly communicated through shadows and background contrast.
- **Badges/Chips:** Small, pill-shaped tags with a 10% tinted background of the text color (e.g., a Mint badge with dark Mint text).
- **Input Fields:** Large, 16px rounded corners with a subtle 1px border in a muted primary tint. On focus, the border thickens and the shadow expands.
- **Icons:** Use Phosphor "Rounded" icons with a consistent 2px stroke. Icons should always be centered within a circular or soft-square container when used as primary navigation triggers.