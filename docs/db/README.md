# Database Schema

| Entity   | PK                      | FKs                                              | Fields                                                                                                                  | Description |
|----------|-------------------------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|-------------|
| USER     | USER_ID                 | â€”                                                | USER_EMAIL, USER_CREATED_AT, USER_LAST_SIGN_IN                                                                           | Stores information about a user. |
| PROFILE  | USER_ID                 | USER_ID â†’ USER.USER_ID                           | PROFILE_NAME                                                                                                            | Holds additional profile information, directly linked to a user. |
| MEMBER   | USER_ID, WORLD_ID       | USER_ID â†’ USER.USER_ID; WORLD_ID â†’ WORLD.WORLD_ID| MEMBER_ROLE, MEMBER_JOINED_AT                                                                                            | Junction table indicating which users are members of which worlds, and their role. |
| WORLD    | WORLD_ID                | â€”                                                | WORLD_JOIN_CODE, WORLD_NAME, WORLD_DESCRIPTION, WORLD_CREATED_AT                                                         | Represents a creative project or setting (a "world"). |
| BOOK     | BOOK_ID                 | WORLD_ID â†’ WORLD.WORLD_ID                        | BOOK_TYPE                                                                                                               | Organizational structure (a "book") within a world. |
| NODE     | NODE_ID                 | BOOK_ID â†’ BOOK.BOOK_ID; NODE_PARENT_ID â†’ NODE.NODE_ID; USER_ID â†’ USER.USER_ID | NODE_TYPE, NODE_TITLE, NODE_ORDER_INDEX, NODE_IS_HIDDEN, NODE_CREATED_AT, NODE_UPDATED_AT, NODE_PREVIEW_TEXT, NODE_SLUG, NODE_IMAGE_URL | Piece of content (plot hook, character, location). |
| LINK     | LINK_ID                 | LINK_NODE_FROM â†’ NODE.NODE_ID; LINK_NODE_TO â†’ NODE.NODE_ID | LINK_ANCHOR_TEXT                                                                                                         | Directional connection between two nodes. |
| ENTRY    | NODE_ID                 | NODE_ID â†’ NODE.NODE_ID                           | ENTRY_CONTENT                                                                                                           | Content for a node. |
| CATEGORY | NODE_ID                 | NODE_ID â†’ NODE.NODE_ID                           | CATEGORY_DESCRIPTION                                                                                                    | Description when used as a category. |

## Relationships
- USER to PROFILE (1:1): Each USER has exactly one PROFILE.
- USER to MEMBER (1:N): A USER can be a member of multiple WORLDS.
- WORLD to MEMBER (1:N): A WORLD can have multiple MEMBERs.
- WORLD to BOOK (1:N): A WORLD can contain multiple BOOKs.
- USER to NODE (1:N): A USER creates or owns NODEs.
- BOOK to NODE (1:N): A BOOK can contain multiple NODEs.
- NODE to NODE (1:N, recursive): Parent-child via NODE_PARENT_ID.
- NODE to ENTRY (1:1): Each NODE has one ENTRY (content).
- NODE to CATEGORY (1:1): Each NODE has one CATEGORY (description).
- NODE to LINK (1:N): A NODE can be a source or destination of LINKs.
- LINK represents many-to-many relationships between NODEs.

## Specialization Constraint
- Every NODE must be exactly one of: ENTRY or CATEGORY (total, disjoint).
- Driven by NODE.NODE_TYPE âˆˆ {ENTRY, CATEGORY}.
- Enforcement guidance: ensure one-and-only-one child row exists in ENTRY or CATEGORY for each NODE.

