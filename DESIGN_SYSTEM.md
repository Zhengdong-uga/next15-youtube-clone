# YouTube Design System

This project follows YouTube's design system, aligned with Google's Material Design principles.

## Typography

### Primary UI Font
- **Roboto** - Used for all UI elements (navigation, comments, descriptions, buttons)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)
- Applied globally via Next.js font optimization

### Thumbnail Fonts (for future thumbnail generation)
Available via Tailwind utility classes:

- `font-bebas` - **Bebas Neue**: Clean, impactful sans-serif
- `font-anton` - **Anton**: Bold, blocky, high screen legibility
- `font-lexend` - **Lexend**: Designed for faster reading and accessibility
- `font-nunito` - **Nunito**: Rounded, friendly, highly legible

### Thumbnail Best Practices
- **High contrast** text on backgrounds
- **Limit text** to 3-4 words maximum
- **Font weight**: Bold or Black (700-900)
- **Responsive scaling** for mobile and desktop

## Color Palette

### YouTube Brand Colors
```css
youtube-red: #FF0000
youtube-red-dark: #CC0000
youtube-black: #0F0F0F
youtube-gray-dark: #212121
youtube-gray-medium: #606060
youtube-gray-light: #AAAAAA
youtube-white: #FFFFFF
```

### Theme Colors
- **Light mode**: Clean white background (#FFFFFF), dark text (#0F0F0F)
- **Dark mode**: YouTube dark (#0F0F0F background), light text (#FAFAFA)
- **High contrast** for accessibility

## Spacing System

Following Material Design's **4-8px grid system**:

```
0.5 → 2px
1   → 4px
1.5 → 6px
2   → 8px
3   → 12px
4   → 16px
5   → 20px
6   → 24px
7   → 28px
8   → 32px
10  → 40px
12  → 48px
16  → 64px
20  → 80px
24  → 96px
```

Use these spacing values for:
- Padding and margins
- Gap between elements
- Component sizing
- Consistent vertical rhythm

## Components

### Buttons
- **Rounded corners**: 0.75rem (12px)
- **Padding**: Follows 4-8px grid
- **Font weight**: 500 (Medium)
- **Hover states**: Subtle opacity or background changes

### Cards
- **Border radius**: 0.75rem
- **Shadow**: Subtle, minimal elevation
- **Padding**: 16px or 24px

### Input Fields
- **Border**: 1px solid, light gray
- **Border radius**: 0.75rem
- **Focus ring**: Subtle, matches primary color
- **Height**: 40px or 48px (follows 8px grid)

## Usage Examples

### Applying Fonts
```tsx
// Primary UI (default)
<p className="font-sans">Regular UI text</p>

// Thumbnail text
<h1 className="font-bebas text-6xl font-bold">THUMBNAIL</h1>
<h2 className="font-anton text-5xl">BOLD TITLE</h2>
<p className="font-lexend font-semibold">Accessible Text</p>
<span className="font-nunito font-black">Friendly Title</span>
```

### Applying Spacing
```tsx
<div className="p-4 gap-2">  {/* 16px padding, 8px gap */}
  <button className="px-6 py-3"> {/* 24px horizontal, 12px vertical */}
    Click me
  </button>
</div>
```

### Applying Colors
```tsx
<button className="bg-youtube-red hover:bg-youtube-red-dark text-white">
  Subscribe
</button>
```

## Design Principles

1. **Consistency**: Use the 4-8px grid for all spacing
2. **Legibility**: Roboto for UI, bold sans-serif for emphasis
3. **Contrast**: High contrast for accessibility
4. **Simplicity**: Clean, minimal design
5. **Responsive**: Mobile-first, scales to desktop
6. **Performance**: Optimized fonts via Next.js font system
