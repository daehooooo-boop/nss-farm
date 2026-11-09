import Link from "next/link";
import { SynergyMark } from "@/components/ui/SynergyMark";
import { buttonClass } from "@/components/ui/Button";

export function Wordmark({ tone = "paper" }: { tone?: "paper" | "night" }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <SynergyMark size={28} tone={tone} />
      <span className="font-display text-[22px] leading-none tracking-[0.02em]">
        NAME SYNERGY
      </span>
    </span>
  );
}

export function Header({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link href="/" aria-label="NAME SYNERGY 홈">
          <Wordmark />
        </Link>
        {showCta ? (
          <Link href="/#start" className={buttonClass("secondary", "md", "h-10 px-4 text-sm")}>
            분석하기
          </Link>
        ) : null}
      </div>
    </header>
  );
}
