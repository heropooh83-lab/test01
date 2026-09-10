# 수업용 AI 웹앱 모음

클로드 채팅으로 만든 수업용 웹앱을 분석해 하나의 Vite 프로젝트로 이식한 저장소입니다.
현재 두 개의 앱이 각자의 진입 HTML을 갖고 함께 빌드됩니다.

| 앱 | 주소 | 원본 | 분석 문서 |
| --- | --- | --- | --- |
| AI 윤리 판단 기준 시뮬레이터 | `/` | `heropooh83-lab/A2026-AI-Ethics` (커밋 `a3a3bbd`) | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| AI 안전 방패 메이커 | `/shield.html` (배포 시 `/shield`) | 클로드 채팅으로 만든 단일 HTML 1개 | [ARCHITECTURE-SHIELD.md](./ARCHITECTURE-SHIELD.md) |

## 실행

```bash
npm install
npm run dev      # http://localhost:3000  · 방패 앱은 /shield.html
```

| 스크립트 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 (포트 3000) |
| `npm run build` | 프로덕션 빌드 → `dist/` (진입 HTML 2개) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | `tsc --noEmit` 타입 검사 |

---

## 1. AI 윤리 판단 기준 시뮬레이터 (`/`)

정답이 없는 문제 앞에서 AI가 무엇을 기준으로 결정해야 하는지 탐구하는 수업용 웹앱입니다.
학생이 판단 기준의 **가중치**와 **공개 여부**를 직접 조절하면, 그 설정이 만들어 내는
**공정성**과 **투명성**의 결과를 즉시 진단해 보여줍니다.

1. **상황 선택** — 채용 심사 / 응급실 우선순위 / 장학생 선발 중 하나를 고릅니다.
2. **기준 설정** — 기준별 중요도를 0~10으로 정하고, 각 기준을 대중에 공개할지 결정합니다.
3. **진단** — 종합 판정, 두 집단의 유불리 격차, 은폐된 차별 기준 여부를 확인합니다.
4. **성찰** — 가상 인물 2명의 합격 결과가 뒤바뀌는 것을 보고 토의한 뒤, 보고서를 복사해 제출합니다.

빠른 실험 버튼으로 "완전 공정·투명", "차별 기준 은폐", "균등(5점)" 상태를 한 번에 만들 수 있어
교사 시연에 바로 쓸 수 있습니다.

```
src/
├── types.ts              도메인 타입
├── data/scenarios.ts     시나리오 3종 (순수 데이터)
├── utils/evaluator.ts    평가 엔진 (React 비의존 순수 함수)
└── components/           표현 전용 컴포넌트 7개
```

상태는 `App.tsx`에만 있고, 계산은 `evaluateSimulation()` 순수 함수 하나가 담당하며,
컴포넌트는 props를 받아 그리기만 합니다. 시나리오 추가는 `data/scenarios.ts` 편집으로 시작합니다.

---

## 2. AI 안전 방패 메이커 (`/shield.html`)

딥페이크의 두 얼굴을 살펴본 뒤, 모둠이 **안전 사용 규칙**을 정해 방패에 새기는 수업용 웹앱입니다.

1. **상황 판단** — 상황 카드 6장을 허용/금지로 나눕니다. 채점하지 않습니다.
2. **규칙 새기기** — 모둠 이름과 규칙 3~5개를 적습니다. 1단계에서 고른 판단이 요약되어 재료가 됩니다.
3. **방패 완성** — 규칙이 새겨진 방패가 만들어집니다. PNG 저장·인쇄·반 갤러리 등록을 할 수 있습니다.
4. **함께 정하기** — "발전 vs 규제" 찬반에 모둠당 한 표를 던지고 집계를 함께 봅니다.

모둠 이름은 **해시로 방패 도형 5종 중 하나**를 고릅니다. 난수가 아니므로 같은 이름은 늘 같은 방패가 되고,
갤러리에서 도형만 보고도 모둠을 알아볼 수 있습니다.

규칙이 길거나 많으면 방패가 좁아지는 아래쪽에서 글자가 잘리므로, 도형마다 안전 영역을 정해 두고
글자 크기를 그 안에 맞춥니다. 화면과 PNG 저장본 모두 같은 규칙을 따릅니다.

```
shield.html               진입 HTML
src/shield/
├── App.tsx               상태 전부 (단계·판단·규칙·갤러리·투표)
├── data/                 상황 6종 · 힌트 6종 · 방패 도형 5종
├── utils/                도형 해시 · SVG/PNG 생성 · 저장소 3단 폴백 · 집계 문구
└── components/           표현 전용 컴포넌트 9개
```

### 갤러리와 투표가 저장되는 곳

원본은 클로드 아티팩트 런타임의 공유 저장소(`window.storage`)만 사용해, 일반 브라우저에서 열면
새로고침과 함께 데이터가 사라졌습니다. 이식본은 **`window.storage` → `localStorage` → 메모리** 순으로
내려가며, 지금 어디에 저장되고 있는지 4단계 화면에 문장으로 알려 줍니다.

- **공유 저장소가 있을 때** — 같은 링크를 연 다른 기기의 표까지 함께 셉니다.
- **없을 때** — 이 브라우저에만 저장됩니다. 교실 화면 하나를 함께 보며 모둠별로 누르는 방식이 됩니다.

저장 키는 원본과 같은 `shield_gallery_v1`, `shield_vote_tally_v1`이라 기존 데이터를 그대로 이어 읽습니다.

---

## 기술 스택

Vite 6 · React 19 · TypeScript · Tailwind CSS v4 · lucide-react(윤리 시뮬레이터).
서버와 외부 API 호출이 없어 정적 호스팅만으로 배포됩니다 (`vercel.json`에 SPA 리라이트 포함).

## 배포

두 가지 경로로 배포됩니다. 둘은 서로 독립이라 한쪽이 막혀도 다른 쪽으로 열 수 있습니다.

| 경로 | 주소 | 무엇이 트리거하나 |
| --- | --- | --- |
| GitHub Pages | `https://heropooh83-lab.github.io/test01/` | `main`에 푸시 (`.github/workflows/pages.yml`) |
| Vercel | Vercel 프로젝트의 Domains에 배정된 주소 | `main`에 푸시 |

방패 앱 경로는 배포처마다 다릅니다.

| 배포처 | 윤리 시뮬레이터 | 방패 메이커 |
| --- | --- | --- |
| GitHub Pages | `/test01/` | `/test01/shield.html` |
| Vercel | `/` | `/shield` (또는 `/shield.html`) |

Pages에는 리라이트 기능이 없어 `/shield` 짧은 주소는 Vercel에서만 됩니다.

### GitHub Pages

저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번만 바꿔 주면 그 뒤로는 자동입니다.

Pages는 `https://<사용자>.github.io/<저장소>/` 처럼 하위 경로에 올라가므로 자산 경로의 기준을 맞춰야 합니다.
워크플로가 `BASE_PATH=/test01/`를 넘겨 주고, `vite.config.ts`가 그 값을 `base`로 씁니다.
값이 없으면 `/`가 되어 Vercel 배포에는 영향을 주지 않습니다.

앱 사이를 오가는 링크는 `import.meta.env.BASE_URL`을 써서 두 배포처 모두에서 맞게 풀립니다.

### Vercel

Vercel 프로젝트: https://vercel.com/jh-lab1/test01

`main` 브랜치가 프로덕션 배포 대상입니다. `main`에 푸시하면 자동으로 재배포됩니다.
`vercel.json`에 프레임워크, 빌드 명령, 출력 디렉터리를 명시해 두었으므로 별도 설정 없이 배포됩니다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Root Directory | 저장소 루트 (비워 둠) |

`/shield`로 들어오면 `/shield.html`로 연결되고, 그 밖의 경로는 `/index.html`로 되돌아갑니다.

## 배포가 안 될 때

**"Return to Team" 버튼이 있는 404**는 앱이 아니라 **Vercel 대시보드**의 404입니다.
없는 프로젝트 주소를 열었다는 뜻이지 배포가 실패한 것이 아닙니다.
`vercel.com/jh-lab1/test01`이 맞는 주소인지 확인하세요.

**`404: NOT_FOUND` 와 배포 ID가 함께 뜨는 화면**이 앱 쪽 404입니다. 이때는 두 가지를 보세요.

1. Vercel이 보는 브랜치에 앱 코드가 있는지. Vercel은 기본적으로 `main`을 프로덕션으로 배포하므로,
   앱이 다른 브랜치에만 있으면 빌드 결과물이 비어 404가 납니다.
   Settings → Git → Production Branch가 실제 코드가 있는 브랜치인지 확인하세요.
2. 빌드가 성공했는지. Deployments 탭에서 최신 Production 배포의 상태와 로그를 확인하세요.

로컬에서 배포와 같은 조건을 재현하려면 아래를 그대로 돌려 보면 됩니다.

```bash
npm ci && npm run build && npm run preview   # Vercel과 같은 설치·빌드 명령
BASE_PATH=/test01/ npm run build             # Pages와 같은 조건
```
