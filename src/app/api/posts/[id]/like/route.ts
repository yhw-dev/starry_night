import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// 타입 정의
type RouteContext = {
  params: {
    id: string
  }
}

// POST 요청 처리 - 좋아요 수 증가
export async function POST(
  _req: NextRequest,
  context: RouteContext
) {
  const id = parseInt(context.params.id)

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
