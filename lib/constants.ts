import { Axiom } from "./models";

export const DEFAULT_MORAL_HALF_LIFE_YEARS = 30;

export const DEFAULT_SOCIAL_WEIGHTS: Record<string, number> = {
  self: 1.0,
  inner_circle: 0.8,
  tribe: 0.5,
  citizens: 0.3,
  outsiders: 0.1,
};

export const RELATIVE_STRENGTH_THRESHOLDS = {
  strong: 0.5,
  medium: 0.2,
};

export const DEFAULT_AXIOMS: Axiom[] = [
  {
    id: "life_health",
    name: "Life and Physical Health",
    description: "e.g., death, illness, injury, longevity",
    default_weight: 0.5,
  },
  {
    id: "bodily_autonomy",
    name: "Bodily Autonomy",
    description: "e.g., medical decisions, physical consent",
    default_weight: 0.5,
  },
  {
    id: "civil_liberty",
    name: "Civil Liberty",
    description: "e.g., free speech, privacy, movement",
    default_weight: 0.5,
  },
  {
    id: "suffering_wellbeing",
    name: "Suffering / Wellbeing",
    description: "e.g., stress, happiness, mental health",
    default_weight: 0.5,
  },
  {
    id: "fairness_equality",
    name: "Fairness / Equal Rules",
    description: "e.g., equal treatment, fair processes",
    default_weight: 0.5,
  },
  {
    id: "truth_epistemic",
    name: "Truth / Epistemic",
    description: "e.g., honesty, transparency, informed consent",
    default_weight: 0.5,
  },
  {
    id: "long_term_capacity",
    name: "Long-term Capacity",
    description: "e.g., sustainability, future generations",
    default_weight: 0.5,
  },
  {
    id: "social_trust",
    name: "Social Trust",
    description: "e.g., institutional trust, community bonds",
    default_weight: 0.5,
  },
];

export const DEFAULT_AXIOM_WEIGHTS: Record<string, number> = Object.fromEntries(
  DEFAULT_AXIOMS.map((a) => [a.id, a.default_weight])
);
