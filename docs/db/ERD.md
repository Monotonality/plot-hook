# ERD

```mermaid
erDiagram
    USER ||--|| PROFILE : has
    USER ||--o{ NODE : author
    USER ||--o{ MEMBER : joins

    WORLD ||--o{ BOOK : contains
    WORLD ||--o{ MEMBER : membership

    BOOK ||--o{ NODE : contains

    NODE ||--|| ENTRY : content
    NODE ||--|| CATEGORY : classified_by
    NODE ||--o| NODE : parent

    LINK {
      LINK_ID int PK
      LINK_NODE_FROM int FK
      LINK_NODE_TO int FK
      LINK_ANCHOR_TEXT string
    }

    USER {
      USER_ID int PK
      USER_EMAIL string
      USER_CREATED_AT datetime
      USER_LAST_SIGN_IN datetime
    }

    PROFILE {
      USER_ID int PK, FK
      PROFILE_NAME string
    }

    WORLD {
      WORLD_ID int PK
      WORLD_JOIN_CODE string
      WORLD_NAME string
      WORLD_DESCRIPTION string
      WORLD_CREATED_AT datetime
    }

    MEMBER {
      USER_ID int PK, FK
      WORLD_ID int PK, FK
      MEMBER_ROLE string
      MEMBER_JOINED_AT datetime
    }

    BOOK {
      BOOK_ID int PK
      WORLD_ID int FK
      BOOK_TYPE string
    }

    NODE {
      NODE_ID int PK
      BOOK_ID int FK
      NODE_PARENT_ID int FK
      NODE_TYPE string
      NODE_TITLE string
      NODE_ORDER_INDEX int
      NODE_IS_HIDDEN boolean
      USER_ID int FK
      NODE_CREATED_AT datetime
      NODE_UPDATED_AT datetime
      NODE_PREVIEW_TEXT string
      NODE_SLUG string
      NODE_IMAGE_URL string
    }

    ENTRY {
      NODE_ID int PK, FK
      ENTRY_CONTENT text
    }

    CATEGORY {
      NODE_ID int PK, FK
      CATEGORY_DESCRIPTION string
    }

    USER ||--o{ MEMBER : has
    WORLD ||--o{ MEMBER : has
    NODE ||--o{ LINK : from
    NODE ||--o{ LINK : to
```

> Constraint: NODE is a total, disjoint specialization into ENTRY or CATEGORY based on NODE_TYPE (ENTRY/CATEGORY).

