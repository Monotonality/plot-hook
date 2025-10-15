# Plot Hook Project Outline

## 1. Project Overview
**Project Name:** Plot Hook  
**Module:** World Book  
**Description:** A DM-centric digital encyclopedia for Dungeons & Dragons campaigns, featuring hierarchical nodes, rich text editing, inline images, and internal cross-linking.

## 2. Objectives
- Enable Dungeon Masters to create and organize campaign content.
- Allow players to view public content based on membership.
- Support hierarchical URLs for intuitive navigation.
- Embed rich text content with inline images and links.
- Maintain scalable and secure backend architecture.

## 3. Tech Stack
- **Frontend:** Vercel (Next.js / React), Tiptap rich text editor
- **Backend:** Render API (Node.js / preferred framework)
- **Database:** Supabase PostgreSQL + Auth
- **Images:** External URLs for inline content; optional cover image column

## 4. Core Features
### 4.1 Hierarchical Node Structure
- Recursive categories and entries
- Parent-child relationships
- Hierarchical URLs like `/world/root/sub1/sub2`
- DM-only nodes with visibility flags

### 4.2 Rich Text Content
- Inline images with resizing, alignment, and captions
- Stored as JSONB (`NODE_ENTRIES_CONTENT`) in database
- Frontend renders content dynamically

### 4.3 Cross-Linking
- Anchor text links between nodes
- Optional `NODE_LINKS` table for tracking links
- Enables wiki-style navigation

### 4.4 Access Control
- World membership system with DM and Player roles
- Supabase Auth for authentication
- Permissions enforced in backend API

### 4.5 Images
- Users can paste external image URLs
- Optional cover image per node
- Frontend handles rendering, resizing, and alignment

## 5. Database Outline
- **USERS & PROFILE:** User information and profiles
- **WORLD & MEMBER:** Worlds and membership roles
- **BOOK & NODE:** Hierarchical organization of content
- **NODE_ENTRIES:** Rich text content including images and links
- **LINKS:** Optional table for cross-node links

## 6. Milestones
1. **MVP:** Node creation, rich text editor, hierarchical URLs
2. **Membership System:** Users join worlds via codes, role-based access
3. **Cross-Linking & Navigation:** Clickable links between nodes
4. **Image Handling:** Inline images via external URLs
5. **Frontend Enhancements:** Responsive UI, markdown export (optional)

## 7. Future Enhancements
- File upload support for images
- Player journals (Adventurer's Book)
- Campaign tracker (Story Book)
- Collaborative editing and version history

## 8. Deliverables
- Functional World Book with hierarchical content
- Backend API with CRUD and access control
- Rich text editing frontend with inline images
- Database schema supporting recursive nodes and memberships

