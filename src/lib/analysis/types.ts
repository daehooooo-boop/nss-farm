/** 분석 엔진 공용 타입 — docs/ANALYSIS_RULES.md */

export const RELATIONS = ["lover", "spouse", "friend", "family", "colleague", "pet", "other"] as const;
export type Relation = (typeof RELATIONS)[number];

export type PersonKey = "a" | "b";

export type PersonInput = {
  name: string;
  hanja: string;
  meaning: string;
};

export type AnalysisInput = {
  a: PersonInput;
  b: PersonInput;
  relation: Relation;
};

/** 폼 상태: 관계를 아직 고르지 않았을 수 있다 */
export type DraftInput = {
  a: PersonInput;
  b: PersonInput;
  relation: Relation | null;
};

export type PersonFieldErrors = Partial<Record<keyof PersonInput, string>>;

export type ValidationResult =
  | {
      ok: true;
      value: AnalysisInput;
      warnings: Record<PersonKey, PersonFieldErrors>;
    }
  | {
      ok: false;
      errors: { a: PersonFieldErrors; b: PersonFieldErrors; relation?: string };
      warnings: Record<PersonKey, PersonFieldErrors>;
    };

// ───────────── 분석 결과 타입 (ANALYSIS_RULES 9장) ─────────────

export type ToneKind = "bright" | "dark" | "neutral";

export type NameFeatures = {
  name: string;
  length: number;
  syllables: { char: string; cho: string; jung: string; jong: string }[];
  vowelTone: number;
  toneKind: ToneKind;
  openness: number;
  softness: number;
  density: number;
  /** 음절별 O(열림)/C(닫힘) */
  pattern: ("O" | "C")[];
  sounds: string[];
};

export type ScoreItem = {
  code: string;
  label: string;
  score: number;
  /** 0~1 유사도 (유사도 기반 항목만) */
  similarity?: number;
  detail: string;
};

export type FlowKind = "open" | "liaison" | "sonorant" | "plain" | "hard";

export type FlowJunction = {
  from: string; // 앞 이름
  to: string; // 뒤 이름
  fromSyllable: string;
  toSyllable: string;
  jong: string;
  cho: string;
  kind: FlowKind;
  value: number;
  detail: string;
};

export type PhoneticSection = {
  key: "phonetic";
  status: "available";
  score: number;
  items: ScoreItem[];
  flow: { value: number; junctions: [FlowJunction, FlowJunction] };
  sharedSounds: string[];
};

export type StructureSection = {
  key: "structure";
  status: "available";
  score: number;
  items: ScoreItem[];
  patternMatch: number;
};

export type MeaningStatus = "available" | "none" | "partial" | "unrecognized";

export type MeaningSection =
  | {
      key: "meaning";
      status: "available";
      score: number;
      items: ScoreItem[];
      categories: { a: string[]; b: string[] };
      shared: string[];
      complements: { a: string; b: string; note: string }[];
      sharedHanja: string[];
    }
  | {
      key: "meaning";
      status: Exclude<MeaningStatus, "available">;
      message: string;
      hint?: string;
      sharedHanja: string[];
    };

export type TypeCode = "SYNERGY" | "RHYTHM" | "HARMONY" | "COMPLEMENT" | "BALANCE";

export type AnalysisResult = {
  version: string;
  input: AnalysisInput;
  features: { a: NameFeatures; b: NameFeatures };
  sections: {
    phonetic: PhoneticSection;
    structure: StructureSection;
    meaning: MeaningSection;
  };
  /** 실제 적용 가중치 (합 = 1). 의미 제외 시 meaning = null */
  weights: { phonetic: number; structure: number; meaning: number | null };
  total: number;
  grade: string;
  indices: { similarity: number; flow: number };
  type: { code: TypeCode; reason: string };
  sameName: boolean;
};
