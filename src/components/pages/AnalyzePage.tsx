import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";

export function AnalyzePage({ locale }: { locale: Locale }) {
  const t = getDict(locale).analyzePage;
  return (
    <>
      <Header showCta={false} locale={locale} path="/analyze" />
      <main id="main" className="flex-1 pb-24">
        <Container className="pt-10 md:pt-16">
          <div className="max-w-[640px]">
            <p className="eyebrow text-ink-soft">Step 1 — Names</p>
            <h1 className="mt-4 font-serif-kr text-[28px] leading-[1.3] font-bold md:text-[40px]">{t.title}</h1>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft md:text-base">{t.body}</p>
          </div>
          <div className="mt-12">
            <AnalyzeForm locale={locale} />
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
