import poems from '@/data/poems.json';

export default function PoemDetail({ params }) {
  const poem = poems.find((p) => p.num === Number(params.id));

  if (!poem) {
    return <div className="text-white p-6">해당 시를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">{poem.title}</h1>
      <h2 className="text-lg text-gray-400 mb-6">by {poem.author}</h2>
      <pre className="whitespace-pre-wrap leading-relaxed">{poem.content}</pre>
    </div>
  );
}
