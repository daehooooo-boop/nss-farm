/**
 * 탭 단위 sessionStorage 보관. 이름은 서버·URL로 보내지 않는다 (PRD 8장).
 * 저장소 접근이 막힌 환경(프라이빗 모드 등)에서도 예외를 던지지 않는다.
 */
import { isRelation } from "@/lib/analysis/validate";
import type { AnalysisInput, PersonInput } from "@/lib/analysis/types";
import type { Locale } from "@/i18n/locale";

/** 언어마다 따로 보관한다 (한국어 입력이 영어 엔진으로 가지 않도록) */
const INPUT_KEY: Record<Locale, string> = { ko: "name-synergy:input:v1", en: "name-synergy:input:en:v1" };

function isPerson(value: unknown): value is PersonInput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.hanja === "string" && typeof v.meaning === "string";
}

function isAnalysisInput(value: unknown): value is AnalysisInput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return isPerson(v.a) && isPerson(v.b) && isRelation(v.relation);
}

export function saveInput(input: AnalysisInput, locale: Locale = "ko"): boolean {
  try {
    window.sessionStorage.setItem(INPUT_KEY[locale], JSON.stringify(input));
    return true;
  } catch {
    return false;
  }
}

export function loadInput(locale: Locale = "ko"): AnalysisInput | null {
  return parseInput(readRawInput(locale));
}

export function clearInput(locale: Locale = "ko"): void {
  try {
    window.sessionStorage.removeItem(INPUT_KEY[locale]);
  } catch {
    // 무시
  }
}

/** useSyncExternalStore용: 저장된 원문 문자열 (안정적인 스냅샷) */
export function readRawInput(locale: Locale = "ko"): string | null {
  try {
    return window.sessionStorage.getItem(INPUT_KEY[locale]);
  } catch {
    return null;
  }
}

export function parseInput(raw: string | null): AnalysisInput | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isAnalysisInput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
