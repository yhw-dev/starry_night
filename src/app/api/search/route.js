// src/app/api/search/route.js
import { NextResponse } from "next/server";
import posts from "@/data/posts";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword")?.toLowerCase();

  if (!keyword) {
    return NextResponse.json([], { status: 200 });
  }

  const results = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword)
  );

  return NextResponse.json(results);
}
