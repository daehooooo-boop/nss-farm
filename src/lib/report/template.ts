import { josa } from "@/lib/hangul/hangul";

/** FNV-1a 32bit — 템플릿 변형 선택용 (ANALYSIS_RULES 8.2) */
export function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (const ch of text) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function pickVariant<T>(variants: readonly T[], seed: number, block: number): T {
  return variants[(seed + block) % variants.length];
}

/** {key} 또는 {key:은/는} 치환. 값이 없는 키는 그대로 두지 않고 오류를 던진다. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)(?::([^}]+))?\}/g, (_, key: string, particle?: string) => {
    const value = vars[key];
    if (value === undefined) throw new Error(`템플릿 변수 없음: ${key}`);
    return particle ? josa(value, particle) : value;
  });
}
