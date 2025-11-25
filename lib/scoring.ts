import {
  Decision,
  DecisionResult,
  Factor,
  FactorAxiomPair,
  FactorScore,
  StrengthBand,
} from "./models";
import {
  DEFAULT_AXIOM_WEIGHTS,
  DEFAULT_SOCIAL_WEIGHTS,
  DEFAULT_MORAL_HALF_LIFE_YEARS,
  RELATIVE_STRENGTH_THRESHOLDS,
} from "./constants";
import { computeEffectiveDuration } from "./time";

const strengthBand = (total: number, sumAbs: number): StrengthBand => {
  if (sumAbs === 0) return "neutral";
  const ratio = Math.abs(total) / sumAbs;
  if (total > 0) {
    if (ratio >= RELATIVE_STRENGTH_THRESHOLDS.strong) return "strong_yes";
    if (ratio >= RELATIVE_STRENGTH_THRESHOLDS.medium) return "medium_yes";
    return "weak_yes";
  } else if (total < 0) {
    if (ratio >= RELATIVE_STRENGTH_THRESHOLDS.strong) return "strong_no";
    if (ratio >= RELATIVE_STRENGTH_THRESHOLDS.medium) return "medium_no";
    return "weak_no";
  }
  return "neutral";
};

export const calculateEffectiveScale = (
  factor: Factor,
  socialWeights = DEFAULT_SOCIAL_WEIGHTS
): number => {
  return factor.scale_groups.reduce((acc, group) => {
    const weight = socialWeights[group.group_type] ?? 0.3;
    return acc + group.count * weight;
  }, 0);
};

export const calculateAxiomPairScore = (
  pair: FactorAxiomPair,
  effectiveScale: number,
  userAxiomWeight: number,
  moralHalfLifeYears: number
): number => {
  const teff = computeEffectiveDuration(
    pair.time_type,
    pair.duration_years ?? null,
    pair.physical_half_life_years ?? null,
    moralHalfLifeYears
  );
  const impactOverTime = pair.intensity_per_year * teff;
  return (
    userAxiomWeight *
    impactOverTime *
    pair.confidence *
    pair.polarity *
    effectiveScale
  );
};

export const calculateFactorScore = (
  factor: Factor,
  axiomWeights = DEFAULT_AXIOM_WEIGHTS,
  socialWeights = DEFAULT_SOCIAL_WEIGHTS,
  moralHalfLifeYears = DEFAULT_MORAL_HALF_LIFE_YEARS
): FactorScore => {
  const effectiveScale = calculateEffectiveScale(factor, socialWeights);

  const axiom_scores: Record<string, number> = {};
  let total = 0;

  for (const pair of factor.axiom_pairs) {
    const userWeight = axiomWeights[pair.axiom_id] ?? 0.5;
    const score = calculateAxiomPairScore(
      pair,
      effectiveScale,
      userWeight,
      moralHalfLifeYears
    );
    axiom_scores[pair.axiom_id] = score;
    total += score;
  }

  return {
    factor_id: factor.id,
    factor_name: factor.name,
    axiom_scores,
    total_score: total,
  };
};

export const scoreDecision = (
  decision: Decision,
  axiomWeights = DEFAULT_AXIOM_WEIGHTS,
  socialWeights = DEFAULT_SOCIAL_WEIGHTS,
  moralHalfLifeYears = DEFAULT_MORAL_HALF_LIFE_YEARS
): DecisionResult => {
  const factor_scores = decision.factors.map((factor) =>
    calculateFactorScore(factor, axiomWeights, socialWeights, moralHalfLifeYears)
  );

  const total_score = factor_scores.reduce(
    (acc, fs) => acc + fs.total_score,
    0
  );
  const sum_abs = factor_scores.reduce(
    (acc, fs) => acc + Math.abs(fs.total_score),
    0
  );

  const result =
    total_score > 0 ? "YES" : total_score < 0 ? "NO" : "NEUTRAL";

  const top_contributors = [...factor_scores]
    .sort((a, b) => Math.abs(b.total_score) - Math.abs(a.total_score))
    .slice(0, 5)
    .map((fs) => fs.factor_id);

  // Simple warnings: extreme confidence
  const warnings: string[] = [];
  for (const factor of decision.factors) {
    for (const pair of factor.axiom_pairs) {
      if (pair.confidence >= 0.95 || pair.confidence <= 0.05) {
        warnings.push(
          `Factor '${factor.name}' has extreme confidence (${pair.confidence}) on ${pair.axiom_id}`
        );
      }
    }
  }

  return {
    decision_id: decision.id,
    total_score,
    result,
    strength: strengthBand(total_score, sum_abs),
    factor_scores,
    top_contributors,
    warnings,
  };
};

export const formatScoreBreakdown = (
  result: DecisionResult,
  decision: Decision,
  moralHalfLifeYears = DEFAULT_MORAL_HALF_LIFE_YEARS,
  axiomWeights = DEFAULT_AXIOM_WEIGHTS,
  socialWeights = DEFAULT_SOCIAL_WEIGHTS
): string => {
  const lines: string[] = [];
  lines.push(`## Decision: ${decision.question}`);
  lines.push(`**Result: ${result.result} (${result.strength})**`);
  lines.push(`**Total Score: ${result.total_score.toFixed(2)}**`);
  lines.push("");
  lines.push("### Factor Breakdown");
  lines.push("");

  const sorted = [...result.factor_scores].sort(
    (a, b) => Math.abs(b.total_score) - Math.abs(a.total_score)
  );

  for (const fs of sorted) {
    const factor = decision.factors.find((f) => f.id === fs.factor_id);
    if (!factor) continue;
    const dir = fs.total_score > 0 ? "+" : "";
    lines.push(`#### ${factor.name}`);
    lines.push(`Contribution: ${dir}${fs.total_score.toFixed(2)}`);
    for (const [axiomId, score] of Object.entries(fs.axiom_scores)) {
      const pair = factor.axiom_pairs.find((p) => p.axiom_id === axiomId);
      if (!pair) continue;
      const teff = computeEffectiveDuration(
        pair.time_type,
        pair.duration_years ?? null,
        pair.physical_half_life_years ?? null,
        moralHalfLifeYears
      );
      const impact = pair.intensity_per_year * teff;
      const sign = score > 0 ? "+" : "";
      lines.push(
        `- ${axiomId}: ${sign}${score.toFixed(2)} (I=${pair.intensity_per_year}, T_eff=${teff.toFixed(
          2
        )}, I x T_eff=${impact.toFixed(2)}, C=${pair.confidence}, P=${pair.polarity})`
      );
    }
    lines.push("");
  }

  if (result.warnings.length) {
    lines.push("### Warnings");
    for (const w of result.warnings) lines.push(`- ${w}`);
  }

  lines.push("");
  lines.push("### Defaults Used");
  lines.push(
    `- Moral half-life: ${moralHalfLifeYears} years | Social weights: ${JSON.stringify(
      socialWeights
    )}`
  );
  lines.push(`- Axiom weights: ${JSON.stringify(axiomWeights)}`);

  return lines.join("\n");
};
