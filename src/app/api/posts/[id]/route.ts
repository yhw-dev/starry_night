// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// 타입 정의
interface RouteContext {
  params: {
    id: string
  }
}

// 공통 포맷터 (created_at → createdAt 등)
function formatPost(row: any) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: row.created_date,
    likes: row.likes,
  }
}

// GET: 게시글 상세 조회
export async function GET(
  _: NextRequest,
  context: RouteContext
) {
  const { params } = context
  const id = parseInt(params.id)

  try {
    const result = await pool.query('SELECT * FROM poems WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(formatPost(result.rows[0]), { status: 200 })
  } catch (error) {
    console.error(`GET 오류 (id=${id}):`, error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// PUT: 게시글 수정
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { params } = context
  const id = parseInt(params.id)
  const { title, content } = await request.json()

  try {
    const result = await pool.query(
      `UPDATE poems 
       SET title = $1, content = $2
       WHERE id = $3
       RETURNING *`,
      [title, content, id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '수정할 게시글이 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(formatPost(result.rows[0]), { status: 200 })
  } catch (error) {
    console.error(`PUT 오류 (id=${id}):`, error)
    return NextResponse.json({ error: '수정 실패' }, { status: 500 })
  }
}

// DELETE: 게시글 삭제
export async function DELETE(
  _: NextRequest,
  context: RouteContext
) {
  const { params } = context
  const id = parseInt(params.id)

  try {
    const result = await pool.query('DELETE FROM poems WHERE id = $1 RETURNING *', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '삭제할 게시글이 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(
      { message: '삭제 완료', deleted: formatPost(result.rows[0]) },
      { status: 200 }
    )
  } catch (error) {
    console.error(`DELETE 오류 (id=${id}):`, error)
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 })
  }
}
