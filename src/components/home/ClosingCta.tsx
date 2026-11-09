import { ArrowRight, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SynergyMark } from "@/components/ui/SynergyMark";

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="border-t border-line py-20 md:py-28">
      <Container className="flex flex-col items-center text-center">
        <SynergyMark size={56} />
        <h2 id="closing-title" className="mt-8 font-serif-kr text-[26px] leading-[1.35] font-bold md:text-[40px]">
          지금, 두 이름을
          <br className="md:hidden" /> 나란히 놓아 보세요.
        </h2>
        <p className="mt-4 max-w-[28em] text-[15px] leading-[1.65] text-ink-soft md:text-base">
          연인, 부부, 친구, 가족, 동료, 그리고 반려동물까지. 어떤 관계든 이름으로 이야기를 시작할 수 있어요.
        </p>
        <ButtonLink
          href="/analyze"
          className="mt-9"
          icon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden />}
        >
          이름 분석 시작하기
        </ButtonLink>
        <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-ink-faint">
          <Lock size={14} strokeWidth={1.75} aria-hidden />
          이름은 서버에 저장되지 않아요
        </p>
      </Container>
    </section>
  );
}
