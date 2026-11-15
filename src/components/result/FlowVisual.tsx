import type { FlowJunction, NameFeatures } from "@/lib/analysis/types";
import type { Dict } from "@/i18n/dict";

type FlowText = Dict["flow"];

function NameSyllables({
  f,
  highlight,
  tone,
}: {
  f: NameFeatures;
  highlight: "first" | "last";
  tone: "a" | "b";
}) {
  const color = tone === "a" ? "text-person-a" : "text-person-b";
  return (
    <span className="inline-flex">
      {f.syllables.map((s, i) => {
        const on = highlight === "last" ? i === f.length - 1 : i === 0;
        return (
          <span key={i} className={on ? `${color}` : "text-ink/50"}>
            {s.char}
          </span>
        );
      })}
    </span>
  );
}

function Row({ j, from, to, fromTone, t }: { j: FlowJunction; from: NameFeatures; to: NameFeatures; fromTone: "a" | "b"; t: FlowText }) {
  const toTone = fromTone === "a" ? "b" : "a";
  // 연결 강도에 따라 이음선 스타일
  const line = j.value >= 0.85 ? "border-solid" : j.value >= 0.6 ? "border-dashed" : "border-dotted";
  return (
    <li className="py-5">
      <div className="flex items-center gap-3 font-serif-kr text-[26px] font-bold md:text-[34px]">
        <NameSyllables f={from} highlight="last" tone={fromTone} />
        <span aria-hidden="true" className={`h-0 min-w-8 flex-1 border-t-2 ${line} border-ink/40`} />
        <NameSyllables f={to} highlight="first" tone={toTone} />
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-ink-soft">
        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[12px] font-semibold text-paper">{t.kind[j.kind]}</span>
        <span>{t.junction(j.fromSyllable, j.jong, j.toSyllable, j.cho)}</span>
      </p>
      <p className="mt-1 text-[14px] text-ink-faint">{j.detail}</p>
    </li>
  );
}

/** 시그니처 장면: 두 이름을 이어 부를 때의 연결 (PRD 1.3) */
export function FlowVisual({
  a,
  b,
  junctions,
  sharedSounds,
  t,
}: {
  a: NameFeatures;
  b: NameFeatures;
  junctions: [FlowJunction, FlowJunction];
  sharedSounds: string[];
  t: FlowText;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 md:p-7">
      <p className="eyebrow text-ink-soft">{t.title}</p>
      <ul className="divide-y divide-line">
        <Row j={junctions[0]} from={a} to={b} fromTone="a" t={t} />
        <Row j={junctions[1]} from={b} to={a} fromTone="b" t={t} />
      </ul>
      <div className="mt-2 border-t border-line pt-5">
        <p className="eyebrow text-ink-soft">{t.shared}</p>
        {sharedSounds.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={t.sharedAria}>
            {sharedSounds.map((s) => (
              <li
                key={s}
                className="synergy-gradient grid size-10 place-items-center rounded-full font-serif-kr text-lg font-bold text-paper"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[14px] text-ink-faint">{t.noShared}</p>
        )}
      </div>
    </div>
  );
}
