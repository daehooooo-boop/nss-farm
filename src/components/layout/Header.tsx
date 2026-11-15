import Link from "next/link";
import { SynergyMark } from "@/components/ui/SynergyMark";
import { buttonClass } from "@/components/ui/Button";
import { getDict } from "@/i18n/dict";
import { localePath, type Locale } from "@/i18n/locale";

export function Wordmark({ tone = "paper", locale = "ko" }: { tone?: "paper" | "night"; locale?: Locale }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <SynergyMark size={28} tone={tone} />
      <span className="font-serif-kr text-[19px] leading-none font-extrabold tracking-[-0.01em]">{getDict(locale).brand}</span>
    </span>
  );
}

type HeaderProps = {
  showCta?: boolean;
  locale?: Locale;
  /** 언어 전환 시 이동할 같은 화면의 경로 (언어 접두어 없이) */
  path?: string;
};

export function Header({ showCta = true, locale = "ko", path = "/" }: HeaderProps) {
  const t = getDict(locale);
  const other: Locale = locale === "ko" ? "en" : "ko";
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-[1120px] items-center justify-between px-5 md:h-16 md:px-8 lg:px-12">
        <Link href={localePath(locale, "/")} aria-label={t.homeLabel}>
          <Wordmark locale={locale} />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={localePath(other, path)}
            hrefLang={other}
            lang={other}
            aria-label={t.langSwitch.aria}
            className="inline-flex h-9 min-w-11 items-center justify-center rounded-full border border-line-strong px-3 font-display text-[13px] font-medium tracking-[0.04em] text-ink-soft hover:border-ink hover:text-ink md:h-10"
          >
            {t.langSwitch.short}
          </Link>
          {showCta ? (
            <Link href={localePath(locale, "/#start")} className={buttonClass("secondary", "md", "h-9 px-4 text-sm md:h-10")}>
              {t.header.cta}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
