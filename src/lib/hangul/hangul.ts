/**
 * 한글 음절 분해와 조사 선택 — docs/ANALYSIS_RULES.md 2장.
 * 순수 함수만 둔다.
 */

export const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"] as const;
export const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"] as const;
export const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"] as const;

/** 복합 자모를 기본 자모로 푼다 (이중모음, 겹받침) */
export const COMPOUND_JAMO: Readonly<Record<string, readonly string[]>> = {
  ㅘ: ["ㅗ", "ㅏ"],
  ㅙ: ["ㅗ", "ㅐ"],
  ㅚ: ["ㅗ", "ㅣ"],
  ㅝ: ["ㅜ", "ㅓ"],
  ㅞ: ["ㅜ", "ㅔ"],
  ㅟ: ["ㅜ", "ㅣ"],
  ㅢ: ["ㅡ", "ㅣ"],
  ㄳ: ["ㄱ", "ㅅ"],
  ㄵ: ["ㄴ", "ㅈ"],
  ㄶ: ["ㄴ", "ㅎ"],
  ㄺ: ["ㄹ", "ㄱ"],
  ㄻ: ["ㄹ", "ㅁ"],
  ㄼ: ["ㄹ", "ㅂ"],
  ㄽ: ["ㄹ", "ㅅ"],
  ㄾ: ["ㄹ", "ㅌ"],
  ㄿ: ["ㄹ", "ㅍ"],
  ㅀ: ["ㄹ", "ㅎ"],
  ㅄ: ["ㅂ", "ㅅ"],
};

export type Syllable = {
  char: string;
  cho: string;
  jung: string;
  /** 받침 없음은 빈 문자열 */
  jong: string;
};

const BASE = 0xac00;
const LAST = 0xd7a3;

export function isHangulSyllable(char: string): boolean {
  const code = char.charCodeAt(0);
  return char.length === 1 && code >= BASE && code <= LAST;
}

export function decomposeSyllable(char: string): Syllable {
  if (!isHangulSyllable(char)) throw new Error(`완성형 한글 음절이 아닙니다: ${char}`);
  const idx = char.charCodeAt(0) - BASE;
  return {
    char,
    cho: CHO[Math.floor(idx / 588)],
    jung: JUNG[Math.floor((idx % 588) / 28)],
    jong: JONG[idx % 28],
  };
}

export function decompose(word: string): Syllable[] {
  return [...word].map(decomposeSyllable);
}

/** 기본 자모 배열 (복합 자모는 풀어서) */
export function basicJamo(jamo: string): readonly string[] {
  if (jamo === "") return [];
  return COMPOUND_JAMO[jamo] ?? [jamo];
}

export function hasFinalConsonant(word: string): boolean {
  const last = word.at(-1);
  if (!last || !isHangulSyllable(last)) return false;
  return decomposeSyllable(last).jong !== "";
}

/**
 * 받침 유무에 따른 조사 선택.
 * pair 예: "은/는", "이/가", "을/를", "과/와", "이랑/랑", "아/야", "이에요/예요", "으로/로"
 */
export function josa(word: string, pair: string): string {
  const [withFinal, withoutFinal] = pair.split("/");
  const last = word.at(-1);
  if (pair === "으로/로" && last && isHangulSyllable(last) && decomposeSyllable(last).jong === "ㄹ") {
    return word + withoutFinal;
  }
  return word + (hasFinalConsonant(word) ? withFinal : withoutFinal);
}
