"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { analyzeNames } from "@/lib/analysis";
import { buildReport } from "@/lib/report/buildReport";
import { parseInput, readRawInput } from "@/lib/storage/session";
import { RELATION_TYPES } from "@/data/relationTypes";
import { relationOption } from "@/data/relations";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScoreRing } from "@/components/result/ScoreRing";
import { SectionBlock } from "@/components/result/SectionBlock";
import { ScoreItemRow } from "@/components/result/ScoreItemRow";
import { FlowVisual } from "@/components/result/FlowVisual";
import { ShareActions } from "@/components/share/ShareActions";

const noopSubscribe = () => () => {};

export function ResultView() {
  // 서버 렌더에서는 undefined(확인 중), 브라우저에서는 저장된 문자열 또는 null
  const raw = useSyncExternalStore<string | null | undefined>(noopSubscribe, readRawInput, () => undefined);
  const data = useMemo(() => {
    const input = parseInput(raw ?? null);
    if (!input) return null;
    const result = analyzeNames(input);
    return { result, report: buildReport(result) };
  }, [raw]);

  if (raw === undefined) {
    return <div className="min-h-[60vh]" aria-busy="true" />;
  }
  if (!data) return <EmptyState />;

  const { result, report } = data;
  const { a, b } = result.features;
  const { phonetic, structure, meaning } = result.sections;
  const type = RELATION_TYPES[result.type.code];
  const relation = relationOption(result.input.relation);
  const weights = result.weights;

  return (
    <article>
      {/* 01 커버 + 지수 */}
      <header className="bg-night text-paper">
        <Container className="pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-paper/60">Name Synergy Report</p>
            <p className="rounded-full border border-paper/25 px-3 py-1 text-[12px] text-paper/80">{relation.label}</p>
          </div>
          <h1 className="mt-10 font-serif-kr text-[36px] leading-[1.2] font-bold md:text-[64px]">
            <span className="text-person-a-night">{a.name}</span>
            <span className="mx-3 font-display font-normal text-paper/40 italic md:mx-5">×</span>
            <span className="text-person-b-night">{b.name}</span>
          </h1>
          <p className="mt-5 max-w-[22em] font-serif-kr text-[20px] leading-[1.5] text-paper/90 md:text-[28px]">
            {report.headline}
          </p>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
            <div className="flex justify-center md:justify-start" role="img" aria-label={`이름 조화 지수 ${result.total}점, ${result.grade}`}>
              <ScoreRing score={result.total} />
            </div>
            <div>
              <p className="text-[13px] text-paper/60">이름 조화 지수</p>
              <p className="mt-1 font-serif-kr text-[28px] font-bold">{result.grade}</p>
              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-paper/15 pt-5">
                {[
                  { label: "발음", score: phonetic.score, w: weights.phonetic },
                  { label: "구조", score: structure.score, w: weights.structure },
                  { label: "의미", score: meaning.status === "available" ? meaning.score : null, w: weights.meaning },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="text-[12px] text-paper/60">{s.label}</dt>
                    <dd className="mt-1 font-display text-[30px] leading-none tabular-nums">
                      {s.score === null ? <span className="font-sans text-[14px] text-paper/50">자료 부족</span> : Math.round(s.score)}
                    </dd>
                    <dd className="mt-1 text-[11px] text-paper/50">{s.w ? `반영 ${Math.round(s.w * 100)}%` : "제외"}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[12px] leading-[1.6] text-paper/50">
                {weights.meaning === null
                  ? "이름의 뜻 자료가 없어 의미 항목은 빼고 발음과 구조만으로 계산했어요. "
                  : ""}
                이름 조화 지수는 이름의 특징을 비교한 엔터테인먼트 지표이며, 과학적 궁합 점수가 아니에요.
              </p>
            </div>
          </div>
        </Container>
      </header>

      <Container size="read" className="space-y-16 py-16 md:space-y-24 md:py-24">
        {/* 요약 */}
        <section aria-label="전체 요약">
          <p className="eyebrow text-ink-soft">Summary</p>
          <div className="mt-4 space-y-3 text-[17px] leading-[1.75] md:text-[19px]">
            {report.summary.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <p className="rounded-[var(--radius-card)] bg-person-a-tint p-5 text-[15px] leading-[1.65]">{report.traits.a}</p>
            <p className="rounded-[var(--radius-card)] bg-person-b-tint p-5 text-[15px] leading-[1.65]">{report.traits.b}</p>
          </div>
        </section>

        {/* 01 발음 */}
        <SectionBlock index="01" label="Sound" title="발음의 조화" score={phonetic.score} weight={weights.phonetic}>
          <p className="mb-6 text-[17px] leading-[1.75]">{report.image}</p>
          <FlowVisual a={a} b={b} junctions={phonetic.flow.junctions} sharedSounds={phonetic.sharedSounds} />
          <ul className="mt-8">
            {phonetic.items.map((item) => (
              <ScoreItemRow key={item.code} item={item} />
            ))}
          </ul>
        </SectionBlock>

        {/* 02 구조 */}
        <SectionBlock index="02" label="Structure" title="구조의 균형" score={structure.score} weight={weights.structure}>
          <ul>
            {structure.items.map((item) => (
              <ScoreItemRow key={item.code} item={item} />
            ))}
          </ul>
        </SectionBlock>

        {/* 03 의미 */}
        <SectionBlock
          index="03"
          label="Meaning"
          title="의미의 조화"
          score={meaning.status === "available" ? meaning.score : null}
          weight={weights.meaning}
        >
          {meaning.status === "available" ? (
            <>
              <dl className="mb-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-field)] bg-person-a-tint p-4">
                  <dt className="text-[13px] font-semibold text-person-a">{a.name}의 뜻</dt>
                  <dd className="mt-1 text-[15px]">“{result.input.a.meaning}”</dd>
                  <dd className="mt-2 text-[13px] text-ink-soft">{meaning.categories.a.join(" · ")}</dd>
                </div>
                <div className="rounded-[var(--radius-field)] bg-person-b-tint p-4">
                  <dt className="text-[13px] font-semibold text-person-b">{b.name}의 뜻</dt>
                  <dd className="mt-1 text-[15px]">“{result.input.b.meaning}”</dd>
                  <dd className="mt-2 text-[13px] text-ink-soft">{meaning.categories.b.join(" · ")}</dd>
                </div>
              </dl>
              <ul>
                {meaning.items.map((item) => (
                  <ScoreItemRow key={item.code} item={item} />
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong p-6">
              <p className="text-[15px] font-semibold">{meaning.message}</p>
              {meaning.hint ? <p className="mt-2 text-[14px] leading-[1.6] text-ink-faint">{meaning.hint}</p> : null}
              {meaning.sharedHanja.length > 0 ? (
                <p className="mt-3 text-[14px] text-ink-soft">
                  참고: 두 이름이 ‘{meaning.sharedHanja.join("’, ‘")}’ 자를 함께 쓰고 있어요.
                </p>
              ) : null}
              <Link href="/analyze" className={buttonClass("ghost", "md", "mt-3")}>
                이름의 뜻 입력하러 가기
              </Link>
            </div>
          )}
        </SectionBlock>

        {/* 04 관계 유형 */}
        <SectionBlock index="04" label="Type" title="두 이름의 관계 유형">
          <div className="rounded-[var(--radius-card)] bg-night p-7 text-paper md:p-9">
            <p className="font-display text-[44px] leading-none md:text-[56px]">
              {type.label.replace(" TYPE", "")}
              <span className="ml-2 align-middle font-sans text-[13px] font-semibold tracking-[0.16em] text-paper/60">TYPE</span>
            </p>
            <p className="mt-4 text-[18px] font-semibold">{type.title}</p>
            <p className="mt-3 text-[15px] leading-[1.7] text-paper/80">{type.description}</p>
            <p className="mt-5 border-t border-paper/15 pt-4 text-[13px] leading-[1.6] text-paper/60">{result.type.reason}</p>
          </div>
          <div className="mt-8 space-y-6 text-[17px] leading-[1.75]">
            <div>
              <h4 className="eyebrow text-ink-soft">관계의 강점</h4>
              <p className="mt-2">{report.strength}</p>
            </div>
            <div>
              <h4 className="eyebrow text-ink-soft">서로를 이해하는 한마디</h4>
              <p className="mt-2">{report.message}</p>
            </div>
          </div>
        </SectionBlock>

        {/* 05 스토리 */}
        <SectionBlock index="05" label="Story" title="두 이름으로 쓴 이야기">
          <blockquote className="border-l-2 border-ink pl-5 font-serif-kr text-[19px] leading-[1.85] md:text-[22px]">
            {report.story.map((p) => (
              <p key={p} className="mt-4 first:mt-0">
                {p}
              </p>
            ))}
          </blockquote>
        </SectionBlock>

        {/* 공유 */}
        <section aria-label="결과 공유" className="border-t border-ink pt-8">
          <ShareActions result={result} report={report} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/analyze" variant="secondary" icon={<RotateCcw size={18} strokeWidth={1.75} aria-hidden />}>
              다른 이름으로 분석하기
            </ButtonLink>
          </div>
          <p className="mt-8 text-[13px] leading-[1.6] text-ink-faint">
            이 결과는 이 브라우저 탭에만 임시로 보관되며, 탭을 닫으면 사라져요. 결과는 재미와 공감을 위한 콘텐츠예요.
          </p>
        </section>
      </Container>
    </article>
  );
}

function EmptyState() {
  return (
    <Container size="read" className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow text-ink-soft">No Report</p>
      <h1 className="mt-4 font-serif-kr text-[28px] leading-[1.3] font-bold md:text-[36px]">아직 분석한 이름이 없어요</h1>
      <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
        결과는 개인정보 보호를 위해 이 탭에만 잠시 보관돼요. 탭을 새로 열었거나 시간이 지나 사라졌다면, 이름을 다시 입력해 주세요.
      </p>
      <ButtonLink href="/analyze" className="mt-8" icon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden />}>
        이름 입력하러 가기
      </ButtonLink>
    </Container>
  );
}
