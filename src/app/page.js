import Button from "@/components/ui/Button";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

const quote = `
.
.
.
`;

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className="text-2xl leading-relaxed text-center">
          별 하나에 <span className="font-bold">추억</span>과<br />별 하나에{" "}
          <span className="font-bold">사랑</span>과<br />별 하나에{" "}
          <span className="font-bold">쓸쓸함</span>과<br />별 하나에{" "}
          <span className="font-bold">동경</span>과<br />별 하나에{" "}
          <span className="font-bold">시</span>와<br />별 하나에{" "}
          <span className="font-bold">어머니</span>,{" "}
          <span className="font-bold">어머니</span>
          <br />
          <span className="text-sm leading-tight">.<br />.<br />.</span>
          <br />
          당신의 <span className="font-bold">별</span>에는 어떤 이야기가 담겨있나요?
        </p>

        <div className={styles.ctas}>
          <Link href="/signup">
            <Button variant="primary" href="/signup">
              계정 만들기
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" href="/login">
              계정이 있어요
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
