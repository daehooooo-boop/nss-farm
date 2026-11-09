/** 발음의 조화 — ANALYSIS_RULES 3장 */
import { josa } from "@/lib/hangul/hangul";
import {
  ASPIRATED,
  FLOW_VALUES,
  PHONETIC_WEIGHTS,
  SHARED_SOUND_SATURATION,
  SIMILARITY_FLOOR,
  SOFTNESS_RANGE,
  SONORANTS,
  TENSE,
} from "@/lib/analysis/constants";
import { TONE_PHRASE, endingPhrase, initialPhrase } from "@/lib/analysis/features";
import type { FlowJunction, FlowKind, NameFeatures, PhoneticSection, ScoreItem } from "@/lib/analysis/types";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const simScore = (sim: number) => SIMILARITY_FLOOR + (100 - SIMILARITY_FLOOR) * sim;

function closeness(sim: number, high: string, mid: string, low: string) {
  if (sim >= 0.85) return high;
  if (sim >= 0.6) return mid;
  return low;
}

const FLOW_DETAIL: Record<FlowKind, string> = {
  open: "끝소리가 열려 있어 자연스럽게 이어져요",
  liaison: "받침이 다음 소리로 부드럽게 넘어가요",
  sonorant: "울림소리끼리 만나 매끄럽게 이어져요",
  plain: "짧은 쉼표가 생기며 이어져요",
  hard: "또렷한 끊김이 있는 리듬이에요",
};

export function junction(from: NameFeatures, to: NameFeatures): FlowJunction {
  const last = from.syllables[from.length - 1];
  const first = to.syllables[0];
  let kind: FlowKind;
  if (last.jong === "") kind = "open";
  else if (first.cho === "ㅇ") kind = "liaison";
  else if (SONORANTS.has(last.jong) && SONORANTS.has(first.cho)) kind = "sonorant";
  else if (ASPIRATED.has(first.cho) || TENSE.has(first.cho)) kind = "hard";
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
    detail: FLOW_DETAIL[kind],
  };
}

export function analyzePhonetic(a: NameFeatures, b: NameFeatures): PhoneticSection {
  // P1 모음 톤
  const sim1 = clamp01(1 - Math.abs(a.vowelTone - b.vowelTone) / 2);
  const p1: ScoreItem = {
    code: "P1",
    label: "모음 톤",
    score: simScore(sim1),
    similarity: sim1,
    detail:
      a.toneKind === b.toneKind
        ? `두 이름 모두 ${TONE_PHRASE[a.toneKind]}을 가졌어요. ${closeness(sim1, "모음의 결이 거의 같아요.", "모음의 결이 비슷한 편이에요.", "")}`.trim()
        : `${josa(a.name, "은/는")} ${TONE_PHRASE[a.toneKind]}, ${josa(b.name, "은/는")} ${TONE_PHRASE[b.toneKind]}이에요. ${closeness(sim1, "톤은 달라도 차이는 크지 않아요.", "서로 다른 톤이 은은한 대비를 만들어요.", "밝음과 깊음이 뚜렷한 대비를 이뤄요.")}`,
  };

  // P2 받침 리듬
  const sim2 = clamp01(1 - Math.abs(a.openness - b.openness));
  const openCount = (f: NameFeatures) => f.pattern.filter((p) => p === "O").length;
  const p2: ScoreItem = {
    code: "P2",
    label: "받침 리듬",
    score: simScore(sim2),
    similarity: sim2,
    detail: `${josa(a.name, "은/는")} ${a.length}음절 중 ${openCount(a)}음절, ${josa(b.name, "은/는")} ${b.length}음절 중 ${openCount(b)}음절이 받침 없이 열려 있어요. ${closeness(sim2, "끝소리의 박자가 꼭 닮았어요.", "끝소리의 박자가 비슷해요.", "한쪽은 열리고 한쪽은 맺는 리듬이에요.")}`,
  };

  // P3 첫소리 질감
  const sim3 = clamp01(1 - Math.abs(a.softness - b.softness) / SOFTNESS_RANGE);
  const p3: ScoreItem = {
    code: "P3",
    label: "첫소리 질감",
    score: simScore(sim3),
    similarity: sim3,
    detail: `${josa(a.name, "은/는")} ${initialPhrase(a)}, ${josa(b.name, "은/는")} ${initialPhrase(b)}를 가졌어요. ${closeness(sim3, "자음의 질감이 잘 맞아요.", "자음의 질감이 무난하게 어울려요.", "부드러움과 선명함이 서로를 돋보이게 해요.")}`,
  };

  // P4 이어 부르기
  const ab = junction(a, b);
  const ba = junction(b, a);
  const flow = (ab.value + ba.value) / 2;
  const p4: ScoreItem = {
    code: "P4",
    label: "이어 부르기",
    score: 100 * flow,
    similarity: flow,
    detail: `${a.name} → ${b.name}: ${ab.detail}. ${b.name} → ${a.name}: ${ba.detail}.`,
  };

  // P5 공유 소리
  const setA = new Set(a.sounds);
  const setB = new Set(b.sounds);
  const shared = [...setA].filter((s) => setB.has(s)).sort();
  const union = new Set([...setA, ...setB]);
  const jaccard = union.size === 0 ? 0 : shared.length / union.size;
  const sim5 = clamp01(jaccard / SHARED_SOUND_SATURATION);
  const p5: ScoreItem = {
    code: "P5",
    label: "공유 소리",
    score: simScore(sim5),
    similarity: sim5,
    detail:
      shared.length > 0
        ? `두 이름이 함께 가진 소리는 ${shared.join(" · ")} ${shared.length}개예요. ${closeness(sim5, "많은 소리를 나눠 가졌어요.", "적당히 겹치는 소리가 공감대를 만들어요.", "겹치는 소리가 적어 서로 새로운 소리를 들려줘요.")}`
        : "겹치는 소리가 없어 서로에게 완전히 새로운 소리를 들려줘요.",
  };

  const items = [p1, p2, p3, p4, p5];
  const score =
    PHONETIC_WEIGHTS.P1 * p1.score +
    PHONETIC_WEIGHTS.P2 * p2.score +
    PHONETIC_WEIGHTS.P3 * p3.score +
    PHONETIC_WEIGHTS.P4 * p4.score +
    PHONETIC_WEIGHTS.P5 * p5.score;

  return {
    key: "phonetic",
    status: "available",
    score,
    items,
    flow: { value: flow, junctions: [ab, ba] },
    sharedSounds: shared,
  };
}
