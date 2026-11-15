/** English input validation — docs/ANALYSIS_RULES_EN.md 1장 */
import { lettersOf, displayName } from "@/lib/analysis-en/features";
import { isRelation } from "@/lib/analysis/validate";
import type { AnalysisInput, DraftInput, PersonFieldErrors, PersonInput, PersonKey, Relation, ValidationResult } from "@/lib/analysis/types";

export const EN_NAME_MIN = 2;
export const EN_PET_NAME_MIN = 1;
export const EN_NAME_MAX = 20;
/** 영문(악센트 포함), 공백, 하이픈, 아포스트로피만 허용 */
const LATIN_NAME = /^[\p{Script=Latin}\s'’-]+$/u;

export const MESSAGES_EN = {
  nameRequired: "Please enter a name.",
  nameFormat: (min: number) => `Use English letters only, ${min}–${EN_NAME_MAX} letters.`,
  relationRequired: "Please choose your relationship.",
} as const;

export function normalizePersonEn(p: PersonInput): PersonInput {
  return { name: displayName(p.name), hanja: "", meaning: "" };
}

export function validateNameEn(raw: string, min: number): string | undefined {
  const name = displayName(raw);
  if (name.length === 0) return MESSAGES_EN.nameRequired;
  const letters = lettersOf(name).length;
  if (!LATIN_NAME.test(name) || letters < min || letters > EN_NAME_MAX) return MESSAGES_EN.nameFormat(min);
  return undefined;
}

function minLength(key: PersonKey, relation: Relation | null) {
  return key === "b" && relation === "pet" ? EN_PET_NAME_MIN : EN_NAME_MIN;
}

export function validateInputEn(draft: DraftInput): ValidationResult {
  const errA: PersonFieldErrors = {};
  const errB: PersonFieldErrors = {};
  const na = validateNameEn(draft.a.name, minLength("a", draft.relation));
  const nb = validateNameEn(draft.b.name, minLength("b", draft.relation));
  if (na) errA.name = na;
  if (nb) errB.name = nb;
  const relation = draft.relation && isRelation(draft.relation) ? undefined : MESSAGES_EN.relationRequired;
  const warnings = { a: {}, b: {} };
  if (na || nb || relation || draft.relation === null) {
    return { ok: false, errors: { a: errA, b: errB, relation }, warnings };
  }
  const value: AnalysisInput = { a: normalizePersonEn(draft.a), b: normalizePersonEn(draft.b), relation: draft.relation };
  return { ok: true, value, warnings };
}
