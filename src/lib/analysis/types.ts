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
