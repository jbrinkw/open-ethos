Here’s the **updated spec** with our new ideas baked in, then a **diff summary** at the end.

---

# Open Ethos Decision Engine (MU + Pluggable Time Spec)

A personal moral-scoring calculator. Users set axiom weights, social-distance weights, and moral time stance; the engine applies a transparent formula to any decision JSON. This repo is a client-side Next.js app (no Streamlit).

Binary only: every factor pushes toward **YES** or **NO** via `polarity` (no 3rd option).

---

## Core Formula + Units

Per factor–axiom–group, the engine computes a contribution in **Moral Units (MU)**:

```text
W = U × (I × T_eff) × C × P × S
```

* **U**: Axiom MU weight (≥ 0).

  * Internally: MU per person-year at full intensity for that axiom.
  * In UI: user can enter any positive numbers; engine normalizes later.
* **I**: Intensity per year (0–1), **normalized from anchors** for that axiom.
* **T_eff**: Effective duration (years) from the time module (see Time Integration).
* **C**: Confidence / probability (0–1).
* **P**: Polarity (−1 to +1; negative = pushes NO, positive = pushes YES).
* **S**: Scale = Σ over scale groups of `count × social_class_weight`.

Total decision score (in MU):

```text
total_score = Σ_factors Σ_axioms W
```

Binary strength (contestation-aware):

```text
ratio = |total_score| / Σ_factors |factor_score|
```

* `factor_score` = Σ_axioms W for that factor.
* **Strong** ≥ 0.50, **Medium** ≥ 0.20, **Weak** otherwise.

### MU → dollars (optional)

We can interpret MU as equivalent dollars for this user:

* Choose a calibration scenario (e.g. “1 year severe depression for me = $50,000”).
* That scenario has some total MU, call it `MU_cal`.
* Define:

```text
MU_to_USD = 50_000 / MU_cal
```

All outputs can then be shown as:

```text
score_USD = total_score_MU × MU_to_USD
```

The math always runs in MU; $ is just a display layer.

---

## Time Integration (Pluggable Time Module)

Factors store **what the time shape is**; the user profile stores **how to value it**.

### Time descriptor (stored in factor)

For each axiom_pair:

* `time_type`:

  * `"finite"`: finite duration.
  * `"indefinite"`: structural / ongoing.
* `duration_years`: required if `time_type = "finite"`.
* `physical_half_life_years`: required if `time_type = "indefinite"` (how the effect physically decays).

This is time **data**, not the value stance.

### Time stance (stored in profile)

```ts
time_stance = {
  model: "linear" | "half_life" | "bucketed",
  // model-specific params:
  moral_half_life_years?: number,
  short_term_weight?: number,
  medium_term_weight?: number,
  long_term_weight?: number
}
```

### Time module interface

Conceptually:

```ts
T_eff = computeEffectiveDuration(time_descriptor, time_stance)
```

Scoring treats `T_eff` as a black box. Only the **time module** knows how to combine duration + stance.

#### Built-in models

1. **Linear**

* No moral discounting.

```text
finite:     T_eff = duration_years
indefinite: T_eff = physical_half_life_years  (or some configured cap)
```

2. **Half-life** (what you already had)

* **Moral half-life (H_moral)**: “After how many years does an equal impact matter half as much?”
* **Physical half-life (H_phys)**: For indefinite/structural factors.
* Rates: `λ = ln(2) / half_life`

Effective duration:

* Finite:

  ```text
  λ_m = ln(2) / H_moral
  T_eff = (1 - exp(-λ_m × duration_years)) / λ_m
  ```

* Indefinite:

  ```text
  λ_m = ln(2) / H_moral
  λ_p = ln(2) / H_phys
  T_eff = 1 / (λ_m + λ_p)
  ```

3. **Bucketed** (optional)

* Short-, medium-, long-term buckets with separate weights.
* Example: full weight 0–5y, medium 5–30y, low beyond 30y.

---

## Axioms (8)

Fixed axiom IDs:

* `life_health`
* `bodily_autonomy`
* `civil_liberty`
* `suffering_wellbeing`
* `fairness_equality`
* `truth_epistemic`
* `long_term_capacity`
* `social_trust`

---

## Social Distance (Editable Classes)

User has a list of **social classes** with weights. Default starter set:

```jsonc
"social_classes": [
  { "id": "self",          "label": "Me",                     "weight": 1.0 },
  { "id": "inner_circle",  "label": "Close friends/family",   "weight": 0.8 },
  { "id": "tribe",         "label": "My group / tribe",       "weight": 0.5 },
  { "id": "citizens",      "label": "Random citizen",         "weight": 0.3 },
  { "id": "outsiders",     "label": "Distant outsider",       "weight": 0.1 }
]
```

Users can **add more**, e.g.:

```jsonc
{ "id": "felon",   "label": "Convicted felon",   "weight": 0.2 },
{ "id": "scammer", "label": "Known scammer",     "weight": 0.05 }
```

In the UI:

* They can edit class list and weights in any positive scale.
* Engine can optionally normalize internally (e.g. max weight → 1.0).

`S` in the formula is:

```text
S = Σ_scale_groups (count × social_class_weight)
```

---

## Intensity Anchors (Multi-Axiom, Time-Free)

Anchors are **scenarios**, not per-year numbers, and can touch multiple axioms. Time is handled by factors, not anchors.

Schema:

```jsonc
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
```

Rules:

* Anchors only need intensities for **relevant** axioms; others can be omitted.
* `raw_axiom_intensities`:

  * arbitrary positive scale (e.g. 0–10 or 0–100).
* Engine normalizes per axiom to get `normalized_axiom_intensities` in [0,1].
* Anchors never carry `years`. Duration lives in the factor’s time descriptor.

Example conceptual anchors (raw, not locked to 0–1):

* Life/Health:

  * “Minor illness episode”
  * “Moderate illness”
  * “Serious injury / hospitalization”
  * “Severe chronic illness”
  * “Death”
* Autonomy/Liberty:

  * “Mild inconvenience / friction”
  * “Moderate coercion”
  * “Large restriction”
  * “Forced intervention (e.g. treatment)”
  * “Confinement”
* Suffering/Wellbeing:

  * “Mild stress”
  * “Moderate anxiety”
  * “Significant suffering”
  * “Severe psychological harm”
  * “Breakdown”

Factors then say “this is like *anchor X* on axiom A, for N years”.

---

## JSON Shape (time-aware, anchors-aware)

Updated conceptual JSON:

```json
{
  "id": "question-id",
  "question": "...",
  "context": "...",
  "factors": [
    {
      "id": "factor-id",
      "name": "...",
      "description": "...",
      "what_changes": "...",
      "who_affected": "...",
      "how_much": "...",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "anchor_id": "anchor_death",          // optional: use anchor
          "intensity_per_year": 1.0,            // normalized 0–1; usually derived from anchor
          "time_type": "finite",                // "finite" | "indefinite"
          "duration_years": 40,                 // required if finite
          "physical_half_life_years": null,     // required if indefinite
          "confidence": 0.7,                    // 0–1
          "polarity": 1.0,                      // +1 YES, -1 NO
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
```

Validation:

* `time_type = "finite"` → `duration_years` required, `physical_half_life_years` null.
* `time_type = "indefinite"` → `physical_half_life_years` required, `duration_years` optional or null.
* `anchor_id` optional; if present, UI should derive `intensity_per_year` from that anchor’s normalized intensity for this axiom (possibly scaled by user).

---

## Project Structure (Next.js)

Unchanged at high level:

```text
moral-engine/
├─ app/            # Next.js app router pages (home, user-guide)
├─ lib/            # scoring, time, models, prompt, profile (cookies)
├─ node_modules/
├─ package.json
├─ next.config.js
├─ tailwind.config.js
├─ tsconfig.json
└─ .gitignore
```

### Implementation Notes

* Scoring: `scoreDecision` in TypeScript; uses:

  * MU axiom weights,
  * `computeEffectiveDuration` from the time module,
  * factor formula in MU.
* Time: via pluggable module (`linear`, `half_life`, `bucketed`…).
* Anchors:

  * Stored as multi-axiom objects,
  * UI lets user set raw intensities; engine normalizes.
* Social distance:

  * `social_classes` editable list in profile, with default starter set.
* Storage: Profile stored in cookies (client-only). No server calls.
* Rebuttals: Still out of active use (models kept for future).

---

## Running / Deploying

Same:

```bash
npm install
npm run dev   # http://localhost:3000
npm run build
```

Deploy to Vercel: import repo, framework Next.js, defaults (build: `npm run build`, output: `.next`). No env vars required.

---

## Usage Flow

1. Copy the prompt header → generate decision JSON with AI.
2. Paste JSON into the app → Score (runs locally, returns MU + optional $).
3. Inspect/edit factors, anchors, time stance, axioms, and social classes → rescore.
4. Reference axioms / anchors; manage anchors and social classes via modals; read User Guide (`/user-guide`).

---

## Transparency Principles

* Deterministic scoring.
* **All parameters visible and editable**:

  * axiom weights (MU),
  * anchors,
  * social classes,
  * time stance.
* Strength reflects internal contestation between factors.
* Factors must be concrete, grounded to anchors where possible, and cover both sides (YES/NO) via polarity.

---

## What changed vs the old spec

1. **Units / weights**

   * Old: `U` was a 0–1 dimensionless axiom weight.
   * New: `U` is a **MU-per-person-year** weight; engine can map MU → $ via a calibration scenario.

2. **Time**

   * Old: Single baked-in exponential half-life model; `T_eff` always used that formula.
   * New: **Pluggable time module**:

     * `time_stance.model` can be `"linear"`, `"half_life"`, `"bucketed"`, etc.
     * Half-life math is now one implementation, not the only one.

3. **Anchors**

   * Old: Anchors were informal per-axiom labels (“0.1 minor illness, 1.0 death”) and implicitly “per year”.
   * New:

     * Anchors are **explicit objects**: real-world scenarios with **per-axiom raw intensities**.
     * Time is **not** in the anchor; duration is only in factors.
     * Raw intensities can be any scale; engine normalizes to 0–1 per axiom.

4. **Social distance**

   * Old: Social-distance weights were a fixed hard-coded set.
   * New:

     * Social classes are an **editable list** in the profile, with your old set as the **default starter**.
     * `scale_groups` now reference `social_class_id`.

5. **Binary + strength**

   * Old: Binary behavior was implicit; strength metric only described once.
   * New:

     * Binary nature is explicit (everything is YES vs NO via polarity).
     * Strength formula is unchanged, but now clearly defined as the **binary** contestation metric.
i have