import type { ReactNode } from "react";
import { jetbrainsMono, spaceGrotesk } from "@/app/fonts";
import { getDict } from "@/i18n/dict";
import { SiteAnalytics } from "@/components/layout/SiteAnalytics";
import type { Locale } from "@/i18n/locale";

/** 언어별 루트 레이아웃이 함께 쓰는 html/body 뼈대 */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      style={{ colorScheme: "light" }}
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {getDict(locale).skipLink}
        </a>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
