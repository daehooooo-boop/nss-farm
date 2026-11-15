import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AnalysisPillars } from "@/components/home/AnalysisPillars";
import { ResultPreview, type ResultPreviewData } from "@/components/home/ResultPreview";
import { TypeGallery } from "@/components/home/TypeGallery";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ENGINES } from "@/i18n/engine";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";

/** 결과 예시는 실제 분석 엔진 출력으로 만든다 (가상의 이름) */
function sampleFor(locale: Locale): ResultPreviewData {
  const engine = ENGINES[locale];
  const dict = getDict(locale);
  const sample = engine.analyze({
    a: { name: dict.sample.nameA, hanja: "", meaning: "" },
    b: { name: dict.sample.nameB, hanja: "", meaning: "" },
    relation: "lover",
  });
  const report = engine.report(sample);
  const type = engine.relationTypes[sample.type.code];
  return {
    nameA: sample.features.a.name,
    nameB: sample.features.b.name,
    relationLabel: engine.relationOption(sample.input.relation).label,
    total: sample.total,
    grade: sample.grade,
    typeLabel: type.label,
    typeTitle: type.title,
    quote: report.headline,
    sections: [
      { label: dict.result.sound, score: Math.round(sample.sections.phonetic.score) },
      { label: dict.result.structure, score: Math.round(sample.sections.structure.score) },
    ],
  };
}

const SAMPLES: Record<Locale, ResultPreviewData> = { ko: sampleFor("ko"), en: sampleFor("en") };

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Header showCta={false} locale={locale} path="/" />
      <main id="main" className="flex-1">
        <Hero locale={locale} />
        <HowItWorks locale={locale} />
        <AnalysisPillars locale={locale} />
        <ResultPreview data={SAMPLES[locale]} locale={locale} />
        <TypeGallery locale={locale} />
        <ClosingCta locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
