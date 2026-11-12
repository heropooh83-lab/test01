# 인터넷 주소로 배포하기 (Render 무료 서버)

이렇게 하면 `https://red-wall-class-○○○.onrender.com` 같은 주소가 생겨요.
학생들은 로그인 없이 이 주소만 열면 됩니다. 처음 한 번만 20분 정도 걸려요.

## 1단계. GitHub에 파일 올리기

1. https://github.com 에 가입하고 로그인합니다.
2. 오른쪽 위 `+` → `New repository`를 누르고 이름을 `red-wall-class`로 정한 뒤 `Create repository`를 누릅니다.
3. 새 화면에서 `uploading an existing file` 링크를 누릅니다.
4. 압축을 푼 폴더 안의 **모든 파일과 `public` 폴더**를 끌어다 놓습니다. (`server.js`, `package.json`, `render.yaml`, `public` 등)
5. 아래쪽 `Commit changes`를 누릅니다.

## 2단계. Render에서 서버 만들기

1. https://render.com 에서 `Get Started`를 누르고 GitHub 계정으로 로그인합니다.
2. `New +` → `Blueprint`를 고르고 방금 만든 `red-wall-class` 저장소를 선택합니다.
3. `ADMIN_PIN` 값을 물어보면 **교사 PIN(숫자 4자리 이상)**을 입력합니다. 학생에게 알려 주지 마세요.
4. `Apply`를 누르고 배포가 끝날 때까지 기다립니다. (몇 분)
5. 위쪽에 나온 `https://…onrender.com` 주소가 학생에게 알려 줄 주소입니다.

(`Blueprint`가 안 보이면 `New +` → `Web Service`에서 저장소를 고르고, Start Command에 `node server.js`, Instance Type에 `Free`, Environment에 `ADMIN_PIN`을 넣어도 같아요.)

## 3단계. 수업 전후

- **수업 5분 전에 주소를 한 번 열어 두세요.** 무료 서버는 15분 동안 아무도 안 쓰면 잠들고, 다시 열 때 1분쯤 걸려요.
- 학생 기기에서 주소를 열면 자동으로 "공유 중 · 우리반"이 돼요. 반을 나누려면 위쪽 `공유` 버튼에서 반 코드(예: 5-1)를 입력하게 하세요.
- 교사용 서랍(`교사용` 버튼)에서 교사 PIN을 한 번 입력해 두면 `활동 결과 지우기`를 쓸 수 있어요.

## 꼭 알아 둘 점

- **저장 기간**: 무료 서버는 잠들거나 다시 시작될 때 저장 파일이 지워질 수 있어요. 수업 시간 안에 쓰고, 남기고 싶은 화면은 캡처해 두세요. 오래 남기려면 Render 유료 디스크를 붙이고 환경변수 `DATA_FILE`을 `/data/data.json`처럼 디스크 경로로 지정해야 해요.
- **접근**: 주소를 아는 사람은 누구나 들어올 수 있어요. 학생 이름은 실명 대신 별명을 쓰게 하는 것을 권해요.
- **지우기 보호**: PIN을 설정하면 PIN 없이는 데이터를 지울 수 없어요. 쌓기와 이모티콘 고르기는 누구나 할 수 있어요.
- **요청 제한**: 한 기기에서 1분에 쓰기 요청이 240번을 넘으면 잠시 막혀요. 서버에 저장되는 문서는 최대 2만 개예요.
- Railway, Koyeb 같은 다른 호스팅도 `node server.js`를 시작 명령으로 지정하면 같은 방식으로 쓸 수 있어요.
