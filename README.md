# Live Animated Event Map Web App

A real-time, animated map for discovering and creating nearby events.

## Features
- **Real-time Map**: Mapbox GL JS with animated pulsing markers.
- **Instant Updates**: New events appear instantly for all users via Socket.io.
- **Geospatial Discovery**: Find events based on your exact location using PostGIS.
- **Premium UI**: Sleek dark theme with glassmorphism and smooth animations.
- **Event Management**: Create, view, and join events.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Framer Motion, Mapbox GL JS.
- **Backend**: Node.js, Express, Socket.io, JWT.
- **Database**: PostgreSQL with PostGIS.

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL and PostGIS are installed. Run the schema:
```bash
psql -d YOUR_DB_NAME -f server/db/schema.sql
```

### 2. Backend Setup
1. CD into `server`.
2. Install dependencies: `npm install`.
3. Create `.env` from `.env.example` and fill in your database credentials and Mapbox token.
4. Start the server: `npm start` (or `npm run dev` with nodemon).

### 3. Frontend Setup
1. CD into `client`.
2. Install dependencies: `npm install`.
3. Set `NEXT_PUBLIC_MAPBOX_TOKEN` and `NEXT_PUBLIC_API_URL` in environment variables.
4. Start the app: `npm run dev`.

## API Endpoints
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Log in and get a JWT.
- `GET /api/events`: Get nearby events (requires `lat`, `lng`, `radius`).
- `POST /api/events`: Create a new event (requires Auth).
- `POST /api/events/:id/join`: Join an event (requires Auth).
