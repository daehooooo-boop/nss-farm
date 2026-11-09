import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "이름 궁합 — Two Names, One Connection.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// 빌드 시 한 번만 만들어 정적 파일로 제공한다 (런타임에 node_modules 폰트 파일이 필요 없도록)
export const dynamic = "force-static";

/** 기본 OG 이미지. 한글은 pretendard 패키지의 KS X 1001 서브셋 woff를 빌드 시 읽어 쓴다. */
export default async function OpengraphImage() {
  const font = await readFile(
    join(process.cwd(), "node_modules/pretendard/dist/web/static/woff-subset/Pretendard-Bold.subset.woff"),
  );
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
          background: "#17161c",
          color: "#f7f4ef",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ width: 130, height: 130, borderRadius: 999, border: "6px solid #a9a4ff" }} />
          <div style={{ width: 130, height: 130, borderRadius: 999, border: "6px solid #f2a878", marginLeft: -46 }} />
        </div>
        <div style={{ marginTop: 44, fontSize: 96, letterSpacing: -2 }}>이름 궁합</div>
        <div style={{ marginTop: 14, fontSize: 34, color: "rgba(247,244,239,0.65)" }}>
          두 사람의 이름이 만드는 조화 · Two Names, One Connection.
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] },
  );
}
