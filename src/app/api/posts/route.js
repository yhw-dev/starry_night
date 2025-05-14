// app/api/posts/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import posts from '@/data/posts';

// 전체 게시글 조회 - GET 요청 처리
// 게시글 목록 페이지로 이동하면 실행됨
export async function GET() {
  try {
    // 만약 api 서버로 요청을 보내서 게시글 목록을 가져오고 싶다면
    // const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    // const posts = response.data;

    // 로컬 데이터를 바로 반환합니다
    return NextResponse.json(posts);
  } catch (error) {
    // 에러가 발생하면 에러 메시지와 함께 500 상태 코드 반환
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 게시글 작성 - POST 요청 처리
// 글쓰기 페이지에서 제출하면 실행됨
export async function POST(req) {

  // 글을 작성하면 req 객체에는 다음과 같은 정보가 들어있습니다
  // {
  //   headers: Headers { host: 'localhost:3000', 'content-type': 'application/json', ... },
  //   method: 'POST',
  //   url: 'http://localhost:3000/api/posts',
  //   body: { title: '새 글', content: '내용입니다' }
  //   (단, 직접 접근은 불가능하며 req.json()으로 파싱해야 함)
  // }

  try {
    // 요청 본문에서 데이터 추출
    // data = { title: '새 글', content: '새 글 내용입니다' }
    const data = await req.json();

    // 제목이나 내용이 없으면 400 에러 반환
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 } // 400: Bad Request
      );
    }

    // newPost 객체 생성
    const newPost = {
      id: posts.length + 1,
      title: data.title,
      content: data.content,
      createdAt: new Date().toLocaleDateString()
    };

    // 서버의 데이터 베이스(posts)에 새 게시글 추가
    posts.push(newPost);
    
    // 클라이언트에게 새 게시글 반환
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: '게시글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

