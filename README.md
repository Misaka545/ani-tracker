# AniTracker

Anime tracking web app built with **Elysia.js** (Bun) + **React/Vite** + **Jikan API v4**.

## Features

- **Home** — Top Airing, Popular This Season, Most Anticipated
- **Search** — Full-text search with filters (Type, Status, Sort), smart suggestions with keyboard navigation
- **Seasonal** — Browse anime by season and year
- **My List** — Track anime with status (Watching, Completed, Plan to Watch, On Hold, Dropped), persisted in SQLite
- **Detail Modal** — Synopsis, trailer, genres, stats, production info
- **Dark Mode** — Auto-detects system preference, manual toggle

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Elysia.js (Bun) |
| Frontend | React 19 + Vite 6 |
| API | Jikan API v4 (MyAnimeList) |
| Database | SQLite (bun:sqlite) |
| Styling | Vanilla CSS, Satoshi font |
| Theme | Light (Sakura Blossom) / Dark, auto-detect |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+

### Install & Run

```bash
# Install dependencies
cd server && bun install
cd ../client && bun install

# Start backend (Terminal 1)
cd server
bun run dev

# Start frontend (Terminal 2)
cd client
npx vite --host
```

The Vite dev server proxies `/api` requests to the backend automatically.

## Project Structure

```
anilist/
├── server/
│   ├── src/
│   │   ├── index.ts              # Server entry, CORS, route registration
│   │   ├── db/
│   │   │   └── database.ts       # SQLite schema & CRUD queries
│   │   ├── routes/
│   │   │   ├── anime.ts          # /api/anime/* (search, top, detail)
│   │   │   ├── seasonal.ts       # /api/seasonal/* (by season/year)
│   │   │   └── list.ts           # /api/list/* (user list CRUD)
│   │   └── utils/
│   │       └── jikan.ts          # Jikan API client with rate limiter
│   ├── data/                     # SQLite database (auto-created, gitignored)
│   └── package.json
├── client/
│   ├── src/
│   │   ├── main.jsx              # React entry
│   │   ├── App.jsx               # Router, theme, tracker provider
│   │   ├── index.css             # Design tokens (light + dark)
│   │   ├── App.css               # Component styles
│   │   ├── api/
│   │   │   ├── jikan.js          # Frontend API client
│   │   │   └── list.js           # List API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Nav with theme toggle
│   │   │   ├── AnimeCard.jsx     # Card with score/type badges
│   │   │   ├── AnimeDetail.jsx   # Detail modal with genre navigation
│   │   │   ├── SearchBar.jsx     # Smart suggestions, debounce, keyboard nav
│   │   │   ├── AnimeGrid.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── SkeletonCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx        # Filters + URL state persistence
│   │   │   ├── Seasonal.jsx
│   │   │   └── MyList.jsx
│   │   ├── hooks/
│   │   │   ├── useTracker.js     # Database-backed list management
│   │   │   └── useTheme.js       # System preference + manual toggle
│   │   └── utils/
│   │       └── constants.js      # Status config, formatters
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/anime/search` | Search anime with filters |
| GET | `/api/anime/top` | Top anime by filter |
| GET | `/api/anime/:id` | Anime detail |
| GET | `/api/anime/:id/characters` | Characters |
| GET | `/api/anime/:id/recommendations` | Recommendations |
| GET | `/api/seasonal/now` | Current season |
| GET | `/api/seasonal/:year/:season` | Specific season |
| GET | `/api/list` | Get user list |
| GET | `/api/list/:id` | Check if in list |
| POST | `/api/list` | Add to list |
| PATCH | `/api/list/:id` | Update status |
| DELETE | `/api/list/:id` | Remove from list |
