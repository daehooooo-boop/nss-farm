import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANALYSIS_PILLARS } from "@/data/homeContent";

export function AnalysisPillars() {
  return (
    <section aria-labelledby="method-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="method-title"
          index="02"
          label="Method"
          title="세 가지 관점으로 이름을 읽어요"
          description="모든 계산은 공개된 규칙을 따르고, 같은 이름이면 언제나 같은 결과가 나와요."
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {ANALYSIS_PILLARS.map((pillar) => (
            <li
              key={pillar.key}
              className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-7"
            >
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-ink-soft">{pillar.label}</p>
                <p className="font-display text-[44px] leading-none tabular-nums">
                  {pillar.weight}
                  <span className="text-2xl">%</span>
                </p>
              </div>
              <h3 className="mt-6 font-serif-kr text-[22px] font-medium">{pillar.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{pillar.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                {pillar.items.map((item) => (
                  <li key={item} className="rounded-[var(--radius-tag)] bg-paper px-2.5 py-1 text-[13px] text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[13px] leading-[1.6] text-ink-faint">
          이름의 뜻을 입력하지 않으면 의미 항목은 빼고, 발음 57% · 구조 43%로 다시 나눠 계산해요. 입력하지 않은 한자의 뜻을 지어내지 않아요.
        </p>
      </Container>
    </section>
  );
}
