/**
 * 분석 상수 — docs/ANALYSIS_RULES.md와 1:1로 일치해야 한다.
 * 값을 바꾸면 같은 커밋에서 문서와 변경 이력도 갱신한다.
 */

export const RULES_VERSION = "1.2";

// 1장 입력
export const NAME_MIN = 2;
export const PET_NAME_MIN = 1;
export const NAME_MAX = 5;
export const HANJA_MAX = 5;
export const MEANING_MAX = 60;

// 2.1 분류표
export const BRIGHT_VOWELS = new Set(["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ"]);
export const DARK_VOWELS = new Set(["ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ"]);
// 그 외(ㅡ ㅢ ㅣ)는 중성

export const SONORANTS = new Set(["ㄴ", "ㄹ", "ㅁ", "ㅇ"]);
export const PLAIN_STOPS = new Set(["ㄱ", "ㄷ", "ㅂ", "ㅅ", "ㅈ"]);
export const ASPIRATED = new Set(["ㅊ", "ㅋ", "ㅌ", "ㅍ"]);
export const TENSE = new Set(["ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"]);

export function initialSoftness(cho: string): number {
  if (SONORANTS.has(cho)) return 1.0;
  if (PLAIN_STOPS.has(cho)) return 0.6;
  if (cho === "ㅎ") return 0.5;
  if (ASPIRATED.has(cho)) return 0.25;
  if (TENSE.has(cho)) return 0.1;
  throw new Error(`알 수 없는 초성: ${cho}`);
}

// 2.3 이름 특징 문장 임계값
export const TONE_BRIGHT_MIN = 0.2; // > 0.2 밝음
export const TONE_DARK_MAX = -0.2; // < -0.2 깊음
export const OPEN_MIN = 0.5; // >= 0.5 열림
export const SOFT_MIN = 0.75; // >= 0.75 둥근 첫소리
export const CRISP_MAX = 0.5; // < 0.5 선명한 첫소리

// 3장 발음
export const SIMILARITY_FLOOR = 50; // 점수 = 50 + 50 × 유사도
export const SOFTNESS_RANGE = 0.9;
export const SHARED_SOUND_SATURATION = 0.5;
export const PHONETIC_WEIGHTS = { P1: 0.25, P2: 0.2, P3: 0.2, P4: 0.2, P5: 0.15 } as const;

export const FLOW_VALUES = {
  open: 1.0,
  liaison: 1.0,
  sonorant: 0.85,
  plain: 0.6,
  hard: 0.4,
} as const;

// 4장 구조
export const LENGTH_DIFF_SCORES = [100, 85, 65, 50, 40] as const; // 차이 0~4
export const DENSITY_RANGE = 1.5;
export const STRUCTURE_WEIGHTS = { S1: 0.4, S2: 0.3, S3: 0.3 } as const;

// 5장 의미
export const MEANING_BASE = 55;
export const MEANING_SHARED_POINTS = 20;
export const MEANING_COMPLEMENT_POINTS = 12;
export const MEANING_COUNT_CAP = 2;
export const HANJA_SHARED_BONUS = 5;

// 6장 종합
export const SECTION_WEIGHTS = { phonetic: 0.4, structure: 0.3, meaning: 0.3 } as const;

export const GRADES = [
  { min: 90, label: "눈부신 조화" },
  { min: 80, label: "깊은 조화" },
  { min: 70, label: "편안한 조화" },
  { min: 60, label: "흥미로운 조화" },
  { min: 0, label: "새로운 조화" },
] as const;

// 7장 관계 유형
export const TYPE_RULES = {
  synergyTotalMin: 88,
  synergyFlowMin: 0.85,
  rhythmPatternMin: 2 / 3,
  rhythmVowelSimMin: 0.75,
  harmonySimMin: 0.8,
  complementSimMax: 0.65,
} as const;
