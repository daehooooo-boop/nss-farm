# 이름 궁합 (NAME SYNERGY)

**Two Names, One Connection.**

이름 궁합은 두 사람의 이름을 바탕으로 발음, 구조, 의미의 조화를 분석하고,
두 사람의 관계를 감성적인 디지털 매거진 형태의 리포트로 보여주는 웹 서비스입니다.
연인, 부부, 친구, 가족, 동료 등 다양한 관계에서 사용할 수 있습니다.

> 이름 조화 지수는 이름의 특징을 비교해 보여주는 **엔터테인먼트 콘텐츠 지표**이며,
> 과학적으로 검증된 궁합 점수가 아닙니다.

## 주요 기능 (PHASE 1 MVP)

- 두 사람의 이름 입력 (한글 2~5자), 한자·이름 의미 입력(선택)
- 관계 유형 선택: 연인 · 부부 · 친구 · 가족 · 동료 · 기타
- 규칙 기반 이름 분석 엔진: 발음 조화 · 구조 균형 · 의미 조화
- 이름 조화 지수(0~100)와 점수 근거 설명
- 관계 유형 분류: BALANCE · HARMONY · COMPLEMENT · RHYTHM · SYNERGY
- 결과 이미지 저장, 결과 텍스트 복사, 모바일 공유(Web Share API)
- 회원가입 없음, 이름은 서버에 저장하지 않음

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react · Vitest

## 실행 방법

필요 환경: Node.js 20.9 이상 (권장 22), npm

```bash
npm install
npm run dev        # http://localhost:3000
```

기타 명령어:

```bash
npm run build      # 프로덕션 빌드
npm run start      # 빌드 결과 실행
npm run lint       # 린트
npm test           # 분석 엔진 단위 테스트
```

서비스 주소: https://nss-farm.vercel.app (Vercel 프로젝트 이름 `nss-farm`)

환경변수는 필수가 아닙니다. 다른 주소로 배포하면 `NEXT_PUBLIC_SITE_URL`에 그 주소를 넣으세요(SEO 메타·sitemap에 쓰임). 이후 필요해지면 `.env.local`에 두며, 이 파일은 Git에 포함되지 않습니다.

## 배포 (Vercel)

1. 이 코드를 GitHub 저장소에 올립니다.
2. Vercel에서 **Add New → Project → Import**로 저장소를 고르고, Project Name을 `nss-farm`으로 정합니다.
3. Framework는 Next.js로 자동 인식되며 설정 변경 없이 Deploy 하면 `https://nss-farm.vercel.app`이 생깁니다.
4. 이후 기본 브랜치에 push하면 자동으로 다시 배포됩니다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | 개발 규칙 |
| [docs/PRD.md](./docs/PRD.md) | 제품 요구사항 |
| [docs/DESIGN_GUIDE.md](./docs/DESIGN_GUIDE.md) | 브랜드 및 디자인 가이드 |
| [docs/ANALYSIS_RULES.md](./docs/ANALYSIS_RULES.md) | 분석 및 점수 계산 규칙 |
| [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) | 단계별 구현 계획 |

## 로드맵

- **PHASE 1** 이름 조화 분석 MVP (현재)
- **PHASE 2** 생년월일·출생시간 기반 사주 결합 분석
- **PHASE 3** NAME SCANNER: 인기 이름, 희소성, 한자·의미 검색
- **PHASE 4** NAMING LAB: 신생아 작명, 개명, 전문 작명소 상담 연결
