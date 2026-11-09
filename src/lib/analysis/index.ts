/**
 * 이름 궁합 분석 엔진 진입점 — ANALYSIS_RULES 6, 7장.
 * 결정적 순수 함수: 같은 입력이면 항상 같은 결과를 돌려준다.
 */
import { GRADES, RULES_VERSION, SECTION_WEIGHTS, TYPE_RULES } from "@/lib/analysis/constants";
import { extractFeatures } from "@/lib/analysis/features";
import { analyzeMeaning } from "@/lib/analysis/meaning";
import { analyzePhonetic } from "@/lib/analysis/phonetic";
import { analyzeStructure } from "@/lib/analysis/structure";
import { normalizePerson } from "@/lib/analysis/validate";
import type {
  AnalysisInput,
  AnalysisResult,
  NameFeatures,
  PhoneticSection,
  StructureSection,
  TypeCode,
} from "@/lib/analysis/types";

export function gradeOf(total: number): string {
  return (GRADES.find((g) => total >= g.min) ?? GRADES[GRADES.length - 1]).label;
}

type ClassifyArgs = {
  total: number;
  a: NameFeatures;
  b: NameFeatures;
  phonetic: PhoneticSection;
  structure: StructureSection;
};

const simOf = (section: PhoneticSection | StructureSection, code: string) =>
  section.items.find((i) => i.code === code)?.similarity ?? 0;

export function similarityIndex(phonetic: PhoneticSection, structure: StructureSection): number {
  return (simOf(phonetic, "P1") + simOf(phonetic, "P2") + simOf(phonetic, "P3") + simOf(structure, "S2")) / 4;
}

export function classify({ total, a, b, phonetic, structure }: ClassifyArgs): { code: TypeCode; reason: string } {
  const sim = similarityIndex(phonetic, structure);
  const flow = phonetic.flow.value;
  const vowelSim = simOf(phonetic, "P1");

  if (total >= TYPE_RULES.synergyTotalMin && flow >= TYPE_RULES.synergyFlowMin) {
    return {
      code: "SYNERGY",
      reason: `조화 지수가 ${total}점으로 높고, 두 이름을 이어 부를 때 소리가 막힘 없이 흘러 SYNERGY TYPE으로 분류했어요.`,
    };
  }
  if (
    a.length === b.length &&
    structure.patternMatch >= TYPE_RULES.rhythmPatternMin &&
    vowelSim >= TYPE_RULES.rhythmVowelSimMin
  ) {
    return {
      code: "RHYTHM",
      reason: `두 이름 모두 ${a.length}글자이고 받침 패턴과 모음 톤이 닮아 RHYTHM TYPE으로 분류했어요.`,
    };
  }
  if (sim >= TYPE_RULES.harmonySimMin) {
    return {
      code: "HARMONY",
      reason: `모음 톤, 받침 리듬, 첫소리, 짜임새의 평균 유사도가 ${Math.round(sim * 100)}%로 높아 HARMONY TYPE으로 분류했어요.`,
    };
  }
  if (sim < TYPE_RULES.complementSimMax) {
    return {
      code: "COMPLEMENT",
      reason: `소리와 짜임새의 평균 유사도가 ${Math.round(sim * 100)}%로, 서로 다른 특징이 많아 COMPLEMENT TYPE으로 분류했어요.`,
    };
  }
  return {
    code: "BALANCE",
    reason: `소리와 짜임새의 평균 유사도가 ${Math.round(sim * 100)}%로, 닮은 점과 다른 점이 고르게 섞여 BALANCE TYPE으로 분류했어요.`,
  };
}

export function analyzeNames(rawInput: AnalysisInput): AnalysisResult {
  const input: AnalysisInput = {
    a: normalizePerson(rawInput.a),
    b: normalizePerson(rawInput.b),
    relation: rawInput.relation,
  };
  const a = extractFeatures(input.a.name);
  const b = extractFeatures(input.b.name);

  const phonetic = analyzePhonetic(a, b);
  const structure = analyzeStructure(a, b);
  const meaning = analyzeMeaning(input.a, input.b);

  const meaningOn = meaning.status === "available";
  const sum = SECTION_WEIGHTS.phonetic + SECTION_WEIGHTS.structure + (meaningOn ? SECTION_WEIGHTS.meaning : 0);
  const weights = {
    phonetic: SECTION_WEIGHTS.phonetic / sum,
    structure: SECTION_WEIGHTS.structure / sum,
    meaning: meaningOn ? SECTION_WEIGHTS.meaning / sum : null,
  };

  const raw =
    weights.phonetic * phonetic.score +
    weights.structure * structure.score +
    (meaning.status === "available" && weights.meaning !== null ? weights.meaning * meaning.score : 0);
  // 부동소수 오차로 x.5 경계가 흔들리지 않도록 보정 후 반올림
  const total = Math.min(100, Math.max(0, Math.round(raw + 1e-9)));

  return {
    version: RULES_VERSION,
    input,
    features: { a, b },
    sections: { phonetic, structure, meaning },
    weights,
    total,
    grade: gradeOf(total),
    indices: { similarity: similarityIndex(phonetic, structure), flow: phonetic.flow.value },
    type: classify({ total, a, b, phonetic, structure }),
    sameName: input.a.name === input.b.name,
  };
}
