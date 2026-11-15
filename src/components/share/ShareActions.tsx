"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ENGINES } from "@/i18n/engine";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";
import { canvasToBlob, drawShareCard, type ShareCardData } from "@/lib/share/drawShareCard";
import type { AnalysisResult } from "@/lib/analysis/types";
import type { Report } from "@/lib/report/buildReport";
import { SITE } from "@/lib/site";

const noopSubscribe = () => () => {};
const canShareSnapshot = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 구형 브라우저 대체 경로
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

export function ShareActions({ result, report, locale = "ko" }: { result: AnalysisResult; report: Report; locale?: Locale }) {
  const engine = ENGINES[locale];
  const t = getDict(locale).share;
  const FILE_NAME = t.fileName;
  const canShare = useSyncExternalStore(noopSubscribe, canShareSnapshot, () => false);
  const [busy, setBusy] = useState<"save" | "share" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function notify(message: string) {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }

  const card: ShareCardData = {
    nameA: result.features.a.name,
    nameB: result.features.b.name,
    relationLabel: engine.relationOption(result.input.relation).label,
    total: result.total,
    grade: result.grade,
    typeCode: result.type.code,
    typeTitle: engine.relationTypes[result.type.code].title,
    message: report.headline,
    siteHost: new URL(SITE.url).host + (locale === "en" ? "/en" : ""),
    locale,
  };

  async function makeImage(): Promise<Blob> {
    return canvasToBlob(await drawShareCard(card), locale);
  }

  async function handleSave() {
    setBusy("save");
    try {
      const blob = await makeImage();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = FILE_NAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify(t.saved);
    } catch {
      notify(t.saveFail);
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy() {
    notify((await copyText(report.shareText)) ? t.copied : t.copyFail);
  }

  async function handleShare() {
    setBusy("share");
    try {
      const blob = await makeImage();
      const file = new File([blob], FILE_NAME, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: report.shareText });
      } else {
        await navigator.share({ text: report.shareText });
      }
    } catch (error) {
      // 사용자가 공유 창을 닫은 경우는 조용히 넘어간다
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        notify(t.shareFail);
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <p className="eyebrow text-ink-soft">Share</p>
      <h3 className="mt-3 font-serif-kr text-[24px] leading-[1.3] font-medium md:text-[30px]">{t.title}</h3>
      <p className="mt-2 text-[14px] leading-[1.6] text-ink-faint">
        {t.body}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button
          onClick={handleSave}
          disabled={busy !== null}
          icon={busy === "save" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Download size={18} strokeWidth={1.75} aria-hidden />}
        >
          {t.save}
        </Button>
        <Button variant="secondary" onClick={handleCopy} icon={<Copy size={18} strokeWidth={1.75} aria-hidden />}>
          {t.copy}
        </Button>
        {canShare ? (
          <Button
            variant="secondary"
            onClick={handleShare}
            disabled={busy !== null}
            icon={busy === "share" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Share2 size={18} strokeWidth={1.75} aria-hidden />}
          >
            {t.share}
          </Button>
        ) : null}
      </div>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-5">
        {toast ? (
          <p className="animate-rise rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-paper shadow-lg">{toast}</p>
        ) : null}
      </div>
    </div>
  );
}
