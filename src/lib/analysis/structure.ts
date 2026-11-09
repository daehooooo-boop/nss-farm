/** 구조의 균형 — ANALYSIS_RULES 4장 */
import { josa } from "@/lib/hangul/hangul";
import { DENSITY_RANGE, LENGTH_DIFF_SCORES, STRUCTURE_WEIGHTS } from "@/lib/analysis/constants";
import { clamp01, simScore } from "@/lib/analysis/phonetic";
import type { NameFeatures, ScoreItem, StructureSection } from "@/lib/analysis/types";

/** 두 받침 패턴을 끝에서부터 맞춰 짧은 쪽 길이만큼 비교한 일치율 */
export function patternMatch(a: NameFeatures, b: NameFeatures): number {
  const len = Math.min(a.length, b.length);
  let same = 0;
  for (let i = 1; i <= len; i++) {
    if (a.pattern[a.length - i] === b.pattern[b.length - i]) same += 1;
  }
  return same / len;
}

const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
const patternText = (f: NameFeatures) => f.pattern.map((p) => (p === "O" ? "열림" : "닫힘")).join("·");

export function analyzeStructure(a: NameFeatures, b: NameFeatures): StructureSection {
  // S1 길이 균형
  const diff = Math.abs(a.length - b.length);
  const s1: ScoreItem = {
    code: "S1",
    label: "길이 균형",
    score: LENGTH_DIFF_SCORES[Math.min(diff, LENGTH_DIFF_SCORES.length - 1)],
    detail:
      diff === 0
        ? `두 이름 모두 ${a.length}글자로 길이가 같아요.`
        : `${josa(a.name, "은/는")} ${a.length}글자, ${josa(b.name, "은/는")} ${b.length}글자로 ${diff}글자 차이가 나요.`,
  };

  // S2 소리 밀도
  const sim2 = clamp01(1 - Math.abs(a.density - b.density) / DENSITY_RANGE);
  const s2: ScoreItem = {
    code: "S2",
    label: "소리 밀도",
    score: simScore(sim2),
    similarity: sim2,
    detail: `한 글자에 담긴 자모 수가 ${a.name} ${fmt(a.density)}개, ${b.name} ${fmt(b.density)}개예요. ${
      sim2 >= 0.85 ? "글자의 짜임새가 거의 같아요." : sim2 >= 0.6 ? "짜임새가 비슷한 편이에요." : "한쪽은 촘촘하고 한쪽은 가벼운 짜임이에요."
    }`,
  };

  // S3 받침 패턴
  const m = patternMatch(a, b);
  const s3: ScoreItem = {
    code: "S3",
    label: "받침 패턴",
    score: simScore(m),
    similarity: m,
    detail: `받침 패턴은 ${a.name}(${patternText(a)}), ${b.name}(${patternText(b)})이고, 끝에서부터 맞춰 보면 ${Math.round(m * 100)}%가 일치해요.`,
  };

  const items = [s1, s2, s3];
  const score = STRUCTURE_WEIGHTS.S1 * s1.score + STRUCTURE_WEIGHTS.S2 * s2.score + STRUCTURE_WEIGHTS.S3 * s3.score;
  return { key: "structure", status: "available", score, items, patternMatch: m };
}
