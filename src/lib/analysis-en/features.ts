/**
 * English name features — docs/ANALYSIS_RULES_EN.md 2장.
 * 영어 이름을 규칙 기반으로 음절로 나누고, 한국어 엔진과 같은 특징 공간
 * (모음 톤·열림·첫소리 부드러움·밀도·패턴·소리 집합)으로 옮긴다.
 * 결정적 순수 함수. 발음 사전은 쓰지 않고 철자 규칙만 쓴다.
 */
import { CRISP_MAX, OPEN_MIN, SOFT_MIN, TONE_BRIGHT_MIN, TONE_DARK_MAX } from "@/lib/analysis/constants";
import type { NameFeatures, ToneKind } from "@/lib/analysis/types";

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
/** 한 글자처럼 읽는 자음 묶음 */
const DIGRAPHS = ["sch", "ch", "sh", "th", "ph", "wh", "ck", "ng", "qu", "gh"];
/** 음절 첫머리에 올 수 있는 두 자음 */
const ONSET_CLUSTERS = new Set([
  "bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "sl", "sp", "st", "sw", "tr", "tw", "thr", "chr", "shr",
]);
/** 이어 쓰지만 두 음절로 읽는 모음 쌍 (Mia, Leo, Noah, Daniel) */
const HIATUS = new Set(["ia", "io", "eo", "ua", "oa", "oe", "iu", "ie", "ue", "ya", "yo"]);

export const EN_SONORANTS = new Set(["l", "m", "n", "r", "w", "y", "ng"]);
const VOICED = new Set(["b", "d", "g", "j", "v", "z"]);
export const EN_HARD_ONSETS = new Set(["p", "t", "k", "c", "ck", "q", "qu", "ch", "x"]);

export type EnSyllable = { text: string; onset: string; nucleus: string; coda: string };

/** 악센트를 걷어 내고 영문 소문자만 남긴다 */
export function lettersOf(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function isVowelAt(w: string, i: number): boolean {
  const c = w[i];
  if (VOWELS.has(c)) return true;
  // w: 모음 뒤에서 끝나거나 자음 앞이면 모음의 일부 (Andrew, Shaw)
  if (c === "w") return i > 0 && VOWELS.has(w[i - 1]) && (i + 1 === w.length || !VOWELS.has(w[i + 1]));
  if (c !== "y") return false;
  // y: 첫 글자이면서 뒤에 모음이 오면 자음(Yasmin, Yvonne의 y는 모음)
  if (i === 0) return i + 1 < w.length && !VOWELS.has(w[i + 1]);
  // 가운데 y: 모음 사이에 끼면 자음(Maya), 그 외에는 모음(Ryan, Tyler)
  return !(i + 1 < w.length && VOWELS.has(w[i + 1]) && VOWELS.has(w[i - 1]));
}

/** 자음 덩어리를 단위(다이그래프 포함)로 자른다 */
function consonantUnits(cluster: string): string[] {
  const units: string[] = [];
  let i = 0;
  while (i < cluster.length) {
    const dg = DIGRAPHS.find((d) => cluster.startsWith(d, i));
    if (dg) {
      units.push(dg);
      i += dg.length;
    } else {
      units.push(cluster[i]);
      i += 1;
    }
  }
  return units;
}

/** 모음 덩어리를 음절 핵으로 자른다 (hiatus는 나눈다, 단 끝의 ie/ue는 한 음절) */
function splitNuclei(group: string, atEnd: boolean): string[] {
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < group.length; i++) {
    const pair = group[i - 1] + group[i];
    const lastPair = atEnd && i === group.length - 1;
    if (cur && HIATUS.has(pair) && !(lastPair && (pair === "ie" || pair === "ue"))) {
      out.push(cur);
      cur = group[i];
    } else {
      cur += group[i];
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function syllabify(name: string): EnSyllable[] {
  const w = lettersOf(name);
  if (w.length === 0) return [];

  // 끝의 묵음 e: 자음 뒤이고 앞에 다른 모음이 있을 때 (Kate, Steve, Claire)
  let silentE = false;
  const n = w.length;
  if (n >= 3 && w[n - 1] === "e" && !isVowelAt(w, n - 2)) {
    for (let i = 0; i < n - 1; i++) if (isVowelAt(w, i)) silentE = true;
  }
  // 끝의 -es: 앞에 다른 모음이 있고 s·z·x·ch·sh 뒤가 아니면 묵음 (James, Charles)
  let silentEs = false;
  if (!silentE && n >= 4 && w.endsWith("es") && !isVowelAt(w, n - 3) && !/(s|z|x|ch|sh)$/.test(w.slice(0, -2))) {
    for (let i = 0; i < n - 3; i++) if (isVowelAt(w, i)) silentEs = true;
  }
  const body = silentE ? w.slice(0, -1) : silentEs ? w.slice(0, -2) + "s" : w;

  // 모음/자음 덩어리로 나눈다
  type Run = { vowel: boolean; text: string };
  const runs: Run[] = [];
  for (let i = 0; i < body.length; i++) {
    const v = isVowelAt(body, i);
    const last = runs[runs.length - 1];
    if (last && last.vowel === v) last.text += body[i];
    else runs.push({ vowel: v, text: body[i] });
  }
  // 모음이 하나도 없으면 전체를 한 음절로 (예: "Lynn"은 y가 모음이므로 해당 없음)
  if (!runs.some((r) => r.vowel)) return [{ text: w, onset: body, nucleus: "", coda: silentE ? "e" : "" }];

  const nuclei: string[] = [];
  const between: string[] = []; // nuclei[i]와 nuclei[i+1] 사이의 자음 덩어리
  let lead = "";
  let tail = "";
  runs.forEach((r, idx) => {
    if (r.vowel) {
      const parts = splitNuclei(r.text, idx === runs.length - 1);
      parts.forEach((p, k) => {
        if (nuclei.length > 0 && k > 0) between.push("");
        nuclei.push(p);
      });
    } else if (nuclei.length === 0) {
      lead = r.text;
    } else if (idx === runs.length - 1) {
      tail = r.text;
    } else {
      between.push(r.text);
    }
  });

  const syl: EnSyllable[] = nuclei.map((nuc) => ({ text: "", onset: "", nucleus: nuc, coda: "" }));
  syl[0].onset = lead;
  between.forEach((cluster, i) => {
    const units = consonantUnits(cluster);
    let onsetCount = units.length === 0 ? 0 : 1;
    if (units.length >= 2 && ONSET_CLUSTERS.has(units.slice(-2).join(""))) onsetCount = 2;
    // ng, ck는 앞 음절에 붙는다
    if (units.length === 1 && (units[0] === "ng" || units[0] === "ck" || units[0] === "x")) onsetCount = 0;
    syl[i].coda = units.slice(0, units.length - onsetCount).join("");
    syl[i + 1].onset = units.slice(units.length - onsetCount).join("");
  });
  syl[syl.length - 1].coda = tail;
  for (const s of syl) s.text = s.onset + s.nucleus + s.coda;
  if (silentE) syl[syl.length - 1].text += "e";
  if (silentEs) syl[syl.length - 1].text = syl[syl.length - 1].text.slice(0, -1) + "es";
  return syl;
}

function nucleusTone(nuc: string): number {
  if (["ee", "ea", "ie", "ey", "ei"].includes(nuc)) return 1;
  if (["ou", "oo", "au", "aw", "ow"].includes(nuc)) return -1;
  const c = nuc[0];
  if (c === "a" || c === "i" || c === "y") return 1;
  if (c === "o" || c === "u") return -1;
  return 0;
}

export function onsetSoftness(onset: string): number {
  if (onset === "") return 1.0;
  const first = consonantUnits(onset)[0];
  if (EN_SONORANTS.has(first)) return 1.0;
  if (VOICED.has(first)) return 0.6;
  if (first === "h") return 0.5;
  return 0.25;
}

function toneKindOf(tone: number): ToneKind {
  if (tone > TONE_BRIGHT_MIN) return "bright";
  if (tone < TONE_DARK_MAX) return "dark";
  return "neutral";
}

/** 표시용 이름: 앞뒤 공백 제거, 연속 공백 하나로 */
export function displayName(raw: string): string {
  return raw.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function extractFeaturesEn(rawName: string): NameFeatures {
  const name = displayName(rawName);
  const syl = syllabify(name);
  const n = Math.max(1, syl.length);
  let tone = 0;
  let open = 0;
  let soft = 0;
  let letters = 0;
  const sounds = new Set<string>();
  for (const s of syl) {
    tone += nucleusTone(s.nucleus);
    if (s.coda === "") open += 1;
    soft += onsetSoftness(s.onset);
    letters += s.onset.length + s.nucleus.length + s.coda.length;
    for (const u of [...consonantUnits(s.onset), ...consonantUnits(s.coda)]) sounds.add(u);
    if (s.nucleus) sounds.add(s.nucleus);
  }
  const vowelTone = tone / n;
  // 화면 표시용 음절: 입력한 대소문자를 살린다 (Emma → Em·ma)
  const cased = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z]/g, "");
  let pos = 0;
  const shown = syl.map((s) => {
    const part = cased.slice(pos, pos + s.text.length);
    pos += s.text.length;
    return part || s.text;
  });
  return {
    name,
    length: syl.length,
    syllables: syl.map((s, i) => ({ char: shown[i], cho: s.onset, jung: s.nucleus, jong: s.coda })),
    vowelTone,
    toneKind: toneKindOf(vowelTone),
    openness: open / n,
    softness: soft / n,
    density: letters / n,
    pattern: syl.map((s) => (s.coda === "" ? "O" : "C")),
    sounds: [...sounds].sort(),
  };
}

export const TONE_PHRASE_EN: Record<ToneKind, string> = {
  bright: "a bright, lively ring",
  dark: "a deep, calm ring",
  neutral: "a clean, even ring",
};

export function endingPhraseEn(f: NameFeatures): string {
  return f.openness >= OPEN_MIN ? "soft, open endings" : "crisp, closed endings";
}

export function initialPhraseEn(f: NameFeatures): string {
  if (f.softness >= SOFT_MIN) return "rounded opening sounds";
  if (f.softness < CRISP_MAX) return "sharp opening sounds";
  return "balanced opening sounds";
}
