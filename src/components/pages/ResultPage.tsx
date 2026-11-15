import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultView } from "@/components/result/ResultView";
import type { Locale } from "@/i18n/locale";

export function ResultPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Header locale={locale} path="/result" />
      <main id="main" className="flex-1">
        <ResultView locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
