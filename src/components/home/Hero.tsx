import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";

/** 첫 화면: 짧은 카피 + 이름 입력 폼을 바로 노출한다. 자세한 설명은 아래 섹션에서. */
export function Hero() {
  return (
    <section id="start" aria-labelledby="hero-title" className="scroll-mt-16">
      <Container className="pt-5 pb-16 md:pt-12 lg:pt-16 lg:pb-24">
        <div className="animate-rise">
          <h1
            id="hero-title"
            className="font-serif-kr text-[22px] leading-[1.35] font-bold tracking-[-0.01em] md:text-[36px] lg:text-[44px]"
          >
            두 사람의 이름에는
            <br />
            어떤 이야기가 숨어 있을까요?
          </h1>
          <p className="mt-4 hidden text-[17px] leading-[1.6] text-ink-soft md:block">
            이름의 의미와 울림을 통해 두 사람의 특별한 조화를 발견해 보세요.
          </p>
        </div>

        <div className="mt-5 animate-rise [animation-delay:80ms] md:mt-10">
          <AnalyzeForm />
        </div>

        <a
          href="#about"
          className="mt-12 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowDown size={16} strokeWidth={1.75} aria-hidden />
          이름 궁합은 어떻게 이름을 읽나요?
        </a>
      </Container>
    </section>
  );
}
