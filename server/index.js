const express = require('express');
const http = require('http');
const dns = require('dns');
const { Server } = require('socket.io');

// Force IPv4 for all network connections (resolves ENETUNREACH on Render/Supabase)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Database Pool - Force SSL for remote connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1')
        ? false 
        : { rejectUnauthorized: false }
});

// Test DB Connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to the database');
    release();
});

// Middleware for DB access
app.use((req, res, next) => {
    req.db = pool;
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Live Event Map API is running');
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join specialized rooms
    socket.on('join_chat', ({ eventId, type }) => {
        const room = `event_${eventId}_${type}`;
        socket.join(room);
        console.log(`User ${socket.id} joined chat room: ${room}`);
    });

    socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined personal notification room: user_${userId}`);
    });

    socket.on('send_message', async (data) => {
        const { event_id, user_id, user_name, content, type } = data;
        const room = `event_${event_id}_${type}`;

        try {
            // Persist to database
            const result = await pool.query(
                'INSERT INTO messages (event_id, user_id, user_name, content, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [event_id, user_id, user_name, content, type]
            );

            // Broadcast to the specific room
            io.to(room).emit('chat_message', result.rows[0]);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
