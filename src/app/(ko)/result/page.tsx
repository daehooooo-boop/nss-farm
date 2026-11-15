import type { Metadata } from "next";
import { ResultPage } from "@/components/pages/ResultPage";
import { getDict } from "@/i18n/dict";

const t = getDict("ko").result;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  // 개인 결과 페이지이므로 검색에 노출하지 않는다
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResultPage locale="ko" />;
}
