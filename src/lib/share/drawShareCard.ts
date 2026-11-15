/**
 * 1080×1920 세로형 공유 카드를 Canvas로 그린다 (DESIGN_GUIDE 8장).
 * 외부 서비스로 아무것도 보내지 않고, 브라우저 안에서만 이미지를 만든다.
 */

import { MARK_BOX, MARK_PATH } from "@/lib/brand/mark";

export type ShareCardData = {
  nameA: string;
  nameB: string;
  relationLabel: string;
  total: number;
  grade: string;
  typeCode: string;
  typeTitle: string;
  message: string;
  /** 카드 하단에 적는 사이트 주소 (예: nss-farm.vercel.app) */
  siteHost: string;
};

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

const COLOR = {
  night: "#ffffff",
  paper: "#0a0a0a",
  a: "#0a0a0a",
  b: "#8c8c8c",
};

function cssFont(variable: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

/** 공백 단위로 줄바꿈하고, 한 단어가 너무 길면 글자 단위로 자른다 */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    if (ctx.measureText(word).width <= maxWidth) {
      line = word;
    } else {
      line = "";
      for (const ch of word) {
        if (ctx.measureText(line + ch).width > maxWidth) {
          lines.push(line);
          line = ch;
        } else line += ch;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, family: string, weight: string, start: number, maxWidth: number) {
  let size = start;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > 40) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

export async function drawShareCard(data: ShareCardData): Promise<HTMLCanvasElement> {
  const display = cssFont("--font-grotesk", "system-ui, sans-serif");
  const sans = '"Pretendard Variable", Pretendard, system-ui, sans-serif';
  const serifKr = sans; // 흑백 리디자인: 한글은 모두 Pretendard

  // 카드에 쓰는 글자가 폰트 조각에 포함되도록 미리 불러온다
  const allText = `이름 궁합 나도 보러 가기→${data.nameA}${data.nameB}${data.grade}${data.message}${data.typeTitle}${data.relationLabel}`;
  await Promise.allSettled([
    document.fonts.load(`400 64px ${display}`, `0123456789 ${data.typeCode} TYPE ×`),
    document.fonts.load(`500 32px ${display}`, `Two Names, One Connection. × ${data.siteHost}`),
    document.fonts.load(`700 64px ${serifKr}`, allText),
    document.fonts.load(`500 40px ${serifKr}`, allText),
    document.fonts.load(`600 34px ${sans}`, allText),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없어요.");

  const left = 96;
  const contentWidth = CARD_WIDTH - left * 2;

  ctx.fillStyle = COLOR.night;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.textBaseline = "alphabetic";

  // 상단: 심볼 + 워드마크 + 관계
  // 심볼: 높이 56px로 맞춰 워드마크 왼쪽에 둔다
  const markScale = 56 / MARK_BOX.height;
  ctx.save();
  ctx.translate(left, 150 - 28);
  ctx.scale(markScale, markScale);
  ctx.translate(-MARK_BOX.x, -MARK_BOX.y);
  ctx.fillStyle = COLOR.paper;
  ctx.fill(new Path2D(MARK_PATH));
  ctx.restore();
  ctx.fillStyle = COLOR.paper;
  ctx.font = `700 46px ${serifKr}`;
  ctx.textAlign = "left";
  ctx.fillText("이름 궁합", left + 110, 166);

  ctx.font = `600 30px ${sans}`;
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(10,10,10,0.7)";
  ctx.fillText(data.relationLabel, CARD_WIDTH - left, 162);

  // 이름
  ctx.textAlign = "center";
  const cx = CARD_WIDTH / 2;
  const nameSize = Math.min(
    fitFont(ctx, data.nameA, serifKr, "700", 132, contentWidth),
    fitFont(ctx, data.nameB, serifKr, "700", 132, contentWidth),
  );
  ctx.font = `800 ${nameSize}px ${serifKr}`;
  ctx.fillStyle = COLOR.a;
  ctx.fillText(data.nameA, cx, 400);
  ctx.font = `500 84px ${display}`;
  ctx.fillStyle = "rgba(10,10,10,0.45)";
  ctx.fillText("×", cx, 510);
  ctx.font = `800 ${nameSize}px ${serifKr}`;
  ctx.fillStyle = COLOR.b;
  ctx.fillText(data.nameB, cx, 650);

  // 지수 링
  const ringY = 935;
  const r = 190;
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(10,10,10,0.12)";
  ctx.beginPath();
  ctx.arc(cx, ringY, r, 0, Math.PI * 2);
  ctx.stroke();
  const grad = ctx.createLinearGradient(cx - r, ringY - r, cx + r, ringY + r);
  grad.addColorStop(0, COLOR.a);
  grad.addColorStop(1, COLOR.b);
  ctx.strokeStyle = grad;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, ringY, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * data.total) / 100);
  ctx.stroke();
  ctx.lineCap = "butt";

  ctx.fillStyle = COLOR.paper;
  ctx.font = `400 210px ${display}`;
  ctx.fillText(String(data.total), cx, ringY + 62);
  ctx.font = `600 24px ${sans}`;
  ctx.fillStyle = "rgba(10,10,10,0.6)";
  ctx.fillText("이름 조화 지수", cx, ringY + 112);

  ctx.font = `700 52px ${serifKr}`;
  ctx.fillStyle = COLOR.paper;
  ctx.fillText(data.grade, cx, ringY + r + 110);

  // 관계 유형
  const typeY = 1365;
  ctx.strokeStyle = "rgba(10,10,10,0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, typeY - 90);
  ctx.lineTo(CARD_WIDTH - left, typeY - 90);
  ctx.stroke();
  ctx.font = `400 76px ${display}`;
  ctx.fillStyle = COLOR.paper;
  ctx.fillText(`${data.typeCode} TYPE`, cx, typeY);
  ctx.font = `600 34px ${sans}`;
  ctx.fillStyle = "rgba(10,10,10,0.85)";
  ctx.fillText(data.typeTitle, cx, typeY + 64);

  // 핵심 메시지
  ctx.font = `500 40px ${serifKr}`;
  ctx.fillStyle = COLOR.paper;
  const lines = wrapText(ctx, `“${data.message}”`, contentWidth).slice(0, 3);
  lines.forEach((line, i) => ctx.fillText(line, cx, typeY + 140 + i * 58));

  // 하단: 이 카드를 받은 사람이 바로 분석하러 갈 수 있는 경로
  const pillW = 640;
  const pillH = 96;
  const pillY = CARD_HEIGHT - 240;
  ctx.fillStyle = COLOR.paper;
  ctx.beginPath();
  ctx.roundRect(cx - pillW / 2, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.font = `700 34px ${sans}`;
  ctx.fillStyle = COLOR.night;
  ctx.fillText("나도 이름 궁합 보러 가기 →", cx, pillY + 60);
  ctx.font = `500 30px ${display}`;
  ctx.fillStyle = "rgba(10,10,10,0.75)";
  ctx.fillText(data.siteHost, cx, CARD_HEIGHT - 100);
  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = "rgba(10,10,10,0.55)";
  ctx.fillText("Two Names, One Connection. · 재미로 보는 엔터테인먼트 콘텐츠", cx, CARD_HEIGHT - 60);

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("이미지를 만들지 못했어요."))), "image/png");
  });
}
