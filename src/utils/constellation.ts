// lib/utils/constellation.ts

export function generateRandomConstellation(name: string, count: number) {
  const stars = Array.from({ length: count }, () => ({
    top: Math.random() * 80 + 10,
    left: Math.random() * 80 + 10,
  }));

  const edges: [number, number][] = [];
  const parent = Array(count).fill(0).map((_, i) => i);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  const union = (a: number, b: number): void => {
    const rootA = find(a), rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  };

  const dist = (a: any, b: any) =>
    Math.hypot(a.top - b.top, a.left - b.left);

  const edgeCandidates: { dist: number; a: number; b: number }[] = [];

  for (let i = 0; i < count - 1; i++) {
    for (let j = i + 1; j < count; j++) {
      edgeCandidates.push({ dist: dist(stars[i], stars[j]), a: i, b: j });
    }
  }

  edgeCandidates.sort((a, b) => a.dist - b.dist);

  for (const { a, b } of edgeCandidates) {
    if (find(a) !== find(b)) {
      union(a, b);
      edges.push([a, b]);
    }
  }

  return { name, stars, edges };
}
