import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";

export const metadata: Metadata = {
  title: "이름 입력",
  description: "두 사람의 이름과 관계를 입력하고 이름 조화 리포트를 받아 보세요. 이름은 저장되지 않아요.",
  alternates: { canonical: "/analyze" },
};

export default function AnalyzePage() {
  return (
    <>
      <Header showCta={false} />
      <main id="main" className="flex-1 pb-24">
        <Container className="pt-10 md:pt-16">
          <div className="max-w-[640px]">
            <p className="eyebrow text-ink-soft">Step 1 — Names</p>
            <h1 className="mt-4 font-serif-kr text-[28px] leading-[1.3] font-bold md:text-[40px]">
              두 이름을 나란히 적어 주세요
            </h1>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft md:text-base">
              이름과 관계만 있으면 분석할 수 있어요. 두 사람 모두 같은 방식(성 포함 또는 이름만)으로 적으면 더 정확해요.
            </p>
          </div>
          <div className="mt-12">
            <AnalyzeForm />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
