import { Anchor } from "./models";

// Default intensity anchors - multi-axiom scenarios
export const DEFAULT_ANCHORS: Anchor[] = [
  {
    id: "anchor_death",
    description: "Death (complete loss of life)",
    raw_axiom_intensities: {
      life_health: 10,
      suffering_wellbeing: 8,
    },
    normalized_axiom_intensities: {}, // computed on load
  },
  {
    id: "anchor_severe_depression",
    description: "Severe depression episode",
    raw_axiom_intensities: {
      suffering_wellbeing: 9,
      life_health: 2,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_hospitalization",
    description: "Serious injury requiring hospitalization",
    raw_axiom_intensities: {
      life_health: 5,
      suffering_wellbeing: 4,
      bodily_autonomy: 2,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_moderate_illness",
    description: "Moderate illness (e.g., bad flu)",
    raw_axiom_intensities: {
      life_health: 3,
      suffering_wellbeing: 3,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_minor_illness",
    description: "Minor illness (e.g., common cold)",
    raw_axiom_intensities: {
      life_health: 1,
      suffering_wellbeing: 1,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_confinement",
    description: "Physical confinement / imprisonment",
    raw_axiom_intensities: {
      civil_liberty: 8,
      bodily_autonomy: 6,
      suffering_wellbeing: 5,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_forced_intervention",
    description: "Forced medical or legal intervention",
    raw_axiom_intensities: {
      bodily_autonomy: 6,
      civil_liberty: 4,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_significant_restriction",
    description: "Significant restriction on freedom",
    raw_axiom_intensities: {
      civil_liberty: 4,
      bodily_autonomy: 2,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_moderate_coercion",
    description: "Moderate social or legal coercion",
    raw_axiom_intensities: {
      civil_liberty: 2,
      bodily_autonomy: 1,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_mild_inconvenience",
    description: "Mild inconvenience or friction",
    raw_axiom_intensities: {
      civil_liberty: 1,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_severe_psych_harm",
    description: "Severe psychological harm",
    raw_axiom_intensities: {
      suffering_wellbeing: 7,
      life_health: 2,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_significant_suffering",
    description: "Significant ongoing suffering",
    raw_axiom_intensities: {
      suffering_wellbeing: 5,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_moderate_anxiety",
    description: "Moderate anxiety or stress",
    raw_axiom_intensities: {
      suffering_wellbeing: 3,
    },
    normalized_axiom_intensities: {},
  },
  {
    id: "anchor_mild_stress",
    description: "Mild stress or discomfort",
    raw_axiom_intensities: {
      suffering_wellbeing: 1,
    },
    normalized_axiom_intensities: {},
  },
];

/**
 * Normalize anchors: for each axiom, find the max raw intensity across all anchors,
 * then normalize all anchors for that axiom to [0, 1]
 */
export const normalizeAnchors = (anchors: Anchor[]): Anchor[] => {
  // Find max raw intensity per axiom across all anchors
  const maxPerAxiom: Record<string, number> = {};

  for (const anchor of anchors) {
    for (const [axiomId, rawValue] of Object.entries(
      anchor.raw_axiom_intensities
    )) {
      if (!maxPerAxiom[axiomId] || rawValue > maxPerAxiom[axiomId]) {
        maxPerAxiom[axiomId] = rawValue;
      }
    }
  }

  // Normalize each anchor
  return anchors.map((anchor) => {
    const normalized: Record<string, number> = {};
    for (const [axiomId, rawValue] of Object.entries(
      anchor.raw_axiom_intensities
    )) {
      const max = maxPerAxiom[axiomId] || 1;
      normalized[axiomId] = max > 0 ? rawValue / max : 0;
    }
    return {
      ...anchor,
      normalized_axiom_intensities: normalized,
    };
  });
};

/**
 * Get normalized intensity from an anchor for a specific axiom
 */
export const getIntensityFromAnchor = (
  anchorId: string,
  axiomId: string,
  anchors: Anchor[]
): number => {
  const anchor = anchors.find((a) => a.id === anchorId);
  if (!anchor) return 0;
  return anchor.normalized_axiom_intensities[axiomId] || 0;
};

/**
 * Get all normalized anchors (default + custom)
 */
export const getAllAnchors = (customAnchors: Anchor[] = []): Anchor[] => {
  const allAnchors = [...DEFAULT_ANCHORS, ...customAnchors];
  return normalizeAnchors(allAnchors);
};
