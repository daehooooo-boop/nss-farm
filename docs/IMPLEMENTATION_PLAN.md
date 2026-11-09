# NAME SYNERGY — 전체 구현 계획 (PHASE 1)

- 최종 수정: 2026-11-08
- 원칙: 한 번에 한 STEP. 각 STEP 종료 시 "구현 기능 / 수정 파일 / 실행·테스트 결과 / 미해결 문제 / 다음 단계"를 보고하고 다음 STEP으로 넘어간다.

## 진행 현황

| STEP | 내용 | 상태 |
| --- | --- | --- |
| 1 | 프로젝트 구조·개발 환경 확인 | ✅ 완료 |
| 2 | PRD · 디자인 가이드 · 분석 규칙 문서 | ✅ 완료 |
| 3 | 디자인 시스템 기초 + 메인 페이지 | ⏳ 다음 |
| 4 | 이름 입력 페이지 | ○ |
| 5 | 이름 분석 엔진 + 단위 테스트 | ○ |
| 6 | 분석 진행 화면 + 결과 페이지 | ○ |
| 7 | 공유 기능 (이미지 저장, 텍스트 복사, Web Share) | ○ |
| 8 | 반응형·접근성·SEO·전체 테스트 | ○ |

---

## STEP 1 — 환경 (완료)

- Node 22, npm 10, Git
- `create-next-app@16.4.5`: App Router, TypeScript, Tailwind CSS 4, ESLint, `src/`, `@/*` alias
- 추가 패키지: `lucide-react`, `vitest`(dev)
- `@types/node`를 ^22로 올림 (vitest 5의 peer 요구사항과 충돌하던 ^20을 실제 Node 버전에 맞춤)
- `.gitignore`에 `.env*` 포함 확인

## STEP 2 — 문서 (완료)

`CLAUDE.md`, `README.md`, `docs/PRD.md`, `docs/DESIGN_GUIDE.md`, `docs/ANALYSIS_RULES.md`, 이 문서.

## STEP 3 — 디자인 시스템 기초 + 메인 페이지 `/`

1. 폰트: Instrument Serif · Noto Serif KR(`next/font/google`), Pretendard(`pretendard` 패키지 + `next/font/local`)
2. `globals.css` `@theme` 토큰: 색상, 폰트, 반경, 이징 (DESIGN_GUIDE 3·4·6·7장)
3. `layout.tsx`: `lang="ko"`, 기본 metadata(title 템플릿, description, OG), 폰트 변수
4. 공통 컴포넌트: `ui/Button`, `ui/Container`, `ui/Eyebrow`, `ui/SynergyMark`(두 원 교차 심볼), `layout/Header`, `layout/Footer`
5. 메인 섹션: `home/Hero`, `home/HowItWorks`, `home/AnalysisPillars`, `home/ResultPreview`(정적 예시 → STEP 6 이후 실제 엔진 출력으로 교체), `home/TypeGallery`, `home/ClosingCta`
6. 확인: 375 / 768 / 1280px 스크린샷, lint, build
- 산출물: 디자인이 적용된 메인 페이지, 재사용 UI 기본 세트

## STEP 4 — 이름 입력 페이지 `/analyze`

1. 타입: `PersonInput`, `Relation` (`lib/analysis/types.ts`)
2. 검증 모듈 `lib/analysis/validate.ts` (ANALYSIS_RULES 1장) — UI와 분리, 단위 테스트 포함
3. 컴포넌트: `analyze/PersonCard`(A/B 색 구분), `analyze/NameField`, `analyze/OptionalDetails`(한자·의미 접힘), `analyze/RelationPicker`(라디오 칩), `analyze/AnalyzeForm`
4. 오류 표시 시점(blur·제출 후), 비활성 버튼, 개인정보 안내
5. 제출 시 임시로 입력값만 `sessionStorage`에 저장 (엔진 연결은 STEP 5~6)

## STEP 5 — 분석 엔진

1. `lib/hangul/decompose.ts`: 음절 분해, 자모 분류, 조사 선택 유틸
2. `lib/analysis/constants.ts`: 모든 가중치·임계값
3. `lib/analysis/features.ts`: 이름별 특징값
4. `lib/analysis/phonetic.ts`, `structure.ts`, `meaning.ts`: 각 섹션 점수 + 근거
5. `lib/analysis/score.ts`: 가중치 재조정, 종합 지수, 등급
6. `lib/analysis/classify.ts`: 관계 유형 분류 + 근거
7. `lib/analysis/index.ts`: `analyzeNames(input): AnalysisResult`
8. `data/meaningKeywords.ts`, `data/relationTypes.ts`
9. 테스트(`vitest`): ANALYSIS_RULES 10장 전 항목 + 샘플 200쌍 분포 리포트 → 필요 시 임계값 보정 후 문서 갱신
- 엔진은 UI 없이 `npm test`로 완결 검증

## STEP 6 — 분석 진행 화면 + 결과 페이지 `/result`

1. `lib/report/`: 템플릿, 조사 처리, FNV-1a 변형 선택, `buildReport(result)`
2. `lib/storage/sessionResult.ts`: 저장/조회/스키마 버전 확인
3. 진행 화면: 실제 단계와 연결된 3~4개 문구, 최대 약 2초, reduced-motion 대응
4. 결과 컴포넌트: `result/Cover`, `result/ScoreRing`, `result/Summary`, `result/SectionScore`(세부 바 + 근거), `result/MeaningEmpty`, `result/TypeCard`, `result/Story`
5. 빈 상태(결과 없음) 처리, `/result` noindex
6. 메인 페이지 결과 예시를 실제 엔진 출력으로 교체

## STEP 7 — 공유

1. `share/ShareCard`: 1080×1920 세로 카드 (DESIGN_GUIDE 8장)
2. 이미지 저장: DOM → PNG 변환. `html-to-image` 도입 예정(웹폰트 임베드 확인), 실패 시 원인 파악 후 Canvas 직접 그리기로 전환 검토
3. 텍스트 복사: `navigator.clipboard.writeText` + 토스트, 미지원 시 대체 안내
4. 공유하기: `navigator.share`/`canShare({ files })` 지원 시만 표시
5. 외부 전송 없음 확인 (네트워크 탭)

## STEP 8 — 마무리 테스트

1. Playwright로 375/768/1280px 전체 흐름 스크린샷 점검
2. 시나리오: 정상, 이름 누락, 길이 오류, 한자만, 의미 입력, 결과 이미지 저장, 새로고침 후 빈 상태
3. 접근성: 키보드 탐색, 포커스, 대비, `aria-live`
4. SEO: metadata, `robots.ts`, `sitemap.ts`, OG 이미지, `/result` noindex
5. Lighthouse 모바일 점검, 문서-구현 일치 최종 확인

---

## 주요 기술 결정

| 결정 | 이유 |
| --- | --- |
| 분석을 브라우저에서 수행 | 이름이 서버로 가지 않음, 서버 비용 0, 즉시 결과 |
| 결과를 `sessionStorage`에 보관 | URL에 이름 노출 방지, 탭 닫으면 삭제 |
| 상수·데이터 파일 분리 | 문서와 코드 일치 관리, 규칙 조정이 쉬움 |
| 분석 모듈 + 가중치 재조정 구조 | PHASE 2 사주 분석을 모듈 추가로 연결 |
| 템플릿 변형은 입력 해시로 선택 | 결정성 유지 + 결과 다양성 |

## 확인이 필요한 사항 (사용자)

- GitHub 저장소 연결 여부 (현재 로컬 Git만 초기화됨)
- 도메인/배포 대상 (Vercel 등) — STEP 8 이후 결정 가능
