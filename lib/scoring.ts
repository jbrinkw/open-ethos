import {
  Anchor,
  Decision,
  DecisionResult,
  Factor,
  FactorAxiomPair,
  FactorScore,
  MUCalibration,
  SocialClass,
  StrengthBand,
  StakeholderImpact,
  TimeGraphPoint,
  TimeStance,
} from "./models";
import {
  DEFAULT_AXIOM_WEIGHTS,
  DEFAULT_SOCIAL_CLASSES,
  DEFAULT_TIME_STANCE,
  RELATIVE_STRENGTH_THRESHOLDS,
} from "./constants";
import { computeEffectiveDuration } from "./time";
import { getAllAnchors, getIntensityFromAnchor } from "./anchors";

const computeStrengthRatio = (total: number, sumAbs: number): number => {
  if (sumAbs === 0) return 0;
  return Math.abs(total) / sumAbs;
};

const strengthBand = (total: number, sumAbs: number): StrengthBand => {
  if (sumAbs === 0) return "neutral";
  const ratio = computeStrengthRatio(total, sumAbs);
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
  socialClasses: SocialClass[] = DEFAULT_SOCIAL_CLASSES
): number => {
  return factor.scale_groups.reduce((acc, group) => {
    const socialClass = socialClasses.find(
      (c) => c.id === group.social_class_id
    );
    const weight = socialClass?.weight ?? 0.3;
    return acc + group.count * weight;
  }, 0);
};

const computeTeffForProfile = (
  pair: FactorAxiomPair,
  timeStance: TimeStance,
  temporalProfile: Factor["temporal_profile"]
) => {
  // For steady_case_flow: we DON'T use T_eff at all - duration_years is handled separately
  // in the per-case model. Return 1 here as a placeholder (won't be used for case_flow).
  if (temporalProfile === "steady_case_flow") {
    return 1; // Not actually used - case_flow uses duration_years directly
  }
  
  // For steady_structural: T_eff = 1 (per-year flow, no duration)
  if (temporalProfile === "steady_structural") {
    return 1;
  }
  
  // For transition: use time module with user's time stance
  const timeDesc = {
    time_type: pair.time_type ?? "finite",
    duration_years: pair.duration_years ?? 0,
    physical_half_life_years: pair.physical_half_life_years ?? null,
  };
  return computeEffectiveDuration(timeDesc, timeStance);
};

export const calculateAxiomPairScore = (
  pair: FactorAxiomPair,
  effectiveScale: number,
  userAxiomWeight: number,
  timeStance: TimeStance,
  anchors: Anchor[] = [],
  temporalProfile: Factor["temporal_profile"] = "transition"
): number => {
  // Get intensity: either from anchor or directly from pair
  let intensity = pair.intensity_per_year;
  if (pair.anchor_id && anchors.length > 0) {
    const anchorIntensity = getIntensityFromAnchor(
      pair.anchor_id,
      pair.axiom_id,
      anchors
    );
    if (anchorIntensity > 0) {
      intensity = anchorIntensity;
    }
  }

  // For case_flow: use duration_years directly (linear, no decay)
  // This is the per-axiom contribution for factor_score
  // The full case_flow formula multiplies by cases_per_year in scoreDecision
  if (temporalProfile === "steady_case_flow") {
    const duration = pair.duration_years ?? 1;
    // For factor_score, we need to include effectiveScale
    // But the per-case model means: MU_per_case × cases_weighted
    // Since effectiveScale = Σ(count × weight), this is correct
    return userAxiomWeight * intensity * duration * pair.confidence * pair.polarity * effectiveScale;
  }

  // For transition and structural, use T_eff
  const teff = computeTeffForProfile(pair, timeStance, temporalProfile);
  const impactOverTime = intensity * teff;
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
  axiomWeights: Record<string, number> = DEFAULT_AXIOM_WEIGHTS,
  socialClasses: SocialClass[] = DEFAULT_SOCIAL_CLASSES,
  timeStance: TimeStance = DEFAULT_TIME_STANCE,
  anchors: Anchor[] = []
): FactorScore => {
  const effectiveScale = calculateEffectiveScale(factor, socialClasses);

  const axiom_scores: Record<string, number> = {};
  let total = 0;
  const temporalProfile = factor.temporal_profile ?? "transition";

  for (const pair of factor.axiom_pairs) {
    const userWeight = axiomWeights[pair.axiom_id] ?? 50; // MU default
    const score = calculateAxiomPairScore(
      pair,
      effectiveScale,
      userWeight,
      timeStance,
      anchors,
      temporalProfile
    );
    axiom_scores[pair.axiom_id] = score;
    total += score;
  }

  return {
    factor_id: factor.id,
    factor_name: factor.name,
    axiom_scores,
    total_score: total,
    temporal_profile: temporalProfile as FactorScore["temporal_profile"],
  };
};

/**
 * Convert MU to USD using calibration
 */
export const convertMUToUSD = (
  scoreMU: number,
  calibration?: MUCalibration
): number | undefined => {
  if (!calibration || calibration.total_mu === 0) return undefined;
  const muToUSD = calibration.dollar_value / calibration.total_mu;
  return scoreMU * muToUSD;
};

/**
 * Compute weight for a specific year for a finite axiom pair
 */
const computeYearWeight = (
  year: number,
  pair: FactorAxiomPair,
  timeStance: TimeStance
): number => {
  const duration = pair.duration_years ?? 0;

  // If beyond duration, no weight
  if (year >= duration) return 0;

  if (timeStance.model === "linear") {
    // Flat weight throughout duration
    return 1.0 / duration; // Normalized so sum over years ≈ 1
  } else if (timeStance.model === "half_life") {
    // Exponential decay
    const moralHalfLife = timeStance.moral_half_life_years ?? 30;
    const lambda = Math.log(2) / moralHalfLife;
    const weight = Math.exp(-lambda * year);

    // Normalize by T_eff to make sum ≈ 1
    const timeDesc = {
      time_type: pair.time_type,
      duration_years: pair.duration_years,
      physical_half_life_years: pair.physical_half_life_years,
    };
    const teff = computeEffectiveDuration(timeDesc, timeStance);
    return weight / teff;
  } else if (timeStance.model === "bucketed") {
    // Bucket weights
    const shortYears = timeStance.short_term_years ?? 5;
    const mediumYears = timeStance.medium_term_years ?? 30;
    const shortWeight = timeStance.short_term_weight ?? 1.0;
    const mediumWeight = timeStance.medium_term_weight ?? 0.5;
    const longWeight = timeStance.long_term_weight ?? 0.2;

    if (year < shortYears) {
      return shortWeight / duration;
    } else if (year < mediumYears) {
      return mediumWeight / duration;
    } else {
      return longWeight / duration;
    }
  }

  return 1.0 / duration; // Fallback
};

/**
 * Generate finite impact time graph
 */
const generateTransitionTimeGraph = (
  decision: Decision,
  transitionFactorScores: FactorScore[],
  axiomWeights: Record<string, number>,
  socialClasses: SocialClass[],
  timeStance: TimeStance,
  anchors: Anchor[]
): TimeGraphPoint[] => {
  // Find max duration
  let maxDuration = 0;
  for (const factorScore of transitionFactorScores) {
    const factor = decision.factors.find((f) => f.id === factorScore.factor_id);
    if (!factor) continue;

    for (const pair of factor.axiom_pairs) {
      if (pair.time_type === "finite" && pair.duration_years) {
        maxDuration = Math.max(maxDuration, pair.duration_years);
      }
    }
  }

  if (maxDuration === 0) return [];

  const graph: TimeGraphPoint[] = [];

  // Generate year buckets
  for (let year = 0; year <= Math.ceil(maxDuration); year++) {
    let muPerYear = 0;

    // Sum contributions from all transition factors
    for (const factorScore of transitionFactorScores) {
      const factor = decision.factors.find((f) => f.id === factorScore.factor_id);
      if (!factor) continue;

      const effectiveScale = calculateEffectiveScale(factor, socialClasses);

      for (const pair of factor.axiom_pairs) {
        if (pair.time_type !== "finite") continue;

        const userWeight = axiomWeights[pair.axiom_id] ?? 50;

        // Get intensity
        let intensity = pair.intensity_per_year;
        if (pair.anchor_id) {
          const anchorIntensity = getIntensityFromAnchor(
            pair.anchor_id,
            pair.axiom_id,
            anchors
          );
          if (anchorIntensity > 0) intensity = anchorIntensity;
        }

        // Get weight for this year
        const yearWeight = computeYearWeight(year, pair, timeStance);

        // Add contribution
        muPerYear +=
          userWeight *
          intensity *
          pair.confidence *
          pair.polarity *
          effectiveScale *
          yearWeight;
      }
    }

    graph.push({ year, mu_per_year: muPerYear });
  }

  return graph;
};

/**
 * Calculate stakeholder impacts split by temporal profile
 * Fixed: person-years now uses max duration per factor (not sum of all axiom_pair durations)
 */
const calculateStakeholderImpacts = (
  decision: Decision,
  factor_scores: FactorScore[],
  axiomWeights: Record<string, number>,
  socialClasses: SocialClass[],
  anchors: Anchor[]
): StakeholderImpact[] => {
  type StakeholderKey = string;
  const stakeholderMap = new Map<StakeholderKey, StakeholderImpact>();

  for (const factorScore of factor_scores) {
    const factor = decision.factors.find((f) => f.id === factorScore.factor_id);
    if (!factor || factor.scale_groups.length === 0) continue;

    const totalScale = factor.scale_groups.reduce((sum, sg) => {
      const weight = socialClasses.find((sc) => sc.id === sg.social_class_id)?.weight ?? 0.3;
      return sum + sg.count * weight;
    }, 0);

    // For transition person-years: use max duration across finite axiom_pairs (not sum)
    let maxFiniteDuration = 0;
    if (factorScore.temporal_profile === "transition") {
      for (const pair of factor.axiom_pairs) {
        if (pair.time_type === "finite" && pair.duration_years) {
          maxFiniteDuration = Math.max(maxFiniteDuration, pair.duration_years);
        }
      }
    }

    for (const sg of factor.scale_groups) {
      const weight = socialClasses.find((sc) => sc.id === sg.social_class_id)?.weight ?? 0.3;
      const groupScale = sg.count * weight;
      const groupShare = totalScale > 0 ? groupScale / totalScale : 0;
      const key: StakeholderKey = `${sg.social_class_id}|${sg.count}|${sg.description}`;

      if (!stakeholderMap.has(key)) {
        stakeholderMap.set(key, {
          social_class_id: sg.social_class_id,
          count: sg.count,
          description: sg.description ?? "",
          transition_total_MU: 0,
          transition_positive_MU: 0,
          transition_negative_MU: 0,
          transition_per_capita_MU: 0,
          transition_physical_person_years: 0,
          transition_per_capita_MU_per_year: 0,
          case_flow_MU_per_year: 0,
          case_flow_positive_MU_per_year: 0,
          case_flow_negative_MU_per_year: 0,
          case_flow_per_capita_MU_per_year: 0,
          structural_MU_per_year: 0,
          structural_positive_MU_per_year: 0,
          structural_negative_MU_per_year: 0,
          structural_per_capita_MU_per_year: 0,
        });
      }

      const stakeholder = stakeholderMap.get(key)!;

      if (factorScore.temporal_profile === "transition") {
        const groupMU = factorScore.total_score * groupShare;
        stakeholder.transition_total_MU += groupMU;
        if (groupMU > 0) {
          stakeholder.transition_positive_MU += groupMU;
        } else if (groupMU < 0) {
          stakeholder.transition_negative_MU += groupMU;
        }

        // Use max duration (not sum of all pairs' durations)
        if (maxFiniteDuration > 0) {
          stakeholder.transition_physical_person_years += maxFiniteDuration * sg.count;
        }
      } else if (factorScore.temporal_profile === "steady_case_flow") {
        // NEW: Per-case model for case-flow
        // MU_per_case = Σ_axiom_pairs (U × I × duration_years × C × P)
        let muPerCase = 0;
        for (const pair of factor.axiom_pairs) {
          const userWeight = axiomWeights[pair.axiom_id] ?? 50;
          const duration = pair.duration_years ?? 1;
          let intensity = pair.intensity_per_year;
          if (pair.anchor_id) {
            const anchorIntensity = getIntensityFromAnchor(
              pair.anchor_id,
              pair.axiom_id,
              anchors
            );
            if (anchorIntensity > 0) intensity = anchorIntensity;
          }
          muPerCase += userWeight * intensity * duration * pair.confidence * pair.polarity;
        }
        
        // cases_per_year_weighted for this factor
        const casesPerYearWeighted = factor.scale_groups.reduce((sum, sg) => {
          const w = socialClasses.find((sc) => sc.id === sg.social_class_id)?.weight ?? 0.3;
          return sum + sg.count * w;
        }, 0);
        
        // Factor's MU per year
        const factorFlowMU = muPerCase * casesPerYearWeighted;
        
        const groupFlowMU = factorFlowMU * groupShare;
        stakeholder.case_flow_MU_per_year += groupFlowMU;
        if (groupFlowMU > 0) {
          stakeholder.case_flow_positive_MU_per_year += groupFlowMU;
        } else if (groupFlowMU < 0) {
          stakeholder.case_flow_negative_MU_per_year += groupFlowMU;
        }
      } else if (factorScore.temporal_profile === "steady_structural") {
        let factorFlowMU = 0;
        const effectiveScale = calculateEffectiveScale(factor, socialClasses);

        for (const pair of factor.axiom_pairs) {
          const userWeight = axiomWeights[pair.axiom_id] ?? 50;
          let intensity = pair.intensity_per_year;
          if (pair.anchor_id) {
            const anchorIntensity = getIntensityFromAnchor(
              pair.anchor_id,
              pair.axiom_id,
              anchors
            );
            if (anchorIntensity > 0) intensity = anchorIntensity;
          }
          factorFlowMU += userWeight * intensity * pair.confidence * pair.polarity * effectiveScale;
        }

        const groupFlowMU = factorFlowMU * groupShare;
        stakeholder.structural_MU_per_year += groupFlowMU;
        if (groupFlowMU > 0) {
          stakeholder.structural_positive_MU_per_year += groupFlowMU;
        } else if (groupFlowMU < 0) {
          stakeholder.structural_negative_MU_per_year += groupFlowMU;
        }
      }
    }
  }

  const stakeholders = Array.from(stakeholderMap.values());
  for (const sh of stakeholders) {
    sh.transition_per_capita_MU = sh.count > 0 ? sh.transition_total_MU / sh.count : 0;
    sh.transition_per_capita_MU_per_year =
      sh.transition_physical_person_years > 0
        ? sh.transition_total_MU / sh.transition_physical_person_years
        : 0;
    sh.case_flow_per_capita_MU_per_year =
      sh.count > 0 ? sh.case_flow_MU_per_year / sh.count : 0;
    sh.structural_per_capita_MU_per_year =
      sh.count > 0 ? sh.structural_MU_per_year / sh.count : 0;
  }

  return stakeholders;
};

export const scoreDecision = (
  decision: Decision,
  axiomWeights: Record<string, number> = DEFAULT_AXIOM_WEIGHTS,
  socialClasses: SocialClass[] = DEFAULT_SOCIAL_CLASSES,
  timeStance: TimeStance = DEFAULT_TIME_STANCE,
  customAnchors: Anchor[] = [],
  muCalibration?: MUCalibration
): DecisionResult => {
  const allAnchors = getAllAnchors(customAnchors);

  const factor_scores = decision.factors.map((factor) =>
    calculateFactorScore(
      factor,
      axiomWeights,
      socialClasses,
      timeStance,
      allAnchors
    )
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

  const total_score_usd = convertMUToUSD(total_score, muCalibration);

  // === TEMPORAL PROFILE CALCULATIONS ===

  const transitionFactorScores = factor_scores.filter(
    (fs) => fs.temporal_profile === "transition"
  );
  const caseFlowFactorScores = factor_scores.filter(
    (fs) => fs.temporal_profile === "steady_case_flow"
  );
  const structuralFactorScores = factor_scores.filter(
    (fs) => fs.temporal_profile === "steady_structural"
  );

  // TRANSITION METRICS
  const transition_total_MU = transitionFactorScores.reduce((sum, fs) => sum + fs.total_score, 0);

  const transitionPopulationSet = new Set<string>();
  let transition_total_physical_person_years = 0;

  for (const fs of transitionFactorScores) {
    const factor = decision.factors.find((f) => f.id === fs.factor_id);
    if (!factor) continue;

    for (const sg of factor.scale_groups) {
      transitionPopulationSet.add(`${sg.social_class_id}|${sg.count}|${sg.description}`);
    }

    for (const pair of factor.axiom_pairs) {
      if (pair.time_type === "finite" && pair.duration_years) {
        const factorPopulation = factor.scale_groups.reduce((sum, sg) => sum + sg.count, 0);
        transition_total_physical_person_years += pair.duration_years * factorPopulation;
      }
    }
  }

  const transition_total_population = Array.from(transitionPopulationSet).reduce((sum, key) => {
    const count = parseInt(key.split("|")[1]);
    return sum + count;
  }, 0);

  const transition_MU_per_capita =
    transition_total_population > 0 ? transition_total_MU / transition_total_population : 0;

  const transition_MU_per_year_population =
    transition_total_physical_person_years > 0
      ? transition_total_MU / transition_total_physical_person_years
      : 0;

  // STEADY CASE-FLOW METRICS (per year) - NEW PER-CASE MODEL
  // MU_per_case = Σ_axiom_pairs (U × I × duration_years × C × P)
  // MU_per_year = MU_per_case × cases_per_year_weighted
  let case_flow_MU_per_year = 0;
  const caseFlowPopulationSet = new Set<string>();
  for (const fs of caseFlowFactorScores) {
    const factor = decision.factors.find((f) => f.id === fs.factor_id);
    if (!factor) continue;
    for (const sg of factor.scale_groups) {
      caseFlowPopulationSet.add(`${sg.social_class_id}|${sg.count}|${sg.description}`);
    }
    
    // Step 1: Calculate MU_per_case (sum over axiom_pairs, using duration_years directly)
    let muPerCase = 0;
    for (const pair of factor.axiom_pairs) {
      const userWeight = axiomWeights[pair.axiom_id] ?? 50;
      const duration = pair.duration_years ?? 1; // Default to 1 if not specified

      let intensity = pair.intensity_per_year;
      if (pair.anchor_id) {
        const anchorIntensity = getIntensityFromAnchor(
          pair.anchor_id,
          pair.axiom_id,
          allAnchors
        );
        if (anchorIntensity > 0) intensity = anchorIntensity;
      }

      // Per-case contribution: U × I × duration_years × C × P (no scale yet)
      muPerCase += userWeight * intensity * duration * pair.confidence * pair.polarity;
    }
    
    // Step 2: Calculate cases_per_year_weighted (from scale_groups)
    const casesPerYearWeighted = factor.scale_groups.reduce((sum, sg) => {
      const weight = socialClasses.find((sc) => sc.id === sg.social_class_id)?.weight ?? 0.3;
      return sum + sg.count * weight;
    }, 0);
    
    // Step 3: MU_per_year = MU_per_case × cases_per_year_weighted
    case_flow_MU_per_year += muPerCase * casesPerYearWeighted;
  }
  const case_flow_total_population = Array.from(caseFlowPopulationSet).reduce((sum, key) => {
    const count = parseInt(key.split("|")[1]);
    return sum + count;
  }, 0);
  const case_flow_MU_per_capita_per_year =
    case_flow_total_population > 0 ? case_flow_MU_per_year / case_flow_total_population : 0;

  // STEADY STRUCTURAL METRICS (per year)
  let structural_MU_per_year = 0;
  const structuralPopulationSet = new Set<string>();
  for (const fs of structuralFactorScores) {
    const factor = decision.factors.find((f) => f.id === fs.factor_id);
    if (!factor) continue;
    for (const sg of factor.scale_groups) {
      structuralPopulationSet.add(`${sg.social_class_id}|${sg.count}|${sg.description}`);
    }
    const effectiveScale = calculateEffectiveScale(factor, socialClasses);
    for (const pair of factor.axiom_pairs) {
      const userWeight = axiomWeights[pair.axiom_id] ?? 50;

      let intensity = pair.intensity_per_year;
      if (pair.anchor_id) {
        const anchorIntensity = getIntensityFromAnchor(
          pair.anchor_id,
          pair.axiom_id,
          allAnchors
        );
        if (anchorIntensity > 0) intensity = anchorIntensity;
      }

      structural_MU_per_year +=
        userWeight * intensity * pair.confidence * pair.polarity * effectiveScale;
    }
  }
  const structural_total_population = Array.from(structuralPopulationSet).reduce((sum, key) => {
    const count = parseInt(key.split("|")[1]);
    return sum + count;
  }, 0);
  const structural_MU_per_capita_per_year =
    structural_total_population > 0 ? structural_MU_per_year / structural_total_population : 0;

  // === FINITE VS INDEFINITE CROSS-CUT (by physical time_type) ===
  // This slices ALL factors by their axiom_pairs' time_type, independent of temporal_profile
  let finite_total_MU = 0;
  let finite_total_physical_person_years = 0;
  const finitePopulationSet = new Set<string>();
  let indefinite_flow_MU_per_year = 0;
  const indefinitePopulationSet = new Set<string>();

  for (const factor of decision.factors) {
    const effectiveScale = calculateEffectiveScale(factor, socialClasses);
    const temporalProfile = factor.temporal_profile ?? "transition";

    for (const pair of factor.axiom_pairs) {
      const userWeight = axiomWeights[pair.axiom_id] ?? 50;
      let intensity = pair.intensity_per_year;
      if (pair.anchor_id) {
        const anchorIntensity = getIntensityFromAnchor(pair.anchor_id, pair.axiom_id, allAnchors);
        if (anchorIntensity > 0) intensity = anchorIntensity;
      }

      if (pair.time_type === "finite") {
        // Finite: compute W with T_eff (only transition uses real T_eff; steady = 1)
        const teff = computeTeffForProfile(pair, timeStance, temporalProfile);
        const pairMU = userWeight * intensity * teff * pair.confidence * pair.polarity * effectiveScale;
        finite_total_MU += pairMU;

        // Physical person-years for finite pairs
        if (pair.duration_years) {
          const factorPopulation = factor.scale_groups.reduce((sum, sg) => sum + sg.count, 0);
          finite_total_physical_person_years += pair.duration_years * factorPopulation;
        }

        for (const sg of factor.scale_groups) {
          finitePopulationSet.add(`${sg.social_class_id}|${sg.count}|${sg.description}`);
        }
      } else if (pair.time_type === "indefinite") {
        // Indefinite: per-year flow (U × I × C × P × S, no T_eff)
        const pairFlowMU = userWeight * intensity * pair.confidence * pair.polarity * effectiveScale;
        indefinite_flow_MU_per_year += pairFlowMU;

        for (const sg of factor.scale_groups) {
          indefinitePopulationSet.add(`${sg.social_class_id}|${sg.count}|${sg.description}`);
        }
      }
    }
  }

  const finite_total_population = Array.from(finitePopulationSet).reduce((sum, key) => {
    const count = parseInt(key.split("|")[1]);
    return sum + count;
  }, 0);
  const finite_MU_per_capita = finite_total_population > 0 ? finite_total_MU / finite_total_population : 0;
  const finite_MU_per_year_population = finite_total_physical_person_years > 0
    ? finite_total_MU / finite_total_physical_person_years
    : 0;

  // TRANSITION TIME GRAPH
  const transition_time_graph = generateTransitionTimeGraph(
    decision,
    transitionFactorScores,
    axiomWeights,
    socialClasses,
    timeStance,
    allAnchors
  );

  // STAKEHOLDER IMPACTS
  const stakeholder_impacts = calculateStakeholderImpacts(
    decision,
    factor_scores,
    axiomWeights,
    socialClasses,
    allAnchors
  );

  // Strength ratio for display
  const strength_ratio = computeStrengthRatio(total_score, sum_abs);

  return {
    decision_id: decision.id,
    total_score, // in MU
    total_score_usd,
    result,
    strength: strengthBand(total_score, sum_abs),
    strength_ratio,
    factor_scores,
    top_contributors,
    warnings,

    // Temporal profile metrics
    transition_total_MU,
    transition_total_population,
    transition_MU_per_capita,
    transition_total_physical_person_years,
    transition_MU_per_year_population,

    case_flow_MU_per_year,
    case_flow_total_population,
    case_flow_MU_per_capita_per_year,
    structural_MU_per_year,
    structural_total_population,
    structural_MU_per_capita_per_year,

    // Finite vs indefinite cross-cut
    finite_total_MU,
    finite_total_population,
    finite_MU_per_capita,
    finite_total_physical_person_years,
    finite_MU_per_year_population,
    indefinite_flow_MU_per_year,

    transition_time_graph,
    stakeholder_impacts,
  };
};

export const formatScoreBreakdown = (
  result: DecisionResult,
  decision: Decision,
  timeStance: TimeStance = DEFAULT_TIME_STANCE,
  axiomWeights: Record<string, number> = DEFAULT_AXIOM_WEIGHTS,
  socialClasses: SocialClass[] = DEFAULT_SOCIAL_CLASSES,
  customAnchors: Anchor[] = []
): string => {
  const allAnchors = getAllAnchors(customAnchors);
  const lines: string[] = [];
  lines.push(`## Decision: ${decision.question}`);
  lines.push(`**Result: ${result.result} (${result.strength})**`);
  lines.push(`**Total Score: ${result.total_score.toFixed(2)} MU**`);
  if (result.total_score_usd !== undefined) {
    lines.push(
      `**Total Score (USD): $${result.total_score_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**`
    );
  }
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
    lines.push(`Contribution: ${dir}${fs.total_score.toFixed(2)} MU`);
    for (const [axiomId, score] of Object.entries(fs.axiom_scores)) {
      const pair = factor.axiom_pairs.find((p) => p.axiom_id === axiomId);
      if (!pair) continue;

      const teff = computeTeffForProfile(pair, timeStance, factor.temporal_profile);

      let intensity = pair.intensity_per_year;
      if (pair.anchor_id) {
        const anchorIntensity = getIntensityFromAnchor(
          pair.anchor_id,
          pair.axiom_id,
          allAnchors
        );
        if (anchorIntensity > 0) intensity = anchorIntensity;
      }

      const impact = intensity * teff;
      const sign = score > 0 ? "+" : "";
      lines.push(
        `- ${axiomId}: ${sign}${score.toFixed(2)} MU (I=${intensity.toFixed(
          2
        )}, T_eff=${teff.toFixed(2)}, I x T_eff=${impact.toFixed(
          2
        )}, C=${pair.confidence}, P=${pair.polarity})`
      );
    }
    lines.push("");
  }

  if (result.warnings.length) {
    lines.push("### Warnings");
    for (const w of result.warnings) lines.push(`- ${w}`);
  }

  lines.push("");
  lines.push("### Configuration Used");
  lines.push(`- Time stance: ${timeStance.model}`);
  if (timeStance.model === "half_life") {
    lines.push(
      `  - Moral half-life: ${timeStance.moral_half_life_years} years`
    );
  } else if (timeStance.model === "bucketed") {
    lines.push(
      `  - Short term: ${timeStance.short_term_years}y (weight ${timeStance.short_term_weight})`
    );
    lines.push(
      `  - Medium term: ${timeStance.medium_term_years}y (weight ${timeStance.medium_term_weight})`
    );
    lines.push(`  - Long term: weight ${timeStance.long_term_weight}`);
  }
  lines.push(
    `- Social classes: ${socialClasses.map((c) => `${c.id}=${c.weight}`).join(", ")}`
  );
  lines.push(
    `- Axiom weights (MU): ${Object.entries(axiomWeights)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}`
  );

  return lines.join("\n");
};
