/** English report builder — mirrors buildReport.ts, uses English templates only. */
import { RELATION_TYPES_EN, relationOptionEn } from "@/data/en/relations";
import { TONE_IMAGE_EN, TYPE_TEMPLATES_EN } from "@/data/en/reportTemplates";
import { toneImageKey } from "@/data/reportTemplates";
import { TONE_PHRASE_EN, endingPhraseEn, initialPhraseEn } from "@/lib/analysis-en/features";
import { fill, pickVariant } from "@/lib/report/template";
import { reportSeed, type Report } from "@/lib/report/buildReport";
import type { AnalysisResult, NameFeatures } from "@/lib/analysis/types";
import { SITE } from "@/lib/site";

const SECTION_LABEL_EN = { phonetic: "Sound harmony", structure: "Structural balance" } as const;

function trait(f: NameFeatures): string {
  return `${f.name} has ${TONE_PHRASE_EN[f.toneKind]}, ${endingPhraseEn(f)} and ${initialPhraseEn(f)}.`;
}

export function buildReportEn(result: AnalysisResult): Report {
  const { a, b } = result.features;
  const { phonetic, structure } = result.sections;
  const type = RELATION_TYPES_EN[result.type.code];
  const relation = relationOptionEn(result.input.relation);
  const t = TYPE_TEMPLATES_EN[result.type.code];
  const seed = reportSeed(result);
  const pairBase = result.sameName ? `${relation.pair}, sharing the same name` : relation.pair;
  const vars: Record<string, string> = {
    nameA: a.name,
    nameB: b.name,
    pair: pairBase,
    Pair: pairBase.charAt(0).toUpperCase() + pairBase.slice(1),
    score: String(result.total),
    grade: result.grade,
    typeLabel: type.label,
    typeTitle: type.title,
  };
  // 문장 첫머리의 {pair}는 대문자로 시작
  const fillEn = (s: string) => fill(s.replace(/(^|[.!?]\s+)\{pair\}/g, "$1{Pair}"), vars);

  const headline = fillEn(pickVariant(t.headline, seed, 0));
  const sections = [
    { key: "phonetic" as const, score: phonetic.score },
    { key: "structure" as const, score: structure.score },
  ];
  const best = sections.reduce((x, y) => (y.score > x.score ? y : x));
  const weak = sections.reduce((x, y) => (y.score < x.score ? y : x));
  const summary = [
    `${a.name} and ${b.name} score ${result.total} on the Name Harmony Index: “${result.grade}.”`,
    best.key === weak.key
      ? `${SECTION_LABEL_EN[best.key]} scored ${Math.round(best.score)}, evenly matched across the board.`
      : `${SECTION_LABEL_EN[best.key]} stood out at ${Math.round(best.score)}, while ${SECTION_LABEL_EN[weak.key].toLowerCase()} at ${Math.round(weak.score)} is where each name shows its own character.`,
    `The pair is a ${type.label}: “${type.title}.”`,
  ];
  if (result.sameName) summary.push("Sharing the same name, the two match perfectly in sound and structure.");

  const [ab] = phonetic.flow.junctions;
  const image = `${TONE_IMAGE_EN[toneImageKey(a.toneKind, b.toneKind)]} Said together, at the step from “${ab.fromSyllable}” to “${ab.toSyllable},” ${ab.detail}.`;

  const story = pickVariant(result.input.relation === "pet" ? t.petStory : t.story, seed, 3).map(fillEn);
  if (phonetic.sharedSounds.length > 0) {
    story.push(`The sounds they share, “${phonetic.sharedSounds.join(" · ")},” quietly echo every time one calls the other.`);
  }

  const shareText = [
    `[Name Synergy] ${a.name} × ${b.name}`,
    `Name Harmony Index ${result.total} · ${result.grade}`,
    `${type.label}: ${type.title}`,
    `“${headline}”`,
    "",
    "Curious about your names? Try it here:",
    `${SITE.url}/en/analyze`,
    "* Just for fun. An entertainment index, not science.",
  ].join("\n");

  return {
    headline,
    summary,
    traits: { a: trait(a), b: trait(b) },
    image,
    strength: fillEn(pickVariant(t.strength, seed, 1)),
    message: fillEn(pickVariant(t.message, seed, 2)),
    story,
    shareText,
  };
}
