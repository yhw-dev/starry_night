import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST: /api/posts/[id]/like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
  }

  try {
    // 1. 사용자가 이미 좋아요를 눌렀는지 확인
    const existing = await pool.query(
      'SELECT 1 FROM poem_likes WHERE user_id = $1 AND poem_id = $2',
      [userId, id]
    );

    if ((existing?.rowCount ?? 0) > 0) {
      // 이미 눌렀다면 → 좋아요 취소
      await pool.query(
        'DELETE FROM poem_likes WHERE user_id = $1 AND poem_id = $2',
        [userId, id]
      );

      const updated = await pool.query(
        'UPDATE poems SET likes = likes - 1 WHERE id = $1 RETURNING likes',
        [id]
      );

      return NextResponse.json({ liked: false, likes: updated.rows[0].likes }, { status: 200 });
    } else {
      // 안 눌렀다면 → 좋아요 추가
      await pool.query(
        'INSERT INTO poem_likes (user_id, poem_id) VALUES ($1, $2)',
        [userId, id]
      );

      const updated = await pool.query(
        'UPDATE poems SET likes = likes + 1 WHERE id = $1 RETURNING likes',
        [id]
      );

      return NextResponse.json({ liked: true, likes: updated.rows[0].likes }, { status: 200 });
    }
  } catch (error) {
    console.error(`LIKE 토글 오류 (id=${id}):`, error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}