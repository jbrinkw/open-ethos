import { Axiom } from "./models";

export const DEFAULT_MORAL_HALF_LIFE_YEARS = 30;

export const DEFAULT_SOCIAL_WEIGHTS: Record<string, number> = {
  self: 1.0,
  inner_circle: 0.8,
  tribe: 0.5,
  citizens: 0.3,
};

export const RELATIVE_STRENGTH_THRESHOLDS = {
  strong: 0.5,
  medium: 0.2,
};

export const DEFAULT_AXIOMS: Axiom[] = [
  {
    id: "life_health",
    name: "Life and Physical Health",
    description: "Survival, injury, disease burden",
    default_weight: 0.5,
  },
  {
    id: "bodily_autonomy",
    name: "Bodily Autonomy and Self-Ownership",
    description: "Control of body, medical consent",
    default_weight: 0.5,
  },
  {
    id: "civil_liberty",
    name: "Freedom from Coercion / Civil Liberty",
    description: "Speech, movement, state force",
    default_weight: 0.5,
  },
  {
    id: "suffering_wellbeing",
    name: "Suffering and Wellbeing",
    description: "Pain, joy, mental health, quality of experience",
    default_weight: 0.5,
  },
  {
    id: "fairness_equality",
    name: "Fairness / Equal Rules",
    description: "Procedural justice, discrimination",
    default_weight: 0.5,
  },
  {
    id: "truth_epistemic",
    name: "Truth and Epistemic Integrity",
    description: "Honesty, accuracy, manipulation",
    default_weight: 0.5,
  },
  {
    id: "long_term_capacity",
    name: "Long-term Societal Capacity / Future Potential",
    description: "Innovation, resilience",
    default_weight: 0.5,
  },
  {
    id: "social_trust",
    name: "Social Trust and Cohesion",
    description: "Legitimacy, stability, institutional trust",
    default_weight: 0.5,
  },
];

export const DEFAULT_AXIOM_WEIGHTS: Record<string, number> = Object.fromEntries(
  DEFAULT_AXIOMS.map((a) => [a.id, a.default_weight])
);
