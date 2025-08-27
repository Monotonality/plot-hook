# Plot Hook - Database Design Notes

## Overview
This document outlines the specific implementation details, business logic, and design decisions for the Plot Hook database schema.

## Rich Text Editor Choice: Prosemirror

### Why Prosemirror?
Prosemirror has been selected as the rich text editor for Plot Hook based on the following requirements and capabilities:

#### Core Requirements Met:
- **Rich Formatting**: Bullets, tables, line breaks, images, bold, italics, headings, sub-headings
- **Custom Blocks**: Ability to create specialized content types (NPC sheets, location maps, quest logs)
- **@Mention System**: Internal linking between entries with auto-complete
- **Real-Time Collaboration**: Essential for future session board functionality

#### Technical Advantages:
- **Operational Transform (OT)**: Handles concurrent edits without conflicts
- **Cursor Tracking**: See other users' cursors in real-time
- **Change Broadcasting**: Instant sync across multiple clients
- **Custom Node Types**: Perfect for D&D-specific content blocks
- **Battle-Tested**: Powers Google Docs, Notion, Atlassian products

#### Future-Proofing:
- **Session Board Ready**: Built-in collaboration features for real-time D&D sessions
- **Scalable**: Handles multiple concurrent users efficiently
- **Extensible**: Can add custom functionality as needed

#### Implementation Considerations:
- **Complexity**: Steeper learning curve but worth the investment
- **Bundle Size**: Larger than simpler editors but necessary for features
- **Customization**: Requires more setup but provides maximum flexibility

### Database Storage Strategy:
Content will be stored as structured JSON representing the Prosemirror document structure, enabling:
- **Version Control**: Track changes over time
- **Collaboration History**: See who made what changes
- **Search Indexing**: Parse structured content for better search
- **Export Options**: Convert to various formats (PDF, HTML, etc.)

## Campaign Book System

### Overview:
The Campaign Book is a session-focused dashboard that provides a unique four-quadrant layout for real-time D&D session management, combining session tracking with collaborative note-taking and reference management.

### Core Tables:
- **`sessions`**: Session management and metadata
- **`session_content`**: Content for each session quadrant
- **`session_references`**: References made during sessions

### Four-Quadrant Layout:

#### Top Left: Session Content (Main Area)
- **Session information** and main content area
- **Shared content** visible to all participants
- **Session progression** and key events

#### Top Right: DM Notes (DM Only)
- **DM-only content** and planning notes
- **Session preparation** and secret information
- **Reference creation** to World Book content

#### Bottom Left: Player Notes (Collaborative)
- **Player collaborative notes** and observations
- **Real-time sharing** between players
- **Reference creation** to both World Book and Player Book

#### Bottom Right: Reference Panel (Dynamic)
- **Auto-populated references** from all quadrants
- **Quick access** to referenced content
- **Contextual information** display

### Session Management:
- **Session Creation**: DMs create sessions with titles and metadata
- **Session Status**: Planned, Active, Completed states
- **Session Numbering**: Track campaign progression
- **Date Tracking**: When sessions were/will be played

### Content Types:
- **dm_notes**: DM-only content (top right quadrant)
- **player_notes**: Collaborative player content (bottom left quadrant)
- **shared_content**: Content visible to all (main area)

### Reference System:
- **Automatic Detection**: References are detected as content is written
- **Multi-Source**: References can come from World Book or Player Book
- **Context Preservation**: Maintain context of how content was referenced
- **Real-Time Updates**: Reference panel updates as content changes

### Real-Time Features:
- **Live Collaboration**: Multiple users can edit simultaneously
- **Reference Tracking**: Automatic reference detection and display
- **Permission Enforcement**: DM-only areas protected
- **Session State Management**: Track active vs completed sessions

### Implementation Benefits:
- **Session-Focused**: Designed specifically for D&D session management
- **Collaborative**: Real-time sharing between DM and players
- **Reference-Rich**: Automatic linking to existing content
- **Flexible Layout**: Adapts to different session types and needs

## World Management System

### Overview:
The world management system allows users to create and manage multiple D&D campaigns/universes, with role-based access control and sharing capabilities.

### Core Tables:
- **`worlds`**: Main world/campaign containers
- **`world_users`**: User access and role management

### World Sharing Features:
- **Join Codes**: Unique codes for sharing world access
- **Role-Based Access**: Creator, Co-Creator, Player roles
- **Permission Inheritance**: Roles determine editing capabilities

### Role Permissions:
- **Creator**: Full access, can manage users, delete world
- **Co-Creator**: Can edit content, manage players, cannot delete world
- **Player**: Read-only access to most content, can create personal notes

### Implementation Benefits:
- **Multi-Campaign Support**: Manage multiple D&D worlds
- **Flexible Sharing**: Easy world access for players
- **Scalable**: Unlimited worlds per user
- **Secure**: Role-based permission system

## Hierarchical Organization System

### Overview:
The system supports two types of hierarchical organization: category-based and entry-based, allowing flexible content organization.

### Category System:
- **`categories`**: Hierarchical organization with self-referencing parent_id
- **World Isolation**: Categories belong to specific worlds
- **Entry Containment**: Categories can contain entries and subcategories
- **Hidden Categories**: DM-only categories for campaign secrets

### Entry-Based Organization:
- **`parent_entry_id`**: Entries can contain other entries
- **Contextual Grouping**: Related content within specific entries
- **Flexible Nesting**: Unlimited depth of entry containment

### Dual Organization Benefits:
- **Traditional Categories**: Geography > Continents > Nations
- **Contextual Grouping**: America > States > California
- **Flexible Structure**: Adapts to different organizational needs

## Tags System

### Overview:
The tags system provides flexible, color-coded organization for entries across the world.

### Core Tables:
- **`tags`**: World-specific tags with color coding
- **`entry_tags`**: Many-to-many relationship between entries and tags
- **`player_entry_tags`**: Tags for player-created entries

### Features:
- **World-Specific**: Tags are isolated per world
- **Color Coding**: Visual organization with hex colors
- **Flexible Tagging**: Multiple tags per entry
- **Unique Constraints**: No duplicate tags within a world

### Implementation Benefits:
- **Visual Organization**: Color-coded content identification
- **Flexible Search**: Find content by multiple tags
- **Cross-Category**: Tags work across different categories
- **User-Friendly**: Intuitive tagging interface

## Cross-References System

### Overview:
The cross-references system enables linking between entries to show relationships and connections within the world.

### Core Tables:
- **`cross_references`**: Links between World Book entries
- **`player_cross_references`**: Links between Player Book entries

### Reference Types:
- **mentions**: One entry mentions another
- **related**: Entries are related in some way
- **parent-child**: Hierarchical relationships
- **location**: Geographic or spatial relationships

### Features:
- **Bidirectional Linking**: Track relationships in both directions
- **Context Notes**: Explain how entries relate
- **Unique Constraints**: Prevent duplicate references
- **Type Classification**: Categorize relationship types

### Implementation Benefits:
- **Relationship Discovery**: Find connected content
- **Context Preservation**: Maintain relationship context
- **Navigation Aid**: Easy traversal between related entries
- **World Coherence**: Maintain logical connections

## Personal Notes System (Integrated with Player Book)

### Overview:
Personal notes are now integrated into the Player Book system, eliminating redundancy and providing a unified approach to player content creation.

### How It Works:
- **Automatic Creation**: When a player creates a "note" on a World Book entry, it automatically creates a Player Book entry
- **Reference Linking**: The Player Book entry is linked to the World Book entry via the reference system
- **Personal Content**: The note content becomes the Player Book entry content
- **Unified Interface**: All player content is managed through the Player Book system

### Implementation Benefits:
- **Eliminates Redundancy**: No separate personal notes table needed
- **Unified System**: All player content in one place
- **Better Organization**: Notes become proper Player Book entries
- **Enhanced Features**: Notes can use full Player Book features (tags, cross-references, etc.)
- **Simplified Architecture**: Fewer tables and relationships to manage

### User Experience:
- **Seamless Integration**: Players don't notice the difference
- **Enhanced Functionality**: Notes can be tagged, linked, and organized
- **Better Discovery**: Notes appear in Player Book searches and organization
- **Consistent Interface**: Same editing experience for all player content

### Database Structure:
Personal notes are now stored as Player Book entries with:
- **`is_personal_note`** flag in world_book_references table
- **`reference_type`** set to 'personal_note'
- **Full Player Book functionality** available for the note content

## Favorites System

### Overview:
The favorites system allows users to bookmark important entries for quick access.

### Features:
- **Personal Bookmarks**: Users can favorite entries
- **Personal Notes**: Add notes about why it's favorited
- **Unique Constraints**: One favorite per entry per user
- **Quick Access**: Easy to find important entries

### Implementation Benefits:
- **Personal Organization**: Users can organize their own priorities
- **Quick Navigation**: Fast access to important content
- **Context Preservation**: Notes explain why entries are important
- **User Experience**: Familiar bookmarking functionality

## Player Book System

### Overview:
The Player Book system mirrors the World Book but provides collaborative features for players to share and organize their own content while referencing World Book material.

### Core Tables:
- **`player_categories`**: Player-created categories
- **`player_entries`**: Player-created entries
- **`world_book_references`**: Links player content to World Book content
- **`player_cross_references`**: Internal linking between player entries

### Collaborative Features:
- **Shared Creation**: Players can create categories and entries
- **Protected Ownership**: Players cannot edit each other's content
- **Visibility Control**: Players can hide content from others
- **World Integration**: Reference World Book content freely

### Permission System:
- **Create/Edit**: Players can create and edit their own content
- **View**: Players can view other players' content (unless hidden)
- **No Modification**: Players cannot edit/delete others' content
- **World Book Access**: Read-only access to World Book content

### World Book Integration:
- **Reference System**: Link player entries to World Book entries/categories
- **Context Notes**: Explain relationships between Player and World books
- **Bidirectional Linking**: Maintain connections between systems
- **No Modification**: Players cannot modify World Book content

### Implementation Benefits:
- **Collaborative Note-Taking**: Players can share discoveries
- **World Integration**: Build on World Book foundation
- **Individual Ownership**: Protect personal contributions
- **Flexible Organization**: Players create their own structure

## Hidden Content System

### Overview:
The hidden content system allows authors (DMs) to selectively hide portions of entries that contain campaign secrets, while maintaining the ability to reveal them during gameplay.

### Implementation with Prosemirror:
- **Custom Mark**: Hidden content is implemented as a Prosemirror mark that wraps any content (text, images, sections)
- **Visual Feedback**: Hidden content appears with black background, revealed content shows with gray background
- **User Permissions**: Only authors can create and manage hidden content, players see it as black until revealed

### User Interaction Flow:

#### For Authors (DM):
1. **Select Content**: Highlight text, image, or section in Prosemirror editor
2. **Hide Content**: Click "Hide Content" button in toolbar
3. **Visual Change**: Content becomes hidden (black background)
4. **Hover Preview**: Gray box appears on hover showing original content
5. **Reveal Control**: Click to reveal when ready to show players

#### For Players:
1. **Hidden View**: Hidden content appears black by default
2. **No Preview**: No hover effects (cannot see what's hidden)
3. **Reveal Notification**: Content becomes visible when DM reveals it
4. **Revealed State**: Revealed content shows with gray background for context

### Database Structure:
```sql
Table hidden_content {
  id integer [primary key, increment]
  entry_id integer [not null, ref: > entries.id]
  content_hash varchar [not null, note: 'Hash of hidden content for identification']
  content_type varchar [note: 'text, image, section']
  is_revealed boolean [default: false, note: 'Whether content is currently visible']
  revealed_by integer [ref: > users.id, note: 'Who revealed this content']
  revealed_at timestamp [note: 'When content was revealed']
  created_at timestamp [default: `now()`]
}
```

### Prosemirror Content Structure:
```json
{
  "type": "text",
  "text": "This NPC is actually a dragon in disguise",
  "marks": [
    {
      "type": "hidden",
      "attrs": {
        "id": "hidden_123",
        "isRevealed": false
      }
    }
  ]
}
```

### Real-Time Features:
- **Instant Reveal**: Players see revealed content immediately via WebSocket
- **Audit Trail**: Track who revealed what content and when
- **Session Integration**: Hidden content can be revealed during live sessions
- **Collaboration Safe**: Hidden content respects user permissions in collaborative editing

### Technical Benefits:
- **Granular Control**: Hide any text, image, or section independently
- **Flexible**: Works with all Prosemirror content types
- **Performance**: Lightweight mark implementation
- **Extensible**: Easy to add new hidden content features

## Media Management System

### Overview:
The media management system handles file uploads and storage for images and other media used in entries.

### Features:
- **File Storage**: Organized file storage with metadata
- **World Isolation**: Media belongs to specific worlds
- **Entry Association**: Media can be attached to specific entries
- **Upload Tracking**: Track who uploaded what and when

### Implementation Benefits:
- **Organized Storage**: Structured file management
- **Performance**: Efficient file serving and caching
- **Security**: Controlled access to uploaded files
- **Scalability**: Support for various file types and sizes

## Table of Contents
- [User Management](#user-management)
- [Category System](#category-system)
- [Entry System](#entry-system)
- [Relationships and Constraints](#relationships-and-constraints)
- [Business Logic](#business-logic)
- [API Design Considerations](#api-design-considerations)

## User Management

## Category System

## Entry System

## Relationships and Constraints

## Business Logic

## API Design Considerations
