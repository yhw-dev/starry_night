import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    const query = `
      INSERT INTO poems (title, content, created_date)
      VALUES ($1, $2, NOW())
      RETURNING *;
    `;
    const values = [title, content];

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('Insert error:', err);
    return NextResponse.json({ error: 'Failed to insert poem' }, { status: 500 });
  }
}
