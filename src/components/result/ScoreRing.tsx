/** 조화 지수 링: 두 개의 겹치는 원 + synergy 그라디언트 호 (DESIGN_GUIDE 6장) */
export function ScoreRing({ score, size = 240 }: { score: number; size?: number }) {
  const r = 100;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 240 240" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="ring-synergy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-person-a-night)" />
            <stop offset="100%" stopColor="var(--color-person-b-night)" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" />
        <circle
          cx="120"
          cy="120"
          r={r}
          fill="none"
          stroke="url(#ring-synergy)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 120 120)"
          className="[animation:ring-in_900ms_var(--ease-out-soft)_both]"
          style={{ ["--ring-c" as string]: `${c}` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[88px] leading-[0.9] tabular-nums md:text-[104px]">{score}</span>
        <span className="mt-1 text-[12px] tracking-[0.16em] text-paper/60 uppercase">Synergy Index</span>
      </div>
    </div>
  );
}
