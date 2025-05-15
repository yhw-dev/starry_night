import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// 공통 포맷터 (created_at → createdAt 등)
function formatPost(row: any) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    authorId: row.author,
    createdAt: row.created_date,
    likes: row.likes,
  }
}

// GET: 게시글 조회
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await pool.query('SELECT * FROM poems WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(formatPost(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(`GET 오류 (id=${id}):`, error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// PUT: 게시글 수정 (작성자만 가능)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { title, content, authorId } = await request.json();

  try {
    // 작성자 확인
    const existing = await pool.query('SELECT author FROM poems WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      return NextResponse.json({ error: '게시글이 존재하지 않습니다.' }, { status: 404 });
    }

    const post = existing.rows[0];
    if (post.author !== authorId) {
      return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 });
    }

    const result = await pool.query(
      `UPDATE poems SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
      [title, content, id]
    );

    return NextResponse.json(formatPost(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(`PUT 오류 (id=${id}):`, error);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}

// DELETE: 게시글 삭제 (작성자만 가능)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorId } = await request.json();

  try {
    // 작성자 확인
    const existing = await pool.query('SELECT author FROM poems WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      return NextResponse.json({ error: '게시글이 존재하지 않습니다.' }, { status: 404 });
    }

    const post = existing.rows[0];
    if (post.author !== authorId) {
      return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
    }

    const result = await pool.query('DELETE FROM poems WHERE id = $1 RETURNING *', [id]);

    return NextResponse.json(
      { message: '삭제 완료', deleted: formatPost(result.rows[0]) },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE 오류 (id=${id}):`, error);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
}
