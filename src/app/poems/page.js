'use client';

import { useState, useEffect } from 'react';
import poemsData from '../../data/poems.json';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { initializeLikesCount } from '@/lib/user-activity/initLikesCount';


const SearchBar = dynamic(
  () => import('../../components/user-activity/SearchBar'),
  { ssr: false }
);




export default function PoemsPage() {
  const [poems, setPoems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // 🚨 개발 중에만 잠깐 활성화 (주의!)
    initializeLikesCount();
  }, []);


  useEffect(() => {
    // 전체 시 목록 및 검색용 시는 로컬 JSON에서 불러옴
    setPoems(poemsData);
    setFiltered(poemsData);
  }, []);

  useEffect(() => {
    const fetchTopLikedPoems = async () => {
      const poemsRef = collection(db, 'poems');
      const q = query(poemsRef, orderBy('likesCount', 'desc'), limit(5));
      const snap = await getDocs(q);
      const topPoems = snap.docs.map(doc => ({ ...doc.data(), num: Number(doc.id) }));
      setRecommended(topPoems);
    };
    fetchTopLikedPoems();
  }, []);

  const handleSearch = (keyword) => {
    const trimmed = keyword.trim();
    const lowerKeyword = trimmed.toLowerCase();

    if (trimmed === "") {
      setFiltered(poems);
      setHasSearched(false);
    } else {
      const result = poems.filter((p) =>
        p.title.toLowerCase().includes(lowerKeyword) ||
        p.author.toLowerCase().includes(lowerKeyword)
      );
      setFiltered(result);
      setHasSearched(true);
    }
  };

  return (
    <div className="flex gap-10 px-6 py-8 max-w-screen-xl mx-auto text-white">
      {/* 📜 왼쪽: 전체 시 목록 */}
      <div className="w-1/4 mt-12">
        <h2 className="text-xl font-semibold mb-2">📜 전체 시 목록</h2>
        <div className="overflow-y-auto max-h-[500px] pr-2 custom-scroll">
          <ul className="space-y-2">
            {poems.map((poem) => (
              <li key={poem.num}>
                <Link href={`/poems/${poem.num}`} className="hover:underline">
                  {poem.title} - {poem.author}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 🔍 가운데: 검색창 + 검색 결과 */}
      <div className="w-2/4">
        <h1 className="text-3xl font-bold mb-6 text-center">📖 시 감상</h1>
        <SearchBar onSearch={handleSearch} />

        {hasSearched && (
          <div className="mt-10">
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
        )}
      </div>

      {/* 🌟 오른쪽: 추천 시 */}
      <div className="w-1/4 relative left-8 mt-12">
        <h2 className="text-xl font-semibold mb-2">🌟 추천 시</h2>
        <ul className="space-y-2">
          {recommended.map((poem) => (
            <li key={poem.num}>
              <Link href={`/poems/${poem.num}`} className="text-blue-300 hover:underline">
                {poem.title} - {poem.author} ❤️ {poem.likesCount || 0}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
