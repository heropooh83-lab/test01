# Vercel로 배포하기 (처음 한 번, 10분 정도)

## 1단계. 프로젝트 만들기

1. 아래 링크를 엽니다. (GitHub 계정으로 Vercel에 로그인해요)

   https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheropooh83-lab%2Ftest01%2Ftree%2Fred-wall-vercel&project-name=red-wall-class&repository-name=red-wall-class&env=ADMIN_PIN&envDescription=%EA%B5%90%EC%82%AC%20PIN(%EC%88%AB%EC%9E%90%204%EC%9E%90%EB%A6%AC%20%EC%9D%B4%EC%83%81)%EC%9D%84%20%EC%A0%81%EC%96%B4%20%EC%A3%BC%EC%84%B8%EC%9A%94.%20%ED%99%9C%EB%8F%99%20%EA%B2%B0%EA%B3%BC%20%EC%A7%80%EC%9A%B0%EA%B8%B0%EC%97%90%20%EC%93%B0%EC%9D%B4%EB%8B%88%20%ED%95%99%EC%83%9D%EC%97%90%EA%B2%8C%20%EC%95%8C%EB%A0%A4%20%EC%A3%BC%EC%A7%80%20%EB%A7%88%EC%84%B8%EC%9A%94.

2. 저장소 이름(`red-wall-class`)을 확인하고 `Create`를 누릅니다.
3. `ADMIN_PIN` 칸에 교사 PIN(숫자 4자리 이상)을 적고 `Deploy`를 누릅니다.
4. 배포가 끝나면 주소(`https://red-wall-class-○○○.vercel.app`)가 생깁니다.

(링크가 안 열리면: Vercel에서 `Add New… → Project`로 `heropooh83-lab/test01` 저장소를 가져오고,
 Framework Preset은 `Other`, Environment Variables에 `ADMIN_PIN`을 넣은 뒤,
 `Settings → Git → Production Branch`를 `red-wall-vercel`로 바꿔 다시 배포하세요.)

## 2단계. 공유 저장소 연결 (꼭 필요해요)

Vercel은 서버가 계속 켜져 있지 않아서, 학생들의 벽돌을 저장할 곳(Redis)을 따로 연결해야 해요.

1. 만든 프로젝트 화면에서 위쪽 `Storage` 탭을 누릅니다.
2. `Create Database`(또는 `Connect Store`)에서 `Upstash` → `Redis`를 고르고 무료(Free) 요금제로 만듭니다.
3. `Connect to Project`에서 이 프로젝트를 선택하고 모든 환경(Production, Preview, Development)에 연결합니다.
4. `Deployments` 탭 → 맨 위 배포의 `⋯` → `Redeploy`를 눌러 다시 배포합니다.

## 3단계. 확인하기

1. 배포된 주소를 열면 위쪽에 `공유 중 · 우리반`이 보여야 해요.
2. 다른 기기(또는 다른 브라우저)에서 같은 주소를 열고 벽돌을 쌓아 보세요. 서로 보이면 성공이에요.
3. `공유할 수 없음` + "공유 저장소가 아직 설정되지 않았어요"가 보이면 2단계를 끝낸 뒤 다시 배포하지 않은 거예요.

## 수업에서 쓸 때

- 학생들은 주소만 열면 자동으로 같은 반(`우리반`)에 연결돼요. 반을 나누려면 위쪽 `공유` 버튼에서 반 코드(예: 5-1)를 입력하게 하세요.
- 교사용 서랍(`교사용` 버튼)에서 교사 PIN을 한 번 입력해 두면 `활동 결과 지우기`를 쓸 수 있어요. PIN 없이는 지울 수 없어요.
- 데이터는 Redis에 남아 있어서 서버가 잠들어도 사라지지 않아요. 새 수업 전에 `활동 결과 지우기`로 비워 주세요.

## 알아 둘 점

- 학생 기기는 4초마다 새 소식을 확인해요. 학생 30명이 40분 쓰면 Redis 명령이 7만 번쯤 쓰여요. Upstash 무료 요금제는 한 달 50만 번 정도라서 한 달에 대여섯 번 수업까지 여유가 있어요. 더 자주 쓰면 Vercel의 `Settings → Environment Variables`에 `POLL_MS=6000`을 추가해 간격을 늘리세요.
- 주소를 아는 사람은 누구나 들어올 수 있어요. 학생 이름은 실명 대신 별명을 쓰게 하는 것을 권해요.
- 무료 요금제의 한도와 약관은 바뀔 수 있어요. Vercel과 Upstash 화면의 안내를 확인해 주세요.
