import { describe, expect, it } from "vitest";
import { analyzeNamesEn } from "@/lib/analysis-en";
import { syllabify } from "@/lib/analysis-en/features";
import { validateInputEn } from "@/lib/analysis-en/validate";
import { buildReportEn } from "@/lib/report/buildReportEn";
import type { AnalysisInput, Relation } from "@/lib/analysis/types";

const input = (a: string, b: string, relation: Relation = "friend"): AnalysisInput => ({
  a: { name: a, hanja: "", meaning: "" },
  b: { name: b, hanja: "", meaning: "" },
  relation,
});

const split = (n: string) => syllabify(n).map((s) => s.text).join("-");

describe("English syllables", () => {
  it.each([
    ["Emma", "em-ma"],
    ["Olivia", "o-li-vi-a"],
    ["Noah", "no-ah"],
    ["Kate", "kate"],
    ["James", "james"],
    ["Daniel", "da-ni-el"],
    ["Marie", "ma-rie"],
    ["Ryan", "ry-an"],
    ["Charlotte", "char-lotte"],
    ["Christopher", "chri-sto-pher"],
    ["Yasmin", "yas-min"],
  ])("%s → %s", (name, expected) => {
    expect(split(name)).toBe(expected);
  });

  it("ignores accents, case, spaces and hyphens", () => {
    expect(split("Zoë")).toBe(split("zoe"));
    expect(split("Mary-Jane")).toBe(split("maryjane"));
  });
});

describe("English analysis", () => {
  it("is deterministic and symmetric", () => {
    const r1 = analyzeNamesEn(input("Emma", "Liam"));
    const r2 = analyzeNamesEn(input("Emma", "Liam"));
    const r3 = analyzeNamesEn(input("Liam", "Emma"));
    expect(r1).toEqual(r2);
    expect(r1.total).toBe(r3.total);
    expect(r1.type.code).toBe(r3.type.code);
  });

  it("gives the same result regardless of letter case or extra spaces", () => {
    expect(analyzeNamesEn(input("emma ", " LIAM")).total).toBe(analyzeNamesEn(input("Emma", "Liam")).total);
  });

  it("produces scores in range and excludes meaning", () => {
    for (const [a, b] of [["Ava", "Max"], ["Christopher", "Jo"], ["Sophia", "Ethan"], ["Rex", "Luna"]]) {
      const r = analyzeNamesEn(input(a, b));
      expect(r.total).toBeGreaterThanOrEqual(0);
      expect(r.total).toBeLessThanOrEqual(100);
      expect(r.weights.meaning).toBeNull();
      expect(r.sections.meaning.status).not.toBe("available");
    }
  });

  it("same name is flagged", () => {
    expect(analyzeNamesEn(input("Emma", "emma")).sameName).toBe(true);
  });

  it("report is English, mentions both names and avoids fortune-telling words", () => {
    const r = analyzeNamesEn(input("Olivia", "Noah", "lover"));
    const report = buildReportEn(r);
    const all = [report.headline, ...report.summary, report.traits.a, report.traits.b, report.image, report.strength, report.message, ...report.story, report.shareText].join("\n");
    expect(all).toContain("Olivia");
    expect(all).toContain("Noah");
    expect(all).not.toMatch(/[가-힣]/);
    expect(all).not.toMatch(/destiny|soulmate|forever|breakup|bad luck|\{\w+\}/i);
    expect(report.shareText).toContain("/en/analyze");
    expect(report.shareText).not.toContain("Olivia/");
  });
});

describe("English validation", () => {
  it("accepts Latin names and rejects others", () => {
    expect(validateInputEn({ ...input("Emma", "Liam"), relation: "friend" }).ok).toBe(true);
    expect(validateInputEn({ ...input("Zoë", "O'Neil"), relation: "friend" }).ok).toBe(true);
    expect(validateInputEn({ ...input("김하윤", "Liam"), relation: "friend" }).ok).toBe(false);
    expect(validateInputEn({ ...input("E", "Liam"), relation: "friend" }).ok).toBe(false);
    expect(validateInputEn({ ...input("Emma", "J"), relation: "pet" }).ok).toBe(true);
  });
});
