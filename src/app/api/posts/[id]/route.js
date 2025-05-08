import { NextResponse } from 'next/server';
import posts from '@/data/posts';

// 특정 게시글 조회 - GET 요청 처리
// 게시글 상세 페이지로 이동하면 실행됨
// response 인수 대신 params 인수를 사용하여 URL 파라미터를 전달받음
export async function GET(request, { params }) {
  // params = { id: '1' }
 try {
   // URL 파라미터로 전달된 id 값과 일치하는 게시글 찾기
   const post = posts.find(post => post.id === parseInt(params.id));
   
   // 게시글이 없을 경우 404 응답
   if (!post) {
     return NextResponse.json(
       { error: '게시글을 찾을 수 없습니다.' },
       { status: 404 }
     );
   }
   
   return NextResponse.json(post);
 } catch (error) {
   return NextResponse.json(
     { error: '게시글을 불러오는데 실패했습니다.' },
     { status: 500 }
   );
 }
}

// 게시글 수정 - PUT 요청 처리
// 수정할 내용을 입력하고 PUT 요청을 보내면 실행됨
export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    // data = { title: '수정된 제목', content: '수정된 내용' }
    
    // id와 일치하는 게시글의 인덱스 찾기
    const index = posts.findIndex(post => post.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // posts = [
    //   { id: 1, title: '첫글' },    // p.id === 1 비교 -> true
    //   { id: 2, title: '둘째글' },  // 여기까지 안 감
    //   { id: 3, title: '셋째글' }   // 여기까지 안 감
    // ]

    // 첫번째 요소 에서 p.id === 1 비교 -> true 가 되므로
    // index = 0 이 됨
    posts[index] = {
      ...posts[index],
      title: data.title || posts[index].title,
      content: data.content || posts[index].content
    };

    // 게시글 업데이트 - 제목이나 내용이 없으면 기존 값 유지
    // posts[0] = 
    // { 
    // id: 1, title: '첫 번째 글', content: '안녕하세요!', createdAt: '2024-01-01', 
    // title: '수정된 제목', 
    // content: '수정된 내용' 
    // }
    
    // 클라이언트에게 수정된 게시글 (post[0]) 반환
    return NextResponse.json(posts[index], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '게시글 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 삭제 - DELETE 요청 처리
export async function DELETE(req, { params }) {
  try {
    // id와 일치하는 게시글의 인덱스 찾기
    const index = posts.findIndex(p => p.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 게시글 삭제
    // slice() 함수는 배열의 일부를 추출하여 새로운 배열을 만듭니다
    // splice(시작 인덱스, 삭제할 요소 개수) 함수는 배열에서 요소를 삭제합니다
    posts.splice(index, 1);
    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json(
      { error: '게시글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}