# English Name Analysis Rules (en-1.0)

- 적용 경로: `/en`, `/en/analyze`, `/en/result`
- 코드: `src/lib/analysis-en/` (특징 추출·점수), `src/lib/report/buildReportEn.ts`, `src/data/en/`
- 원칙은 한국어 규칙(`ANALYSIS_RULES.md`)과 같다: 결정적, 대칭적, 이름 뜻을 지어내지 않음, 엔터테인먼트 지표.

## 1. 입력

- 라틴 문자(악센트 포함), 공백, 하이픈, 아포스트로피만 허용. 글자 수(공백·기호 제외) 2~20자, 반려동물 이름은 1자부터.
- 대소문자, 앞뒤 공백, 악센트는 점수에 영향을 주지 않는다 (`Zoë` = `zoe`).
- 이름의 뜻·한자 입력은 없다. 가중치는 발음 57% · 구조 43% (한국어와 같은 재정규화).

## 2. 음절 나누기 (철자 규칙, 발음 사전 없음)

1. 모음: a e i o u. `y`는 첫 글자에서 모음 앞이면 자음, 두 모음 사이면 자음, 그 외에는 모음. `w`는 모음 뒤에서 끝나거나 자음 앞이면 모음의 일부(aw, ew, ow).
2. 끝의 묵음 e: 자음 뒤의 마지막 e는 앞에 다른 모음이 있으면 읽지 않는다 (Kate, Grace). 끝의 `-es`도 s·z·x·ch·sh 뒤가 아니면 묵음 (James, Charles).
3. 붙어 있어도 두 음절로 읽는 모음 쌍: ia io eo ua oa oe iu ie ue ya yo. 단 단어 끝의 ie, ue는 한 음절 (Marie, Julie).
4. 자음 묶음은 다이그래프(sch ch sh th ph wh ck ng qu gh)를 한 단위로 본다. 모음 사이 자음은 마지막 한 단위를 다음 음절 첫소리로 보내고, 마지막 두 단위가 첫소리 묶음(bl br cl cr dr fl fr gl gr pl pr sl sp st sw tr tw thr chr shr)이면 둘 다 보낸다. ng, ck, x 하나만 있으면 앞 음절에 붙인다.

## 3. 특징값 (한국어 엔진과 같은 공간)

| 특징 | 영어 규칙 |
| --- | --- |
| 모음 톤 | 음절 핵의 첫 모음: a, i, y = 밝음(+1) / o, u = 깊음(−1) / e = 중성(0). ee·ea·ie·ey·ei = 밝음, ou·oo·au·aw·ow = 깊음 |
| 열림 | 끝 자음(coda)이 없는 음절 비율 |
| 첫소리 부드러움 | 모음 시작·l m n r w y = 1.0 / b d g j v z = 0.6 / h = 0.5 / 그 외 무성음 = 0.25 |
| 밀도 | 음절당 글자 수 (묵음 e 제외) |
| 패턴 | 음절별 열림(O)/닫힘(C) |
| 소리 집합 | 자음 단위 + 모음 핵 |

## 4. 점수와 유형

- P1~P5, S1~S3, 등급 경계, 관계 유형 조건은 한국어 엔진의 상수(`lib/analysis/constants.ts`)를 그대로 쓴다. 길이는 음절 수 차이로 본다.
- 이어 부르기: 앞 이름 끝이 열림 → open(1.0), 뒤 이름이 모음으로 시작 → liaison(1.0), 울림소리끼리 → sonorant(0.85), 뒤 첫소리가 p t k c ck q qu ch x → hard(0.4), 그 외 plain(0.6).
- 등급: Radiant / Deep / Easy / Intriguing / Fresh Harmony (90 / 80 / 70 / 60 / 0점 이상).

## 5. 리포트

- `src/data/en/reportTemplates.ts`의 유형별 템플릿과 FNV-1a 시드로 고른다 (한국어와 같은 방식).
- 금지 표현: destiny, soulmate, forever, breakup, bad luck 등 단정·예언·부정 표현. 테스트(`analysis-en.test.ts`)가 확인한다.
- 공유 문구 끝에는 `/en/analyze` 링크를 붙인다. 링크에 이름을 넣지 않는다.
