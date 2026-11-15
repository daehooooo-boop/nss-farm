import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

/** 영문 디스플레이, 큰 숫자 — 기하학적 그로테스크 */
export const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

/** 라벨(eyebrow)·메타 정보 — 모노스페이스 */
export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
