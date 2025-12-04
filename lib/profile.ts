import {
  DEFAULT_AXIOM_WEIGHTS,
  DEFAULT_SOCIAL_CLASSES,
  DEFAULT_TIME_STANCE,
} from "./constants";
import { Anchor, MUCalibration, SocialClass, TimeStance } from "./models";

export interface Profile {
  axiomWeights: Record<string, number>; // in MU per person-year
  socialClasses: SocialClass[]; // editable list
  timeStance: TimeStance; // pluggable time model
  muCalibration?: MUCalibration; // optional: for MU -> USD conversion
  customAnchors?: Anchor[]; // optional: user-defined anchors
}

const COOKIE_NAME = "oe_profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const defaultProfile = (): Profile => ({
  axiomWeights: { ...DEFAULT_AXIOM_WEIGHTS },
  socialClasses: [...DEFAULT_SOCIAL_CLASSES],
  timeStance: { ...DEFAULT_TIME_STANCE },
  muCalibration: undefined,
  customAnchors: [],
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

    // Handle migration from old format
    let timeStance = DEFAULT_TIME_STANCE;
    if (parsed.timeStance) {
      timeStance = parsed.timeStance;
    } else if (typeof parsed.moralHalfLifeYears === "number") {
      // Migrate old format
      timeStance = {
        model: "half_life",
        moral_half_life_years: parsed.moralHalfLifeYears,
      };
    }

    let socialClasses = DEFAULT_SOCIAL_CLASSES;
    if (parsed.socialClasses && Array.isArray(parsed.socialClasses)) {
      socialClasses = parsed.socialClasses;
    } else if (parsed.socialWeights) {
      // Migrate old format
      socialClasses = Object.entries(parsed.socialWeights).map(
        ([id, weight]) => ({
          id,
          label:
            DEFAULT_SOCIAL_CLASSES.find((c) => c.id === id)?.label || id,
          weight: weight as number,
        })
      );
    }

    return {
      axiomWeights: {
        ...DEFAULT_AXIOM_WEIGHTS,
        ...(parsed.axiomWeights || {}),
      },
      socialClasses,
      timeStance,
      muCalibration: parsed.muCalibration || undefined,
      customAnchors: parsed.customAnchors || [],
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
