@AGENTS.md

# NAME SYNERGY — 개발 규칙

> Two Names, One Connection.
> 두 사람의 이름을 규칙 기반으로 비교해 이름 조화 지수와 관계 리포트를 보여주는 웹 서비스.

이 문서는 이 저장소에서 작업하는 모든 사람(과 Claude)이 지켜야 할 규칙이다.
제품 요구사항은 `docs/PRD.md`, 디자인은 `docs/DESIGN_GUIDE.md`, 분석/점수 규칙은 `docs/ANALYSIS_RULES.md`, 단계별 계획은 `docs/IMPLEMENTATION_PLAN.md`를 따른다.

## 1. 기술 스택

- Next.js 16 (App Router, `src/` 디렉터리) · React 19 · TypeScript (strict)
- Tailwind CSS v4 (CSS-first 설정, 토큰은 `src/app/globals.css`의 `@theme`)
- 아이콘: `lucide-react`
- 테스트: `vitest` (분석 엔진 단위 테스트)
- 이 Next.js 버전은 학습 데이터와 다를 수 있다. 새 API를 쓰기 전에 `node_modules/next/dist/docs/`를 확인한다.

## 2. 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드 (타입 검사 포함)
npm run lint     # ESLint
npm test         # vitest 단위 테스트
```

작업을 마치기 전에 `npm run lint`, `npm test`, `npm run build`가 모두 통과해야 한다.

## 3. 디렉터리 구조

```
src/
  app/                 # 라우트: / , /analyze , /result  + layout, metadata, robots, sitemap
  components/
    ui/                # 버튼, 카드, 입력 필드 등 브랜드 기본 컴포넌트
    layout/            # Header, Footer
    home/ analyze/ result/ share/   # 페이지별 섹션 컴포넌트
  lib/
    hangul/            # 한글 자모 분해 등 순수 유틸
    analysis/          # 분석 엔진 (발음·구조·의미·종합 점수·유형 분류) — UI 의존 금지
    report/            # 분석 결과 → 문장 리포트 조합
    storage/           # sessionStorage 결과 보관
  data/                # 의미 키워드 사전, 관계 유형 정의, 문장 템플릿 등 정적 데이터
docs/                  # PRD, 디자인 가이드, 분석 규칙, 구현 계획
```

## 4. 코드 규칙

- `any` 금지. 불가피하면 `unknown` + 타입 가드.
- 분석 로직(`lib/analysis`, `lib/report`)은 React·브라우저 API를 import하지 않는 순수 함수로 작성한다.
- 데이터(`data/`)와 로직(`lib/`)과 UI(`components/`)를 분리한다. 문장·키워드·가중치를 컴포넌트 안에 하드코딩하지 않는다.
- 가중치·임계값은 `lib/analysis/constants.ts` 한 곳에서 관리하고, 바꾸면 `docs/ANALYSIS_RULES.md`도 같은 커밋에서 고친다.
- 분석은 결정적이어야 한다. `Math.random()`, `Date.now()` 등을 결과 계산에 쓰지 않는다.
- 클라이언트 컴포넌트(`"use client"`)는 상호작용이 필요한 곳에만 둔다.
- 파일명: 컴포넌트 `PascalCase.tsx`, 그 외 `camelCase.ts`.

## 5. 콘텐츠 원칙

- 이름 조화 지수는 **엔터테인먼트용 지표**이며 과학적 궁합 점수가 아니다. 결과 화면에 항상 명시한다.
- 사용자가 입력하지 않은 한자 뜻·오행·운세를 만들어내지 않는다. 자료가 없으면 "자료 부족"으로 표시하고 점수에서 제외한다.
- 운명론, 미래 예측, 이별/불행 같은 부정적 단정 표현을 쓰지 않는다.
- 같은 입력이면 같은 결과, 다른 입력이면 실제로 다른 근거가 보여야 한다.

## 6. 개인정보

- 이름을 서버·DB·URL 쿼리·외부 분석 도구에 보내지 않는다. 분석은 브라우저에서 수행하고 결과는 `sessionStorage`에만 둔다.
- 생년월일·출생시간은 PHASE 1에서 받지 않는다.
- 비밀 값은 `.env.local`에만 두고 프론트엔드 코드에 넣지 않는다 (`.env*`는 `.gitignore`에 포함됨).

## 7. 디자인 원칙 (요약)

- `docs/DESIGN_GUIDE.md`의 색상·타이포 토큰만 사용한다. 임의의 hex 값, 기본 Tailwind 팔레트(`blue-500` 등) 직접 사용 금지.
- 운세 사이트 시각 언어(금색, 붉은 장식, 구름, 별자리, 전통 문양) 금지.
- 모바일 우선. 375px 폭에서 먼저 확인하고 768px·1280px로 확장한다.
- 애니메이션은 짧고 절제되게, `prefers-reduced-motion`을 존중한다.

## 8. 작업 방식

- `docs/IMPLEMENTATION_PLAN.md`의 STEP 순서대로 한 단계씩 진행한다.
- 각 단계가 끝나면 보고: 구현한 기능 / 수정한 파일 / 실행·테스트 결과 / 미해결 문제 / 다음 단계.
- 문제는 우회하지 말고 원인을 찾아 고친다.
- 파일을 대량 수정·삭제하기 전에는 변경 내용을 설명하고 승인을 받는다.
- 문서와 구현이 어긋나면 같은 작업 안에서 문서도 갱신한다.
