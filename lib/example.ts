export const EXAMPLE_JSON = `{
  "id": "lie-feelings-001",
  "question": "Should I lie to protect someone's feelings about their artwork?",
  "context": "Close friend asks for honest feedback on a multi-month project",
  "factors": [
    {
      "id": "emotional-harm-prevention",
      "name": "Prevent immediate emotional pain",
      "description": "Lying spares them hurt right now",
      "what_changes": "Emotional state when hearing feedback",
      "who_affected": "Friend",
      "how_much": "Moderate distress avoided",
      "duration": "A few days",
      "axiom_pairs": [
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.3,
          "time_type": "finite",
          "duration_years": 0.02,
          "physical_half_life_years": null,
          "confidence": 0.85,
          "polarity": 1.0,
          "rationale": "Moderate distress lasting days"
        }
      ],
      "scale_groups": [
        {"group_type": "inner_circle", "count": 1, "description": "The friend"}
      ]
    },
    {
      "id": "trust-damage",
      "name": "Damage to relationship trust if discovered",
      "description": "Finding out about the lie harms relationship trust",
      "what_changes": "Interpersonal trust baseline",
      "who_affected": "Both parties",
      "how_much": "Significant trust erosion",
      "duration": "Could linger for years",
      "axiom_pairs": [
        {
          "axiom_id": "social_trust",
          "intensity_per_year": 0.4,
          "time_type": "finite",
          "duration_years": 5,
          "physical_half_life_years": null,
          "confidence": 0.6,
          "polarity": -1.0,
          "rationale": "Personal betrayal if discovered"
        },
        {
          "axiom_id": "truth_epistemic",
          "intensity_per_year": 0.3,
          "time_type": "finite",
          "duration_years": 1,
          "physical_half_life_years": null,
          "confidence": 0.6,
          "polarity": -1.0,
          "rationale": "Violation of honesty norm"
        }
      ],
      "scale_groups": [
        {"group_type": "inner_circle", "count": 1, "description": "Friend"},
        {"group_type": "self", "count": 1, "description": "Your integrity"}
      ]
    },
    {
      "id": "growth-prevention",
      "name": "Stunting artistic growth",
      "description": "No honest feedback slows their improvement",
      "what_changes": "Learning trajectory",
      "who_affected": "Friend",
      "how_much": "Moderate lost growth",
      "duration": "Multi-year drag",
      "axiom_pairs": [
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.2,
          "time_type": "finite",
          "duration_years": 3,
          "physical_half_life_years": null,
          "confidence": 0.7,
          "polarity": -1.0,
          "rationale": "Slower skill development"
        }
      ],
      "scale_groups": [
        {"group_type": "inner_circle", "count": 1, "description": "Friend"}
      ]
    }
  ]
}`;
