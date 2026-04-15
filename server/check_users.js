const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('CONNECTED');
        const res = await client.query('SELECT id, name, email FROM users');
        console.log('TOTAL_USERS:', res.rows.length);
        res.rows.forEach(r => console.log(`USER: ${r.id} | ${r.name} | ${r.email}`));
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await client.end();
    }
}
run();
