const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        console.log('Connecting to DB...');
        const res = await pool.query('SELECT * FROM users LIMIT 10;');
        console.log('Users found:', res.rows.length);
        console.table(res.rows.map(r => ({ id: r.id, name: r.name, email: r.email })));
    } catch (err) {
        console.error('DB Connection Error:', err);
    } finally {
        await pool.end();
    }
}

test();
