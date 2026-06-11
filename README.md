# My Leaderboard Backend

Express + MongoDB backend for the leaderboard app.

## Setup

1. Start MongoDB locally or provide a connection string in `MONGODB_URI`.
2. Copy `.env.example` to `.env` and update values if needed.
3. Install dependencies:

```bash
npm install
```

4. Run the server:

```bash
npm run dev
```

The API listens on `http://localhost:3001` by default.

## API

- `GET /api/health`
- `GET /api/players`
- `POST /api/players`
- `PATCH /api/players/:id`
- `DELETE /api/players/:id`
- `PUT /api/players`

The app frontend uses `PUT /api/players` to keep the whole player list in sync with MongoDB.
