import { Scenario, SimulationResult } from '../types';

export function evaluateSimulation(
  scenario: Scenario,
  values: Record<string, number>,
  opens: Record<string, boolean>
): SimulationResult {
  let fairSum = 0;
  let unfairSum = 0;
  const unfairUsed: { id: string; label: string; val: number }[] = [];
  const fairUsed: { id: string; label: string; val: number }[] = [];

  scenario.criteria.forEach((c) => {
    const val = values[c.id] ?? 5;
    if (c.fair) {
      fairSum += val;
      if (val >= 6) fairUsed.push({ id: c.id, label: c.label, val });
    } else {
      unfairSum += val;
      if (val > 3) unfairUsed.push({ id: c.id, label: c.label, val });
    }
  });

  const totalSum = fairSum + unfairSum || 1;
  const fairRatio = Math.round((fairSum / totalSum) * 100);
  const unfairRatio = 100 - fairRatio;

  // Gap calculation based on unfair criteria weighting
  const gap = Math.min(unfairSum * 6, 70);
  const group1Score = Math.min(95, 55 + Math.round(gap / 2));
  const group2Score = Math.max(5, 55 - Math.round(gap / 2));
  const diff = Math.abs(group1Score - group2Score);

  // Verdict calculation
  let verdict: SimulationResult['verdict'];
  if (unfairSum <= 4 && fairRatio >= 70) {
    verdict = {
      status: 'good',
      title: '✅ 비교적 공정합니다',
      description: '실력과 상황 같은 정당한 기준을 중심으로 판단하고 있어요. 불합리한 집단 간 격차가 최소화되었습니다.'
    };
  } else if (unfairSum <= 10) {
    verdict = {
      status: 'warn',
      title: '⚠️ 주의가 필요합니다',
      description: '판단과 관계없는 배경 요소나 편향 지표가 결과에 실질적인 영향을 미치고 있습니다.'
    };
  } else {
    verdict = {
      status: 'bad',
      title: '❌ 불공정합니다',
      description: '편견·차별이 될 수 있는 기준이 크게 반영되어 두 집단 간 유불리 격차가 매우 심각합니다.'
    };
  }

  // Why explanation list
  const whyItems: SimulationResult['whyItems'] = [];
  const favoredGroup = group1Score >= group2Score ? scenario.groups[0] : scenario.groups[1];

  if (unfairUsed.length > 0) {
    const sorted = [...unfairUsed].sort((a, b) => b.val - a.val);
    sorted.forEach((item) => {
      whyItems.push({
        type: 'negative',
        text: `판단과 관계없는 '${item.label}' 기준을 높게 반영하여, ${favoredGroup} 집단이 부당하게 우대되었습니다.`,
        highlightPill: `${item.label} = ${item.val}점`
      });
    });

    whyItems.push({
      type: 'summary',
      text: `이로 인해 두 집단의 유불리 격차가 ${diff}%p까지 벌어졌습니다. 차별 위험 기준의 값을 낮추면 격차가 즉시 줄어듭니다.`,
      highlightPill: `격차 ${diff}%p`
    });
  } else {
    whyItems.push({
      type: 'positive',
      text: `차별 위험 기준을 모두 낮게(3점 이하) 설정하였기 때문에, 집단 간 격차가 ${diff}%p로 매우 작고 공평하게 유지되었습니다. 👍`,
      highlightPill: `격차 ${diff}%p (안정)`
    });
  }

  if (fairUsed.length > 0) {
    const fairLabels = fairUsed.map((c) => c.label.split('(')[0].trim()).join(', ');
    whyItems.push({
      type: 'positive',
      text: `'${fairLabels}' 등의 객관적이고 정당한 기준을 중요하게 반영한 것은 윤리적으로 매우 훌륭한 선택입니다.`,
      highlightPill: '정당한 기준 중점'
    });
  }

  // Fairness points
  const fairnessPoints: SimulationResult['fairnessPoints'] = [
    { text: `정당한 기준 반영 비율: ${fairRatio}% (차별 위험 기준 ${unfairRatio}%)` },
    {
      text: `두 집단 간 유불리 격차: ${diff}%p ${diff > 30 ? '⚠️ (격차가 심각하여 구조적 차별 위험)' : '✅ (비교적 균형적)'}`,
      isRisk: diff > 30
    }
  ];

  if (unfairUsed.length > 0) {
    const unfairLabels = unfairUsed.map((c) => c.label.split('(')[0].trim()).join(', ');
    fairnessPoints.push({
      text: `차별 위험 기준으로 지목된 항목: [${unfairLabels}]`,
      isRisk: true
    });
  } else {
    fairnessPoints.push({
      text: '차별이나 편견을 유발할 위험 기준을 높게 반영하지 않았습니다. 👍',
      isRisk: false
    });
  }

  // Transparency assessment
  const hiddenAll = scenario.criteria.filter((c) => !opens[c.id]);
  const hiddenUnfair = hiddenAll.filter((c) => !c.fair && (values[c.id] ?? 5) > 3);
  const hiddenFair = hiddenAll.filter((c) => c.fair);
  const openCount = scenario.criteria.filter((c) => opens[c.id] !== false).length;
  const totalCount = scenario.criteria.length;
  const openRatio = Math.round((openCount / totalCount) * 100);

  let transStatus: SimulationResult['transparency']['status'] = 'transparent';
  let transHeadline = '';
  const transPoints: SimulationResult['transparency']['points'] = [
    { text: `전체 기준 중 ${openCount}/${totalCount}개(${openRatio}%)를 대중에 공개하기로 결정했습니다.` }
  ];

  if (hiddenUnfair.length > 0) {
    transStatus = 'hidden_risk';
    transHeadline = '🚨 투명하지 않습니다: 공개하기 떳떳하지 못한 차별 기준을 은폐하고 있습니다!';
    const hiddenLabels = hiddenUnfair.map((c) => c.label.split('(')[0].trim()).join(', ');
    transPoints.push({
      text: `비공개로 은폐된 차별 위험 기준: [${hiddenLabels}] — 외부에 공개하면 지탄받을 위험한 잣대를 몰래 AI 알고리즘에 숨겨 쓰고 있습니다.`,
      isWarning: true
    });
    transPoints.push({
      text: '💡 진정으로 정당한 기준이라면 감출 이유가 없습니다. 공개하기 곤란하다면, 그 기준을 AI 알고리즘에서 완전히 제거하는 것이 윤리적으로 올바릅니다.',
      isWarning: true
    });
  } else if (hiddenAll.length > 0) {
    transStatus = 'partial';
    transHeadline = '🤔 조금 아쉽습니다: 굳이 숨길 필요 없는 정당한 기준까지 비공개로 두었습니다.';
    if (hiddenFair.length > 0) {
      const fairHiddenLabels = hiddenFair.map((c) => c.label.split('(')[0].trim()).join(', ');
      transPoints.push({
        text: `비공개된 정당한 기준: [${fairHiddenLabels}] — 충분히 떳떳한 역량/의학 지표이므로 사용자에게 공개하여 신뢰를 높여야 합니다.`
      });
    }
  } else {
    transStatus = 'transparent';
    transHeadline = '✅ 매우 투명합니다! 모든 판단 기준과 가중치를 숨김없이 공개했습니다.';
    transPoints.push({
      text: '모든 판단 기준을 대중에 투명하게 공개하면, 결정을 통보받는 대상자도 그 결과를 신뢰하고 수용할 수 있습니다.'
    });
  }

  if (unfairUsed.length === 0 && hiddenUnfair.length === 0) {
    transPoints.push({
      text: '🌟 [공정성 & 투명성 만점] 떳떳하고 정당한 기준만 사용하며, 아무것도 은폐하지 않은 모범적인 AI 모델입니다!'
    });
  }

  // Calculate virtual profiles comparison
  const [prof1, prof2] = scenario.virtualProfiles;
  let prof1Weighted = 0;
  let prof2Weighted = 0;
  let weightSum = 0;

  scenario.criteria.forEach((c) => {
    const w = values[c.id] ?? 5;
    weightSum += w;
    prof1Weighted += (prof1.scores[c.id] ?? 0) * w;
    prof2Weighted += (prof2.scores[c.id] ?? 0) * w;
  });

  const prof1Total = weightSum > 0 ? Math.round((prof1Weighted / (weightSum * 10)) * 100) : 50;
  const prof2Total = weightSum > 0 ? Math.round((prof2Weighted / (weightSum * 10)) * 100) : 50;
  const winnerId = prof1Total >= prof2Total ? prof1.id : prof2.id;
  const winnerName = prof1Total >= prof2Total ? prof1.name : prof2.name;

  let virtualAnalysis = '';
  if (unfairSum > 6 && prof2Total > prof1Total) {
    virtualAnalysis = `⚠️ 차별 위험 기준(배경/학벌/자산/성별 등)의 가중치가 높아져, 본질적 역량이 뛰어난 ${prof1.name} 대신 배경 지표가 우세한 ${prof2.name}가 최종 선발(우대)되었습니다. 이것이 바로 현실의 AI 편향 사례입니다!`;
  } else if (prof1Total > prof2Total) {
    virtualAnalysis = `✅ 공정하고 정당한 본질 지표에 집중한 결과, 뛰어난 실무/상황 대처 능력을 갖춘 ${prof1.name}가 우수한 점수(${prof1Total}점)로 합당하게 선정되었습니다.`;
  } else {
    virtualAnalysis = `두 가상 후보의 종합 점수가 비슷하게 산출되었습니다 (${prof1Total}점 vs ${prof2Total}점). 기준 가중치를 재조정해 차이를 관찰해 보세요.`;
  }

  return {
    fairSum,
    unfairSum,
    totalSum,
    fairRatio,
    unfairRatio,
    group1Score,
    group2Score,
    diff,
    verdict,
    whyItems,
    fairnessPoints,
    transparency: {
      openCount,
      totalCount,
      openRatio,
      status: transStatus,
      headline: transHeadline,
      points: transPoints
    },
    virtualCaseComparison: {
      profile1Total: prof1Total,
      profile2Total: prof2Total,
      winnerId,
      analysisText: virtualAnalysis
    }
  };
}
