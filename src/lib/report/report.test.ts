import { describe, expect, it } from "vitest";
import { analyzeNames } from "@/lib/analysis";
import { buildReport } from "@/lib/report/buildReport";
import { fill, fnv1a } from "@/lib/report/template";
import { SAMPLE_NAMES } from "@/lib/analysis/samples";
import { RELATIONS, type AnalysisInput, type Relation } from "@/lib/analysis/types";

const input = (a: string, b: string, relation: Relation = "lover", ma = "", mb = ""): AnalysisInput => ({
  a: { name: a, hanja: "", meaning: ma },
  b: { name: b, hanja: "", meaning: mb },
  relation,
});

const BANNED = ["운명", "천생연분", "반드시", "영원히", "헤어", "불운", "흉", "undefined", "{", "}"];

describe("리포트", () => {
  it("템플릿 치환과 조사", () => {
    expect(fill("{nameA:과/와} {nameB:은/는}", { nameA: "민준", nameB: "서아" })).toBe("민준과 서아는");
    expect(() => fill("{missing}", {})).toThrow();
    expect(fnv1a("a")).toBe(fnv1a("a"));
  });

  it("실제 이름이 문장에 반영되고 금지어가 없다 (모든 샘플 × 모든 관계)", () => {
    for (const relation of RELATIONS) {
      for (let j = 1; j < SAMPLE_NAMES.length; j += 2) {
        const r = analyzeNames(input(SAMPLE_NAMES[0], SAMPLE_NAMES[j], relation, "밝은 빛", "지혜"));
        const report = buildReport(r);
        const all = [report.headline, ...report.summary, report.traits.a, report.traits.b, report.image, report.strength, report.message, ...report.story, report.shareText].join("\n");
        expect(all).toContain(SAMPLE_NAMES[0]);
        expect(all).toContain(SAMPLE_NAMES[j]);
        for (const word of BANNED) expect(all).not.toContain(word);
      }
    }
  });

  it("같은 입력 → 같은 문장", () => {
    const i = input("하윤", "도현");
    expect(buildReport(analyzeNames(i))).toEqual(buildReport(analyzeNames(i)));
  });

  it("다른 이름 → 다른 문장", () => {
    const x = buildReport(analyzeNames(input("하윤", "도현")));
    const y = buildReport(analyzeNames(input("민준", "서연")));
    expect(x.summary.join()).not.toBe(y.summary.join());
  });

  it("반려동물 전용 스토리", () => {
    const r = buildReport(analyzeNames(input("김하윤", "콩", "pet")));
    expect(r.story.join(" ")).toContain("콩");
  });
});
