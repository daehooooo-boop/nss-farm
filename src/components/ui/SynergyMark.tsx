import { MARK_BOX, MARK_PATH, MARK_VIEWBOX } from "@/lib/brand/mark";

type SynergyMarkProps = {
  /** 가로 폭(px). 높이는 비율에 맞춰 정해진다. */
  size?: number;
  className?: string;
  /** 어두운 배경 위에서 사용할 때 */
  tone?: "paper" | "night";
};

/** 브랜드 심볼: 두 원이 맞물린 형태 (DESIGN_GUIDE 2장). */
export function SynergyMark({ size = 24, className = "", tone = "paper" }: SynergyMarkProps) {
  return (
    <svg
      width={size}
      height={Math.round((size * MARK_BOX.height) / MARK_BOX.width)}
      viewBox={MARK_VIEWBOX}
      fill="none"
      aria-hidden="true"
      className={`${tone === "night" ? "text-paper" : "text-ink"} ${className}`}
    >
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}
