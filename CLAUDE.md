Part I: Theory & Mechanics

The engine is a binary moral calculator:

Every factor pushes toward YES or NO via its polarity.

Contributions are measured in Moral Units (MU).

Time is handled through Temporal Profiles and time descriptors, not hidden in magic scalars.

1. Core Formula + Units

Per (factor, axiom, scale_group) the engine computes:

W = U × (I × T_eff) × C × P × S


Where:

U: Axiom MU weight (≥ 0)

Internal meaning: MU per person-year at full intensity for that axiom.

UI: user enters any positive numbers; engine may normalize.

I: Intensity per year ∈ [0,1]

Derived from anchors per axiom (time-free scenarios).

T_eff: Effective duration (years)

Comes from the time module given the factor’s time descriptor + user time stance.

How exactly we use T_eff depends on the Temporal Profile (see below).

C: Confidence / probability ∈ [0,1]

P: Polarity ∈ [−1, +1]

Negative → pushes NO.

Positive → pushes YES.

S: Social scale

S = Σ_scale_groups (count × social_class_weight)


count: number of individuals (or equivalent units) in that group.

social_class_weight: user-defined weight for that class.

At full intensity (I = 1), one year, one person, weight 1, confidence 1, polarity +1:

W = U


So U directly encodes how many MU one full-intensity person-year is worth on that axiom.

Factor and decision scores

Factor score:

factor_score = Σ_axioms W  (summed over all axiom_pairs for that factor)


Total decision score (fully aggregated view):

total_score_MU = Σ_factors factor_score


This aggregated scalar is one view; the engine also exposes Temporal Profile-wise metrics (Transition vs Steady) so you can see where the score is coming from.

Binary strength (contestation-aware)

Binary decision:

Sign of total_score_MU → YES vs NO.

Strength:

ratio = |total_score_MU| / Σ_factors |factor_score|


Strong ≥ 0.50

Medium ≥ 0.20

Weak otherwise

2. Temporal Profiles

Each factor has a Temporal Profile that describes how its effect plays out in time:

temporal_profile ∈ {
  "transition",        // time-limited around policy change
  "steady_case_flow",  // recurring cohorts per year
  "steady_structural"  // background per person-year
}


This is orthogonal to the physical time shape (time_type = "finite" | "indefinite"). Think:

temporal_profile: pattern in decision space (shock vs recurring vs ambient).

time_type: physical persistence of the underlying effect.

2.1 Profiles
2.1.1 Transition profile

Time-limited effects around the change that then fade out.

Examples:

Initial riots, protests, legal chaos.

Early “messy” years where illegal workarounds are especially dangerous.

First cohorts that are hit harder and then the system stabilizes.

Interpretation:

For Transition factors, T_eff from the time module is used directly in W.

Decision-level metric:

total_transition_MU = Σ_transition_factors Σ_axioms W


This is a finite blob: “total MU cost/benefit of the transition phase” under the current time stance.

2.1.2 Steady case-flow profile

New harmed/benefited individuals per year as long as the policy holds.

Examples:

Each year: N mothers forced to carry unwanted pregnancies.

Each year: N extra prisoners under a harsh sentencing law.

Each year: N additional people denied life-saving treatment.

Core reporting unit is per policy-year. Case-flow respects **per-case duration** with a linear, no-discount model.

**Per-case timeline**

For each axiom_pair in a case-flow factor:

* Use the factor's `duration_years` as a **finite window** for that impact on people in the case.
* `time_type` should conceptually be "finite" for these; the engine doesn't enforce it, but that's the intended use.

Per-case contribution on that axiom:

MU_per_case[axiom_pair] = U × I × duration_years × C × P


(No T_eff from the time stance; this is a straight person-years × intensity calculation.)

Per-case total for that factor:

MU_per_case_factor = Σ_axiom_pairs MU_per_case[axiom_pair]


**Cases per year**

For steady case-flow, `scale_groups` are interpreted as **cases per year**:

cases_per_year_weighted_factor = Σ_scale_groups (count_per_year × social_class_weight)


Then the **per-year** MU from that factor is:

MU_per_year_case_flow_factor = MU_per_case_factor × cases_per_year_weighted_factor


Decision-level case-flow lane:

total_case_flow_MU_per_year =
  Σ_factors[temporal_profile = "steady_case_flow"] MU_per_year_case_flow_factor


Interpretation:

"If we look at the **cohort of cases that begin in one year**, and follow their whole finite impact over time with no discount, how many MU is that cohort worth?"

This keeps:

* Duration differences between factors,
* Case counts per year,
* Social-distance weights,

without bringing in decay/horizons.

**Time stance and decay for case-flow**

For `temporal_profile = "steady_case_flow"`, the engine uses a **linear, no-discount** treatment of time within each case. `duration_years` is taken at face value; the user's time stance does not modify it.

The moral stance about time (half-life, etc.) is only used in:

* **Transition** profile (`temporal_profile = "transition"`), and
* Optional long-horizon aggregations for structural/legacy effects (if you decide to add those later).

**Relationship to "capped at lifespan"**

Case-flow factors are intended for finite, person-level trajectories (e.g., lifetime of a child, long-term health trajectory of a parent). Very long-run civilization or cultural effects should be modeled in structural/legacy profiles instead of extending a single case for centuries.

The spec assumes case-flow factors describe **finite, human-scale** impacts for directly involved people. Modelers are expected to pick `duration_years` that make sense (often on the order of a human life or less).

2.1.3 Steady structural profile

Ambient background per person-year while the regime holds.

Examples:

Cultural devaluation of early life.

Constant low-level fear under surveillance.

Ambient discrimination, stigma, or mistrust.

Again, core reporting is per policy-year with T_eff = 1:

W_structural_per_year = U × I × 1 × C × P × S
total_structural_MU_per_year = Σ_steady_structural_factors Σ_axioms W_structural_per_year


Interpretation:

“Per year, what is the MU cost/benefit of living in this structural background, given current population?”

2.2 Physical time shape (time_type)

Independently of the profile, each axiom_pair has a time descriptor:

time_type ∈ { "finite", "indefinite" }


"finite": effect has a bounded duration if it occurs.

duration_years: required.

"indefinite": effect is structural and persists/decays physically if the regime holds.

physical_half_life_years: required (how the effect physically decays in absence of a moral discount).

These describe physical behavior (episodes vs structural decay), not value stance.

2.3 Time stance

Each user has a time stance that encodes moral time preference:

time_stance = {
  model: "linear" | "half_life" | "bucketed",
  moral_half_life_years?: number,
  short_term_weight?: number,
  medium_term_weight?: number,
  long_term_weight?: number
}


Determines how much less they care about far future vs near future.

Used by the time module.

2.4 Time module (T_eff)

Conceptual interface:

T_eff = computeEffectiveDuration(time_descriptor, time_stance)


Where time_descriptor includes:

time_type

duration_years (finite)

physical_half_life_years (indefinite)

2.4.1 Built-in models

Linear

No moral discounting.

finite:     T_eff = duration_years
indefinite: T_eff = physical_half_life_years (or a configured cap)


Half-life (default)

Moral half-life H_moral:

λ_m = ln(2) / H_moral


Physical half-life H_phys:

λ_p = ln(2) / H_phys


Effective duration:

Finite:

T_eff = (1 - exp(-λ_m × duration_years)) / λ_m


Indefinite:

T_eff = 1 / (λ_m + λ_p)


Bucketed

Short/medium/long-term buckets (e.g. 0–5 / 5–30 / 30+ years) with explicit weights.

Implementation-specific; same interface, different T_eff.

2.4.2 Where T_eff is actually used

For Transition profile:

T_eff directly used in the core formula → total_transition_MU.

For Steady case-flow profile:

T_eff is NOT used. Instead, `duration_years` is taken directly for each axiom_pair in a linear, no-discount calculation. The user's time stance does not modify case-flow calculations.

For Steady structural profile:

Primary outputs use T_eff = 1 year by definition → per-year flows.

Optional "total over time" views may integrate flows with the time stance, but that's labeled as time-stance-dependent.

3. Derived Decision Metrics

The engine exposes several derived metrics built from the core formula.

3.1 Temporal Profile aggregates

Per decision:

Transition profile:

total_transition_MU = Σ_factors[temporal_profile="transition"] Σ_axioms W


Steady case flow (uses per-case duration, no decay):

MU_per_case_factor = Σ_axiom_pairs (U × I × duration_years × C × P)
cases_per_year_weighted = Σ_scale_groups (count × social_class_weight)
MU_per_year_case_flow_factor = MU_per_case_factor × cases_per_year_weighted

total_case_flow_MU_per_year =
  Σ_factors[temporal_profile="steady_case_flow"] MU_per_year_case_flow_factor


Steady structural:

total_structural_MU_per_year =
  Σ_factors[temporal_profile="steady_structural"] Σ_axioms (U × I × C × P × S)


These three numbers give a time-profile vector:

One finite blob (transition),

Two per-year flows (case-level and structural).

3.2 Finite vs indefinite cross-cut

You can also slice the same world by physical time_type.

Finite section:

finite_total_MU:

finite_total_MU = Σ_axiom_pairs[time_type="finite"] W


(This uses T_eff from the time module, so it is time-stance-dependent.)

finite_total_population:

finite_total_population = Σ_scale_groups contributing to finite_pairs (count)


finite_MU_per_capita:

finite_MU_per_capita = finite_total_MU / finite_total_population


finite_total_physical_person_years:

finite_total_physical_person_years =
  Σ_axiom_pairs[time_type="finite"] (duration_years × Σ_group count)


finite_MU_per_year_population:

finite_MU_per_year_population =
  finite_total_MU / finite_total_physical_person_years


Interpreted as average MU per person-year over the finite exposure window.

Indefinite section (flow per year):

indefinite_flow_MU_per_year:

indefinite_flow_MU_per_year =
  Σ_axiom_pairs[time_type="indefinite"] (U × I × C × P × S)


This is similar to total_structural_MU_per_year, but defined purely by time_type; structural transitions could appear here too.

3.3 Finite/Transition time graph

To visualize how finite/transition impacts are spread in time, the engine can build a yearly MU/time series from the transition and finite components:

Define a horizon K = max relevant duration (e.g. max finite duration used, or a configured cap).

For integer years k = 0, 1, …, K:

year_flow_MU(k) ≈ Σ_transition_or_finite_pairs
    (U × I × C × P × S × weight_for_year_k(pair, time_stance))


Where weight_for_year_k encodes how that pair’s effect is distributed over time (flat vs decaying etc). This is implementation detail for plotting; it does not change total_transition_MU.

The UI can show:

X-axis: years from now.

Y-axis: MU per year.

Only transition/finite contributions; steady per-year flows are shown separately as MU_per_year.

4. Stakeholder Metrics

For each distinct stakeholder group (identified by social_class_id + description), we can derive:

4.1 Scale recap

For any factor:

factor_total_scale = Σ_scale_groups (count × social_class_weight)

group_scale = count_group × social_class_weight_group

group_share = group_scale / factor_total_scale

4.2 Transition / finite contributions

For any factor with a finite/transition contribution:

factor_total_MU (from W-sum over axioms).

Group’s share of that factor:

group_MU_transition_or_finite_factor =
  factor_total_MU × group_share


Aggregate over all such factors:

group_total_MU_finite = Σ_relevant_factors group_MU_transition_or_finite_factor
group_per_capita_MU_finite = group_total_MU_finite / group_count


If you want per-person-year for finite/transition:

group_physical_person_years_finite =
  Σ_pairs_for_group[time_type="finite"] (duration_years × group_count)

group_per_capita_MU_per_year_finite =
  group_total_MU_finite / group_physical_person_years_finite

4.3 Steady flow contributions

For steady_case_flow:

The factor's MU_per_year already incorporates duration via the per-case model.

Group's share:

group_flow_MU_per_year_factor =
  MU_per_year_case_flow_factor × group_share


For steady_structural:

For each factor, define:

factor_flow_MU_per_year = Σ_axioms (U × I × C × P × S)


Group's share:

group_flow_MU_per_year_factor =
  factor_flow_MU_per_year × group_share


Aggregate across both steady profiles:

group_total_flow_MU_per_year =
  Σ_steady_factors group_flow_MU_per_year_factor

group_per_capita_flow_MU_per_year =
  group_total_flow_MU_per_year / group_count


These are the per-year ongoing impacts on each stakeholder group.

5. Axioms (8)

Fixed axiom IDs:

life_health

bodily_autonomy

civil_liberty

suffering_wellbeing

fairness_equality

truth_epistemic

long_term_capacity

social_trust

Factors decompose their effects into one or more of these.

6. Social Distance (Editable Classes)

User maintains an editable list:

"social_classes": [
  { "id": "self",          "label": "Me",                     "weight": 1.0 },
  { "id": "inner_circle",  "label": "Close friends/family",   "weight": 0.8 },
  { "id": "tribe",         "label": "My group / tribe",       "weight": 0.5 },
  { "id": "citizens",      "label": "Random citizen",         "weight": 0.3 },
  { "id": "outsiders",     "label": "Distant outsider",       "weight": 0.1 }
]


Users can add more classes and change weights. Engine may normalize (e.g. max weight → 1).

The S term uses these weights plus counts as described earlier.

7. Intensity Anchors (Multi-Axiom, Time-Free)

Anchors are scenario intensities, not time-bearing objects.

Example:

{
  "id": "anchor_severe_depression",
  "description": "Severe depression episode (no time attached).",
  "raw_axiom_intensities": {
    "suffering_wellbeing": 9,
    "life_health": 2
  },
  "normalized_axiom_intensities": {
    "suffering_wellbeing": 0.8,
    "life_health": 0.2
  }
}


Rules:

Only give intensities for relevant axioms.

raw_axiom_intensities are arbitrary positive numbers.

Engine normalizes per axiom across anchors to [0,1].

Anchors never hold years; temporal behavior is on the factor via Temporal Profile + time_type.

Factors then say:

“On suffering_wellbeing, this is ~0.6 of anchor_severe_depression, for 5 years, steady_case_flow profile.”

8. JSON Shape (time-aware, anchors-aware, scope-aware)

Conceptual shape:

{
  "id": "question-id",
  "question": "...",
  "scope": "...",
  "context": "...",
  "excluded_scenarios": [
    {
      "scenario": "...",
      "why_separate": "...",
      "separate_question": "..."
    }
  ],
  "factors": [
    {
      "id": "factor-id",
      "name": "...",
      "description": "...",
      "what_changes": "...",
      "who_affected": "...",
      "how_much": "...",
      "temporal_profile": "transition" | "steady_case_flow" | "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "anchor_id": "anchor_death",
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
        {
          "social_class_id": "citizens",
          "count": 300000,
          "description": "Who/what count"
        }
      ]
    }
  ]
}


Validation:

temporal_profile must be one of the three allowed values.

For transition profile: time_type = "finite" → duration_years required, physical_half_life_years null.
                        time_type = "indefinite" → physical_half_life_years required, duration_years optional/null.

For steady_case_flow: duration_years required (used directly, no decay). time_type should be "finite".

For steady_structural: time_type typically "indefinite" but not enforced.

anchor_id optional; if present, UI should derive intensity from anchor.

9. Scope & Excluded Scenarios

Same idea as before:

scope: which cases this analysis is about (e.g. “typical first-trimester elective abortions, adult, no immediate medical emergency”).

excluded_scenarios: edge cases that should be separate decisions (rape, life-of-mother, severe abnormalities, minors, etc.).

10. Transparency Principles

All parameters are visible and editable:

axiom weights (U),

anchors,

social classes,

Temporal Profiles,

time_type / durations / physical half-lives,

time stance.

Time is not hidden:

Transition uses the time stance to compute T_eff.

Case-flow uses duration_years directly with no decay (linear person-years).

Structural profiles expose MU per policy-year, not baked-in horizons.

Any aggregated scalar that integrates flows over time is explicitly labeled as dependent on the current time stance.

Binary strength is an honest measure of contestation under the chosen aggregation.

What changed vs the last theory spec

Updated steady case-flow to respect per-case duration:

* Case-flow now uses `MU_per_case = U × I × duration_years × C × P` (linear, no decay).
* Then multiplies by cases_per_year (from scale_groups) to get MU_per_year.
* Time stance / moral half-life does NOT affect case-flow; only transition uses T_eff.

Replaced informal "lanes/regimes" with explicit Temporal Profiles and a temporal_profile field.

Pulled back in the derived metrics you were using:

profile-wise aggregates (total_transition_MU, total_case_flow_MU_per_year, total_structural_MU_per_year),

finite vs indefinite cross-cut (finite_total_MU, indefinite_flow_MU_per_year, person-year metrics),

stakeholder split formulas (per-capita, per-year),

optional transition/finite time-series logic for graphs.

Clarified that:

Transition uses T_eff directly.

Case-flow uses duration_years directly (linear, no decay).

Structural uses T_eff = 1 for core outputs and only uses the time module for optional "total over time" views.

Kept all the previous pieces you need for the app + AI prompt: anchors, axioms, social distance, scope, JSON shape.