import { Axiom, SocialClass, TimeStance } from "./models";

export const DEFAULT_MORAL_HALF_LIFE_YEARS = 30;

// Default time stance (half-life model)
export const DEFAULT_TIME_STANCE: TimeStance = {
  model: "half_life",
  moral_half_life_years: DEFAULT_MORAL_HALF_LIFE_YEARS,
};

// Social classes (editable in profile)
export const DEFAULT_SOCIAL_CLASSES: SocialClass[] = [
  { id: "self", label: "Me", weight: 1.0 },
  { id: "inner_circle", label: "Close friends/family", weight: 0.8 },
  { id: "tribe", label: "My group / tribe", weight: 0.5 },
  { id: "citizens", label: "Random citizen", weight: 0.3 },
  { id: "outsiders", label: "Distant outsider", weight: 0.1 },
];

// Legacy: keep for backward compatibility
export const DEFAULT_SOCIAL_WEIGHTS: Record<string, number> =
  Object.fromEntries(DEFAULT_SOCIAL_CLASSES.map((c) => [c.id, c.weight]));

export const RELATIVE_STRENGTH_THRESHOLDS = {
  strong: 0.5,
  medium: 0.2,
};

// Axioms with MU-based default weights
// MU = Moral Units per person-year at full intensity
export const DEFAULT_AXIOMS: Axiom[] = [
  {
    id: "life_health",
    name: "Life and Physical Health",
    description: "e.g., death, illness, injury, longevity",
    default_weight: 30, // MU per person-year (reduced from 50)
  },
  {
    id: "bodily_autonomy",
    name: "Bodily Autonomy",
    description: "e.g., medical decisions, physical consent",
    default_weight: 40,
  },
  {
    id: "civil_liberty",
    name: "Civil Liberty",
    description: "e.g., free speech, privacy, movement",
    default_weight: 40,
  },
  {
    id: "suffering_wellbeing",
    name: "Suffering / Wellbeing",
    description: "e.g., stress, happiness, mental health",
    default_weight: 45,
  },
  {
    id: "fairness_equality",
    name: "Fairness / Equal Rules",
    description: "e.g., equal treatment, fair processes",
    default_weight: 30,
  },
  {
    id: "truth_epistemic",
    name: "Truth / Epistemic",
    description: "e.g., honesty, transparency, informed consent",
    default_weight: 25,
  },
  {
    id: "long_term_capacity",
    name: "Long-term Capacity",
    description: "e.g., sustainability, future generations",
    default_weight: 35,
  },
  {
    id: "social_trust",
    name: "Social Trust",
    description: "e.g., institutional trust, community bonds",
    default_weight: 30,
  },
];

export const DEFAULT_AXIOM_WEIGHTS: Record<string, number> = Object.fromEntries(
  DEFAULT_AXIOMS.map((a) => [a.id, a.default_weight])
);
