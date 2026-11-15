import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";

/** 첫 화면: 짧은 카피 + 이름 입력 폼을 바로 노출한다. 자세한 설명은 아래 섹션에서. */
export function Hero({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).hero;
  return (
    <section id="start" aria-labelledby="hero-title" className="scroll-mt-12">
      <Container className="pt-4 pb-16 md:pt-12 lg:pt-16 lg:pb-24">
        <div className="animate-rise">
          <h1
            id="hero-title"
            className="font-serif-kr text-[30px] leading-[1.2] font-extrabold md:text-[52px] lg:text-[64px]"
          >
            {t.title}
          </h1>
          <p className="mt-1.5 text-[15px] leading-[1.5] font-medium text-ink-soft md:mt-4 md:text-[19px]">
            {t.sub}
          </p>
        </div>

        <div className="mt-4 animate-rise [animation-delay:80ms] md:mt-10">
          <AnalyzeForm locale={locale} />
        </div>

        <a
          href="#about"
          className="mt-12 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowDown size={16} strokeWidth={1.75} aria-hidden />
          {t.about}
        </a>
      </Container>
    </section>
  );
}
