/**
 * 의미 범주 사전 — docs/ANALYSIS_RULES.md 5.2, 5.3
 * 키워드는 원칙적으로 2자 이상. 1자 키워드는 ALLOWED_SINGLE에 있는 것만 쓴다.
 * 매칭은 긴 키워드부터 하고, 매칭된 부분은 지워 짧은 키워드가 다시 쓰지 못하게 한다 ("강하" ≠ "강").
 */

export type MeaningCategory =
  | "light"
  | "wisdom"
  | "virtue"
  | "peace"
  | "strength"
  | "nature"
  | "water"
  | "aspiration"
  | "beauty"
  | "joy"
  | "growth"
  | "integrity"
  | "love";

export const MEANING_LABELS: Record<MeaningCategory, string> = {
  light: "빛·밝음",
  wisdom: "지혜·배움",
  virtue: "어짊·덕",
  peace: "평안·화목",
  strength: "굳셈·용기",
  nature: "자연·초목",
  water: "물·바다",
  aspiration: "큰 뜻·높음",
  beauty: "아름다움",
  joy: "기쁨·복",
  growth: "성장·번영",
  integrity: "바름·진실",
  love: "사랑·은혜",
};

export const MEANING_KEYWORDS: Record<MeaningCategory, readonly string[]> = {
  light: ["빛", "밝", "환하", "환한", "햇살", "햇빛", "태양", "광명", "빛나", "눈부", "여명", "새벽"],
  wisdom: ["지혜", "슬기", "총명", "현명", "학문", "배움", "명석", "똑똑", "영리", "지식", "깨달"],
  virtue: ["어질", "어진", "덕", "인자", "착하", "착한", "너그러", "선하", "선한", "베풀"],
  peace: ["평안", "편안", "평화", "화목", "안녕", "고요", "온화", "평온", "안정"],
  strength: ["굳세", "굳센", "강하", "강한", "용기", "용감", "씩씩", "튼튼", "단단", "굳건"],
  nature: ["나무", "숲", "꽃", "풀", "봄", "자연", "열매", "새싹", "들판"],
  water: ["물", "바다", "강", "시내", "샘", "호수", "맑은 물", "이슬", "냇물"],
  aspiration: ["하늘", "높", "큰 뜻", "크게", "우뚝", "뛰어나", "뛰어난", "넓은", "드넓", "원대"],
  beauty: ["아름답", "아름다운", "고운", "곱", "예쁘", "예쁜", "빼어나", "수려"],
  joy: ["기쁨", "기쁘", "기쁜", "복", "행복", "즐거", "경사", "웃음", "행운"],
  growth: ["성장", "자라", "번영", "번성", "이루", "이룸", "성공", "발전", "번창"],
  integrity: ["바르", "바른", "곧", "정직", "진실", "의로", "참", "올곧", "성실", "믿음"],
  love: ["사랑", "은혜", "따뜻", "다정", "아끼", "아낌", "정다"],
};

/** 허용된 1자 키워드 (문서 5.2와 일치) */
export const ALLOWED_SINGLE = new Set(["빛", "밝", "덕", "숲", "꽃", "풀", "봄", "물", "강", "샘", "높", "곱", "복", "곧", "참"]);

/** 보완 관계 범주쌍 (5.3) */
export const COMPLEMENT_PAIRS: readonly { pair: [MeaningCategory, MeaningCategory]; note: string }[] = [
  { pair: ["strength", "peace"], note: "단단함이 고요함을 지켜 주는" },
  { pair: ["light", "nature"], note: "빛이 초목을 자라게 하는" },
  { pair: ["water", "nature"], note: "물과 초목이 서로를 살리는" },
  { pair: ["wisdom", "virtue"], note: "지혜와 어짊이 판단과 마음의 균형을 잡는" },
  { pair: ["aspiration", "integrity"], note: "큰 뜻에 바른 기준이 더해지는" },
  { pair: ["beauty", "love"], note: "바라봄과 아낌이 이어지는" },
  { pair: ["growth", "joy"], note: "이룸과 누림이 함께하는" },
];
