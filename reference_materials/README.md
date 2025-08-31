# Plot Hook - D&D World-Building Tool

A comprehensive web-based, multi-user world-building tool for Dungeons & Dragons campaigns. Plot Hook unifies world-building, player journaling, and campaign tracking into a single, cohesive platform.

## Overview

Plot Hook serves as a comprehensive digital repository for Dungeon Masters (DMs) to manage their homebrew campaigns. It consolidates three critical functions:

- **World Encyclopedia**: Canonical source of truth for campaign lore
- **Campaign Tracker**: Session management and story progression  
- **Player Journal**: Personal wiki for each player's discoveries

## Architecture

### Three-Book System

The application features an innovative three-book separation system that provides clear role separation while maintaining data consistency:

1. **World Book** (DM-Centric) - Canonical encyclopedia of the world
2. **Adventurer's Book** (Player-Centric) - Personal wiki for each player
3. **Story Book** (Campaign-Centric) - Living campaign log and session manager

### Core Data Model

Built on a modular, scalable architecture centered around two core entities:

- **Categories**: Containers for related information with tile-based views
- **Entries**: Detailed content pages with text, images, and side panels

## Key Features

### World Book (DM-Centric)
- **Hierarchical Organization**: Navigate through world structure (World Book > Geography > Continents > Aeloria)
- **DM-Only Editing**: Restricted content modification to maintain canonical authority
- **Hidden Content Management**: 
  - Hidden entries/categories for campaign secrets
  - Hidden text blocks within public entries
- **Edit Mode**: Cog icon interface for content management

### Adventurer's Book (Player-Centric)
- **Personal Wikis**: Individual books for each player
- **Authoring Tools**: Same interface as DM for consistency
- **Cross-Reference Linking**: Connect personal notes to canonical World Book entries
- **Discovery Documentation**: Players record their findings and experiences

### Story Book (Campaign-Centric)
- **Session Management**: Tile-based session organization
- **Dashboard Interface**: Quick-reference session entries
- **Dynamic Linking**: Side panel with relevant World Book entries and active quests
- **Campaign Progression**: Living campaign log

## Technology Stack

### Backend: Django
- High-level Python web framework with "batteries included"
- Built-in authentication system with DM/Player role differentiation
- Object-Relational Mapper (ORM) for data models
- Django REST Framework (DRF) for API creation

### Frontend: React
- Component-based architecture perfect for reusable tiles and entries
- Excellent state management for application state
- Single-page application with real-time updates
- Fast, responsive user experience

### Database: PostgreSQL
- Most powerful and reliable open-source relational database
- Excellent handling of complex, nested data relationships
- Seamless compatibility with Django ORM
- ACID compliance and advanced features

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/plot-hook.git
   cd plot-hook
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Setup database
   python manage.py migrate
   python manage.py createsuperuser
   ```

3. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Run the application**
   ```bash
   # Backend (in one terminal)
   python manage.py runserver
   
   # Frontend (in another terminal)
   npm start
   ```

## Development Roadmap

### Phase 1: Core Infrastructure
- [ ] Django Backend Setup
- [ ] React Frontend Foundation
- [ ] Basic Category/Entry Data Model
- [ ] Three-Book Navigation System
- [ ] DM Editing Capabilities

### Phase 2: Advanced Features
- [ ] Hidden Content Management
- [ ] Player Book Functionality
- [ ] Cross-Reference Linking
- [ ] API Development

### Phase 3: Enhanced UX
- [ ] Session Management Tools
- [ ] Advanced Search and Filtering
- [ ] Mobile Responsiveness
- [ ] Performance Optimization

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The D&D community for inspiration and feedback
- Django and React communities for excellent documentation
- All contributors and beta testers

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/plot-hook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/plot-hook/discussions)
- **Documentation**: [Product Design Review](Product_Design_Review.md)

---

**Plot Hook** - Where every campaign finds its story.
