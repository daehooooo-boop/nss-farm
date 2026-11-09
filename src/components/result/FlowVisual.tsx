import type { FlowJunction, NameFeatures } from "@/lib/analysis/types";

const KIND_LABEL: Record<FlowJunction["kind"], string> = {
  open: "열린 연결",
  liaison: "연음",
  sonorant: "울림 연결",
  plain: "짧은 쉼표",
  hard: "또렷한 끊김",
};

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
          <span key={i} className={on ? `${color}` : "text-ink/30"}>
            {s.char}
          </span>
        );
      })}
    </span>
  );
}

function Row({ j, from, to, fromTone }: { j: FlowJunction; from: NameFeatures; to: NameFeatures; fromTone: "a" | "b" }) {
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
        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[12px] font-semibold text-paper">{KIND_LABEL[j.kind]}</span>
        <span>
          ‘{j.fromSyllable}’의 {j.jong ? `받침 ${j.jong}` : "열린 끝소리"} → ‘{j.toSyllable}’의 첫소리 {j.cho === "ㅇ" ? "ㅇ(소리 없음)" : j.cho}
        </span>
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
}: {
  a: NameFeatures;
  b: NameFeatures;
  junctions: [FlowJunction, FlowJunction];
  sharedSounds: string[];
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 md:p-7">
      <p className="eyebrow text-ink-soft">이어 부르기</p>
      <ul className="divide-y divide-line">
        <Row j={junctions[0]} from={a} to={b} fromTone="a" />
        <Row j={junctions[1]} from={b} to={a} fromTone="b" />
      </ul>
      <div className="mt-2 border-t border-line pt-5">
        <p className="eyebrow text-ink-soft">함께 가진 소리</p>
        {sharedSounds.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="두 이름이 함께 가진 소리">
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
          <p className="mt-3 text-[14px] text-ink-faint">겹치는 소리가 없어요. 서로에게 새로운 소리를 들려주는 조합이에요.</p>
        )}
      </div>
    </div>
  );
}
