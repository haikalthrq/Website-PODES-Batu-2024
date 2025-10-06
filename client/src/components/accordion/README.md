# Enhanced Accordion Component Documentation

## Overview

The Enhanced Accordion component provides a fully accessible, touch-friendly, and keyboard-navigable accordion widget for the PODES Dashboard Analysis pages. Built with UX/A11y best practices and Material-UI integration.

## Features

### 🎯 **User Experience**
- **Strong Visual Affordance**: Clear button styling communicates clickability
- **Touch-Friendly**: 48px+ minimum touch targets (WCAG AA compliance)  
- **Hover & Active States**: Visual feedback for all interaction states
- **Smooth Animations**: 200-250ms transitions with reduced motion support
- **Progressive Disclosure**: Optional "Buka Semua/Tutup Semua" controls

### ♿ **Accessibility** 
- **Semantic HTML**: Proper `<button>` elements, not `<div>`
- **ARIA Compliance**: `aria-expanded`, `aria-controls`, `role="region"`
- **Keyboard Navigation**: Arrow keys, Home/End, Enter/Space, Escape
- **Screen Reader Support**: Proper labeling and announcements
- **Focus Management**: Visible focus rings and roving tabindex

### ⚡ **Performance**
- **Lazy Rendering**: Content rendered only after first open
- **State Persistence**: localStorage with fallback
- **Chart Integration**: Automatic resize events for embedded charts
- **Optimized Animations**: Respects `prefers-reduced-motion`

## Components

### `<Accordion>`
Root container managing state and keyboard navigation.

```jsx
<Accordion
  type="single" // 'single' | 'multiple'
  defaultOpenKeys={[]}
  persistKey="analysis-pendidikan"
  allowToggleAll={false}
>
  {/* AccordionItem children */}
</Accordion>
```

**Props:**
- `type`: Single or multiple items can be open
- `defaultOpenKeys`: Array of keys to open initially
- `persistKey`: localStorage key for state persistence
- `allowToggleAll`: Show "Buka/Tutup Semua" controls

### `<AccordionItem>`
Individual accordion item with enhanced UX.

```jsx
<AccordionItem
  id="tk"
  icon="🎓"
  title="Jumlah TK"
  subtitle="Klik untuk membuka"
>
  {/* Content rendered lazily */}
</AccordionItem>
```

**Props:**
- `id`: Unique identifier (required)
- `icon`: Left-side icon/emoji
- `title`: Main heading text
- `subtitle`: Optional subtitle (defaults to "Klik untuk membuka/menutup")

## Usage Examples

### Basic Analysis Accordion
```jsx
import { Accordion, AccordionItem } from '../components/accordion';

<Accordion type="single" persistKey="analysis-pendidikan">
  <AccordionItem id="tk" icon="🎓" title="Jumlah TK">
    <IndicatorPanel data={data} indicator={tkIndicator} />
  </AccordionItem>
  <AccordionItem id="sd" icon="📚" title="Jumlah SD">
    <IndicatorPanel data={data} indicator={sdIndicator} />
  </AccordionItem>
</Accordion>
```

### Multiple Selection with Controls
```jsx
<Accordion 
  type="multiple" 
  defaultOpenKeys={['overview']}
  allowToggleAll={true}
  persistKey="data-overview"
>
  <AccordionItem id="overview" title="Ringkasan">
    {/* Overview content */}
  </AccordionItem>
  <AccordionItem id="details" title="Detail Data">
    {/* Detailed content */}
  </AccordionItem>
</Accordion>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` / `→` | Move to next accordion header |
| `↑` / `←` | Move to previous accordion header |
| `Home` | Move to first accordion header |
| `End` | Move to last accordion header |
| `Enter` / `Space` | Toggle current accordion |
| `Escape` | Close current accordion (if open) |

## ARIA Pattern

Following WAI-ARIA Authoring Practices for Accordion Pattern:

```html
<button
  id="accordion-tk-button"
  aria-expanded="false"
  aria-controls="accordion-tk-panel"
  type="button"
>
  Jumlah TK
  <span class="sr-only">Buka bagian Jumlah TK</span>
</button>

<div
  id="accordion-tk-panel"
  role="region"
  aria-labelledby="accordion-tk-button"
  hidden={!isOpen}
>
  <!-- Content -->
</div>
```

## State Persistence

Accordion state is automatically persisted to `localStorage` when `persistKey` is provided:

```javascript
// Storage key format
`accordion-${persistKey}` 

// Stored value (JSON array)
["tk", "sd"] // Open accordion keys
```

## Integration with Analysis Pages

The enhanced accordion is integrated into:

1. **IndicatorsSummary.jsx** - Main "Ringkasan Seluruh Indikator" sections
2. **AnalysisPage.jsx** - Uses IndicatorsSummary component
3. **Future Components** - Can be used anywhere accordions are needed

## Chart Integration

When accordion items contain charts, the component automatically:

1. **Triggers Resize Events**: `window.dispatchEvent(new Event('resize'))` on expand
2. **Lazy Loading**: Charts only rendered after first expand
3. **Performance**: Keeps rendered content mounted for instant reopen

## Styling & Theming

The component uses Material-UI's theme system and includes:

- **CSS Custom Properties**: For easy customization
- **Theme Integration**: Follows Material-UI color palette
- **Responsive Design**: Touch-friendly sizing on mobile
- **Dark Mode Support**: Inherits from Material-UI theme
- **High Contrast**: Enhanced borders for accessibility

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Accessibility**: NVDA, JAWS, VoiceOver screen readers
- **Keyboard**: Full keyboard navigation support
- **Touch**: Optimized for mobile/tablet interfaces

## Migration Guide

### From Old Accordion
```jsx
// OLD - Material-UI Accordion
<Accordion expanded={expanded} onChange={handleChange}>
  <AccordionSummary expandIcon={<ExpandMore />}>
    <Typography>{title}</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {content}
  </AccordionDetails>
</Accordion>

// NEW - Enhanced Accordion
<Accordion type="single" persistKey="my-accordion">
  <AccordionItem id="item1" title={title}>
    {content}
  </AccordionItem>
</Accordion>
```

### Benefits of Migration
- ✅ **Better UX**: Clear clickable affordance
- ✅ **Accessibility**: Full ARIA compliance
- ✅ **Keyboard**: Enhanced navigation
- ✅ **Performance**: Lazy rendering
- ✅ **Persistence**: State remembering
- ✅ **Touch**: Mobile-optimized

## Development

### Running Tests
```bash
npm test -- accordion
```

### Building
```bash
npm run build
```

### Accessibility Testing
```bash
npm run test:a11y
```