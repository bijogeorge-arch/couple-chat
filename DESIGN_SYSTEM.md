# 🎨 Lumière Design System

## Design Philosophy
**Dark Mode Elegance** - A sophisticated, cinematic experience for couples. Anti-corporate, intimate, and premium.

---

## 🎨 Color Palette

### Primary Colors (Dark Mode Elegance)
```css
--charcoal: #0F1115        /* Main background */
--midnight-deep: #0B0D17   /* Deeper backgrounds */
--velvet: #E11D48          /* Primary accent (CTA, important actions) */
--gold: #FCD34D            /* Secondary accent (highlights, hover states) */
```

### Supporting Colors
```css
--lavender: #C9B3FF        /* Soft accent, borders */
--rosegold: #E8A4A4        /* Romantic accent, reactions */
--peach: #FFC7A5           /* Warm accent, notifications */
--cream: #FFF7F2           /* Light text on dark */
```

### Glass Morphism
```css
--glass-sm: rgba(255, 255, 255, 0.05)
--glass-md: rgba(255, 255, 255, 0.10)
```

---

## 📝 Typography

### Font Families
- **Headings**: `Playfair Display` (elegant, serif)
- **Body**: `Lato` (clean, readable)
- **Cute/Playful**: `Quicksand` (soft, rounded)
- **Luxury**: `Cinzel` (for branding)

### Font Sizes
```css
/* Headings */
h1: 5xl-8xl (48px-96px)
h2: 3xl-4xl (30px-36px)
h3: xl-2xl (20px-24px)

/* Body */
body: sm-base (14px-16px)
small: xs (12px)
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 🔲 Spacing & Layout

### Border Radius
- Small: `8px` (buttons, inputs)
- Medium: `12px` (cards)
- Large: `20px-30px` (video containers)
- Extra Large: `9999px` (pills, circular)

### Spacing Scale
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Container Max Widths
- Small: `640px`
- Medium: `768px`
- Large: `1024px`
- Extra Large: `1280px`

---

## ✨ Effects & Animations

### Shadows
```css
/* Glow Effects */
velvet-glow: 0 0 30px rgba(225, 29, 72, 0.3)
gold-glow: 0 0 30px rgba(252, 211, 77, 0.3)
lavender-glow: 0 0 30px rgba(201, 179, 255, 0.3)

/* Standard Shadows */
sm: 0 2px 8px rgba(0, 0, 0, 0.1)
md: 0 4px 16px rgba(0, 0, 0, 0.2)
lg: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### Transitions
- **Fast**: 150ms (hover states)
- **Normal**: 300ms (standard interactions)
- **Slow**: 700ms (page transitions, theme changes)

### Blur
- **Backdrop**: `blur(12px)` for glass morphism
- **Glow**: `blur(40px-120px)` for orb effects

---

## 🎭 Component Patterns

### Buttons

#### Primary CTA
```jsx
<button className="px-10 py-4 bg-gradient-to-b from-velvet to-red-950 rounded-md 
  shadow-[0_0_30px_rgba(225,29,72,0.2)] hover:shadow-[0_0_50px_rgba(225,29,72,0.4)] 
  transition-all duration-700">
  Enter Private Suite
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-white/10 text-white rounded-full 
  hover:bg-white/20 transition-all duration-300">
  Cancel
</button>
```

#### Icon Button
```jsx
<button className="p-4 rounded-full bg-white/10 text-white 
  hover:bg-white/20 hover:scale-110 transition-all duration-300">
  <Icon className="w-6 h-6" />
</button>
```

### Cards

#### Glass Card
```jsx
<div className="bg-glass-sm backdrop-blur-md border border-white/5 
  p-8 rounded-lg hover:bg-glass-md transition-all duration-700 
  hover:border-white/10">
  {/* Content */}
</div>
```

#### Feature Card
```jsx
<div className="group bg-glass-sm backdrop-blur-md border border-white/5 
  p-8 rounded-lg hover:bg-glass-md transition-all duration-700">
  <div className="mb-6 text-gold/70 group-hover:text-gold transition-colors">
    <Icon />
  </div>
  <h3 className="font-heading text-xl text-white mb-3">Title</h3>
  <p className="text-gray-400 font-light leading-relaxed text-sm">Description</p>
</div>
```

### Inputs

#### Text Input
```jsx
<input className="bg-transparent border-b border-white/20 text-white 
  placeholder-gray-600 py-2 px-2 focus:outline-none 
  focus:border-gold/60 transition-all duration-500" />
```

### Modals

#### Standard Modal
```jsx
<div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm 
  flex items-center justify-center p-4">
  <div className="bg-midnight border-2 border-rosegold/30 rounded-3xl p-8 
    max-w-md w-full shadow-[0_0_50px_rgba(232,164,164,0.3)]">
    {/* Content */}
  </div>
</div>
```

---

## 🎬 Micro-interactions

### Hover States
- **Scale**: `scale(1.05)` for buttons
- **Glow**: Increase shadow intensity
- **Color**: Transition from muted to vibrant

### Click Effects
- **Ripple**: Expanding circle from click point
- **Scale**: Brief `scale(0.95)` then back to normal

### Loading States
- **Spinner**: Rotating border with glow
- **Pulse**: Opacity animation for placeholders
- **Skeleton**: Gradient shimmer effect

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile-First Approach
- Stack vertically on mobile
- Side-by-side on tablet+
- Larger touch targets (min 44px)
- Simplified navigation (hamburger menu)

---

## ♿ Accessibility

### Color Contrast
- Text on dark: Minimum 4.5:1 ratio
- Interactive elements: Clear focus states
- Error states: Red with icon + text

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-velvet/50
```

### ARIA Labels
- All interactive elements have labels
- Modals have `role="dialog"`
- Loading states have `aria-live="polite"`

---

## 🎯 Usage Guidelines

### DO ✅
- Use heavy rounding (2xl, 3xl) for warmth
- Apply glass morphism for depth
- Add glow effects for emphasis
- Animate transitions smoothly
- Use colored glows instead of gray shadows

### DON'T ❌
- Use sharp corners
- Mix design systems (stick to Dark Mode Elegance)
- Use more than 3 fonts
- Create jarring transitions
- Use corporate blue/gray tones

---

## 🎨 Theme Variations

### Romantic (Default)
- Background: Gradient from midnight to deep purple
- Accents: Rosegold, lavender
- Mood: Warm, intimate

### Starry Night
- Background: Deep navy (#0B0D17)
- Accents: White stars, lavender
- Mood: Dreamy, celestial

### Minimal
- Background: Light gray (#F9FAFB)
- Accents: Charcoal, subtle colors
- Mood: Clean, modern

---

## 📦 Component Library

### Available Components
1. **EnhancedLandingPage** - Full landing with testimonials, FAQ, footer
2. **MicroInteractions** - Ripple, confetti, glow effects
3. **EmptyStates** - Camera blocked, waiting, errors
4. **UIComponents** - Modals, toasts, tutorials
5. **Room** - Main video call interface

### Import Pattern
```jsx
import { Component } from '@/components/ComponentName';
```

---

## 🚀 Performance

### Optimization Tips
- Use `will-change` for animated elements
- Lazy load images and heavy components
- Debounce rapid interactions
- Use CSS transforms over position changes
- Minimize re-renders with React.memo

---

## 📝 Code Style

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- CSS Classes: kebab-case (via Tailwind)
- Constants: UPPER_SNAKE_CASE

### File Structure
```
src/
  components/
    LandingPage.jsx
    Room.jsx
    UIComponents.jsx
    MicroInteractions.jsx
    EmptyStates.jsx
  App.jsx
  index.css
```

---

**Last Updated**: 2025-11-26
**Version**: 2.0 (Dark Mode Elegance)
