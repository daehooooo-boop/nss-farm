import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ResultPreviewData = {
  nameA: string;
  nameB: string;
  relationLabel: string;
  total: number;
  grade: string;
  typeLabel: string;
  typeTitle: string;
  quote: string;
  sections: { label: string; score: number | null }[];
};

export function ResultPreview({ data }: { data: ResultPreviewData }) {
  return (
    <section aria-labelledby="sample-title" className="border-t border-line py-20 md:py-28 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeading
            id="sample-title"
            index="03"
            label="Sample"
            title="결과는 한 편의 매거진처럼"
            description="조화 지수와 그 이유, 관계 유형, 두 이름으로 쓴 짧은 이야기까지. 아래는 예시 이름으로 만든 결과예요."
          />
        </div>

        <figure className="lg:col-span-6 lg:col-start-7">
          <div className="overflow-hidden rounded-[28px] bg-night p-7 text-paper md:p-10">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-paper/60">Name Synergy Report</p>
              <p className="rounded-full border border-paper/25 px-3 py-1 text-[12px] text-paper/80">
                {data.relationLabel}
              </p>
            </div>

            <p className="mt-10 font-serif-kr text-[30px] leading-tight font-bold md:text-[40px]">
              <span className="text-person-a-night">{data.nameA}</span>
              <span className="mx-3 font-display text-paper/50 italic">×</span>
              <span className="text-person-b-night">{data.nameB}</span>
            </p>

            <div className="mt-8 flex items-end gap-4">
              <p
                className="font-display text-[88px] leading-[0.85] tabular-nums md:text-[112px]"
                aria-label={`이름 조화 지수 ${data.total}점`}
              >
                {data.total}
              </p>
              <div className="pb-2">
                <p className="text-[13px] text-paper/60">이름 조화 지수</p>
                <p className="mt-1 text-[15px] font-semibold">{data.grade}</p>
              </div>
            </div>
            <div className="mt-6 h-1 rounded-full bg-paper/10">
              <div className="synergy-gradient h-1 rounded-full" style={{ width: `${data.total}%` }} />
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-paper/15 pt-6">
              {data.sections.map((s) => (
                <div key={s.label}>
                  <dt className="text-[12px] text-paper/60">{s.label}</dt>
                  <dd className="mt-1 font-display text-[28px] leading-none tabular-nums">
                    {s.score ?? <span className="text-base text-paper/50">자료 부족</span>}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-paper/15 pt-6">
              <p className="eyebrow text-paper/60">{data.typeLabel}</p>
              <p className="mt-2 text-[15px] font-semibold">{data.typeTitle}</p>
              <blockquote className="mt-5 font-serif-kr text-[18px] leading-[1.6] text-paper/90 md:text-[20px]">
                “{data.quote}”
              </blockquote>
            </div>
          </div>
          <figcaption className="mt-4 text-[13px] text-ink-faint">
            예시 결과 · 실제 결과는 입력한 이름에 따라 달라져요.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
