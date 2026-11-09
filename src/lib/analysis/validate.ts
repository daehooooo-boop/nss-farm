/**
 * 입력 정규화와 검증 — docs/ANALYSIS_RULES.md 1장.
 * UI와 독립된 순수 함수. 오류 문구는 그대로 화면에 노출된다.
 */
import {
  HANJA_MAX,
  MEANING_MAX,
  NAME_MAX,
  NAME_MIN,
  PET_NAME_MIN,
} from "@/lib/analysis/constants";
import {
  RELATIONS,
  type AnalysisInput,
  type DraftInput,
  type PersonFieldErrors,
  type PersonInput,
  type PersonKey,
  type Relation,
  type ValidationResult,
} from "@/lib/analysis/types";

const HANGUL_SYLLABLES = /^[가-힣]+$/;
const HAN_CHARS = /^\p{Script=Han}+$/u;

export const MESSAGES = {
  nameRequired: "이름을 입력해 주세요.",
  nameFormat: (min: number) => `이름은 한글 ${min}~${NAME_MAX}자로 입력해 주세요.`,
  hanjaFormat: `한자는 한자로만 ${HANJA_MAX}자까지 입력해 주세요.`,
  hanjaLengthMismatch: "이름 글자 수와 한자 수가 달라요. 그대로 분석할 수 있어요.",
  meaningTooLong: `의미는 ${MEANING_MAX}자 이내로 입력해 주세요.`,
  relationRequired: "두 사람의 관계를 선택해 주세요.",
} as const;

export function normalizeName(raw: string): string {
  return raw.normalize("NFC").replace(/\s+/g, "");
}

export function normalizeHanja(raw: string): string {
  return raw.normalize("NFC").replace(/\s+/g, "");
}

export function normalizeMeaning(raw: string): string {
  return raw.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function normalizePerson(p: PersonInput): PersonInput {
  return {
    name: normalizeName(p.name),
    hanja: normalizeHanja(p.hanja),
    meaning: normalizeMeaning(p.meaning),
  };
}

export function nameMinLength(key: PersonKey, relation: Relation | null): number {
  return key === "b" && relation === "pet" ? PET_NAME_MIN : NAME_MIN;
}

export function validateName(raw: string, min: number): string | undefined {
  const name = normalizeName(raw);
  if (name.length === 0) return MESSAGES.nameRequired;
  if (!HANGUL_SYLLABLES.test(name) || name.length < min || name.length > NAME_MAX) {
    return MESSAGES.nameFormat(min);
  }
  return undefined;
}

export function validateHanja(raw: string): string | undefined {
  const hanja = normalizeHanja(raw);
  if (hanja.length === 0) return undefined;
  if (!HAN_CHARS.test(hanja) || [...hanja].length > HANJA_MAX) return MESSAGES.hanjaFormat;
  return undefined;
}

export function validateMeaning(raw: string): string | undefined {
  return normalizeMeaning(raw).length > MEANING_MAX ? MESSAGES.meaningTooLong : undefined;
}

export function isRelation(value: unknown): value is Relation {
  return typeof value === "string" && (RELATIONS as readonly string[]).includes(value);
}

function personErrors(p: PersonInput, min: number): PersonFieldErrors {
  const errors: PersonFieldErrors = {};
  const name = validateName(p.name, min);
  const hanja = validateHanja(p.hanja);
  const meaning = validateMeaning(p.meaning);
  if (name) errors.name = name;
  if (hanja) errors.hanja = hanja;
  if (meaning) errors.meaning = meaning;
  return errors;
}

function personWarnings(p: PersonInput): PersonFieldErrors {
  const n = normalizePerson(p);
  if (n.hanja && !validateHanja(n.hanja) && [...n.hanja].length !== n.name.length) {
    return { hanja: MESSAGES.hanjaLengthMismatch };
  }
  return {};
}

export function validateInput(draft: DraftInput): ValidationResult {
  const errors = {
    a: personErrors(draft.a, nameMinLength("a", draft.relation)),
    b: personErrors(draft.b, nameMinLength("b", draft.relation)),
    relation: draft.relation ? undefined : MESSAGES.relationRequired,
  };
  const warnings = { a: personWarnings(draft.a), b: personWarnings(draft.b) };
  const hasError =
    Object.keys(errors.a).length > 0 || Object.keys(errors.b).length > 0 || errors.relation !== undefined;

  if (hasError || draft.relation === null) {
    return { ok: false, errors, warnings };
  }
  const value: AnalysisInput = {
    a: normalizePerson(draft.a),
    b: normalizePerson(draft.b),
    relation: draft.relation,
  };
  return { ok: true, value, warnings };
}
