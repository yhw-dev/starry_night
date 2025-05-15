import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// ✅ 전체 게시글 조회 (GET)
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, title, content, created_date, likes, author
      FROM poems 
      ORDER BY created_date DESC
    `);

    const posts = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_date,
      likes: row.likes,
      authorId: row.author, // ✅ author도 포함시켜서 반환
    }));

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('GET 오류:', error);
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// ✅ 새 게시글 작성 (POST)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, content, authorId } = data;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: '제목, 내용, 사용자 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO poems (title, content, author, created_date, likes)
       VALUES ($1, $2, $3, NOW(), 0)
       RETURNING id, title, content, created_date, likes, author`,
      [title, content, authorId] // ✅ UID 저장
    );

    const newPost = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      createdAt: result.rows[0].created_date,
      likes: result.rows[0].likes,
      authorId: result.rows[0].author,
    };

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('POST 오류:', error);
    return NextResponse.json(
      { error: '게시글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
