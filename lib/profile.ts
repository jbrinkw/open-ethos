import {
  DEFAULT_AXIOM_WEIGHTS,
  DEFAULT_MORAL_HALF_LIFE_YEARS,
  DEFAULT_SOCIAL_WEIGHTS,
} from "./constants";

export interface Profile {
  axiomWeights: Record<string, number>;
  socialWeights: Record<string, number>;
  moralHalfLifeYears: number;
}

const COOKIE_NAME = "oe_profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const defaultProfile = (): Profile => ({
  axiomWeights: { ...DEFAULT_AXIOM_WEIGHTS },
  socialWeights: { ...DEFAULT_SOCIAL_WEIGHTS },
  moralHalfLifeYears: DEFAULT_MORAL_HALF_LIFE_YEARS,
});

export const loadProfileFromCookie = (): Profile => {
  if (typeof document === "undefined") return defaultProfile();
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return defaultProfile();
  try {
    const raw = decodeURIComponent(match.split("=")[1]);
    const parsed = JSON.parse(raw);
    return {
      axiomWeights: { ...DEFAULT_AXIOM_WEIGHTS, ...(parsed.axiomWeights || {}) },
      socialWeights: { ...DEFAULT_SOCIAL_WEIGHTS, ...(parsed.socialWeights || {}) },
      moralHalfLifeYears:
        typeof parsed.moralHalfLifeYears === "number"
          ? parsed.moralHalfLifeYears
          : DEFAULT_MORAL_HALF_LIFE_YEARS,
    };
  } catch {
    return defaultProfile();
  }
};

export const saveProfileToCookie = (profile: Profile) => {
  if (typeof document === "undefined") return;
  const data = encodeURIComponent(JSON.stringify(profile));
  document.cookie = `${COOKIE_NAME}=${data}; path=/; max-age=${COOKIE_MAX_AGE}`;
};
