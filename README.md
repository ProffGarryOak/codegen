# Code Generation Copilot

A minimal full-stack web app for generating code using AI, powered by Next.js, Supabase, and Google Gemini.

## Features
- **AI Code Generation**: Generates code in multiple languages (Python, JS, C++, etc.) using Gemini API.
- **History Tracking**: Saves all generations to a Supabase database.
- **Pagination**: Browse through previous generations.
- **Responsive UI**: Clean, muted dark cyan theme with light/dark mode support.
- **Syntax Highlighting**: Beautiful code display.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Zustand, Lucide React.
- **Backend**: Next.js API Routes.
- **Database**: Supabase (PostgreSQL).
- **AI**: Google Gemini API.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd code-gen-copilot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `GEMINI_API_KEY`: Your Google Gemini API Key.

4. **Database Setup**:
   - Run the migration script in your Supabase SQL Editor: `supabase/migrations/20240521000000_initial_schema.sql`.
   - This will create `languages` and `generations` tables and seed the languages.

5. **Run the app**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Database Schema & Complexity Analysis

### Schema Design
The database uses a normalized relational schema:
- **`languages`**: Stores supported languages. Separating this allows for easy management of supported languages and ensures data consistency via Foreign Keys.
- **`generations`**: Stores the actual content, referencing `languages` via `language_id`.

**ER Diagram**: See `schema.md` or the migration file.

### Complexity
- **Paginated Retrieval**: The `GET /api/history` endpoint uses `OFFSET` and `LIMIT`.
    - **Time Complexity**: O(Limit) for fetching rows after finding the offset. However, standard SQL offset pagination can degrade to O(Offset + Limit) as the database must scan and discard prior rows.
    - **Optimization**: An index on `created_at` (descending) allows the database to efficiently find the top N rows. For very large datasets, cursor-based pagination (using the last seen `created_at` or `id`) would be O(Limit) constant time, but offset is sufficient for this scale.
- **Indexes**:
    - `languages(slug)`: Unique index. O(1) / O(log N) lookup for finding language IDs during generation.
    - `generations(created_at)`: Implicitly used for sorting history.

## Design Decisions
- **Zustand**: Used for global state to avoid prop drilling, especially for sharing the `generatedCode` and `history` between the form, feed, and editor components.
- **Tailwind**: For rapid, consistent styling with a custom "Muted Dark Cyan" theme.
- **Next.js API Routes**: Keeps the backend logic close to the frontend, simplifying the architecture for this demo.
