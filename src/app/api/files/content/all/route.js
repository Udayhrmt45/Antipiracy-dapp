// /app/api/content/all/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../../../utils/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT content_id, ipfs_hash, price_eth FROM content');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}