import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/layout/Header";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";
import { SITE } from "@/lib/site";

export function Footer({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).footer;
  const { creator } = SITE;
  return (
    <footer className="mt-auto bg-night text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 lg:px-12">
        {/* 제작자 사이트로 가는 카드 */}
        <a
          href={creator.url}
          target="_blank"
          rel="noopener"
          className="group mb-14 flex flex-col gap-5 rounded-[var(--radius-card)] border border-paper/20 p-6 transition-colors duration-200 hover:border-paper hover:bg-paper/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <p className="eyebrow text-paper/60">{t.promoEyebrow}</p>
            <p className="mt-3 font-serif-kr text-[20px] leading-[1.4] font-bold md:text-[26px]">{t.promoTitle}</p>
          </div>
          <span className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-paper px-6 text-[15px] font-semibold text-night transition-transform duration-200 group-hover:translate-x-0.5 md:self-auto">
            {t.promoCta}
            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
            <span className="sr-only">{t.newTab}</span>
          </span>
        </a>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Wordmark tone="night" locale={locale} />
            <p className="mt-4 font-display text-xl text-paper/80">{SITE.slogan}</p>
          </div>
          <ul className="space-y-2 text-[13px] leading-[1.6] text-paper/70 md:max-w-[420px] md:text-right">
            {t.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-paper/15 pt-6 text-[13px] text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.copyright}</p>
          <p>
            {t.creditBy}{" "}
            <a
              href={creator.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {creator.name}
              <span className="sr-only"> {t.newTab}</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
