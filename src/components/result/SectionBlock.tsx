import type { ReactNode } from "react";

type SectionBlockProps = {
  index: string;
  label: string;
  title: string;
  score?: number | null;
  weight?: number | null;
  children: ReactNode;
};

/** 결과 리포트의 한 섹션 (매거진 기사 블록) */
export function SectionBlock({ index, label, title, score, weight, children }: SectionBlockProps) {
  return (
    <section className="border-t border-ink pt-6" aria-label={title}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow text-ink-soft">
            <span className="tabular-nums">{index}</span> — {label}
          </p>
          <h3 className="mt-3 font-serif-kr text-[24px] leading-[1.3] font-medium md:text-[30px]">{title}</h3>
        </div>
        {score !== undefined ? (
          <div className="shrink-0 text-right">
            {score === null ? (
              <p className="mt-1 rounded-[var(--radius-tag)] border border-dashed border-line-strong px-2.5 py-1 text-[13px] text-ink-faint">
                자료 부족
              </p>
            ) : (
              <p className="font-display text-[48px] leading-none tabular-nums">{Math.round(score)}</p>
            )}
            {weight ? <p className="mt-1 text-[12px] text-ink-faint">반영 {Math.round(weight * 100)}%</p> : null}
          </div>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
