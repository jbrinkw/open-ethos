import { TimeType } from "./models";

const LN2 = Math.log(2);

const safeHalfLife = (value?: number | null): number => {
  if (!value || value <= 0) return 1e-6;
  return value;
};

const moralRate = (moralHalfLifeYears: number): number =>
  LN2 / safeHalfLife(moralHalfLifeYears);

const physicalRate = (physicalHalfLifeYears?: number | null): number =>
  physicalHalfLifeYears ? LN2 / safeHalfLife(physicalHalfLifeYears) : 0;

export const computeEffectiveDuration = (
  timeType: TimeType,
  durationYears: number | null | undefined,
  physicalHalfLifeYears: number | null | undefined,
  moralHalfLifeYears: number
): number => {
  const lambdaM = moralRate(moralHalfLifeYears);

  if (timeType === "indefinite") {
    const lambdaP = physicalRate(physicalHalfLifeYears);
    const denom = lambdaM + lambdaP;
    return denom > 0 ? 1 / denom : 0;
  }

  const D = durationYears ?? 0;
  if (D <= 0) return 0;
  return (1 - Math.exp(-lambdaM * D)) / lambdaM;
};
