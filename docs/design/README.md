# Design Documentation

This section contains UI/UX design specifications and guidelines for Plot Hook.

## Design Philosophy

Plot Hook follows a **clean, intuitive, and efficient** design philosophy:

- **Clarity**: Clear visual hierarchy and navigation
- **Efficiency**: Minimize clicks and cognitive load
- **Consistency**: Unified design patterns across all features
- **Accessibility**: Inclusive design for all users

## Design System

### Color Palette

#### Primary Colors
- **Primary Blue**: `#2563eb` - Main brand color
- **Primary Dark**: `#1d4ed8` - Hover states
- **Primary Light**: `#3b82f6` - Secondary elements

#### Neutral Colors
- **Background**: `#ffffff` - Main background
- **Surface**: `#f8fafc` - Card backgrounds
- **Border**: `#e2e8f0` - Dividers and borders
- **Text Primary**: `#1e293b` - Main text
- **Text Secondary**: `#64748b` - Secondary text

#### Status Colors
- **Success**: `#10b981` - Positive actions
- **Warning**: `#f59e0b` - Caution states
- **Error**: `#ef4444` - Error states
- **Hidden**: `#dc2626` - Hidden content indicators

### Typography

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

#### Type Scale
- **H1**: `2.5rem` (40px) - Page titles
- **H2**: `2rem` (32px) - Section headers
- **H3**: `1.5rem` (24px) - Subsection headers
- **H4**: `1.25rem` (20px) - Card titles
- **Body**: `1rem` (16px) - Main content
- **Small**: `0.875rem` (14px) - Secondary text

### Spacing System

Based on 8px grid:
- **XS**: `0.25rem` (4px)
- **S**: `0.5rem` (8px)
- **M**: `1rem` (16px)
- **L**: `1.5rem` (24px)
- **XL**: `2rem` (32px)
- **XXL**: `3rem` (48px)

## Component Design

### Navigation Panel
- **Width**: 280px fixed
- **Background**: Surface color
- **Border**: Right border with border color
- **Scroll**: Vertical scroll for long lists

### Tile Components
- **Size**: 200px × 200px minimum
- **Border**: 1px border with border color
- **Border Radius**: 8px
- **Hover**: Subtle shadow and transform
- **Padding**: 16px internal spacing

### Entry Layout
- **Body Panel**: 70% width, left side
- **Side Panel**: 30% width, right side
- **Responsive**: Stack on mobile devices

### Hidden Content Indicators
- **Border**: 2px red border
- **Icon**: Eye-slash icon
- **Tooltip**: "Hidden from players" on hover

## User Experience Patterns

### Three-Book Navigation
1. **Persistent Left Panel**: Always visible navigation
2. **Breadcrumb Trail**: Clear location awareness
3. **Quick Actions**: Edit mode toggle, search, filters

### Content Discovery
1. **Tile Grid**: Visual browsing of categories and entries
2. **Search**: Global search with filters
3. **Breadcrumbs**: Hierarchical navigation
4. **Related Content**: Side panel suggestions

### Edit Mode
1. **Toggle Button**: Cog icon in top-right
2. **Visual Feedback**: Different styling for edit state
3. **Drag & Drop**: Reorder tiles and content
4. **Inline Editing**: Direct content modification

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- **Navigation**: Collapsible sidebar
- **Tiles**: Single column layout
- **Entry Layout**: Stacked body and side panels
- **Touch Targets**: Minimum 44px × 44px

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Indicators**: Clear focus states

### Inclusive Design
- **Font Size**: Minimum 16px for body text
- **Touch Targets**: Adequate size for mobile
- **Loading States**: Clear feedback during operations
- **Error Handling**: Helpful error messages

## Animation Guidelines

### Micro-interactions
- **Hover Effects**: Subtle transforms (0.2s ease)
- **Loading States**: Skeleton screens for content
- **Transitions**: Smooth state changes (0.3s ease)

### Performance
- **Hardware Acceleration**: Use transform and opacity
- **Reduced Motion**: Respect user preferences
- **Efficient Animations**: 60fps target

## Design Assets

### Icons
- **Style**: Line icons with 2px stroke
- **Size**: 24px × 24px standard
- **Color**: Inherit from parent text color
- **Library**: Lucide React icons

### Images
- **Format**: WebP with JPEG fallback
- **Optimization**: Compressed for web
- **Lazy Loading**: Progressive image loading
- **Alt Text**: Descriptive alternative text

## Design Tokens

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  
  /* Typography */
  --font-size-h1: 2.5rem;
  --font-size-body: 1rem;
  
  /* Spacing */
  --spacing-m: 1rem;
  --spacing-l: 1.5rem;
  
  /* Border Radius */
  --radius-s: 4px;
  --radius-m: 8px;
}
```

This design system ensures consistency and maintainability across the entire Plot Hook application. 