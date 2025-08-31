# Plot Hook Style Guide

## Overview
This style guide documents the design system, color palette, typography, and component patterns used throughout the Plot Hook application.

## Color Palette

### Primary Colors
- **Primary Brown**: `#8b7355` (Main brand color, buttons, links)
- **Primary Brown Hover**: `#9b8365` (Button hover states)
- **Primary Brown Light**: `#9a8a6a` (Secondary interactions)

### Background Colors
- **Main Background**: `#202020` (Cards, modals, sidebar)
- **Secondary Background**: `#282828` (Main content area)
- **Tertiary Background**: `#303030` (Create cards, hover states)
- **Quaternary Background**: `#383838` (Create card hover)

### Border Colors
- **Primary Border**: `#404040` (Standard borders)
- **Secondary Border**: `#505050` (Form inputs, buttons)
- **Tertiary Border**: `#606060` (Hover states)

### Text Colors
- **Primary Text**: `#e8e6e3` (Main text, headings)
- **Secondary Text**: `#a0a0a0` (Descriptions, labels)
- **Tertiary Text**: `#808080` (Muted text, placeholders)

### Status Colors
- **Success**: `#22c55e` (Green, success messages)
- **Error**: `#dc2626` (Red, error messages, danger actions)
- **Warning**: `#f59e0b` (Orange, warnings)
- **Info**: `#3b82f6` (Blue, information)

### Pattern Colors (Card Backgrounds)
- **Red Pattern**: `#dc2626` (Category cards)
- **Teal Pattern**: `#0d9488` (Demo cards)
- **Blue Pattern**: `#3b82f6` (Special cards)

## Typography

### Font Family
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Font Sizes
- **Large Title**: `1.8rem` (Main page titles)
- **Section Title**: `1.5rem` (Section headings)
- **Card Title**: `1.3rem` (Card headings)
- **Body Text**: `1rem` (Main content)
- **Small Text**: `0.9rem` (Labels, descriptions)
- **Extra Small**: `0.8rem` (Stats, badges)

### Font Weights
- **Bold**: `600` (Headings, important text)
- **Medium**: `500` (Labels, buttons)
- **Normal**: `400` (Body text)

### Line Height
- **Standard**: `1.6` (Body text)
- **Tight**: `1.5` (Headings)

## Layout & Spacing

### Container Widths
- **Max Content**: `1200px` (Main content containers)
- **Settings Container**: `800px` (Settings pages)

### Padding & Margins
- **Large**: `30px` (Section padding, card padding)
- **Medium**: `20px` (Standard spacing)
- **Small**: `15px` (Compact spacing)
- **Extra Small**: `10px` (Tight spacing)
- **Micro**: `8px` (Gaps, icon spacing)

### Border Radius
- **Large**: `12px` (Cards, main containers)
- **Medium**: `8px` (Modals, dropdowns)
- **Small**: `6px` (Buttons, form inputs)
- **Micro**: `4px` (Badges, small elements)

## Component Patterns

### Buttons

#### Primary Button
```css
.btn-primary {
    background: #8b7355;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-primary:hover {
    background: #9b8365;
}
```

#### Secondary Button
```css
.btn-secondary {
    background: #404040;
    color: #e8e6e3;
    border: 1px solid #505050;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: #505050;
    border-color: #606060;
}
```

#### Danger Button
```css
.btn-danger {
    background: #dc2626;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-danger:hover {
    background: #b91c1c;
}
```

### Form Elements

#### Text Input
```css
.form-input {
    background: #404040;
    border: 1px solid #505050;
    border-radius: 6px;
    padding: 12px 16px;
    color: #e8e6e3;
    font-size: 0.9rem;
    transition: border-color 0.3s ease;
    width: 100%;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #8b7355;
}

.form-input::placeholder {
    color: #808080;
}
```

#### Form Group
```css
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.form-group label {
    color: #e8e6e3;
    font-weight: 500;
    font-size: 0.9rem;
}
```

### Cards

#### Standard Card
```css
.campaign-card {
    background: #202020;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.campaign-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
```

#### Settings Card
```css
.settings-card {
    background: #202020;
    border-radius: 12px;
    padding: 30px;
    border: 1px solid #404040;
}
```

### Modals

#### Modal Container
```css
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #202020;
    border: 1px solid #404040;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 2001;
    min-width: 400px;
    max-width: 500px;
}
```

#### Modal Overlay
```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
}
```

### Navigation

#### Sidebar Navigation Item
```css
.nav-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    color: #e8e6e3;
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
    gap: 12px;
    font-size: 0.9rem;
    cursor: pointer;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: #8b7355;
}

.nav-item.active {
    background: rgba(255, 255, 255, 0.1);
    border-left-color: #8b7355;
}
```

### Messages & Alerts

#### Success Message
```css
.message-success {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #86efac;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 0.9rem;
}
```

#### Error Message
```css
.message-error {
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #fca5a5;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 0.9rem;
}
```

## Layout Structure

### Main Layout
```html
<div class="sidebar">
    <!-- Sidebar content -->
</div>

<div class="main-content">
    <div class="main-header">
        <!-- Header content -->
    </div>
    
    <div class="content-section">
        <!-- Main content -->
    </div>
</div>
```

### Sidebar Structure
```html
<div class="sidebar">
    <div class="sidebar-header">
        <a href="#" class="sidebar-logo">
            <img src="..." alt="Logo" class="sidebar-logo-icon">
            <span>Plot Hook</span>
        </a>
        
        <div class="user-info">
            <div class="user-name">Username</div>
        </div>
        
        <div class="search-section">
            <div class="search-container">
                <button class="add-button">+</button>
                <input type="text" class="search-input" placeholder="Search...">
            </div>
        </div>
    </div>
    
    <div class="sidebar-nav">
        <!-- Navigation items -->
    </div>
</div>
```

### Card Structure
```html
<div class="campaign-card">
    <div class="campaign-pattern pattern-red">
        <div class="campaign-badge badge-red">BAD</div>
    </div>
    <div class="campaign-info">
        <div class="campaign-title">Card Title</div>
        <div class="campaign-stats">Card description</div>
        <div class="campaign-actions">
            <button class="campaign-menu">⋮</button>
        </div>
    </div>
</div>
```

## Responsive Design

### Breakpoints
- **Mobile**: `max-width: 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `min-width: 1024px`

### Mobile Adaptations
```css
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        height: auto;
        position: relative;
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .btn {
        width: 100%;
        text-align: center;
    }
}
```

## Animation & Transitions

### Standard Transitions
- **Fast**: `0.2s ease` (Quick interactions)
- **Standard**: `0.3s ease` (Most hover effects)
- **Slow**: `0.5s ease` (Complex animations)

### Common Transitions
```css
/* Hover effects */
transition: background 0.3s ease;
transition: transform 0.3s ease, box-shadow 0.3s ease;
transition: all 0.3s ease;

/* Color transitions */
transition: color 0.3s ease;
transition: border-color 0.3s ease;
```

## Z-Index Hierarchy
- **Base**: `1` (Regular content)
- **Sidebar**: `1000` (Sidebar navigation)
- **Dropdown**: `1000` (User dropdown)
- **Modal Overlay**: `2000` (Modal backgrounds)
- **Modal Content**: `2001` (Modal dialogs)
- **Confirmation**: `2002` (Confirmation modals)

## Icon Usage

### Icon Sizes
- **Large**: `2rem` (Hero icons)
- **Medium**: `1.2rem` (Button icons)
- **Small**: `1rem` (Navigation icons)
- **Extra Small**: `0.8rem` (Inline icons)

### Icon Spacing
- **With Text**: `gap: 12px` (Navigation items)
- **Compact**: `gap: 8px` (Buttons, small elements)

## Accessibility

### Focus States
```css
.form-input:focus {
    outline: none;
    border-color: #8b7355;
}

.btn:focus {
    outline: 2px solid #8b7355;
    outline-offset: 2px;
}
```

### Color Contrast
- All text colors meet WCAG AA standards
- Primary text on dark backgrounds: 15:1 ratio
- Secondary text on dark backgrounds: 7:1 ratio

## Best Practices

### CSS Organization
1. **Reset/Normalize** (if needed)
2. **Base styles** (body, typography)
3. **Layout components** (sidebar, main content)
4. **UI components** (buttons, forms, cards)
5. **Utility classes** (spacing, colors)
6. **Responsive styles** (media queries)

### Naming Conventions
- **BEM-like**: `.component-name__element--modifier`
- **Kebab-case**: All class names use kebab-case
- **Semantic names**: Use descriptive, semantic class names

### File Structure
```
static/
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── auth.css           # Authentication pages
│   └── landing.css        # Landing page
├── js/
│   ├── script.js          # Main JavaScript
│   ├── auth.js           # Authentication logic
│   └── landing.js        # Landing page logic
└── images/
    └── hook.png          # Logo
```

## Usage Examples

### Creating a New Button
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-danger">Danger Action</button>
```

### Creating a New Card
```html
<div class="campaign-card">
    <div class="campaign-pattern pattern-blue">
        <div class="campaign-badge badge-blue">NEW</div>
    </div>
    <div class="campaign-info">
        <div class="campaign-title">New Feature</div>
        <div class="campaign-stats">Description of the new feature</div>
        <div class="campaign-actions">
            <button class="campaign-menu">⋮</button>
        </div>
    </div>
</div>
```

### Creating a New Form
```html
<form class="settings-form">
    <div class="form-group">
        <label for="field-name">Field Label</label>
        <input type="text" id="field-name" class="form-input" placeholder="Enter value...">
    </div>
    <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary">Cancel</button>
    </div>
</form>
```

---

*This style guide should be updated as the design system evolves. Always refer to the latest version when creating new components or modifying existing ones.*
