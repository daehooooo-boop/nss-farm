import type { ScoreItem } from "@/lib/analysis/types";

export function ScoreItemRow({ item }: { item: ScoreItem }) {
  const score = Math.round(item.score);
  return (
    <li className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-[15px] font-semibold">{item.label}</h4>
        <span className="font-display text-[26px] leading-none tabular-nums">{score}</span>
      </div>
      <div
        className="mt-3 h-[3px] rounded-full bg-line"
        role="meter"
        aria-label={`${item.label} 점수`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
      >
        <div className="h-full rounded-full bg-ink" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{item.detail}</p>
    </li>
  );
}
