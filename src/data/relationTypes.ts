/**
 * 관계 유형 정의 — docs/ANALYSIS_RULES.md 7장.
 * 분류 조건은 lib/analysis/classify.ts, 여기에는 보여줄 콘텐츠만 둔다.
 * (강점·메시지·스토리 템플릿은 STEP 5~6에서 추가)
 */
export type RelationTypeCode = "SYNERGY" | "RHYTHM" | "HARMONY" | "COMPLEMENT" | "BALANCE";

export type RelationTypeInfo = {
  code: RelationTypeCode;
  label: string; // "SYNERGY TYPE"
  title: string; // 한 줄 정의
  description: string; // 2문장 내외 설명
};

export const RELATION_TYPES: Record<RelationTypeCode, RelationTypeInfo> = {
  SYNERGY: {
    code: "SYNERGY",
    label: "SYNERGY TYPE",
    title: "함께할 때 새로운 가능성이 만들어지는 관계",
    description:
      "두 이름이 높은 조화를 이루면서도 소리가 막힘 없이 이어지는 조합이에요. 따로일 때보다 함께일 때 더 큰 그림이 그려집니다.",
  },
  RHYTHM: {
    code: "RHYTHM",
    label: "RHYTHM TYPE",
    title: "비슷한 리듬과 분위기를 가진 관계",
    description:
      "글자 수와 받침의 박자, 모음의 톤이 닮은 조합이에요. 말하지 않아도 같은 속도로 걷는 사이처럼 느껴집니다.",
  },
  HARMONY: {
    code: "HARMONY",
    label: "HARMONY TYPE",
    title: "자연스러운 조화를 이루는 관계",
    description:
      "소리와 구조의 결이 전반적으로 비슷한 조합이에요. 억지로 맞추지 않아도 편안하게 어우러집니다.",
  },
  COMPLEMENT: {
    code: "COMPLEMENT",
    label: "COMPLEMENT TYPE",
    title: "서로 다른 특징을 보완하는 관계",
    description:
      "밝음과 깊음, 부드러움과 선명함처럼 서로 다른 결을 가진 조합이에요. 한쪽에 없는 것을 다른 쪽이 채워 줍니다.",
  },
  BALANCE: {
    code: "BALANCE",
    label: "BALANCE TYPE",
    title: "서로의 균형을 맞추는 관계",
    description:
      "닮은 점과 다른 점이 고르게 섞인 조합이에요. 서로의 무게를 덜어 주며 중심을 잡아 갑니다.",
  },
};

/** 메인 페이지 등에서 보여줄 순서 */
export const RELATION_TYPE_ORDER: RelationTypeCode[] = [
  "SYNERGY",
  "RHYTHM",
  "HARMONY",
  "COMPLEMENT",
  "BALANCE",
];
