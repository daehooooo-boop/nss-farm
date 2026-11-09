import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "@/components/home/HeroVisual";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden">
      <Container className="grid items-center gap-12 pt-10 pb-20 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-32">
        <div className="animate-rise lg:col-span-7">
          <p className="eyebrow text-ink-soft">Name × Name — 이름 조화 리포트</p>
          <h1
            id="hero-title"
            className="mt-5 font-serif-kr text-[30px] leading-[1.3] font-bold tracking-[-0.01em] md:text-[44px] lg:text-[52px] lg:leading-[1.25]"
          >
            두 사람의 이름에는
            <br />
            어떤 이야기가
            <br />
            숨어 있을까요?
          </h1>
          <p className="mt-6 max-w-[30em] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
            이름의 의미와 울림을 통해 두 사람의 특별한 조화를 발견해 보세요.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href="/analyze" icon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden />}>
              이름 분석 시작하기
            </ButtonLink>
            <p className="text-[13px] text-ink-faint">약 30초 · 회원가입 없음 · 이름은 저장되지 않아요</p>
          </div>
        </div>

        <div className="animate-rise [animation-delay:120ms] lg:col-span-5">
          <HeroVisual className="mx-auto w-full max-w-[420px]" />
          <p className="mt-6 text-center font-display text-lg italic text-ink-soft md:text-xl">
            Two Names, One Connection.
          </p>
        </div>
      </Container>
    </section>
  );
}
