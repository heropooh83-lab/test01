# AI 윤리 판단 기준 시뮬레이터

정답이 없는 문제 앞에서 AI가 무엇을 기준으로 결정해야 하는지 탐구하는 수업용 웹앱입니다.
학생이 판단 기준의 **가중치**와 **공개 여부**를 직접 조절하면, 그 설정이 만들어 내는
**공정성**과 **투명성**의 결과를 즉시 진단해 보여줍니다.

`heropooh83-lab/A2026-AI-Ethics` (커밋 `a3a3bbd`)의 구조를 분석해 이식한 저장소입니다.
원본이 어떻게 작동하고 구성되어 있는지는 [ARCHITECTURE.md](./ARCHITECTURE.md)에 정리했습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

| 스크립트 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 (포트 3000) |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | `tsc --noEmit` 타입 검사 |

## 수업 흐름

1. **상황 선택** — 채용 심사 / 응급실 우선순위 / 장학생 선발 중 하나를 고릅니다.
2. **기준 설정** — 기준별 중요도를 0~10으로 정하고, 각 기준을 대중에 공개할지 결정합니다.
3. **진단** — 종합 판정, 두 집단의 유불리 격차, 은폐된 차별 기준 여부를 확인합니다.
4. **성찰** — 가상 인물 2명의 합격 결과가 뒤바뀌는 것을 보고 토의한 뒤, 보고서를 복사해 제출합니다.

빠른 실험 버튼으로 "완전 공정·투명", "차별 기준 은폐", "균등(5점)" 상태를 한 번에 만들 수 있어
교사 시연에 바로 쓸 수 있습니다.

## 구조

```
src/
├── types.ts              도메인 타입
├── data/scenarios.ts     시나리오 3종 (순수 데이터)
├── utils/evaluator.ts    평가 엔진 (React 비의존 순수 함수)
└── components/           표현 전용 컴포넌트 7개
```

상태는 `App.tsx`에만 있고, 계산은 `evaluateSimulation()` 순수 함수 하나가 담당하며,
컴포넌트는 props를 받아 그리기만 합니다. 시나리오 추가는 `data/scenarios.ts` 편집으로 시작합니다.

## 기술 스택

Vite 6 · React 19 · TypeScript · Tailwind CSS v4 · lucide-react.
서버와 외부 API 호출이 없어 정적 호스팅만으로 배포됩니다 (`vercel.json`에 SPA 리라이트 포함).

## 배포 (Vercel)

Vercel 프로젝트: https://vercel.com/jh-lab1/test012

`main` 브랜치가 프로덕션 배포 대상입니다. `main`에 푸시하면 자동으로 재배포됩니다.

`vercel.json`에 프레임워크, 빌드 명령, 출력 디렉터리를 명시해 두었으므로 별도 설정 없이 배포됩니다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Root Directory | 저장소 루트 (비워 둠) |

**404: NOT_FOUND 가 뜬다면** 대부분 Vercel이 바라보는 브랜치에 앱 코드가 없는 경우입니다.
Vercel은 기본적으로 `main` 브랜치를 프로덕션으로 배포하므로, 앱이 다른 브랜치에만 있으면
빌드 결과물이 비어 404가 납니다. Vercel 프로젝트의 Settings → Git → Production Branch가
실제 코드가 있는 브랜치를 가리키는지 확인하세요.

SPA 새로고침 시 404가 나는 경우는 `vercel.json`의 rewrites 규칙이 처리합니다.
