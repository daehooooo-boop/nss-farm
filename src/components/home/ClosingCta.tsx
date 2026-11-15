import { ArrowUp, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "@/components/home/HeroVisual";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";

export function ClosingCta({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).closing;
  return (
    <section aria-labelledby="closing-title" className="border-t border-line py-20 md:py-28">
      <Container className="flex flex-col items-center text-center">
        <HeroVisual className="w-full max-w-[280px]" ariaLabel={getDict(locale).heroVisualAria} />
        <h2 id="closing-title" className="mt-8 font-serif-kr text-[26px] leading-[1.35] font-bold md:text-[40px]">
          {t.title[0]}
          <br className="md:hidden" /> {t.title[1]}
        </h2>
        <p className="mt-4 max-w-[28em] text-[15px] leading-[1.65] text-ink-soft md:text-base">
          {t.body}
        </p>
        <ButtonLink
          href="#start"
          className="mt-9"
          icon={<ArrowUp size={20} strokeWidth={1.75} aria-hidden />}
        >
          {t.cta}
        </ButtonLink>
        <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-ink-faint">
          <Lock size={14} strokeWidth={1.75} aria-hidden />
          {t.lock}
        </p>
      </Container>
    </section>
  );
}
