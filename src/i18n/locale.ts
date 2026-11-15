export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** 언어별 경로. 한국어는 루트, 영어는 /en 아래에 둔다. 이름은 경로에 넣지 않는다. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "ko") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** 같은 화면의 다른 언어 경로 */
export function switchLocalePath(target: Locale, pathname: string): string {
  const base = pathname.startsWith("/en") ? pathname.slice(3) || "/" : pathname;
  return localePath(target, base);
}
