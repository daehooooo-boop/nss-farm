import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";

export function HowItWorks({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).about;
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 border-t border-line py-20 md:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="about-title"
          index="01"
          label="About"
          title={
            <>
              {t.title[0]}
              <br className="md:hidden" /> {t.title[1]}
            </>
          }
          description={t.description}
        />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {t.steps.map((item) => (
            <li key={item.step} className="border-t border-ink pt-5">
              <span className="font-display text-[40px] leading-none tabular-nums">{item.step}</span>
              <h3 className="mt-5 text-lg font-semibold md:text-[22px]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft md:text-base">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
