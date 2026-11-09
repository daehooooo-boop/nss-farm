import { describe, expect, it } from "vitest";
import { analyzeNames } from "@/lib/analysis";
import { extractFeatures } from "@/lib/analysis/features";
import { detectCategories } from "@/lib/analysis/meaning";
import { patternMatch } from "@/lib/analysis/structure";
import { SAMPLE_NAMES } from "@/lib/analysis/samples";
import { ALLOWED_SINGLE, MEANING_KEYWORDS } from "@/data/meaningKeywords";
import { decomposeSyllable, josa } from "@/lib/hangul/hangul";
import type { AnalysisInput, Relation } from "@/lib/analysis/types";

const input = (
  a: string,
  b: string,
  opts: { relation?: Relation; ha?: string; hb?: string; ma?: string; mb?: string } = {},
): AnalysisInput => ({
  a: { name: a, hanja: opts.ha ?? "", meaning: opts.ma ?? "" },
  b: { name: b, hanja: opts.hb ?? "", meaning: opts.mb ?? "" },
  relation: opts.relation ?? "lover",
});

describe("한글 유틸", () => {
  it("음절 분해", () => {
    expect(decomposeSyllable("민")).toMatchObject({ cho: "ㅁ", jung: "ㅣ", jong: "ㄴ" });
    expect(decomposeSyllable("서")).toMatchObject({ cho: "ㅅ", jung: "ㅓ", jong: "" });
    expect(decomposeSyllable("왈")).toMatchObject({ cho: "ㅇ", jung: "ㅘ", jong: "ㄹ" });
  });
  it("조사 선택", () => {
    expect(josa("민준", "은/는")).toBe("민준은");
    expect(josa("서연", "이/가")).toBe("서연이");
    expect(josa("하윤", "과/와")).toBe("하윤과");
    expect(josa("도아", "과/와")).toBe("도아와");
    expect(josa("하늘", "으로/로")).toBe("하늘로");
  });
});

describe("특징값", () => {
  it("민준: 중성+음성, 모두 닫힘", () => {
    const f = extractFeatures("민준");
    expect(f.vowelTone).toBe(-0.5);
    expect(f.openness).toBe(0);
    expect(f.pattern).toEqual(["C", "C"]);
    expect(f.density).toBe(3);
    expect(f.sounds).toEqual(["ㄴ", "ㅁ", "ㅈ", "ㅜ", "ㅣ"]);
  });
  it("받침 패턴은 끝에서부터 비교", () => {
    expect(patternMatch(extractFeatures("김하윤"), extractFeatures("도현"))).toBe(1);
    expect(patternMatch(extractFeatures("민준"), extractFeatures("도현"))).toBe(0.5);
  });
});

describe("분석 엔진", () => {
  it("1. 정상 입력: 0~100 정수, 유형 1개, 모든 근거 존재", () => {
    const r = analyzeNames(input("김민준", "이서연"));
    expect(Number.isInteger(r.total)).toBe(true);
    expect(r.total).toBeGreaterThanOrEqual(0);
    expect(r.total).toBeLessThanOrEqual(100);
    expect(r.type.code).toBeTruthy();
    expect(r.type.reason.length).toBeGreaterThan(0);
    for (const item of [...r.sections.phonetic.items, ...r.sections.structure.items]) {
      expect(item.detail.length).toBeGreaterThan(5);
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
    }
  });

  it("4. 한자만 입력: 의미 제외, 한자 뜻 문장 없음", () => {
    const r = analyzeNames(input("하윤", "도현", { ha: "夏允", hb: "道賢" }));
    expect(r.sections.meaning.status).toBe("none");
    expect(r.weights.meaning).toBeNull();
    if (r.sections.meaning.status !== "available") {
      expect(r.sections.meaning.hint).toContain("한자의 뜻을 함께");
    }
  });

  it("5. 의미 입력: 범주 인식, 가중치 40/30/30", () => {
    const r = analyzeNames(input("하윤", "도현", { ma: "여름처럼 밝은 빛", mb: "빛나는 길, 어진 마음" }));
    const m = r.sections.meaning;
    expect(m.status).toBe("available");
    if (m.status === "available") {
      expect(m.shared).toContain("빛·밝음");
      expect(m.score).toBe(75);
    }
    expect(r.weights).toEqual({ phonetic: 0.4, structure: 0.3, meaning: 0.3 });
  });

  it("의미 한쪽만 / 키워드 미인식", () => {
    expect(analyzeNames(input("하윤", "도현", { ma: "밝은 빛" })).sections.meaning.status).toBe("partial");
    expect(analyzeNames(input("하윤", "도현", { ma: "가나다", mb: "라마바" })).sections.meaning.status).toBe(
      "unrecognized",
    );
  });

  it("의미 키워드: 긴 키워드가 짧은 키워드를 가린다 (강하 ≠ 강)", () => {
    expect(detectCategories("강하고 씩씩한")).toEqual(["strength"]);
    expect(detectCategories("맑은 강물")).toEqual(["water"]);
  });

  it("1자 키워드는 허용 목록에 있는 것만", () => {
    for (const words of Object.values(MEANING_KEYWORDS)) {
      for (const w of words) if (w.length === 1) expect(ALLOWED_SINGLE.has(w)).toBe(true);
    }
  });

  it("같은 한자 보너스는 사실만 사용", () => {
    const r = analyzeNames(input("하윤", "윤아", { ha: "夏允", hb: "允雅", ma: "밝음", mb: "밝은 웃음" }));
    expect(r.sections.meaning.sharedHanja).toEqual(["允"]);
    if (r.sections.meaning.status === "available") expect(r.sections.meaning.score).toBe(80);
  });

  it("6. 결정성: 같은 입력 100회 → 완전히 같은 결과", () => {
    const i = input("김하윤", "이도현", { ma: "밝은 빛", mb: "지혜" });
    const first = JSON.stringify(analyzeNames(i));
    for (let k = 0; k < 100; k++) expect(JSON.stringify(analyzeNames(i))).toBe(first);
  });

  it("7. 대칭성: A×B와 B×A의 지수·유형 동일", () => {
    for (let i = 0; i < SAMPLE_NAMES.length; i++) {
      for (let j = i + 1; j < SAMPLE_NAMES.length; j += 3) {
        const ab = analyzeNames(input(SAMPLE_NAMES[i], SAMPLE_NAMES[j]));
        const ba = analyzeNames(input(SAMPLE_NAMES[j], SAMPLE_NAMES[i]));
        expect(ba.total).toBe(ab.total);
        expect(ba.type.code).toBe(ab.type.code);
      }
    }
  });

  it("8. 차별성: 서로 다른 쌍은 다양한 지수를 받는다", () => {
    const totals = new Set<number>();
    for (let j = 1; j < SAMPLE_NAMES.length; j++) totals.add(analyzeNames(input(SAMPLE_NAMES[0], SAMPLE_NAMES[j])).total);
    expect(totals.size).toBeGreaterThan(8);
  });

  it("관계는 점수에 영향을 주지 않는다", () => {
    const lover = analyzeNames(input("민준", "서연", { relation: "lover" }));
    const friend = analyzeNames(input("민준", "서연", { relation: "colleague" }));
    expect(friend.total).toBe(lover.total);
    expect(friend.type).toEqual(lover.type);
  });

  it("동일 이름: 항상 같은 기준(유사도 1)으로 계산", () => {
    const r = analyzeNames(input("서연", "서연"));
    expect(r.sameName).toBe(true);
    expect(r.indices.similarity).toBe(1);
    expect(analyzeNames(input("서연", "서연")).total).toBe(r.total);
  });

  it("반려동물 1글자 이름", () => {
    const r = analyzeNames(input("김하윤", "콩", { relation: "pet" }));
    expect(r.features.b.length).toBe(1);
    expect(r.total).toBeGreaterThan(0);
  });

  it("10. 가중치 재조정: 합 = 1", () => {
    const r = analyzeNames(input("민준", "서연"));
    expect(r.weights.phonetic + r.weights.structure).toBeCloseTo(1, 10);
    expect(r.weights.phonetic).toBeCloseTo(4 / 7, 10);
  });

  it("9. 유형 분류: 각 유형에 해당하는 고정 예시", () => {
    const codes = new Set<string>();
    for (let i = 0; i < SAMPLE_NAMES.length; i++) {
      for (let j = i + 1; j < SAMPLE_NAMES.length; j++) {
        codes.add(analyzeNames(input(SAMPLE_NAMES[i], SAMPLE_NAMES[j])).type.code);
      }
    }
    expect([...codes].sort()).toEqual(["BALANCE", "COMPLEMENT", "HARMONY", "RHYTHM", "SYNERGY"]);
  });
});
