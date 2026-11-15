/**
 * English name analysis — docs/ANALYSIS_RULES_EN.md.
 * 한국어 엔진(lib/analysis)과 같은 점수식·가중치·유형 규칙을 쓰고,
 * 특징 추출(철자 기반 음절)과 설명 문장만 영어용으로 바꾼다.
 * 결정적·대칭적 순수 함수.
 */
import {
  FLOW_VALUES,
  LENGTH_DIFF_SCORES,
  PHONETIC_WEIGHTS,
  SECTION_WEIGHTS,
  SHARED_SOUND_SATURATION,
  SOFTNESS_RANGE,
  STRUCTURE_WEIGHTS,
  DENSITY_RANGE,
  TYPE_RULES,
} from "@/lib/analysis/constants";
import { clamp01, simScore } from "@/lib/analysis/phonetic";
import { patternMatch } from "@/lib/analysis/structure";
import { similarityIndex } from "@/lib/analysis";
import {
  EN_HARD_ONSETS,
  EN_SONORANTS,
  TONE_PHRASE_EN,
  extractFeaturesEn,
  initialPhraseEn,
} from "@/lib/analysis-en/features";
import { normalizePersonEn } from "@/lib/analysis-en/validate";
import type {
  AnalysisInput,
  AnalysisResult,
  FlowJunction,
  FlowKind,
  NameFeatures,
  PhoneticSection,
  ScoreItem,
  StructureSection,
  TypeCode,
} from "@/lib/analysis/types";

export const RULES_VERSION_EN = "en-1.0";

export const GRADES_EN = [
  { min: 90, label: "Radiant Harmony" },
  { min: 80, label: "Deep Harmony" },
  { min: 70, label: "Easy Harmony" },
  { min: 60, label: "Intriguing Harmony" },
  { min: 0, label: "Fresh Harmony" },
] as const;

export function gradeOfEn(total: number): string {
  return (GRADES_EN.find((g) => total >= g.min) ?? GRADES_EN[GRADES_EN.length - 1]).label;
}

function closeness(sim: number, high: string, mid: string, low: string) {
  if (sim >= 0.85) return high;
  if (sim >= 0.6) return mid;
  return low;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const FLOW_DETAIL_EN: Record<FlowKind, string> = {
  open: "the open ending glides straight into the next name",
  liaison: "the last sound links smoothly into a vowel",
  sonorant: "two resonant sounds meet and flow together",
  plain: "a tiny pause forms between the names",
  hard: "a crisp break gives the pair a punchy rhythm",
};

const isSonorantEdge = (s: string) => EN_SONORANTS.has(s) || [...EN_SONORANTS].some((x) => s.endsWith(x));

export function junctionEn(from: NameFeatures, to: NameFeatures): FlowJunction {
  const last = from.syllables[from.length - 1];
  const first = to.syllables[0];
  let kind: FlowKind;
  if (last.jong === "") kind = "open";
  else if (first.cho === "") kind = "liaison";
  else if (isSonorantEdge(last.jong) && EN_SONORANTS.has(first.cho.slice(0, first.cho === "ng" ? 2 : 1)))
    kind = "sonorant";
  else if ([...EN_HARD_ONSETS].some((h) => first.cho.startsWith(h))) kind = "hard";
  else kind = "plain";
  return {
    from: from.name,
    to: to.name,
    fromSyllable: last.char,
    toSyllable: first.char,
    jong: last.jong,
    cho: first.cho,
    kind,
    value: FLOW_VALUES[kind],
    detail: FLOW_DETAIL_EN[kind],
  };
}

export function analyzePhoneticEn(a: NameFeatures, b: NameFeatures): PhoneticSection {
  const sim1 = clamp01(1 - Math.abs(a.vowelTone - b.vowelTone) / 2);
  const p1: ScoreItem = {
    code: "P1",
    label: "Vowel tone",
    score: simScore(sim1),
    similarity: sim1,
    detail:
      a.toneKind === b.toneKind
        ? `Both names carry ${TONE_PHRASE_EN[a.toneKind]}. ${closeness(sim1, "Their vowels are almost identical in color.", "Their vowels share a similar color.", "")}`.trim()
        : `${a.name} has ${TONE_PHRASE_EN[a.toneKind]}, while ${b.name} has ${TONE_PHRASE_EN[b.toneKind]}. ${closeness(sim1, "Different tones, but only slightly apart.", "The two tones make a gentle contrast.", "Brightness and depth create a striking contrast.")}`,
  };

  const sim2 = clamp01(1 - Math.abs(a.openness - b.openness));
  const openCount = (f: NameFeatures) => f.pattern.filter((p) => p === "O").length;
  const p2: ScoreItem = {
    code: "P2",
    label: "Ending rhythm",
    score: simScore(sim2),
    similarity: sim2,
    detail: `${a.name} has ${openCount(a)} of ${plural(a.length, "syllable")} ending open, ${b.name} has ${openCount(b)} of ${b.length}. ${closeness(sim2, "Their endings keep the very same beat.", "Their endings keep a similar beat.", "One name opens up while the other closes firmly.")}`,
  };

  const sim3 = clamp01(1 - Math.abs(a.softness - b.softness) / SOFTNESS_RANGE);
  const p3: ScoreItem = {
    code: "P3",
    label: "Opening texture",
    score: simScore(sim3),
    similarity: sim3,
    detail: `${a.name} has ${initialPhraseEn(a)} and ${b.name} has ${initialPhraseEn(b)}. ${closeness(sim3, "Their consonants feel alike.", "Their consonants sit comfortably together.", "Softness and sharpness make each other stand out.")}`,
  };

  const ab = junctionEn(a, b);
  const ba = junctionEn(b, a);
  const flow = (ab.value + ba.value) / 2;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const p4: ScoreItem = {
    code: "P4",
    label: "Saying them together",
    score: 100 * flow,
    similarity: flow,
    detail: `${a.name} → ${b.name}: ${cap(ab.detail)}. ${b.name} → ${a.name}: ${cap(ba.detail)}.`,
  };

  const setA = new Set(a.sounds);
  const setB = new Set(b.sounds);
  const shared = [...setA].filter((s) => setB.has(s)).sort();
  const union = new Set([...setA, ...setB]);
  const jaccard = union.size === 0 ? 0 : shared.length / union.size;
  const sim5 = clamp01(jaccard / SHARED_SOUND_SATURATION);
  const p5: ScoreItem = {
    code: "P5",
    label: "Shared sounds",
    score: simScore(sim5),
    similarity: sim5,
    detail:
      shared.length > 0
        ? `The names share ${plural(shared.length, "sound")}: ${shared.join(" · ")}. ${closeness(sim5, "They have a lot of sound in common.", "A few shared sounds build a quiet bond.", "With few overlaps, each brings something new to the other.")}`
        : "No sounds overlap, so each name brings something completely new to the other.",
  };

  const items = [p1, p2, p3, p4, p5];
  const score =
    PHONETIC_WEIGHTS.P1 * p1.score +
    PHONETIC_WEIGHTS.P2 * p2.score +
    PHONETIC_WEIGHTS.P3 * p3.score +
    PHONETIC_WEIGHTS.P4 * p4.score +
    PHONETIC_WEIGHTS.P5 * p5.score;
  return { key: "phonetic", status: "available", score, items, flow: { value: flow, junctions: [ab, ba] }, sharedSounds: shared };
}

const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
const patternText = (f: NameFeatures) => f.pattern.map((p) => (p === "O" ? "open" : "closed")).join("·");

export function analyzeStructureEn(a: NameFeatures, b: NameFeatures): StructureSection {
  const diff = Math.abs(a.length - b.length);
  const s1: ScoreItem = {
    code: "S1",
    label: "Length balance",
    score: LENGTH_DIFF_SCORES[Math.min(diff, LENGTH_DIFF_SCORES.length - 1)],
    detail:
      diff === 0
        ? `Both names have ${plural(a.length, "syllable")}, a perfect match in length.`
        : `${a.name} has ${plural(a.length, "syllable")} and ${b.name} has ${b.length}, a difference of ${diff}.`,
  };
  const sim2 = clamp01(1 - Math.abs(a.density - b.density) / DENSITY_RANGE);
  const s2: ScoreItem = {
    code: "S2",
    label: "Sound density",
    score: simScore(sim2),
    similarity: sim2,
    detail: `Letters per syllable: ${a.name} ${fmt(a.density)}, ${b.name} ${fmt(b.density)}. ${
      sim2 >= 0.85 ? "Their build is nearly the same." : sim2 >= 0.6 ? "Their build is fairly similar." : "One is dense, the other light."
    }`,
  };
  const m = patternMatch(a, b);
  const s3: ScoreItem = {
    code: "S3",
    label: "Syllable pattern",
    score: simScore(m),
    similarity: m,
    detail: `Patterns: ${a.name} (${patternText(a)}), ${b.name} (${patternText(b)}). Lined up from the end, ${Math.round(m * 100)}% match.`,
  };
  const items = [s1, s2, s3];
  const score = STRUCTURE_WEIGHTS.S1 * s1.score + STRUCTURE_WEIGHTS.S2 * s2.score + STRUCTURE_WEIGHTS.S3 * s3.score;
  return { key: "structure", status: "available", score, items, patternMatch: m };
}

const simOf = (section: PhoneticSection | StructureSection, code: string) =>
  section.items.find((i) => i.code === code)?.similarity ?? 0;

export function classifyEn(
  total: number,
  a: NameFeatures,
  b: NameFeatures,
  phonetic: PhoneticSection,
  structure: StructureSection,
): { code: TypeCode; reason: string } {
  const sim = similarityIndex(phonetic, structure);
  const pct = Math.round(sim * 100);
  if (total >= TYPE_RULES.synergyTotalMin && phonetic.flow.value >= TYPE_RULES.synergyFlowMin) {
    return { code: "SYNERGY", reason: `With a score of ${total} and names that flow into each other without a break, this pair is a SYNERGY TYPE.` };
  }
  if (a.length === b.length && structure.patternMatch >= TYPE_RULES.rhythmPatternMin && simOf(phonetic, "P1") >= TYPE_RULES.rhythmVowelSimMin) {
    return { code: "RHYTHM", reason: `Both names have ${plural(a.length, "syllable")} with matching endings and vowel tone, so this pair is a RHYTHM TYPE.` };
  }
  if (sim >= TYPE_RULES.harmonySimMin) {
    return { code: "HARMONY", reason: `Vowel tone, endings, opening sounds and build are ${pct}% alike on average, so this pair is a HARMONY TYPE.` };
  }
  if (sim < TYPE_RULES.complementSimMax) {
    return { code: "COMPLEMENT", reason: `Sound and build are only ${pct}% alike, with many contrasting traits, so this pair is a COMPLEMENT TYPE.` };
  }
  return { code: "BALANCE", reason: `Sound and build are ${pct}% alike, an even mix of shared and different traits, so this pair is a BALANCE TYPE.` };
}

export function analyzeNamesEn(rawInput: AnalysisInput): AnalysisResult {
  const input: AnalysisInput = {
    a: normalizePersonEn(rawInput.a),
    b: normalizePersonEn(rawInput.b),
    relation: rawInput.relation,
  };
  const a = extractFeaturesEn(input.a.name);
  const b = extractFeaturesEn(input.b.name);
  const phonetic = analyzePhoneticEn(a, b);
  const structure = analyzeStructureEn(a, b);
  const sum = SECTION_WEIGHTS.phonetic + SECTION_WEIGHTS.structure;
  const weights = { phonetic: SECTION_WEIGHTS.phonetic / sum, structure: SECTION_WEIGHTS.structure / sum, meaning: null };
  const raw = weights.phonetic * phonetic.score + weights.structure * structure.score;
  const total = Math.min(100, Math.max(0, Math.round(raw + 1e-9)));
  return {
    version: RULES_VERSION_EN,
    input,
    features: { a, b },
    sections: {
      phonetic,
      structure,
      meaning: { key: "meaning", status: "none", message: "", sharedHanja: [] },
    },
    weights,
    total,
    grade: gradeOfEn(total),
    indices: { similarity: similarityIndex(phonetic, structure), flow: phonetic.flow.value },
    type: classifyEn(total, a, b, phonetic, structure),
    sameName: input.a.name.toLowerCase() === input.b.name.toLowerCase(),
  };
}
