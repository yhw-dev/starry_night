import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ul>
          <li>
            안녕하세용 처음 페이지입니다.
          </li>
          <li>시를 쓰세요.</li>
          <li>여기에 깔롱한 시작화면 만들거임</li>
        </ul>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/signup"
            target="_blank"
            rel="noopener noreferrer"
          >
            계정 만들기
          </a>
          <a
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            계정이 있어요
          </a>
        </div>
      </main>
    </div>
  );
}
