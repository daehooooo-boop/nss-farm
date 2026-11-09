type SynergyMarkProps = {
  size?: number;
  className?: string;
  /** 어두운 배경 위에서 사용할 때 */
  tone?: "paper" | "night";
};

/** 브랜드 심볼: 두 개의 원이 겹치는 형태 (DESIGN_GUIDE 2장). */
export function SynergyMark({ size = 24, className = "", tone = "paper" }: SynergyMarkProps) {
  const a = tone === "night" ? "var(--color-person-a-night)" : "var(--color-person-a)";
  const b = tone === "night" ? "var(--color-person-b-night)" : "var(--color-person-b-bright)";
  return (
    <svg
      width={size}
      height={size * (20 / 32)}
      viewBox="0 0 32 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="10" cy="10" r="8.5" stroke={a} strokeWidth="1.75" />
      <circle cx="22" cy="10" r="8.5" stroke={b} strokeWidth="1.75" />
    </svg>
  );
}
