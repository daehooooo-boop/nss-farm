/** 이름별 특징값 — ANALYSIS_RULES 2.2, 2.3 */
import { basicJamo, decompose } from "@/lib/hangul/hangul";
import {
  BRIGHT_VOWELS,
  CRISP_MAX,
  DARK_VOWELS,
  OPEN_MIN,
  SOFT_MIN,
  TONE_BRIGHT_MIN,
  TONE_DARK_MAX,
  initialSoftness,
} from "@/lib/analysis/constants";
import type { NameFeatures, ToneKind } from "@/lib/analysis/types";

export function toneKindOf(tone: number): ToneKind {
  if (tone > TONE_BRIGHT_MIN) return "bright";
  if (tone < TONE_DARK_MAX) return "dark";
  return "neutral";
}

export function extractFeatures(name: string): NameFeatures {
  const syllables = decompose(name);
  const n = syllables.length;

  let tone = 0;
  let open = 0;
  let soft = 0;
  let jamoCount = 0;
  const sounds = new Set<string>();

  for (const s of syllables) {
    if (BRIGHT_VOWELS.has(s.jung)) tone += 1;
    else if (DARK_VOWELS.has(s.jung)) tone -= 1;
    if (s.jong === "") open += 1;
    soft += initialSoftness(s.cho);
    jamoCount += 1 + basicJamo(s.jung).length + basicJamo(s.jong).length;

    if (s.cho !== "ㅇ") sounds.add(s.cho);
    for (const j of basicJamo(s.jung)) sounds.add(j);
    for (const j of basicJamo(s.jong)) sounds.add(j);
  }

  const vowelTone = tone / n;
  return {
    name,
    length: n,
    syllables,
    vowelTone,
    toneKind: toneKindOf(vowelTone),
    openness: open / n,
    softness: soft / n,
    density: jamoCount / n,
    pattern: syllables.map((s) => (s.jong === "" ? "O" : "C")),
    sounds: [...sounds].sort(),
  };
}

export const TONE_PHRASE: Record<ToneKind, string> = {
  bright: "밝고 경쾌한 울림",
  dark: "깊고 차분한 울림",
  neutral: "담백하고 맑은 울림",
};

export function endingPhrase(f: NameFeatures): string {
  return f.openness >= OPEN_MIN ? "부드럽게 열리는 끝소리" : "또렷하게 맺는 끝소리";
}

export function initialPhrase(f: NameFeatures): string {
  if (f.softness >= SOFT_MIN) return "둥근 첫소리";
  if (f.softness < CRISP_MAX) return "선명한 첫소리";
  return "균형 잡힌 첫소리";
}
