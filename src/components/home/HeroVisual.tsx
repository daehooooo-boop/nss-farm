/** 히어로 그래픽: 두 이름(A, B)을 상징하는 원과 그 교차 영역. 장식용. */
export function HeroVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="두 개의 원이 겹쳐 하나의 교차 영역을 만드는 이름 궁합 심볼"
    >
      <defs>
        <linearGradient id="hero-synergy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-person-a)" />
          <stop offset="100%" stopColor="var(--color-person-b-bright)" />
        </linearGradient>
        <clipPath id="hero-clip-a">
          <circle cx="150" cy="130" r="110" />
        </clipPath>
      </defs>

      {/* 교차 영역 */}
      <circle cx="250" cy="130" r="110" fill="url(#hero-synergy)" clipPath="url(#hero-clip-a)" opacity="0.92" />

      <circle cx="150" cy="130" r="110" fill="none" stroke="var(--color-person-a)" strokeWidth="1.5" />
      <circle cx="250" cy="130" r="110" fill="none" stroke="var(--color-person-b-bright)" strokeWidth="1.5" />

      <text x="88" y="138" textAnchor="middle" className="font-display" fontSize="34" fill="var(--color-person-a)">
        A
      </text>
      <text x="312" y="138" textAnchor="middle" className="font-display" fontSize="34" fill="var(--color-person-b)">
        B
      </text>
      <text
        x="200"
        y="140"
        textAnchor="middle"
        className="font-display"
        fontSize="30"
        fontStyle="italic"
        fill="var(--color-paper)"
      >
        ×
      </text>
    </svg>
  );
}
