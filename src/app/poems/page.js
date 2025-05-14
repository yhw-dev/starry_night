'use client';

import { useState, useEffect } from 'react';
import poemsData from '../../data/poems.json'; // 정확한 경로 사용!
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 🔽 dynamic import로 SearchBar 컴포넌트 불러오기 (클라이언트 전용)
const SearchBar = dynamic(
  () => import('../../components/user-activity/SearchBar'),
  { ssr: false }
);


export default function PoemsPage() {
  const [poems, setPoems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const sorted = [...poemsData].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    setPoems(poemsData);
    setFiltered(poemsData);
    setRecommended(sorted.slice(0, 5));
  }, []);

  const handleSearch = (keyword) => {
    const result = poems.filter((p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">📖 시 감상</h1>

      {/* ✅ 검색 바 삽입 */}
      <SearchBar onSearch={handleSearch} />

      {/* ✅ 추천 시 5편 */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">🌟 추천 시</h2>
        <ul className="mb-6 space-y-2">
          {recommended.map((poem) => (
            <li key={poem.num}>
              <Link
                href={`/poems/${poem.num}`}
                className="text-blue-300 hover:underline"
              >
                {poem.title} - {poem.author}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ 검색 결과 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">🔍 검색 결과</h2>
        {filtered.length === 0 ? (
          <p className="text-gray-300">검색 결과가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((poem) => (
              <li key={poem.num}>
                <Link href={`/poems/${poem.num}`} className="hover:underline">
                  {poem.title} - {poem.author}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
