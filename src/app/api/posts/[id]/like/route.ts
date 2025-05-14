import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// POST: /api/posts/[id]/like
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } } // ✅ 이렇게 명시적으로 params만 구조분해
) {
  const id = parseInt(params.id)

  try {
    const result = await pool.query(
      'UPDATE poems SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '게시글 없음' }, { status: 404 })
    }

    return NextResponse.json({ likes: result.rows[0].likes }, { status: 200 })
  } catch (error) {
    console.error(`LIKE 오류 (id=${id}):`, error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
