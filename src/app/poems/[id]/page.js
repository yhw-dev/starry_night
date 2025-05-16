'use client';

import { useRouter, useParams } from 'next/navigation';
import poems from '@/data/poems.json';
import { ArrowLeft, Volume2, Square, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { checkLikedPoem, logLikePoem, logReadPoem } from '../../../lib/user-activity';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import Button from '@/components/ui/Button'; // ✅ 커스텀 Button 컴포넌트

export default function PoemDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const [poem, setPoem] = useState(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {    
    const matchedPoem = poems.find((p) => p.num === Number(id));
    setPoem(matchedPoem);
  }, [id]);

  useEffect(() => {
    if (!poem) return;
    if (user) {
      checkLikedPoem(user.uid, String(poem.num)).then(setLiked);
      logReadPoem(user.uid, String(poem.num));
    }
    fetchLikeCount();
  }, [user, poem]);

  const fetchLikeCount = async () => {
    if (!poem) return;
    const usersSnap = await getDocs(collection(db, 'users'));
    let count = 0;
    for (const userDoc of usersSnap.docs) {
      const likesSnap = await getDocs(collection(db, 'users', userDoc.id, 'likes'));
      likesSnap.docs.forEach((doc) => {
        if (doc.id === String(poem.num)) {
          count++;
        }
      });
    }
    setLikeCount(count);
  };

  const emotionToVoiceSettings = {
    happy: { pitch: 1.3, rate: 1.2 },
    sad: { pitch: 0.9, rate: 0.8 },
    angry: { pitch: 1.1, rate: 1.4 },
    neutral: { pitch: 1.0, rate: 1.0 }
  };

  const fetchEmotion = async (text) => {
    try {
      const res = await fetch('/api/analyzeEmotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      return data.emotion || 'neutral';
    } catch (err) {
      console.error('Emotion API error:', err);
      return 'neutral';
    }
  };

  const speakPoem = async () => {
    if (!synth || !poem) return;
    setIsSpeaking(true);

    const emotion = await fetchEmotion(poem.content);
    const settings = emotionToVoiceSettings[emotion] || emotionToVoiceSettings.neutral;

    const utterance = new SpeechSynthesisUtterance(poem.content);
    utterance.lang = 'ko-KR';
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;

    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synth) synth.cancel();
    setIsSpeaking(false);
  };

  const handleLike = async () => {
    if (!user || !poem) return;
    const result = await logLikePoem(user.uid, String(poem.num));
    setLiked(result);
    fetchLikeCount();
  };

  if (!poem) {
    return <div className="text-white p-6">해당 시를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="relative px-6 py-8 max-w-2xl mx-auto text-white">
      <button
        onClick={() => router.back()}
        className="absolute left-0 top-0 mt-6 ml-4 text-white hover:text-blue-300 transition"
        aria-label="뒤로가기"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="pl-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{poem.title}</h1>
            <h2 className="text-lg text-gray-400 mb-4">by {poem.author}</h2>
          </div>

          <div className="flex gap-2">
            {/* ❤️ 좋아요 버튼 */}
            <Button
              onClick={handleLike}
              className="px-3 py-1 rounded-xl border border-white flex items-center gap-1"
              variant={liked ? "secondary" : "primary"}
            >
              <Heart className="w-5 h-5" fill={liked ? 'white' : 'none'} /> {likeCount}
            </Button>

            {/* 🔊 음성 재생 버튼 */}
            <Button
              onClick={speakPoem}
              variant="primary"
              disabled={isSpeaking}
              className="px-3 py-1 rounded-xl border border-white"
            >
              <Volume2 className="w-5 h-5" />
            </Button>

            {/* ⏹ 음성 정지 버튼 */}
            <Button
              onClick={stopSpeaking}
              variant="primary"
              className="px-3 py-1 rounded-xl border border-white"
            >
              <Square className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <pre className="whitespace-pre-wrap leading-relaxed font-sans">{poem.content}</pre>
      </div>
    </div>
  );
}
