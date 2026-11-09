import { Instrument_Serif, Noto_Serif_KR } from "next/font/google";

/** 워드마크, 영문 디스플레이, 큰 숫자 */
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/** 한글 헤드라인. Google Fonts가 한글을 unicode-range 조각으로 나눠 제공하므로 preload는 끈다. */
export const notoSerifKr = Noto_Serif_KR({
  weight: ["500", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});
