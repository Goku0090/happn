const { Client } = require('pg');
require('dotenv').config();

const sql = `
-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'query', -- 'query' or 'group'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_messages_event_type ON messages(event_id, type);
`;

async function addMessagesTable() {
    console.log('Connecting to database...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected. Creating messages table...');
        await client.query(sql);
        console.log('SUCCESS: Messages table created successfully.');
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

addMessagesTable();
