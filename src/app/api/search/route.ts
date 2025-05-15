import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const query = `
      SELECT id, title, content
      FROM poems
      WHERE LOWER(title) LIKE $1 OR LOWER(content) LIKE $1
      ORDER BY created_date DESC
      LIMIT 30
    `;
    const values = [`%${keyword.toLowerCase()}%`];

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("검색 오류:", error);
    return NextResponse.json({ error: "검색 실패" }, { status: 500 });
  }
}