# Database Schema

## ER Diagram

```mermaid
erDiagram
    LANGUAGES ||--o{ GENERATIONS : "has many"
    LANGUAGES {
        bigint id PK
        text name
        text slug
    }
    GENERATIONS {
        uuid id PK
        text prompt
        text code
        bigint language_id FK
        timestamptz created_at
    }
```

## Tables

### `languages`
Stores supported programming languages.
- `id`: Primary Key.
- `name`: Display name (e.g., "Python").
- `slug`: Identifier for API/URL (e.g., "python").

### `generations`
Stores the history of generated code.
- `id`: Primary Key (UUID).
- `prompt`: The user's input prompt.
- `code`: The generated code.
- `language_id`: Foreign Key referencing `languages.id`.
- `created_at`: Timestamp of generation.

## Indexes
- `languages(slug)`: Unique index for fast lookup by slug.
- `generations(created_at)`: Implicitly useful for sorting by date (though a specific index might be added if volume grows).
