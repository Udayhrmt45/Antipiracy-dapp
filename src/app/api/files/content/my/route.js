"use server";
// pages/api/content/my.js
import pool from "../../../../../../utils/db";

export default async function handler(req, res) {
  const { userAddress } = req.query;

  if (!userAddress) {
    return res.status(400).json({ error: 'User address required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT c.content_id, c.ipfs_hash, c.price_eth 
       FROM content c
       JOIN content_access ca ON c.content_id = ca.content_id
       WHERE ca.user_address = $1`,
      [userAddress]
    );
    client.release();
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
}