/** 의미의 조화 — ANALYSIS_RULES 5장. 사용자가 입력한 뜻만 사용하고, 한자 뜻을 지어내지 않는다. */
import {
  COMPLEMENT_PAIRS,
  MEANING_KEYWORDS,
  MEANING_LABELS,
  type MeaningCategory,
} from "@/data/meaningKeywords";
import {
  HANJA_SHARED_BONUS,
  MEANING_BASE,
  MEANING_COMPLEMENT_POINTS,
  MEANING_COUNT_CAP,
  MEANING_SHARED_POINTS,
} from "@/lib/analysis/constants";
import type { MeaningSection, PersonInput, ScoreItem } from "@/lib/analysis/types";

const ALL_KEYWORDS: { keyword: string; category: MeaningCategory }[] = (
  Object.entries(MEANING_KEYWORDS) as [MeaningCategory, readonly string[]][]
)
  .flatMap(([category, words]) => words.map((keyword) => ({ keyword, category })))
  // 긴 키워드부터, 같은 길이는 사전 순 (결정성)
  .sort((x, y) => y.keyword.length - x.keyword.length || x.keyword.localeCompare(y.keyword));

const CATEGORY_ORDER = Object.keys(MEANING_LABELS) as MeaningCategory[];

/** 텍스트에서 인식한 범주 (사전 정의 순서로 정렬) */
export function detectCategories(text: string): MeaningCategory[] {
  let rest = text;
  const found = new Set<MeaningCategory>();
  for (const { keyword, category } of ALL_KEYWORDS) {
    if (rest.includes(keyword)) {
      found.add(category);
      rest = rest.split(keyword).join(" ");
    }
  }
  return CATEGORY_ORDER.filter((c) => found.has(c));
}

export function sharedHanja(a: PersonInput, b: PersonInput): string[] {
  if (!a.hanja || !b.hanja) return [];
  const setB = new Set([...b.hanja]);
  return [...new Set([...a.hanja])].filter((h) => setB.has(h));
}

const HANJA_ONLY_HINT = "한자의 뜻을 함께 적어 주시면 의미까지 분석할 수 있어요.";

export function analyzeMeaning(a: PersonInput, b: PersonInput): MeaningSection {
  const hanjaShared = sharedHanja(a, b);
  const hasMeaningA = a.meaning.length > 0;
  const hasMeaningB = b.meaning.length > 0;
  const hanjaOnly = (!hasMeaningA && a.hanja.length > 0) || (!hasMeaningB && b.hanja.length > 0);
  const hint = hanjaOnly ? HANJA_ONLY_HINT : undefined;

  if (!hasMeaningA && !hasMeaningB) {
    return {
      key: "meaning",
      status: "none",
      message: "이름의 뜻이 입력되지 않아 의미는 분석하지 않았어요.",
      hint: hint ?? "두 사람의 이름 뜻을 입력하면 의미의 조화까지 볼 수 있어요.",
      sharedHanja: hanjaShared,
    };
  }
  if (!hasMeaningA || !hasMeaningB) {
    return {
      key: "meaning",
      status: "partial",
      message: "한 사람의 뜻만 있어 두 이름의 의미를 비교할 수 없어요.",
      hint: hint ?? "다른 한 사람의 이름 뜻도 입력하면 비교할 수 있어요.",
      sharedHanja: hanjaShared,
    };
  }

  const catA = detectCategories(a.meaning);
  const catB = detectCategories(b.meaning);
  if (catA.length === 0 || catB.length === 0) {
    return {
      key: "meaning",
      status: "unrecognized",
      message: "입력한 뜻에서 비교할 수 있는 키워드를 찾지 못했어요.",
      hint: "‘밝은 빛’, ‘지혜로움’, ‘평안’처럼 뜻을 나타내는 낱말로 적으면 분석할 수 있어요.",
      sharedHanja: hanjaShared,
    };
  }

  const setB = new Set(catB);
  const shared = catA.filter((c) => setB.has(c));
  const sharedSet = new Set(shared);
  const complements = COMPLEMENT_PAIRS.flatMap(({ pair: [x, y], note }) => {
    const hits: { a: string; b: string; note: string }[] = [];
    // 공유 범주끼리는 보완 쌍으로 세지 않는다
    if (catA.includes(x) && setB.has(y) && !(sharedSet.has(x) && sharedSet.has(y))) {
      hits.push({ a: MEANING_LABELS[x], b: MEANING_LABELS[y], note });
    } else if (catA.includes(y) && setB.has(x) && !(sharedSet.has(x) && sharedSet.has(y))) {
      hits.push({ a: MEANING_LABELS[y], b: MEANING_LABELS[x], note });
    }
    return hits;
  });

  const bonus = hanjaShared.length > 0 ? HANJA_SHARED_BONUS : 0;
  const score = Math.min(
    100,
    MEANING_BASE +
      MEANING_SHARED_POINTS * Math.min(shared.length, MEANING_COUNT_CAP) +
      MEANING_COMPLEMENT_POINTS * Math.min(complements.length, MEANING_COUNT_CAP) +
      bonus,
  );

  const items: ScoreItem[] = [
    {
      code: "M1",
      label: "공유하는 뜻",
      score: Math.min(100, MEANING_BASE + MEANING_SHARED_POINTS * Math.min(shared.length, MEANING_COUNT_CAP)),
      detail:
        shared.length > 0
          ? `두 이름 모두 ‘${shared.map((c) => MEANING_LABELS[c]).join("’, ‘")}’의 뜻을 품고 있어요.`
          : "같은 범주의 뜻은 없어, 서로 다른 방향의 의미를 가졌어요.",
    },
    {
      code: "M2",
      label: "보완하는 뜻",
      score: Math.min(100, MEANING_BASE + MEANING_COMPLEMENT_POINTS * Math.min(complements.length, MEANING_COUNT_CAP)),
      detail:
        complements.length > 0
          ? complements.map((c) => `‘${c.a}’와 ‘${c.b}’는 ${c.note} 짝이에요.`).join(" ")
          : "정해 둔 보완 짝에 해당하는 뜻은 없어요.",
    },
  ];
  if (hanjaShared.length > 0) {
    items.push({
      code: "M3",
      label: "같은 한자",
      score: 100,
      detail: `두 이름이 ‘${hanjaShared.join("’, ‘")}’ 자를 함께 쓰고 있어요.`,
    });
  }

  return {
    key: "meaning",
    status: "available",
    score,
    items,
    categories: { a: catA.map((c) => MEANING_LABELS[c]), b: catB.map((c) => MEANING_LABELS[c]) },
    shared: shared.map((c) => MEANING_LABELS[c]),
    complements,
    sharedHanja: hanjaShared,
  };
}
