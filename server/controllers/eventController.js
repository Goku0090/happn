const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createEvent = async (req, res) => {
    const { title, description, category, latitude, longitude, start_time, end_time, organizer_name } = req.body;
    const db = req.db;
    const io = req.io;
    const userId = req.user.id;

    if (!title || !latitude || !longitude) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await db.query(
            `INSERT INTO events (title, description, category, latitude, longitude, location, start_time, end_time, created_by, organizer_name)
             VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_Point($5, $4), 4326)::geography, $6, $7, $8, $9)
             RETURNING id, title, description, category, latitude, longitude, start_time, end_time, organizer_name`,
            [title, description, category, latitude, longitude, start_time, end_time, userId, organizer_name]
        );

        const newEvent = result.rows[0];
        io.emit('new_event', newEvent);
        res.status(201).json(newEvent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating event' });
    }
};

exports.getNearbyEvents = async (req, res) => {
    const { lat, lng, radius = 5000, category } = req.query;
    const db = req.db;

    if (!db) return res.status(503).json({ message: 'Database disconnected' });

    try {
        let query = `
            SELECT id, title, description, category, latitude, longitude, start_time, end_time,
            ST_Distance(location, ST_SetSRID(ST_Point($2, $1), 4326)::geography) as distance
            FROM events
            WHERE ST_DWithin(location, ST_SetSRID(ST_Point($2, $1), 4326)::geography, $3)
        `;
        const params = [lat, lng, radius];
        if (category && category !== 'all') {
            query += ` AND category = $4`;
            params.push(category);
        }
        query += ` ORDER BY distance ASC`;

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.json([]);
    }
};

exports.joinEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.db;
    const io = req.io;

    try {
        await db.query(
            'INSERT INTO event_participants (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, id]
        );

        const attendeesCount = await db.query(
            'SELECT COUNT(*) FROM event_participants WHERE event_id = $1',
            [id]
        );

        io.emit('join_event', { eventId: id, attendees: attendeesCount.rows[0].count });
        res.json({ message: 'Joined event successfully', attendees: attendeesCount.rows[0].count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error joining event' });
    }
};

exports.getMyEvents = async (req, res) => {
    const userId = req.user.id;
    const db = req.db;

    try {
        const result = await db.query(
            'SELECT * FROM events WHERE created_by = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching your events' });
    }
};
