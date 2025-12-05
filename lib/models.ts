export type TimeType = "finite" | "indefinite";

export interface Axiom {
  id: string;
  name: string;
  description: string;
  default_weight: number; // in MU per person-year
}

// MU Calibration for converting MU to USD
export interface MUCalibration {
  scenario_description: string; // e.g., "1 year severe depression for me"
  dollar_value: number; // e.g., 50000
  total_mu: number; // computed MU for this scenario
}

// Time stance configuration (pluggable time module)
export interface TimeStance {
  model: "linear" | "half_life" | "bucketed";
  // For half_life model:
  moral_half_life_years?: number;
  // For bucketed model:
  short_term_years?: number; // e.g., 5
  medium_term_years?: number; // e.g., 30
  short_term_weight?: number; // e.g., 1.0
  medium_term_weight?: number; // e.g., 0.5
  long_term_weight?: number; // e.g., 0.2
}

// Intensity anchor (multi-axiom scenario)
export interface Anchor {
  id: string;
  description: string;
  raw_axiom_intensities: Record<string, number>; // arbitrary positive scale
  normalized_axiom_intensities: Record<string, number>; // 0-1, computed
}

// Social distance class (editable)
export interface SocialClass {
  id: string;
  label: string;
  weight: number; // relative weight, can be any positive number
  note?: string; // optional note explaining this social class
}

export interface FactorAxiomPair {
  axiom_id: string;
  intensity_per_year: number; // 0-1, normalized (can be derived from anchor)
  time_type: TimeType;
  duration_years?: number | null; // required if time_type = "finite"
  physical_half_life_years?: number | null; // required if time_type = "indefinite"
  confidence: number; // 0-1
  polarity: number; // -1 to +1; negative pushes NO, positive pushes YES (binary only)
  rationale?: string;
  anchor_id?: string | null; // optional: reference to an Anchor for intensity
}

export interface ScaleGroup {
  social_class_id: string; // references a SocialClass.id (editable)
  count: number;
  description?: string;
}

export interface Factor {
  id: string;
  name: string;
  description: string;
  what_changes: string;
  who_affected: string;
  how_much: string;
  duration: string;
  temporal_profile: "transition" | "steady_case_flow" | "steady_structural";
  axiom_pairs: FactorAxiomPair[];
  scale_groups: ScaleGroup[];
}

export interface ExcludedScenario {
  scenario: string;
  why_separate: string;
  separate_question: string;
}

export interface Decision {
  id: string;
  question: string;
  scope?: string; // What cases does this analysis cover? (e.g., "General cases, excluding rape/medical emergency")
  context: string;
  factors: Factor[];
  excluded_scenarios?: ExcludedScenario[]; // Edge cases that are fundamentally different questions
}

export interface FactorScore {
  factor_id: string;
  factor_name: string;
  axiom_scores: Record<string, number>;
  total_score: number;
  temporal_profile: "transition" | "steady_case_flow" | "steady_structural";
}

export type StrengthBand =
  | "strong_no"
  | "medium_no"
  | "weak_no"
  | "neutral"
  | "weak_yes"
  | "medium_yes"
  | "strong_yes";

export interface StakeholderImpact {
  social_class_id: string;
  count: number;
  description: string;
  // Transition / finite metrics
  transition_total_MU: number;
  transition_positive_MU: number;
  transition_negative_MU: number;
  transition_per_capita_MU: number;
  transition_physical_person_years: number;
  transition_per_capita_MU_per_year: number;
  // Steady case-flow metrics (per year)
  case_flow_MU_per_year: number;
  case_flow_positive_MU_per_year: number;
  case_flow_negative_MU_per_year: number;
  case_flow_per_capita_MU_per_year: number;
  // Steady structural metrics (per year)
  structural_MU_per_year: number;
  structural_positive_MU_per_year: number;
  structural_negative_MU_per_year: number;
  structural_per_capita_MU_per_year: number;
}

export interface TimeGraphPoint {
  year: number;
  mu_per_year: number;
}

export interface DecisionResult {
  decision_id: string;
  total_score: number; // in MU
  total_score_usd?: number; // optional: if MU calibration is set
  result: "YES" | "NO" | "NEUTRAL";
  strength: StrengthBand;
  strength_ratio: number; // 0-1, the actual contestation ratio
  factor_scores: FactorScore[];
  top_contributors: string[];
  warnings: string[];

  // Temporal profile metrics
  transition_total_MU: number;
  transition_total_population: number;
  transition_MU_per_capita: number;
  transition_total_physical_person_years: number;
  transition_MU_per_year_population: number;

  case_flow_MU_per_year: number;
  case_flow_total_population: number;
  case_flow_MU_per_capita_per_year: number;
  structural_MU_per_year: number;
  structural_total_population: number;
  structural_MU_per_capita_per_year: number;

  // Finite vs indefinite cross-cut metrics (by physical time_type)
  finite_total_MU: number;
  finite_total_population: number;
  finite_MU_per_capita: number;
  finite_total_physical_person_years: number;
  finite_MU_per_year_population: number;
  indefinite_flow_MU_per_year: number;

  transition_time_graph: TimeGraphPoint[];
  stakeholder_impacts: StakeholderImpact[];
}
