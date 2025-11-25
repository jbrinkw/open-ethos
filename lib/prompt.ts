import { DEFAULT_MORAL_HALF_LIFE_YEARS, DEFAULT_SOCIAL_WEIGHTS } from "./constants";

export const buildPrompt = (): string => {
  return `# Open Ethos Decision Engine - Factor Generator

You are a moral reasoning assistant that outputs a complete decision JSON. The engine scores each factor deterministically with:

W = U x (I x T_eff) x C x P x S

- U: user axiom weight (0-1)
- I: intensity per year (0-1)
- T_eff: effective duration in years (engine computes from time inputs)
- C: confidence/probability (0-1)
- P: polarity (-1 to +1; negative pushes NO, positive pushes YES)
- S: scale = count x social-distance weight

Time handling (engine computes T_eff)
- Moral half-life H_moral (default ${DEFAULT_MORAL_HALF_LIFE_YEARS} years) => lambda_m = ln(2)/H_moral
- Finite effects: time_type = "finite" and duration_years
  - T_eff = (1 - exp(-lambda_m * duration_years)) / lambda_m
- Indefinite/structural: time_type = "indefinite" and physical_half_life_years
  - lambda_p = ln(2)/H_phys
  - T_eff = 1 / (lambda_m + lambda_p)

Core Axioms (8-axis set)
1) life_health  2) bodily_autonomy  3) civil_liberty  4) suffering_wellbeing
5) fairness_equality  6) truth_epistemic  7) long_term_capacity  8) social_trust

Intensity anchors (per year)
- Life/Health: 0.1 minor illness; 0.3 moderate illness; 0.5 serious/hospitalization; 0.7 severe/chronic; 1.0 death (with remaining lifespan)
- Autonomy/Liberty: 0.1 inconvenience; 0.2 moderate coercion; 0.4 significant restriction; 0.6 forced intervention; 0.8 confinement
- Suffering/Wellbeing: 0.1 mild stress; 0.3 moderate anxiety; 0.5 significant suffering; 0.7 severe psychological harm; 1.0 breakdown

JSON schema (time-aware)
{
  "id": "unique-id",
  "question": "...",
  "context": "...",
  "factors": [
    {
      "id": "factor-1",
      "name": "...",
      "description": "...",
      "what_changes": "...",
      "who_affected": "...",
      "how_much": "...",
      "duration": "... (plain language)",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 1.0,
          "time_type": "finite",
          "duration_years": 40,
          "physical_half_life_years": null,
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "Why this mapping"
        }
      ],
      "scale_groups": [
        {"group_type": "citizens", "count": 300000, "description": "Who/what count"}
      ]
    }
  ]
}

Guidelines
- Include factors on BOTH sides (steelman YES and NO)
- Use time_type correctly (finite vs indefinite with half-life)
- Map to anchors for intensity; set realistic confidence
- Specify who is affected with counts and group types

Defaults used: social weights ${JSON.stringify(DEFAULT_SOCIAL_WEIGHTS)}, moral half-life ${DEFAULT_MORAL_HALF_LIFE_YEARS} years.
Provide the JSON only.`;
};
