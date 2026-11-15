import type { Metadata } from "next";
import { ResultPage } from "@/components/pages/ResultPage";
import { getDict } from "@/i18n/dict";

const t = getDict("en").result;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResultPage locale="en" />;
}
