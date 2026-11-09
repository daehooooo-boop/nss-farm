import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultView } from "@/components/result/ResultView";

export const metadata: Metadata = {
  title: "이름 조화 리포트",
  description: "두 이름의 발음, 구조, 의미를 비교한 이름 궁합 리포트",
  // 개인 결과 페이지이므로 검색에 노출하지 않는다
  robots: { index: false, follow: false },
};

export default function ResultPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <ResultView />
      </main>
      <Footer />
    </>
  );
}
