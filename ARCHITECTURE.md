# A2026-AI-Ethics 코드 분석

분석 대상: `heropooh83-lab/A2026-AI-Ethics` (main, 커밋 `a3a3bbd`, 소스 22개 파일 · 약 1,900줄)

이 문서는 원본 저장소가 **어떻게 작동하고 어떻게 구성되어 있는지**를 정리한 것입니다.
이 저장소(test01)의 `src/`는 아래 구조를 그대로 옮긴 이식본입니다.

---

## 1. 한 줄 요약

학생이 AI의 판단 기준별 **가중치(0~10)** 와 **공개 여부(투명성)** 를 직접 조절하면,
순수 함수 하나가 그 설정을 **공정성·투명성 진단문**으로 바꿔 보여주는 수업용 단일 페이지 앱입니다.
서버도 데이터베이스도 없고, 모든 계산은 브라우저 안에서 동기적으로 끝납니다.

## 2. 기술 스택

| 구분 | 선택 | 비고 |
| --- | --- | --- |
| 빌드 | Vite 6 | `@vitejs/plugin-react` |
| UI | React 19 + TypeScript | 클래스 컴포넌트 없음, 훅만 사용 |
| 스타일 | Tailwind CSS v4 | `@tailwindcss/vite` 플러그인, 설정 파일 없이 `@import "tailwindcss"` 한 줄 |
| 아이콘 | lucide-react | |
| 상태 관리 | React `useState` / `useMemo` | Redux·Zustand·Context 없음 |
| 라우팅 | 없음 | 화면 전환은 `hasEvaluated` 불리언 하나로 처리 |

외부 API 호출은 한 곳도 없습니다. 원본의 `metadata.json`은 Gemini 서버 사이드 API 권한을
선언하고 `.env.example`은 `GEMINI_API_KEY`를 정의하지만, **소스 어디에서도 읽지 않습니다.**

## 3. 파일 구성과 역할

```
src/
├── main.tsx                  React 진입점 (StrictMode + createRoot)
├── index.css                 Tailwind 진입점
├── types.ts                  도메인 타입 전체 (Criterion, VirtualProfile, Scenario, SimulationResult)
├── data/scenarios.ts         3개 시나리오의 순수 선언 데이터 (로직 없음)
├── utils/evaluator.ts        평가 엔진 — 이 앱의 두뇌, 순수 함수 1개
└── components/               표현 전용 컴포넌트 7개
    ├── Header.tsx                제목 + 안내서/전체화면 버튼
    ├── ScenarioSelector.tsx      STEP 1 · 시나리오 탭 + 프리셋 버튼
    ├── CriteriaEditor.tsx        STEP 2 · 슬라이더 + 공개 토글
    ├── EvaluationResultView.tsx  STEP 3 · 판정·격차 그래프·투명성 진단
    ├── VirtualComparison.tsx     가상 인물 2명 점수 대결
    ├── DiscussionReflection.tsx  STEP 4 · 토의 질문 + 성찰 입력 + 보고서 복사
    └── ClassroomGuideModal.tsx   AI 윤리 개념 안내 모달
```

핵심은 **데이터 · 로직 · 표현의 3단 분리**입니다.

- `data/scenarios.ts`는 문자열과 숫자만 있는 순수 데이터입니다.
- `utils/evaluator.ts`는 React를 import하지 않습니다. 입력만 받아 결과 객체를 돌려줍니다.
- `components/*`는 상태를 소유하지 않습니다. props로 받고 콜백으로 올려보냅니다.

덕분에 시나리오를 추가할 때 UI 코드를 고칠 필요가 없습니다.

## 4. 상태와 데이터 흐름

상태는 전부 `App.tsx` 한 곳에 있습니다.

| 상태 | 형태 | 의미 |
| --- | --- | --- |
| `scenarioKey` | `'hire' \| 'med' \| 'scholarship'` | 선택된 시나리오 |
| `values` | `Record<기준id, 0~10>` | 기준별 가중치 |
| `opens` | `Record<기준id, boolean>` | 기준별 대중 공개 여부 |
| `hasEvaluated` | `boolean` | STEP 3·4 노출 여부 |
| `isGuideOpen` / `isFullscreen` | `boolean` | 모달 · 수업 집중 보기 |

흐름은 한 방향입니다.

```
사용자 조작 (슬라이더 / 토글 / 프리셋)
      ↓ 콜백
App.tsx 의 values · opens 갱신
      ↓ useMemo([scenario, values, opens])
evaluateSimulation(scenario, values, opens) → SimulationResult
      ↓ props
결과 컴포넌트 3종이 그대로 렌더
```

`evaluateSimulation`은 `hasEvaluated`와 무관하게 **항상** 다시 계산됩니다.
버튼은 계산을 유발하는 게 아니라, 이미 계산된 결과를 화면에 드러내고
`resultRef.current?.scrollIntoView()`로 스크롤을 내릴 뿐입니다.

시나리오를 바꾸면 기준 id 자체가 달라지므로 `values`와 `opens`를 새 기준으로 전부 초기화(5점·공개)하고
`hasEvaluated`를 `false`로 되돌립니다. 이 초기화를 빼먹으면 이전 시나리오의 잔여 키가 남습니다.

## 5. 평가 엔진 (`utils/evaluator.ts`)

앱의 교육적 메시지는 전부 이 217줄 안에 들어 있습니다. 크게 다섯 단계입니다.

**(1) 기준 분류와 합산** — 각 기준은 `fair: boolean`을 갖습니다. 정당한 기준의 합 `fairSum`과
차별 위험 기준의 합 `unfairSum`을 따로 모으고, `fairRatio = fairSum / 전체 * 100`을 냅니다.
가중치가 6점 이상인 정당 기준은 `fairUsed`, 3점 초과인 차별 기준은 `unfairUsed`로 따로 수집해
나중에 설명문에 이름을 넣는 데 씁니다.

**(2) 집단 간 격차** — 차별 기준 총합만으로 두 집단의 유불리를 만듭니다.

```
gap    = min(unfairSum × 6, 70)      // 상한 70
group1 = min(95, 55 + gap / 2)       // 배경 우위군
group2 = max(5,  55 - gap / 2)       // 취약군
diff   = |group1 - group2|
```

기준선 55%에서 시작해 차별 기준을 올릴수록 두 막대가 벌어집니다.
정당한 기준을 아무리 높여도 격차는 줄지 않습니다. **격차를 만드는 것은 차별 기준뿐**이라는
메시지를 수식 자체가 담고 있습니다.

**(3) 종합 판정** — 두 개의 문턱값으로 3단계를 가릅니다.

| 조건 | 판정 |
| --- | --- |
| `unfairSum ≤ 4` **그리고** `fairRatio ≥ 70` | ✅ 비교적 공정 |
| `unfairSum ≤ 10` | ⚠️ 주의 필요 |
| 그 외 | ❌ 불공정 |

**(4) 투명성 진단** — 여기가 이 앱의 독창적인 부분입니다. 단순히 "몇 개 공개했나"를 세지 않고,
**무엇을 숨겼는지**를 봅니다.

| 상태 | 조건 |
| --- | --- |
| `hidden_risk` 🚨 | 비공개 + 차별 기준 + 가중치 3점 초과인 기준이 하나라도 있음 |
| `partial` 🤔 | 숨긴 것은 있으나 전부 정당한 기준임 |
| `transparent` ✅ | 전부 공개 |

즉 "숨겼다"가 아니라 **"숨길 만한 것을 숨겼다"** 를 잡아냅니다.
정당한 기준을 숨기면 아쉬운 정도지만, 차별 기준을 숨기면 은폐로 판정됩니다.

**(5) 가상 인물 대조** — 시나리오마다 대비되는 인물 2명이 있고, 각자 기준별 원점수(0~10)를 갖습니다.

```
총점 = Σ(원점수 × 가중치) / (Σ가중치 × 10) × 100
```

역량은 뛰어나지만 배경이 약한 인물과, 역량은 평범하나 배경이 화려한 인물을 세워 두어서
가중치를 옮기는 순간 **합격자가 실제로 뒤바뀌는 것**을 눈으로 보게 만듭니다.
`unfairSum > 6`이면서 배경 우위 인물이 이겼을 때는 별도의 경고 문구가 나옵니다.

**설명 생성** — 결과는 숫자뿐 아니라 `whyItems`, `fairnessPoints`, `transparency.points` 같은
**자연어 문장 배열**로 나옵니다. 문장 안에 실제 기준 이름과 점수를 끼워 넣어
"왜 이런 결과가 나왔는지"를 스스로 설명합니다. 앱이 가르치려는 설명 가능성(explainability)을
앱 스스로 구현해 보이는 셈입니다.

## 6. 수업 진행을 위한 UI 장치

- **프리셋 버튼 3종** — `fair`(정당 9점·전부 공개), `bias_hidden`(차별 9점 + 차별 기준만 비공개),
  `balanced`(전부 5점). 특히 `bias_hidden`은 `newOpens[c.id] = c.fair`라는 한 줄로
  "차별 기준만 골라 숨긴 AI"를 즉석에서 만들어 냅니다. 교사가 시연할 때 시간을 아껴 줍니다.
- **실시간 합계 바** — 슬라이더를 움직이는 즉시 정당/차별 합계와 공개 개수가 갱신됩니다.
- **수업 집중 보기** — `isFullscreen`이 배경과 최대 너비만 바꿉니다. 브라우저 전체화면 API는 쓰지 않습니다.
- **보고서 복사** — 설정값·판정·성찰문을 텍스트로 조립해 `navigator.clipboard`로 복사합니다.
  패들렛이나 구글 클래스룸에 붙여넣는 용도이며, 저장 기능이 없는 앱의 결과물 회수 수단입니다.
- **DOM id 부여** — `#run-simulation-btn`, `#slider-{id}`, `#toggle-open-{id}` 등 조작 요소에
  고정 id가 붙어 있어 외부 스크립트나 자동 테스트로 잡기 쉽습니다.

## 7. 이식하면서 손본 것

원본을 그대로 옮기되, 명확한 결함만 고쳤습니다. 로직과 문구는 건드리지 않았습니다.

| 항목 | 원본 | 이 저장소 |
| --- | --- | --- |
| `animate-fade-in` | `App.tsx`·모달에서 쓰지만 **정의가 없어 동작하지 않음** | `index.css`에 keyframes 정의, `prefers-reduced-motion` 대응 추가 |
| 미사용 의존성 | `@google/genai`·`express`·`dotenv`·`motion`·`tsx`·`autoprefixer`·`esbuild`·`@types/express` | 코드에서 전혀 쓰이지 않아 제거 |
| 타입 패키지 | `@types/react`·`@types/react-dom` 누락 | 추가 |
| 패키지 이름 | `react-example` | `ai-ethics-simulator` |
| 미사용 아이콘 import | `HelpCircle`·`Share2`·`ArrowRight` 등 | 제거 |
| AI Studio 전용 파일 | `metadata.json`, `.env.example`, `public/assets/aistudio/` | 이 저장소에서는 불필요하여 제외 |
| `vite.config.ts` 주석 | 인코딩 깨짐 | 정리 |

## 8. 구조상 남아 있는 결합

- `Scenario['id']`가 `'hire' | 'med' | 'scholarship'` 리터럴 유니온입니다.
  시나리오를 추가하려면 `types.ts`와 `App.tsx`의 `useState` 제네릭, 콜백 시그니처를 같이 고쳐야 합니다.
  `ScenarioSelector`의 `scenarioIcons` 맵에도 항목을 추가해야 합니다.
  `SCENARIOS` 키에서 타입을 유도하면(`keyof typeof SCENARIOS`) 이 결합이 사라집니다.
- 판정 문턱값(4, 10, 70%)과 격차 계수 6이 `evaluator.ts`에 상수로 박혀 있습니다.
  시나리오별로 기준 개수가 달라지면 같은 문턱값이 다르게 작동합니다. 현재는 셋 다 5개라 문제되지 않습니다.
- 진단 문구가 코드 안에 하드코딩되어 있어 다국어화나 학년별 어휘 조정에는 추출이 필요합니다.
