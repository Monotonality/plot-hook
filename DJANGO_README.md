# Plot Hook - Django Backend

This is the Django backend implementation of the Plot Hook D&D world-building tool. The backend preserves all existing frontend functionality while providing a solid foundation for future features.

## Features Preserved

- **Navigation Sidebar**: Collapsible sections for Players, Locations, NPCs, Creations, and History
- **Search Functionality**: Real-time search through navigation items
- **Campaign Cards**: Display of world/campaign cards with stats
- **Animated Background**: Particle system animation in the main content area
- **Responsive Design**: Modern dark UI with hover effects and smooth transitions

## Project Structure

```
plot-hook-1/
├── plot_hook_backend/     # Django project settings
├── core/                  # Main Django app
├── templates/             # Django templates
│   ├── base.html         # Base template with sidebar and layout
│   └── home.html         # Home page with campaign cards
├── static/               # Static files (CSS, JS, images)
│   ├── css/
│   │   └── styles.css    # Preserved original styles
│   ├── js/
│   │   └── script.js     # Preserved original JavaScript
│   └── images/
│       └── hook.png      # Logo image
├── manage.py             # Django management script
└── DJANGO_README.md      # This file
```

## Setup and Running

1. **Install Dependencies**:
   ```bash
   python -m pip install django
   ```

2. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Start Development Server**:
   ```bash
   python manage.py runserver
   ```

4. **Access the Application**:
   Open your browser and go to `http://localhost:8000`

## Django Configuration

### Settings (`plot_hook_backend/settings.py`)
- Added `core` app to `INSTALLED_APPS`
- Configured template directory to include `templates/`
- Configured static files directory to include `static/`

### URLs
- Main project URLs: `plot_hook_backend/urls.py`
- Core app URLs: `core/urls.py`
- Home page: `/` (root URL)
- Search API: `/search/`

### Views (`core/views.py`)
- `home()`: Renders the main page with campaign cards
- `search()`: API endpoint for search functionality (ready for future expansion)

## Static Files

All original static files have been preserved and moved to Django's static file structure:
- CSS: `static/css/styles.css`
- JavaScript: `static/js/script.js`
- Images: `static/images/hook.png`

## Templates

### Base Template (`templates/base.html`)
- Contains the complete sidebar navigation
- Includes all original HTML structure
- Uses Django template tags for static files and URLs
- Preserves all CSS classes and JavaScript functionality

### Home Template (`templates/home.html`)
- Extends the base template
- Contains the campaign cards section
- Preserves all original styling and functionality

## Future Development

The Django backend is now ready for:
- Database models for campaigns, players, locations, NPCs, etc.
- User authentication and authorization
- API endpoints for CRUD operations
- Admin interface for content management
- Database-driven search functionality
- Session management and user preferences

## Original Files

The original frontend files have been successfully migrated to the Django structure and removed from the root directory:
- ✅ `index.html` → `templates/base.html` and `templates/home.html`
- ✅ `script.js` → `static/js/script.js`
- ✅ `styles.css` → `static/css/styles.css`
- ✅ `hook.png` → `static/images/hook.png`

All functionality has been preserved in the Django implementation.
