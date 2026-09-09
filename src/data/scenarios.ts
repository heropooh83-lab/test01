import { Scenario } from '../types';

export const SCENARIOS: Record<string, Scenario> = {
  hire: {
    id: 'hire',
    badge: '💼 채용 심사',
    title: '기업 AI 채용 지원자 선발',
    subtitle: '수천 명의 서류를 AI가 단 몇 초 만에 심사할 때, 무엇을 보아야 할까요?',
    desc: '한 기업이 대규모 공개 채용에서 AI 서류 심사를 도입했습니다. 지원자들은 실무 능력, 직무 경력뿐 아니라 성별, 출신 지역, 출신 학교 등 다양한 배경을 갖고 있습니다. AI의 가중치 설정에 따라 선발 결과가 극적으로 뒤바뀝니다.',
    ethicalDilemma: '“학벌이나 출신 지역 같은 배경 지표가 실제 업무 역량보다 우선시되어도 괜찮을까요? 회사는 이 기준을 지원자들에게 투명하게 공개할 수 있을까요?”',
    groups: ['A그룹 지원자 (다수·배경 우위군)', 'B그룹 지원자 (소수·비수도권 등 취약군)'],
    groupDescriptions: [
      '수도권 명문대 출신, 기존 합격자 데이터베이스에 다수를 차지했던 배경층',
      '비수도권 대학 또는 비전공자이지만 실무 역량과 열정을 갖춘 지원자층'
    ],
    criteria: [
      {
        id: 'skill',
        label: '직무 실력·능력 (포트폴리오/코딩테스트)',
        fair: true,
        categoryTag: '직무 본질 역량',
        description: '실제 수행할 직무와 직접 연관된 기술 시험, 포트폴리오, 과제 수행 평가'
      },
      {
        id: 'exp',
        label: '경력 연수 및 직무 관련 프로젝트 경험',
        fair: true,
        categoryTag: '실제 경력·경험',
        description: '유관 직무에서 실제로 일하거나 협업 프로젝트를 이끌어본 기간 및 경험'
      },
      {
        id: 'gender',
        label: '성별 (남성/여성 선호 편향)',
        fair: false,
        categoryTag: '인구학적 배경',
        description: '과거 남성 중심 직군 데이터 학습 등으로 인한 특정 성별 우대나 차별'
      },
      {
        id: 'region',
        label: '출신 지역 (수도권 거주 여부 등)',
        fair: false,
        categoryTag: '지리적 편견',
        description: '출퇴근 거리나 수도권 소재 거주 여부 등 본인 노력과 무관한 환경 요소'
      },
      {
        id: 'school',
        label: '출신 학교 이름값 (학벌·간판)',
        fair: false,
        categoryTag: '배경 간판',
        description: '실제 지원자의 직무 역량과 무관하게 대학의 서열이나 유명세를 점수화'
      }
    ],
    virtualProfiles: [
      {
        id: 'p1',
        name: '지원자 이서연 (B그룹)',
        groupName: 'B그룹',
        avatarColor: 'from-amber-500 to-orange-600',
        summary: '지방 국립대 출신, 실무 코딩테스트 만점, 오픈소스 프로젝트 리드 2년',
        scores: {
          skill: 9,
          exp: 8,
          gender: 3, // 성별 편향 점수
          region: 2, // 비수도권
          school: 3  // 지방대
        }
      },
      {
        id: 'p2',
        name: '지원자 최준호 (A그룹)',
        groupName: 'A그룹',
        avatarColor: 'from-indigo-500 to-blue-600',
        summary: '수도권 최상위 명문대 출신, 인턴 2개월, 코딩테스트 기초 통과',
        scores: {
          skill: 4,
          exp: 3,
          gender: 8, // 과거 우대 데이터
          region: 9, // 강남 거주
          school: 10 // 최상위 학벌
        }
      }
    ],
    discussionQuestions: [
      '내가 정한 기준 중 직무 수행에 ‘진짜 필수적인 것’과 ‘차별이 될 수 있는 것’은 무엇인가요?',
      '만약 불합격한 지원자가 “AI가 나를 왜 탈락시켰나요?”라고 묻는다면, 현재 기준을 그대로 공개할 수 있나요?',
      '회사 입장에서 “과거 합격자 데이터에 명문대가 많아서 AI가 스스로 배운 것”이라고 변명한다면, 이는 정당할까요?'
    ]
  },
  med: {
    id: 'med',
    badge: '🏥 의료 triage',
    title: '응급실 AI 중증도 및 진료 우선순위 결정',
    subtitle: '응급실 병상이 부족할 때, AI는 누구를 먼저 살려야 할까요?',
    desc: '재난 상황 또는 응급실 병상 포화 상태에서 여러 환자가 동시에 내원했습니다. 즉각적인 조치가 필요한 순간, AI가 환자의 생체 신호, 위급도, 지불 능력, 사회적 지위 등을 종합해 우선순위를 추천합니다.',
    ethicalDilemma: '“생명의 무게는 평등해야 할까요, 아니면 사회적 기여도나 치료비 지불 여력에 따라 우선순위가 달라져도 될까요? 숨겨진 차별 기준이 존재할 때 환자는 이를 알 권리가 있을까요?”',
    groups: ['일반 환자군 (안정적 지위·지불력)', '취약 환자군 (노인·저소득·사회적 약자)'],
    groupDescriptions: [
      '경제적 지불 능력이 충분하고 사회적 배경이 튼튼한 일반 성인 환자군',
      '고령자, 기초생활수급자, 의료 취약계층 등 추가 지원이 절실한 환자군'
    ],
    criteria: [
      {
        id: 'severe',
        label: '증상의 위급함 (생체 징후/골든타임)',
        fair: true,
        categoryTag: '의학적 긴급도',
        description: '혈압, 호흡, 심박 등 당장 몇 분 내 생명이 위태로운 객관적 의학 지표'
      },
      {
        id: 'success',
        label: '치료 성공 가능성 및 회복 전망',
        fair: true,
        categoryTag: '의학적 타당도',
        description: '의료진 투입 대비 환자가 회복하여 퇴원할 수 있는 의학적 가능성'
      },
      {
        id: 'age',
        label: '나이 (젊을수록 일방적 우대)',
        fair: false,
        categoryTag: '연령 편향',
        description: '고령 환자라는 이유만으로 치료 순위를 뒤로 미루는 연령 차별'
      },
      {
        id: 'money',
        label: '치료비 지불 능력 (비급여 처치 가능 여부)',
        fair: false,
        categoryTag: '경제적 차별',
        description: '병원 수익 및 고가 약제 지불 여력을 우선순위에 반영'
      },
      {
        id: 'vip',
        label: '사회적 지위·유명세 (VIP 우대)',
        fair: false,
        categoryTag: '특권 우대',
        description: '정치인, 유명인, 고위층 환자에게 비공식 가산점을 주는 행위'
      }
    ],
    virtualProfiles: [
      {
        id: 'p1',
        name: '환자 박할머니 (82세, 취약군)',
        groupName: '취약 환자군',
        avatarColor: 'from-amber-500 to-rose-600',
        summary: '급성 심근경색으로 산소포화도 급락, 기초수급자 독거노인',
        scores: {
          severe: 10,
          success: 7,
          age: 2,
          money: 1,
          vip: 1
        }
      },
      {
        id: 'p2',
        name: '환자 강대표 (45세, 일반군)',
        groupName: '일반 환자군',
        avatarColor: 'from-blue-500 to-indigo-600',
        summary: '단순 경미한 호흡 곤란 및 발열, 대기업 임원 및 VIP 멤버십',
        scores: {
          severe: 4,
          success: 9,
          age: 8,
          money: 10,
          vip: 10
        }
      }
    ],
    discussionQuestions: [
      '응급실에서 "돈이 많은 사람"이나 "유명한 사람"을 먼저 치료하는 알고리즘이 있다면, 이를 환자 보호자에게 공개할 수 있을까요?',
      '비공개로 숨겨둔 기준이 있다면, 왜 당당하게 전광판에 표시하지 못할까요?',
      '한정된 의료 자원에서 공정함이란 과연 무엇일까요? (생존 가능성 vs 긴급함 vs 인간 존엄)'
    ]
  },
  scholarship: {
    id: 'scholarship',
    badge: '🎓 교육 장학',
    title: '대학 AI 장학생 및 특별 지원자 선발',
    subtitle: '미래 인재를 육성하는 장학금, 누구에게 지원해야 가장 정의로울까요?',
    desc: '대학 장학위원회가 AI 알고리즘을 도입해 공익 장학금 수혜자를 자동 심사합니다. 학생들의 학업 열정과 성적, 경제적 형편뿐 아니라 부모의 지위, 사교육 스펙 등이 데이터에 섞여 있습니다.',
    ethicalDilemma: '“부모의 재력이나 사교육으로 만들어진 화려한 스펙이 자립형 학생의 땀방울을 가려도 될까요? 투명성이 결여된 선발은 학생들에게 어떤 박탈감을 줄까요?”',
    groups: ['도전·자립형 학생군 (실제 노력/지원 절실)', '배경 우위형 학생군 (고액 스펙/부모 배경)'],
    groupDescriptions: [
      '아르바이트와 학업을 병행하며 높은 열정과 꿈을 키워가는 학생군',
      '부모의 네트워크와 사교육 컨설팅을 통해 만들어진 스펙을 지닌 학생군'
    ],
    criteria: [
      {
        id: 'effort',
        label: '학업 성취 및 성장 열정 (학점/연구 계획)',
        fair: true,
        categoryTag: '개인 역량·성취',
        description: '학생 본인이 쏟은 학습 노력과 장학금을 통한 향후 학업 계획의 진정성'
      },
      {
        id: 'need',
        label: '경제적 지원 필요도 (가계 소득 분위)',
        fair: true,
        categoryTag: '사회적 형평성',
        description: '학업을 중단하지 않고 이어갈 수 있도록 돕는 실질적 재정 필요성'
      },
      {
        id: 'parents',
        label: '부모의 사회적 직업 및 학교 기여도',
        fair: false,
        categoryTag: '가족 배경',
        description: '학부모의 사회적 권력, 동문 기부금 여력 등을 평가에 반영'
      },
      {
        id: 'asset',
        label: '가족 거주지 주택 가액 및 자산',
        fair: false,
        categoryTag: '자산 편향',
        description: '학생 본인과 무관한 부모의 부동산 자산을 우대 지표로 변칙 적용'
      },
      {
        id: 'extracurricular',
        label: '고액 사교육/해외 어학연수 스펙',
        fair: false,
        categoryTag: '스펙 불평등',
        description: '경제적 여유가 있어야만 참여 가능한 고비용 단기 해외 캠프 등'
      }
    ],
    virtualProfiles: [
      {
        id: 'p1',
        name: '장학생 후보 김민지 (자립군)',
        groupName: '도전·자립형 학생군',
        avatarColor: 'from-emerald-500 to-teal-600',
        summary: '학점 4.2, 주말 편의점 알바 병행, 소득 1분위, AI 공공데이터 연구 계획',
        scores: {
          effort: 9,
          need: 10,
          parents: 1,
          asset: 1,
          extracurricular: 2
        }
      },
      {
        id: 'p2',
        name: '장학생 후보 정우진 (배경군)',
        groupName: '배경 우위형 학생군',
        avatarColor: 'from-purple-500 to-indigo-600',
        summary: '학점 3.5, 해외 서머스쿨 3회, 부모 대형 로펌 파트너, 강남 거주',
        scores: {
          effort: 5,
          need: 2,
          parents: 10,
          asset: 9,
          extracurricular: 10
        }
      }
    ],
    discussionQuestions: [
      '장학금 선발에서 본인의 노력과 무관한 "부모 배경"이 반영된다면, 학교는 이 기준표를 학생들에게 떳떳이 공개할 수 있을까요?',
      '비공개로 선발 기준을 감추는 학교와, 모든 기준과 가중치를 전면 공개하는 학교 중 어디를 더 신뢰하겠습니까?',
      '진정한 공정(Equity)을 위해 AI는 취약 학생을 어떻게 배려해야 할까요?'
    ]
  }
};
