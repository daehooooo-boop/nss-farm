import { Wordmark } from "@/components/layout/Header";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-night text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Wordmark tone="night" />
            <p className="mt-4 font-display text-xl italic text-paper/80">{SITE.slogan}</p>
          </div>
          <ul className="space-y-2 text-[13px] leading-[1.6] text-paper/70 md:max-w-[420px] md:text-right">
            <li>이름 조화 지수는 이름의 특징을 비교한 엔터테인먼트 콘텐츠 지표이며, 과학적으로 검증된 궁합 점수가 아니에요.</li>
            <li>입력한 이름은 서버에 저장되지 않고, 이 브라우저 안에서만 분석돼요.</li>
          </ul>
        </div>
        <p className="mt-12 border-t border-paper/15 pt-6 text-[13px] text-paper/50">
          © 이름 궁합
        </p>
      </div>
    </footer>
  );
}
