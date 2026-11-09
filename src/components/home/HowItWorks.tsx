import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOW_IT_WORKS } from "@/data/homeContent";

export function HowItWorks() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 border-t border-line py-20 md:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="about-title"
          index="01"
          label="About"
          title={
            <>
              이름은 한 사람이
              <br className="md:hidden" /> 가장 많이 듣는 소리입니다.
            </>
          }
          description="이름 궁합은 두 사람의 이름을 나란히 놓고, 그 소리와 짜임새와 뜻이 어떻게 어울리는지 읽어 드리는 이름 리포트예요. 근거 없는 점수 대신, 왜 그런 결과가 나왔는지를 함께 보여드려요."
        />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="border-t border-ink pt-5">
              <span className="font-display text-[40px] leading-none tabular-nums">{item.step}</span>
              <h3 className="mt-5 text-lg font-semibold md:text-[22px]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft md:text-base">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
