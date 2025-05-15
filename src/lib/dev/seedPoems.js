import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 1️⃣ Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyCFndnFafVysVKPOpKpjf-1MmyvCHVe5PE",
  authDomain: "starry-night-8f28c.firebaseapp.com",
  projectId: "starry-night-8f28c",
  storageBucket: "starry-night-8f28c.firebasestorage.app",
  messagingSenderId: "379717652242",
  appId: "1:379717652242:web:1f382c6d45366d1a342dcb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2️⃣ __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 3️⃣ JSON 파일 읽기
const filePath = resolve(__dirname, '../../data/poems.json');
const file = await readFile(filePath, 'utf-8');
const poems = JSON.parse(file);

// 4️⃣ Firestore에 업로드
async function seedPoems() {
  for (const poem of poems) {
    const ref = doc(db, 'poems', poem.num.toString());
    await setDoc(ref, {
      title: poem.title,
      author: poem.author,
      content: poem.content,
      likesCount: 0  // 기본값
    });
    console.log(`✅ 업로드 완료: ${poem.title}`);
  }
}

seedPoems().then(() => {
  console.log('🌱 모든 시 업로드 완료!');
  process.exit();
}).catch((err) => {
  console.error('🚨 오류 발생:', err);
  process.exit(1);
});
