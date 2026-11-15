import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MARK_BOX, MARK_PATH, MARK_VIEWBOX } from "@/lib/brand/mark";

export const alt = "이름 궁합 — Two Names, One Connection.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 한글 표시용 Pretendard Bold (KS X 1001 서브셋, OFL) — assets/fonts
const font = await readFile(join(process.cwd(), "assets/fonts/Pretendard-Bold.subset.woff"));

/** 기본 OG 이미지 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "Pretendard",
        }}
      >
        <svg width={300} height={Math.round((300 * MARK_BOX.height) / MARK_BOX.width)} viewBox={MARK_VIEWBOX}>
          <path d={MARK_PATH} fill="#171717" />
        </svg>
        <div style={{ marginTop: 44, fontSize: 96, letterSpacing: -2 }}>이름 궁합</div>
        <div style={{ marginTop: 14, fontSize: 34, color: "rgba(10,10,10,0.6)" }}>
          우리 둘 사이는 몇 점? · 이름으로 알아보는 이름 궁합
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] },
  );
}
