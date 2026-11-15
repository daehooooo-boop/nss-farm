import type { Metadata } from "next";
import { AnalyzePage } from "@/components/pages/AnalyzePage";
import { getDict } from "@/i18n/dict";

const t = getDict("ko").analyzePage;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: { canonical: "/analyze", languages: { ko: "/analyze", en: "/en/analyze" } },
};

export default function Page() {
  return <AnalyzePage locale="ko" />;
}
