import type { Relation } from "@/lib/analysis/types";

export type RelationOption = {
  value: Relation;
  label: string;
  /** 리포트 호칭 — ANALYSIS_RULES 8.2 */
  pair: string;
};

export const RELATION_OPTIONS: RelationOption[] = [
  { value: "lover", label: "연인", pair: "두 사람" },
  { value: "spouse", label: "부부", pair: "두 분" },
  { value: "friend", label: "친구", pair: "두 친구" },
  { value: "family", label: "가족", pair: "두 가족" },
  { value: "colleague", label: "동료", pair: "두 동료" },
  { value: "pet", label: "반려동물", pair: "함께 사는 두 이름" },
  { value: "other", label: "기타", pair: "두 사람" },
];

export function relationOption(value: Relation): RelationOption {
  const found = RELATION_OPTIONS.find((o) => o.value === value);
  if (!found) throw new Error(`Unknown relation: ${value}`);
  return found;
}

/** 입력 화면의 Person 라벨 */
export function personLabels(relation: Relation | null): { a: string; b: string } {
  return relation === "pet" ? { a: "나", b: "반려동물" } : { a: "첫 번째 사람", b: "두 번째 사람" };
}
