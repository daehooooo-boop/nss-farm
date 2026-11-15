export const SITE = {
  name: "이름 궁합",
  nameEn: "NAME SYNERGY",
  slogan: "Two Names, One Connection.",
  title: "이름 궁합 — 우리 둘 사이는 몇 점?",
  description:
    "두 사람의 이름에 담긴 울림과 구조, 의미를 비교해 이름 조화 지수와 관계 유형, 두 사람만의 이야기를 보여드려요. 회원가입 없이, 이름은 저장되지 않아요.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nss-farm.vercel.app",
} as const;

/** English site copy */
export const SITE_EN = {
  name: "Name Synergy",
  title: "Name Synergy — What's our score?",
  description:
    "Compare the sound and structure of two names to get a Name Harmony Index, a pair type and a short story. No sign-up, and names are never stored.",
} as const;
