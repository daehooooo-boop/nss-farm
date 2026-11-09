import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  tone?: "paper" | "night";
};

/** 에디토리얼 섹션 머리: `01 — SOUND` eyebrow + 세리프 제목 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  id,
  tone = "paper",
}: SectionHeadingProps) {
  const muted = tone === "night" ? "text-paper/70" : "text-ink-soft";
  return (
    <div className="max-w-[640px]">
      <p className={`eyebrow ${muted}`}>
        <span className="tabular-nums">{index}</span>
        <span aria-hidden="true"> — </span>
        {label}
      </p>
      <h2
        id={id}
        className="mt-4 font-serif-kr text-[24px] leading-[1.3] font-medium md:text-[36px]"
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-[15px] leading-[1.65] md:text-base ${muted}`}>{description}</p>
      ) : null}
    </div>
  );
}
