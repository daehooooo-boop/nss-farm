import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AnalysisPillars } from "@/components/home/AnalysisPillars";
import { ResultPreview, type ResultPreviewData } from "@/components/home/ResultPreview";
import { TypeGallery } from "@/components/home/TypeGallery";
import { ClosingCta } from "@/components/home/ClosingCta";

// TODO(STEP 6): 분석 엔진 출력으로 교체
const SAMPLE: ResultPreviewData = {
  nameA: "하윤",
  nameB: "도현",
  relationLabel: "연인",
  total: 84,
  grade: "깊은 조화",
  typeLabel: "BALANCE TYPE",
  typeTitle: "서로의 균형을 맞추는 관계",
  quote: "서로 다른 두 이름이 만나 하나의 특별한 리듬을 만듭니다.",
  sections: [
    { label: "발음", score: 86 },
    { label: "구조", score: 82 },
    { label: "의미", score: null },
  ],
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <HowItWorks />
        <AnalysisPillars />
        <ResultPreview data={SAMPLE} />
        <TypeGallery />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
