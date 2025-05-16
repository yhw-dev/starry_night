import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { getAuth } from "firebase-admin/auth";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = session?.user?.uid;
  const email = session?.user?.email;

  if (!uid || !email) return new Response("Unauthorized", { status: 401 });

  try {
    // 좋아요 수 감소 (최소 0 보장)
    await pool.query(`
      UPDATE poems
      SET likes = GREATEST(likes - 1, 0)
      WHERE id IN (
        SELECT poem_id FROM poem_likes WHERE user_id = $1
      )
    `, [uid]);

    // 좋아요 기록 삭제
    await pool.query(`DELETE FROM poem_likes WHERE user_id = $1`, [uid]);

    // 사용자 정보 삭제
    await pool.query(`DELETE FROM users WHERE id = $1`, [uid]);

    // Firebase Auth 계정 삭제
    const auth = getAuth();
    const userRecord = await auth.getUserByEmail(email);
    await auth.deleteUser(userRecord.uid);

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    console.error("회원 탈퇴 오류:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
