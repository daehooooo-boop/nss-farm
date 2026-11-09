import { ImageResponse } from "next/og";

export const alt = "NAME SYNERGY — Two Names, One Connection.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 기본 OG 이미지 (외부 폰트 없이 기본 서체로 영문만 사용) */
export default function OpengraphImage() {
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
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ width: 140, height: 140, borderRadius: 999, border: "6px solid #a9a4ff" }} />
          <div style={{ width: 140, height: 140, borderRadius: 999, border: "6px solid #f2a878", marginLeft: -50 }} />
        </div>
        <div style={{ marginTop: 48, fontSize: 88, letterSpacing: 4 }}>NAME SYNERGY</div>
        <div style={{ marginTop: 16, fontSize: 36, fontStyle: "italic", color: "rgba(247,244,239,0.6)" }}>
          Two Names, One Connection.
        </div>
      </div>
    ),
    size,
  );
}
