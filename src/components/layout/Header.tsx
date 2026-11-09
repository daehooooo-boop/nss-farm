import Link from "next/link";
import { SynergyMark } from "@/components/ui/SynergyMark";
import { buttonClass } from "@/components/ui/Button";

export function Wordmark({ tone = "paper" }: { tone?: "paper" | "night" }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <SynergyMark size={28} tone={tone} />
      <span className="font-serif-kr text-[20px] leading-none font-bold tracking-[-0.01em]">이름 궁합</span>
    </span>
  );
}

export function Header({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between px-5 md:h-16 md:px-8 lg:px-12">
        <Link href="/" aria-label="이름 궁합 홈">
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
