import pg from 'pg';
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
console.log('Testing connection to:', connectionString?.split('@')[1]);

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

test();
