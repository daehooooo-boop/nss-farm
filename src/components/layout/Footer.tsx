import { Wordmark } from "@/components/layout/Header";
import { getDict } from "@/i18n/dict";
import type { Locale } from "@/i18n/locale";
import { SITE } from "@/lib/site";

export function Footer({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).footer;
  return (
    <footer className="mt-auto bg-night text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 lg:px-12">
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
        <p className="mt-12 border-t border-paper/15 pt-6 text-[13px] text-paper/60">{t.copyright}</p>
      </div>
    </footer>
  );
}
