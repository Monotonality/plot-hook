# Plot Hook Frontend

React frontend for the Plot Hook D&D world-building tool.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/` - Reusable UI components
  - `Navigation/` - Navigation panel and breadcrumbs
  - `EntryTile/` - Entry display components
  - `CategoryTile/` - Category display components
  - `BookSelector/` - Book selection components
- `src/pages/` - Main application pages
  - `WorldBook/` - DM-centric world encyclopedia
  - `AdventurersBook/` - Player-centric personal wikis
  - `StoryBook/` - Campaign-centric session management
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/context/` - React context providers

## Features

- Three-book system (World Book, Adventurer's Book, Story Book)
- Tile-based navigation
- Real-time updates
- Responsive design 