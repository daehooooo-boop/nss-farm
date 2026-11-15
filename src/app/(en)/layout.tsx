import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "../globals.css";
import { RootShell } from "@/components/layout/RootShell";
import { SITE, SITE_EN } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE_EN.title,
    template: `%s | ${SITE_EN.name}`,
  },
  description: SITE_EN.description,
  applicationName: SITE_EN.name,
  keywords: ["name compatibility", "name match", "couple names", "name test", "NAME SYNERGY"],
  alternates: { canonical: "/en", languages: { ko: "/", en: "/en" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_EN.name,
    title: SITE_EN.title,
    description: SITE_EN.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_EN.title,
    description: SITE_EN.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
