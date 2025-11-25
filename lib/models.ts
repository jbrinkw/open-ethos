export type TimeType = "finite" | "indefinite";

export interface Axiom {
  id: string;
  name: string;
  description: string;
  default_weight: number;
}

export interface FactorAxiomPair {
  axiom_id: string;
  intensity_per_year: number;
  time_type: TimeType;
  duration_years?: number | null;
  physical_half_life_years?: number | null;
  confidence: number;
  polarity: number;
  rationale?: string;
  anchor_id?: string | null;
}

export interface ScaleGroup {
  group_type: string; // self | inner_circle | tribe | citizens
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
  axiom_pairs: FactorAxiomPair[];
  scale_groups: ScaleGroup[];
}

export interface Decision {
  id: string;
  question: string;
  context: string;
  factors: Factor[];
}

export interface FactorScore {
  factor_id: string;
  factor_name: string;
  axiom_scores: Record<string, number>;
  total_score: number;
}

export type StrengthBand =
  | "strong_no"
  | "medium_no"
  | "weak_no"
  | "neutral"
  | "weak_yes"
  | "medium_yes"
  | "strong_yes";

export interface DecisionResult {
  decision_id: string;
  total_score: number;
  result: "YES" | "NO" | "NEUTRAL";
  strength: StrengthBand;
  factor_scores: FactorScore[];
  top_contributors: string[];
  warnings: string[];
}
