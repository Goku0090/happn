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


# Happn - Real-time Event Discovery Map

A premium, interactive geospatial platform for discovering and creating live events in real-time. Built with a focus on high-end aesthetics and high-performance geospatial data processing.

---

## 🚀 Chosen Vertical: Geospatial Social Discovery
This project sits at the intersection of **Hyperlocal Social Networking** and **Event Discovery**. Unlike traditional list-based event platforms, this solution prioritizes a **map-first interface** to help users visualize what is happening "right here, right now." 

**Target Audience:** Urban explorers, community organizers, and social seekers looking for spontaneous nearby engagement.

---

## 🧠 Approach and Logic

### 1. Geospatial Backend (The "Brain")
The core logic relies on **PostgreSQL with the PostGIS extension**. 
- **Storage**: Events are stored as `GEOGRAPHY(POINT, 4326)` objects, which allows for accurate distance calculations on a spherical earth model.
- **Query Logic**: We use `ST_DWithin` for ultra-fast filtering of events within a user's viewport/radius and `ST_Distance` to provide proximity sorting.
- **Search Optimization**: A **GIST (Generalized Search Tree)** index is implemented on the location column to ensure queries remain performant even with thousands of active markers.

### 2. Real-time Synchronization
To create a "live" feel, we implemented **Socket.io** across the stack:
- **Marker Propagation**: When a user creates an event, it is broadcasted globally. All active maps update instantly without a page refresh.
- **Real-time Chat**: Each event features two chat types (Public Query vs. Accepted Participant Group). Socket.io handles message routing and real-time typing indicators.

### 3. Premium Frontend Architecture
- **Rendering Engine**: Mapbox GL JS for vector-based, hardware-accelerated mapping.
- **Design System**: A custom "Glassmorphism" theme using Lucide icons, Inter typography, and Framer Motion for smooth, spring-based UI transitions.
- **Auth**: Stateless JWT-based authentication ensures the map remains responsive while securing user data.

---

## 🛠️ How the Solution Works

1.  **Discovery Phase**: Upon loading, the app calculates a search radius around the user's current center (centered on Bangalore by default). The frontend queries `/api/events`, which returns a Geo-filtered JSON payload.
2.  **Interactive Exploration**:
    - **Pulsing Markers**: Markers use animated SVG overlays to indicate "live" status.
    - **Event Cards**: Clicking a marker pulls the event details into a framer-motion `AnimatePresence` overlay with backdrop-blur effects.
3.  **Creation Workflow**: 
    - A long-press or click on the map captures `(lat, lng)` coordinates.
    - An `AddEventModal` slides up, allowing the user to define details.
    - Upon submission, the backend persists the event and triggers an `io.emit('new_event')`.
4.  **Participant Management**:
    - Users can "Join" events.
    - Organizers can view a list of seekers and "Accept" or "Reject" them, triggering real-time status notifications to the target users.

---

## 📝 Assumptions Made

- **Geospatial Precision**: It is assumed that 10-meter precision is sufficient for event markers, and as such, `SRID 4326` is used throughout the stack.
- **User Location**: If the browser's Geolocation API is unavailable, the application defaults to a high-density urban center (coordinates: `12.9716, 77.5946`).
- **Network Stability**: The real-time features assume a persistent WebSocket connection. We implement basic reconnection logic, but a stable internet connection is required for the "Live" experience.
- **Environment**: It is assumed that the hosting environment supports PostgreSQL extensions (specifically PostGIS) and has Mapbox access (provided via `.env`).

---

## 🛠️ Tech Stack Recap
- **Frontend**: Next.js 15+, Framer Motion, Mapbox GL, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, JWT.
- **Database**: PostgreSQL + PostGIS (Hosted on Supabase).


