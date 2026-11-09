/** 메인 페이지 정적 카피. 가중치 숫자는 lib/analysis/constants.ts와 일치해야 한다. */

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "두 이름을 적어요",
    body: "두 사람의 이름과 관계를 고르면 준비 끝. 한자와 이름의 뜻은 원할 때만 더해요.",
  },
  {
    step: "02",
    title: "정해진 규칙으로 비교해요",
    body: "모음의 톤, 받침의 리듬, 글자 구조, 이름의 뜻을 공개된 규칙으로 계산해요.",
  },
  {
    step: "03",
    title: "한 편의 리포트를 받아요",
    body: "조화 지수와 그 이유, 관계 유형, 두 이름으로 쓴 이야기를 매거진처럼 읽어요.",
  },
] as const;

export const ANALYSIS_PILLARS = [
  {
    key: "phonetic",
    label: "SOUND",
    title: "발음의 조화",
    weight: 40,
    body: "두 이름을 소리 내어 부를 때의 울림을 비교해요.",
    items: ["모음 톤", "받침 리듬", "첫소리 질감", "이어 부르기", "공유 소리"],
  },
  {
    key: "structure",
    label: "STRUCTURE",
    title: "구조의 균형",
    weight: 30,
    body: "글자 수와 짜임새가 서로 어떤 균형을 이루는지 살펴요.",
    items: ["길이 균형", "소리 밀도", "받침 패턴"],
  },
  {
    key: "meaning",
    label: "MEANING",
    title: "의미의 조화",
    weight: 30,
    body: "직접 적어 주신 이름의 뜻이 서로 닮았는지, 채워 주는지 읽어요.",
    items: ["공유하는 뜻", "보완하는 뜻", "같은 한자"],
  },
] as const;
