import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const result = await pool.query('SELECT * FROM poems WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('GET 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const { title, content } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE poems 
       SET title = $1, content = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [title, content, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '수정할 게시글이 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('PUT 오류:', error);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const result = await pool.query('DELETE FROM poems WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '삭제할 게시글이 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '삭제 완료', deleted: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('DELETE 오류:', error);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
}
