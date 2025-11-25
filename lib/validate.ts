import { Decision } from "./models";

export const validateDecision = (decision: Decision): string[] => {
  const errors: string[] = [];
  if (!decision.id) errors.push("Decision id is required");
  if (!decision.question) errors.push("Decision question is required");
  if (!Array.isArray(decision.factors) || !decision.factors.length) {
    errors.push("At least one factor is required");
    return errors;
  }

  for (const factor of decision.factors) {
    if (!factor.id) errors.push("Factor id is required");
    if (!factor.name) errors.push("Factor name is required");
    if (!Array.isArray(factor.axiom_pairs) || !factor.axiom_pairs.length) {
      errors.push(`Factor '${factor.name || factor.id}' needs axiom_pairs`);
    }
    if (!Array.isArray(factor.scale_groups) || !factor.scale_groups.length) {
      errors.push(`Factor '${factor.name || factor.id}' needs scale_groups`);
    }

    for (const pair of factor.axiom_pairs) {
      if (!pair.axiom_id) errors.push(`Axiom id missing in factor ${factor.id}`);
      if (pair.time_type === "finite") {
        if (pair.duration_years === undefined || pair.duration_years === null) {
          errors.push(
            `duration_years required for finite time_type in factor ${factor.id}`
          );
        }
      } else if (pair.time_type === "indefinite") {
        if (
          pair.physical_half_life_years === undefined ||
          pair.physical_half_life_years === null
        ) {
          errors.push(
            `physical_half_life_years required for indefinite time_type in factor ${factor.id}`
          );
        }
      } else {
        errors.push(`Invalid time_type in factor ${factor.id}`);
      }

      if (pair.intensity_per_year < 0 || pair.intensity_per_year > 1) {
        errors.push(
          `intensity_per_year must be 0-1 in factor ${factor.id} (${pair.axiom_id})`
        );
      }
      if (pair.confidence < 0 || pair.confidence > 1) {
        errors.push(
          `confidence must be 0-1 in factor ${factor.id} (${pair.axiom_id})`
        );
      }
      if (pair.polarity < -1 || pair.polarity > 1) {
        errors.push(
          `polarity must be -1 to 1 in factor ${factor.id} (${pair.axiom_id})`
        );
      }
    }
  }

  return errors;
};
