import { describe, expect, it } from "vitest";
import { MESSAGES, normalizeName, validateInput } from "@/lib/analysis/validate";
import type { DraftInput } from "@/lib/analysis/types";

const person = (name: string, hanja = "", meaning = "") => ({ name, hanja, meaning });
const draft = (a: string, b: string, relation: DraftInput["relation"] = "lover"): DraftInput => ({
  a: person(a),
  b: person(b),
  relation,
});

describe("validateInput", () => {
  it("정상 입력을 통과시키고 정규화한다", () => {
    const r = validateInput(draft(" 김 하윤 ", "이도현"));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.a.name).toBe("김하윤");
  });

  it("이름 누락", () => {
    const r = validateInput(draft("", "이도현"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.a.name).toBe(MESSAGES.nameRequired);
  });

  it.each(["김", "남궁가나다라", "Kim", "ㄱㄴ", "하윤1"])("지원하지 않는 이름: %s", (name) => {
    const r = validateInput(draft(name, "이도현"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.a.name).toBe(MESSAGES.nameFormat(2));
  });

  it("관계 미선택", () => {
    const r = validateInput(draft("김하윤", "이도현", null));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.relation).toBe(MESSAGES.relationRequired);
  });

  it("반려동물은 B 이름 1글자 허용, A는 여전히 2자 이상", () => {
    expect(validateInput(draft("김하윤", "콩", "pet")).ok).toBe(true);
    expect(validateInput(draft("김하윤", "콩", "friend")).ok).toBe(false);
    expect(validateInput(draft("김", "콩", "pet")).ok).toBe(false);
  });

  it("한자: 한자만 허용, 글자 수 불일치는 경고", () => {
    const bad = validateInput({ a: person("하윤", "ha"), b: person("도현"), relation: "lover" });
    expect(bad.ok).toBe(false);
    const warn = validateInput({ a: person("김하윤", "夏允"), b: person("도현"), relation: "lover" });
    expect(warn.ok).toBe(true);
    expect(warn.warnings.a.hanja).toBe(MESSAGES.hanjaLengthMismatch);
  });

  it("의미 60자 초과", () => {
    const r = validateInput({ a: person("하윤", "", "가".repeat(61)), b: person("도현"), relation: "lover" });
    expect(r.ok).toBe(false);
  });

  it("NFD로 들어온 한글도 정규화", () => {
    expect(normalizeName("하윤".normalize("NFD"))).toBe("하윤");
  });
});
