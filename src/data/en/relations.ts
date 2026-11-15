import type { Relation } from "@/lib/analysis/types";
import type { RelationOption } from "@/data/relations";
import type { RelationTypeCode, RelationTypeInfo } from "@/data/relationTypes";

export const RELATION_OPTIONS_EN: RelationOption[] = [
  { value: "lover", label: "Partner", pair: "the two of you" },
  { value: "spouse", label: "Spouse", pair: "the two of you" },
  { value: "friend", label: "Friend", pair: "the two of you" },
  { value: "family", label: "Family", pair: "the two of you" },
  { value: "colleague", label: "Coworker", pair: "the two of you" },
  { value: "pet", label: "Pet", pair: "these two" },
  { value: "other", label: "Other", pair: "the two of you" },
];

export function relationOptionEn(value: Relation): RelationOption {
  const found = RELATION_OPTIONS_EN.find((o) => o.value === value);
  if (!found) throw new Error(`Unknown relation: ${value}`);
  return found;
}

export function personLabelsEn(relation: Relation | null): { a: string; b: string } {
  return relation === "pet" ? { a: "You", b: "Your pet" } : { a: "First person", b: "Second person" };
}

export const RELATION_TYPES_EN: Record<RelationTypeCode, RelationTypeInfo> = {
  SYNERGY: {
    code: "SYNERGY",
    label: "SYNERGY TYPE",
    title: "A pair that creates new possibilities together",
    description: "Highly harmonious names whose sounds flow into each other without a break. Together, the picture gets bigger than either alone.",
  },
  RHYTHM: {
    code: "RHYTHM",
    label: "RHYTHM TYPE",
    title: "A pair with a matching rhythm and mood",
    description: "Names with the same number of syllables, similar endings and a similar vowel tone. Like two people who walk at the same pace without saying a word.",
  },
  HARMONY: {
    code: "HARMONY",
    label: "HARMONY TYPE",
    title: "A pair in natural harmony",
    description: "Names with an overall similar sound and build. They blend comfortably without forcing anything.",
  },
  COMPLEMENT: {
    code: "COMPLEMENT",
    label: "COMPLEMENT TYPE",
    title: "A pair that completes each other's differences",
    description: "Names with contrasting textures, bright and deep, soft and sharp. What one lacks, the other fills in.",
  },
  BALANCE: {
    code: "BALANCE",
    label: "BALANCE TYPE",
    title: "A pair that keeps each other balanced",
    description: "An even mix of likeness and difference. They share the weight and keep each other centered.",
  },
};
