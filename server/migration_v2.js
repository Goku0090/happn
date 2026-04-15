const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function migrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('CONNECTED TO DB');
        
        // Add status to event_participants
        await client.query("ALTER TABLE event_participants ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';");
        console.log('ADDED status COLUMN TO event_participants');
        
        // Add organizer_name to events if missing
        await client.query("ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_name VARCHAR(255);");
        console.log('ADDED organizer_name COLUMN TO events');

    } catch (err) {
        console.error('MIGRATION ERROR:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
