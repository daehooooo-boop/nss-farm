import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RELATION_TYPE_ORDER } from "@/data/relationTypes";
import { ENGINES } from "@/i18n/engine";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";

export function TypeGallery({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).types;
  const types = ENGINES[locale].relationTypes;
  return (
    <section aria-labelledby="types-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="types-title"
          index="04"
          label="Types"
          title={t.title}
          description={t.description}
        />
        <ul className="mt-12 border-t border-ink">
          {RELATION_TYPE_ORDER.map((code) => {
            const type = types[code];
            return (
              <li
                key={code}
                className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:items-baseline md:gap-8 md:py-8"
              >
                <p className="font-display text-[30px] leading-none md:col-span-4 md:text-[40px]">
                  {type.label.replace(" TYPE", "")}
                  <span className="ml-2 align-middle text-[13px] font-sans font-semibold tracking-[0.16em] text-ink-faint">
                    TYPE
                  </span>
                </p>
                <div className="md:col-span-8">
                  <h3 className="text-[17px] font-semibold md:text-lg">{type.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-soft">{type.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
