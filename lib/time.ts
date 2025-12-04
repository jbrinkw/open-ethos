import { TimeType, TimeStance } from "./models";

const LN2 = Math.log(2);

const safeHalfLife = (value?: number | null): number => {
  if (!value || value <= 0) return 1e-6;
  return value;
};

const moralRate = (moralHalfLifeYears: number): number =>
  LN2 / safeHalfLife(moralHalfLifeYears);

const physicalRate = (physicalHalfLifeYears?: number | null): number =>
  physicalHalfLifeYears ? LN2 / safeHalfLife(physicalHalfLifeYears) : 0;

// Time descriptor interface
export interface TimeDescriptor {
  time_type: TimeType;
  duration_years?: number | null;
  physical_half_life_years?: number | null;
}

/**
 * Linear time model: no moral discounting
 */
const computeLinear = (desc: TimeDescriptor): number => {
  if (desc.time_type === "finite") {
    return desc.duration_years ?? 0;
  } else {
    // For indefinite, use physical half-life as proxy for duration
    // or some configured cap (using physical_half_life_years as the effective duration)
    return desc.physical_half_life_years ?? 100; // default cap of 100 years
  }
};

/**
 * Half-life time model: exponential discounting
 */
const computeHalfLife = (
  desc: TimeDescriptor,
  moralHalfLifeYears: number
): number => {
  const lambdaM = moralRate(moralHalfLifeYears);

  if (desc.time_type === "indefinite") {
    const lambdaP = physicalRate(desc.physical_half_life_years);
    const denom = lambdaM + lambdaP;
    return denom > 0 ? 1 / denom : 0;
  }

  const D = desc.duration_years ?? 0;
  if (D <= 0) return 0;
  return (1 - Math.exp(-lambdaM * D)) / lambdaM;
};

/**
 * Bucketed time model: different weights for different time buckets
 */
const computeBucketed = (desc: TimeDescriptor, stance: TimeStance): number => {
  const shortYears = stance.short_term_years ?? 5;
  const mediumYears = stance.medium_term_years ?? 30;
  const shortWeight = stance.short_term_weight ?? 1.0;
  const mediumWeight = stance.medium_term_weight ?? 0.5;
  const longWeight = stance.long_term_weight ?? 0.2;

  let duration: number;
  if (desc.time_type === "finite") {
    duration = desc.duration_years ?? 0;
  } else {
    // For indefinite, use physical half-life as proxy
    duration = desc.physical_half_life_years ?? 100;
  }

  if (duration <= 0) return 0;

  // Split duration into buckets and apply weights
  let effectiveDuration = 0;

  if (duration <= shortYears) {
    effectiveDuration = duration * shortWeight;
  } else if (duration <= mediumYears) {
    effectiveDuration =
      shortYears * shortWeight +
      (duration - shortYears) * mediumWeight;
  } else {
    effectiveDuration =
      shortYears * shortWeight +
      (mediumYears - shortYears) * mediumWeight +
      (duration - mediumYears) * longWeight;
  }

  return effectiveDuration;
};

/**
 * Main entry point: compute effective duration based on time stance
 */
export const computeEffectiveDuration = (
  desc: TimeDescriptor,
  stance: TimeStance
): number => {
  switch (stance.model) {
    case "linear":
      return computeLinear(desc);
    case "half_life":
      return computeHalfLife(desc, stance.moral_half_life_years ?? 30);
    case "bucketed":
      return computeBucketed(desc, stance);
    default:
      // Fallback to half-life
      return computeHalfLife(desc, 30);
  }
};
