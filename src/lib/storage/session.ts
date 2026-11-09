/**
 * 탭 단위 sessionStorage 보관. 이름은 서버·URL로 보내지 않는다 (PRD 8장).
 * 저장소 접근이 막힌 환경(프라이빗 모드 등)에서도 예외를 던지지 않는다.
 */
import { isRelation } from "@/lib/analysis/validate";
import type { AnalysisInput, PersonInput } from "@/lib/analysis/types";

const INPUT_KEY = "name-synergy:input:v1";

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

export function saveInput(input: AnalysisInput): boolean {
  try {
    window.sessionStorage.setItem(INPUT_KEY, JSON.stringify(input));
    return true;
  } catch {
    return false;
  }
}

export function loadInput(): AnalysisInput | null {
  try {
    const raw = window.sessionStorage.getItem(INPUT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isAnalysisInput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearInput(): void {
  try {
    window.sessionStorage.removeItem(INPUT_KEY);
  } catch {
    // 무시
  }
}
