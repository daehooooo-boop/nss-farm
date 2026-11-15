"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { parseInput, readRawInput } from "@/lib/storage/session";
import { ENGINES } from "@/i18n/engine";
import { getDict } from "@/i18n/dict";
import { localePath, type Locale } from "@/i18n/locale";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScoreRing } from "@/components/result/ScoreRing";
import { SectionBlock } from "@/components/result/SectionBlock";
import { ScoreItemRow } from "@/components/result/ScoreItemRow";
import { FlowVisual } from "@/components/result/FlowVisual";
import { ShareActions } from "@/components/share/ShareActions";

const noopSubscribe = () => () => {};

const readKo = () => readRawInput("ko");
const readEn = () => readRawInput("en");

export function ResultView({ locale = "ko" }: { locale?: Locale }) {
  const engine = ENGINES[locale];
  const dict = getDict(locale);
  const t = dict.result;
  // 서버 렌더에서는 undefined(확인 중), 브라우저에서는 저장된 문자열 또는 null
  const raw = useSyncExternalStore<string | null | undefined>(
    noopSubscribe,
    locale === "en" ? readEn : readKo,
    () => undefined,
  );
  const data = useMemo(() => {
    const input = parseInput(raw ?? null);
    if (!input) return null;
    // 다른 언어로 저장된 입력이 섞여 들어와도 이 언어의 검증을 통과해야만 분석한다
    const checked = engine.validate(input);
    if (!checked.ok) return null;
    const result = engine.analyze(checked.value);
    return { result, report: engine.report(result) };
  }, [raw, engine]);

  if (raw === undefined) {
    return <div className="min-h-[60vh]" aria-busy="true" />;
  }
  if (!data) return <EmptyState locale={locale} />;

  const { result, report } = data;
  const { a, b } = result.features;
  const { phonetic, structure, meaning } = result.sections;
  const type = engine.relationTypes[result.type.code];
  const relation = engine.relationOption(result.input.relation);
  const weights = result.weights;
  // 이름의 뜻 입력은 2026-11-15 화면에서 뺐다. 뜻 자료가 있을 때만 의미 항목을 보여 준다.
  const hasMeaning = meaning.status === "available";

  return (
    <article>
      {/* 01 커버 + 지수 */}
      <header className="bg-night text-paper">
        <Container className="pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-paper/60">{t.eyebrow}</p>
            <p className="rounded-full border border-paper/25 px-3 py-1 text-[12px] text-paper/80">{relation.label}</p>
          </div>
          <h1 className="mt-10 font-serif-kr text-[36px] leading-[1.2] font-bold md:text-[64px]">
            <span className="text-person-a-night">{a.name}</span>
            <span className="mx-3 font-display font-normal text-paper/60 md:mx-5">×</span>
            <span className="text-person-b-night">{b.name}</span>
          </h1>
          <p className="mt-5 max-w-[22em] font-serif-kr text-[20px] leading-[1.5] text-paper/90 md:text-[28px]">
            {report.headline}
          </p>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
            <div className="flex justify-center md:justify-start" role="img" aria-label={t.indexAria(result.total, result.grade)}>
              <ScoreRing score={result.total} />
            </div>
            <div>
              <p className="text-[13px] text-paper/60">{t.index}</p>
              <p className="mt-1 font-serif-kr text-[28px] font-bold">{result.grade}</p>
              <dl className={`mt-6 grid gap-3 border-t border-paper/15 pt-5 ${hasMeaning ? "grid-cols-3" : "grid-cols-2"}`}>
                {[
                  { label: t.sound, score: phonetic.score, w: weights.phonetic },
                  { label: t.structure, score: structure.score, w: weights.structure },
                  ...(hasMeaning ? [{ label: t.meaning, score: meaning.score, w: weights.meaning }] : []),
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="text-[12px] text-paper/60">{s.label}</dt>
                    <dd className="mt-1 font-display text-[30px] leading-none tabular-nums">
                      {s.score === null ? <span className="font-sans text-[14px] text-paper/60">{t.noData}</span> : Math.round(s.score)}
                    </dd>
                    <dd className="mt-1 text-[11px] text-paper/60">{s.w ? t.weight(Math.round(s.w * 100)) : ""}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[12px] leading-[1.6] text-paper/60">
                {t.disclaimer}
              </p>
            </div>
          </div>
        </Container>
      </header>

      <Container size="read" className="space-y-16 py-16 md:space-y-24 md:py-24">
        {/* 요약 */}
        <section aria-label={t.summaryAria}>
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
        <SectionBlock index="01" label="Sound" title={t.soundTitle} score={phonetic.score} weight={weights.phonetic} noDataLabel={t.noData} weightLabel={t.weight}>
          <p className="mb-6 text-[17px] leading-[1.75]">{report.image}</p>
          <FlowVisual a={a} b={b} junctions={phonetic.flow.junctions} sharedSounds={phonetic.sharedSounds} t={dict.flow} />
          <ul className="mt-8">
            {phonetic.items.map((item) => (
              <ScoreItemRow key={item.code} item={item} ariaLabel={t.scoreAria(item.label)} />
            ))}
          </ul>
        </SectionBlock>

        {/* 02 구조 */}
        <SectionBlock index="02" label="Structure" title={t.structureTitle} score={structure.score} weight={weights.structure} noDataLabel={t.noData} weightLabel={t.weight}>
          <ul>
            {structure.items.map((item) => (
              <ScoreItemRow key={item.code} item={item} ariaLabel={t.scoreAria(item.label)} />
            ))}
          </ul>
        </SectionBlock>

        {/* 03 의미: 뜻 자료가 있을 때만 */}
        {hasMeaning ? (
        <SectionBlock
          index="03"
          label="Meaning"
          title={t.meaningTitle}
          score={meaning.score}
          weight={weights.meaning}
          noDataLabel={t.noData}
          weightLabel={t.weight}
        >
            <dl className="mb-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[var(--radius-field)] bg-person-a-tint p-4">
                <dt className="text-[13px] font-semibold text-person-a">{t.meaningOf(a.name)}</dt>
                <dd className="mt-1 text-[15px]">“{result.input.a.meaning}”</dd>
                <dd className="mt-2 text-[13px] text-ink-soft">{meaning.categories.a.join(" · ")}</dd>
              </div>
              <div className="rounded-[var(--radius-field)] bg-person-b-tint p-4">
                <dt className="text-[13px] font-semibold text-person-b">{t.meaningOf(b.name)}</dt>
                <dd className="mt-1 text-[15px]">“{result.input.b.meaning}”</dd>
                <dd className="mt-2 text-[13px] text-ink-soft">{meaning.categories.b.join(" · ")}</dd>
              </div>
            </dl>
            <ul>
              {meaning.items.map((item) => (
                <ScoreItemRow key={item.code} item={item} ariaLabel={t.scoreAria(item.label)} />
              ))}
            </ul>
        </SectionBlock>
        ) : null}

        {/* 04 관계 유형 */}
        <SectionBlock index={hasMeaning ? "04" : "03"} label="Type" title={t.typeTitle}>
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
              <h4 className="eyebrow text-ink-soft">{t.strength}</h4>
              <p className="mt-2">{report.strength}</p>
            </div>
            <div>
              <h4 className="eyebrow text-ink-soft">{t.message}</h4>
              <p className="mt-2">{report.message}</p>
            </div>
          </div>
        </SectionBlock>

        {/* 05 스토리 */}
        <SectionBlock index={hasMeaning ? "05" : "04"} label="Story" title={t.storyTitle}>
          <blockquote className="border-l-2 border-ink pl-5 font-serif-kr text-[19px] leading-[1.85] md:text-[22px]">
            {report.story.map((p) => (
              <p key={p} className="mt-4 first:mt-0">
                {p}
              </p>
            ))}
          </blockquote>
        </SectionBlock>

        {/* 공유 */}
        <section aria-label={t.shareAria} className="border-t border-ink pt-8">
          <ShareActions result={result} report={report} locale={locale} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, "/analyze")} variant="secondary" icon={<RotateCcw size={18} strokeWidth={1.75} aria-hidden />}>
              {t.again}
            </ButtonLink>
          </div>
          <p className="mt-8 text-[13px] leading-[1.6] text-ink-faint">
            {t.tabNote}
          </p>
        </section>
      </Container>
    </article>
  );
}

function EmptyState({ locale }: { locale: Locale }) {
  const t = getDict(locale).result;
  return (
    <Container size="read" className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow text-ink-soft">No Report</p>
      <h1 className="mt-4 font-serif-kr text-[28px] leading-[1.3] font-bold md:text-[36px]">{t.emptyTitle}</h1>
      <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
        {t.emptyBody}
      </p>
      <ButtonLink href={localePath(locale, "/analyze")} className="mt-8" icon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden />}>
        {t.emptyCta}
      </ButtonLink>
    </Container>
  );
}
