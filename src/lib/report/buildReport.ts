/**
 * 분석 결과 → 개인화 리포트 문장. 외부 AI 없이 분석값 + 템플릿만 사용한다 (PRD 6장).
 * 입력은 AnalysisResult 하나뿐이며, 같은 결과에서는 항상 같은 문장이 나온다.
 */
import { RELATION_TYPES } from "@/data/relationTypes";
import { relationOption } from "@/data/relations";
import { TONE_IMAGE, TYPE_TEMPLATES, toneImageKey } from "@/data/reportTemplates";
import { TONE_PHRASE, endingPhrase, initialPhrase } from "@/lib/analysis/features";
import { josa } from "@/lib/hangul/hangul";
import { fill, fnv1a, pickVariant } from "@/lib/report/template";
import type { AnalysisResult, NameFeatures } from "@/lib/analysis/types";
import { SITE } from "@/lib/site";

export type Report = {
  headline: string;
  summary: string[];
  traits: { a: string; b: string };
  image: string;
  strength: string;
  message: string;
  story: string[];
  shareText: string;
};

const SECTION_LABEL = { phonetic: "발음의 조화", structure: "구조의 균형", meaning: "의미의 조화" } as const;

function trait(f: NameFeatures): string {
  return `${josa(f.name, "은/는")} ${TONE_PHRASE[f.toneKind]}과 ${endingPhrase(f)}, ${initialPhrase(f)}를 가진 이름이에요.`;
}

export function reportSeed(result: AnalysisResult): number {
  const names = [result.input.a.name, result.input.b.name].sort();
  return fnv1a(`${names.join("|")}|${result.input.relation}`);
}

export function buildReport(result: AnalysisResult): Report {
  const { a, b } = result.features;
  const { phonetic, structure, meaning } = result.sections;
  const type = RELATION_TYPES[result.type.code];
  const relation = relationOption(result.input.relation);
  const isPet = result.input.relation === "pet";
  const t = TYPE_TEMPLATES[result.type.code];
  const seed = reportSeed(result);

  const vars: Record<string, string> = {
    nameA: a.name,
    nameB: b.name,
    pair: result.sameName ? `같은 이름을 나눠 가진 ${relation.pair}` : relation.pair,
    score: String(result.total),
    grade: result.grade,
    typeLabel: type.label,
    typeTitle: type.title,
  };

  const headline = fill(pickVariant(t.headline, seed, 0), vars);

  // 전체 요약
  const sections = [
    { key: "phonetic" as const, score: phonetic.score },
    { key: "structure" as const, score: structure.score },
    ...(meaning.status === "available" ? [{ key: "meaning" as const, score: meaning.score }] : []),
  ];
  // 동점이면 정의 순서 우선 (결정성)
  const best = sections.reduce((x, y) => (y.score > x.score ? y : x));
  const weak = sections.reduce((x, y) => (y.score < x.score ? y : x));

  const summary = [
    `${josa(a.name, "과/와")} ${b.name}의 이름 조화 지수는 ${result.total}점, ‘${result.grade}’입니다.`,
    best.key === weak.key
      ? `${SECTION_LABEL[best.key]} 항목이 ${Math.round(best.score)}점으로 고르게 어울렸어요.`
      : `${josa(SECTION_LABEL[best.key], "이/가")} ${Math.round(best.score)}점으로 가장 돋보였고, ${josa(SECTION_LABEL[weak.key], "은/는")} ${Math.round(weak.score)}점으로 두 이름의 개성이 드러나는 부분이에요.`,
    `두 이름은 ${type.label}, ‘${type.title}’로 분류됩니다.`,
  ];
  if (result.sameName) summary.push("같은 이름을 나눠 가진 만큼, 소리와 구조는 완전히 같은 결을 가졌어요.");
  if (meaning.status !== "available") summary.push("이름의 뜻을 더하면 이야기가 더 풍부해져요.");

  // 두 이름이 만드는 이미지
  const [ab] = phonetic.flow.junctions;
  const image = `${TONE_IMAGE[toneImageKey(a.toneKind, b.toneKind)]} 이어 부르면 ‘${ab.fromSyllable}’에서 ‘${ab.toSyllable}’로 넘어가는 자리에서 ${ab.detail.replace(/요$/, "요.")}`;

  // 스토리: 공유 소리·의미가 있으면 한 문장 덧붙인다
  const story = pickVariant(isPet ? t.petStory : t.story, seed, 3).map((p) => fill(p, vars));
  if (meaning.status === "available" && meaning.shared.length > 0) {
    story.push(`그리고 두 이름은 모두 ‘${meaning.shared[0]}’의 뜻을 품고 있어요. 같은 바람을 담아 지어진 이름이라는 건 작지만 분명한 공통점이에요.`);
  } else if (meaning.status === "available" && meaning.complements.length > 0) {
    const c = meaning.complements[0];
    story.push(`이름의 뜻에서도 ‘${c.a}’와 ‘${c.b}’가 ${c.note} 짝을 이뤄요.`);
  } else if (phonetic.sharedSounds.length > 0) {
    story.push(`두 이름이 함께 가진 ‘${phonetic.sharedSounds.join(" · ")}’ 소리는 서로를 부를 때마다 조용히 겹쳐 울립니다.`);
  }

  const shareText = [
    `[${SITE.name}] ${a.name} × ${b.name}`,
    `이름 조화 지수 ${result.total}점 · ${result.grade}`,
    `${type.label} — ${type.title}`,
    `“${headline}”`,
    "",
    "두 이름이 만드는 이야기, NAME SYNERGY에서 확인해 보세요.",
    "※ 재미로 보는 엔터테인먼트 콘텐츠예요.",
  ].join("\n");

  return {
    headline,
    summary,
    traits: { a: trait(a), b: trait(b) },
    image,
    strength: fill(pickVariant(t.strength, seed, 1), vars),
    message: fill(pickVariant(t.message, seed, 2), vars),
    story,
    shareText,
  };
}
