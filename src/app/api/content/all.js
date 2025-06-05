// pages/api/content/all.js
import pool from '../../../utils/db';

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT content_id, ipfs_hash, price_eth FROM content'
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
}