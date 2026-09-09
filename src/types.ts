export interface Criterion {
  id: string;
  label: string;
  fair: boolean;
  description: string;
  categoryTag: string; // e.g. "직무 역량", "배경 요소", "의학적 지표"
}

export interface VirtualProfile {
  id: string;
  name: string;
  groupName: string;
  avatarColor: string;
  summary: string;
  scores: Record<string, number>; // criterionId -> value (0~10)
}

export interface Scenario {
  id: 'hire' | 'med' | 'scholarship';
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  ethicalDilemma: string;
  groups: [string, string];
  groupDescriptions: [string, string];
  criteria: Criterion[];
  virtualProfiles: [VirtualProfile, VirtualProfile];
  discussionQuestions: string[];
}

export interface SimulationResult {
  fairSum: number;
  unfairSum: number;
  totalSum: number;
  fairRatio: number;
  unfairRatio: number;
  group1Score: number;
  group2Score: number;
  diff: number;
  verdict: {
    status: 'good' | 'warn' | 'bad';
    title: string;
    description: string;
  };
  whyItems: {
    type: 'negative' | 'positive' | 'summary';
    text: string;
    highlightPill?: string;
  }[];
  fairnessPoints: {
    text: string;
    isRisk?: boolean;
  }[];
  transparency: {
    openCount: number;
    totalCount: number;
    openRatio: number;
    status: 'transparent' | 'partial' | 'hidden_risk';
    headline: string;
    points: {
      text: string;
      isWarning?: boolean;
    }[];
  };
  virtualCaseComparison: {
    profile1Total: number;
    profile2Total: number;
    winnerId: string;
    analysisText: string;
  };
}
