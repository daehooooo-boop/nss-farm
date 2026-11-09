import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RELATION_TYPES, RELATION_TYPE_ORDER } from "@/data/relationTypes";

export function TypeGallery() {
  return (
    <section aria-labelledby="types-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="types-title"
          index="04"
          label="Types"
          title="두 이름이 만드는 다섯 가지 관계"
          description="관계 유형은 무작위가 아니라 두 이름의 실제 분석 수치로 정해져요."
        />
        <ul className="mt-12 border-t border-ink">
          {RELATION_TYPE_ORDER.map((code) => {
            const type = RELATION_TYPES[code];
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
