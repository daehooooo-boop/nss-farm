import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AnalysisPillars } from "@/components/home/AnalysisPillars";
import { ResultPreview, type ResultPreviewData } from "@/components/home/ResultPreview";
import { TypeGallery } from "@/components/home/TypeGallery";
import { ClosingCta } from "@/components/home/ClosingCta";
import { analyzeNames } from "@/lib/analysis";
import { buildReport } from "@/lib/report/buildReport";
import { RELATION_TYPES } from "@/data/relationTypes";
import { relationOption } from "@/data/relations";

// 결과 예시는 실제 분석 엔진 출력으로 만든다 (가상의 이름)
const sample = analyzeNames({
  a: { name: "하윤", hanja: "", meaning: "여름처럼 밝은 빛" },
  b: { name: "도현", hanja: "", meaning: "길을 밝히는 지혜" },
  relation: "lover",
});
const sampleReport = buildReport(sample);
const SAMPLE: ResultPreviewData = {
  nameA: sample.features.a.name,
  nameB: sample.features.b.name,
  relationLabel: relationOption(sample.input.relation).label,
  total: sample.total,
  grade: sample.grade,
  typeLabel: RELATION_TYPES[sample.type.code].label,
  typeTitle: RELATION_TYPES[sample.type.code].title,
  quote: sampleReport.headline,
  sections: [
    { label: "발음", score: Math.round(sample.sections.phonetic.score) },
    { label: "구조", score: Math.round(sample.sections.structure.score) },
    {
      label: "의미",
      score: sample.sections.meaning.status === "available" ? Math.round(sample.sections.meaning.score) : null,
    },
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
