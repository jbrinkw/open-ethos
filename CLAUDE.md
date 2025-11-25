# Open Ethos Decision Engine (Time-Integrated Spec)

A personal moral-scoring calculator. Users set axiom weights, social distance weights, and moral time stance; the engine applies a transparent formula to any decision JSON. This repo is now a client-side Next.js app (no Streamlit).

---

## Core Formula

Per factor–axiom–group:

```
W = U x (I x T_eff) x C x P x S
```

- **U**: Axiom weight (0–1)
- **I**: Intensity per year (0–1)
- **T_eff**: Effective duration (years) from time inputs
- **C**: Confidence / probability (0–1)
- **P**: Polarity (−1 to +1; negative = NO, positive = YES)
- **S**: Scale = count x social-distance weight

Decision strength (contestation-aware):

```
ratio = |total_score| / sum(|factor_scores|)
```

Strong ≥ 0.50, Medium ≥ 0.20, Weak otherwise.

---

## Time Integration

- **Moral half-life (H_moral)**: “After how many years does an equal impact matter half as much?”
- **Physical half-life (H_phys)**: For indefinite/structural factors.

Rates: `lambda = ln(2) / half_life`

Effective duration:
- Finite: `T_eff = (1 - exp(-λ_m * duration_years)) / λ_m`
- Indefinite: `T_eff = 1 / (λ_m + λ_p)` (uses H_moral + H_phys)

---

## Axioms (8)

life_health; bodily_autonomy; civil_liberty; suffering_wellbeing; fairness_equality; truth_epistemic; long_term_capacity; social_trust.

Social distance defaults: self 1.0, inner_circle 0.8, tribe 0.5, citizens 0.3.

---

## Intensity Anchors (per year)

Life/Health: 0.1 minor illness; 0.3 moderate; 0.5 serious/hospitalization; 0.7 severe/chronic; 1.0 death (use remaining lifespan).  
Autonomy/Liberty: 0.1 inconvenience; 0.2 moderate coercion; 0.4 significant restriction; 0.6 forced intervention; 0.8 confinement.  
Suffering/Wellbeing: 0.1 mild stress; 0.3 moderate anxiety; 0.5 significant suffering; 0.7 severe psychological harm; 1.0 breakdown.

---

## JSON Shape (time-aware)

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
      "duration": "...",
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
        { "group_type": "citizens", "count": 300000, "description": "Who/what count" }
      ]
    }
  ]
}
```

Validation: finite → require duration_years; indefinite → require physical_half_life_years.

---

## Project Structure (Next.js)

```
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

---

## Implementation Notes

- Scoring: `scoreDecision` in TypeScript; uses `T_eff` and contestation-aware strength.
- UI: Next.js client-side; editable factor parameters, calibration (axiom weights, social weights, moral half-life), anchors modal, reference, prompt viewer, user guide.
- Storage: Profile stored in cookies (client-only). No server calls.
- Rebuttals: Out of active use (models kept for future).

---

## Running / Deploying

```
npm install
npm run dev   # http://localhost:3000
npm run build
```

Deploy to Vercel: import repo, framework Next.js, defaults (build: npm run build, output: .next). No env vars required.

---

## Usage Flow

1) Copy prompt (header) → generate JSON with AI.  
2) Paste JSON (header input) → Score (runs locally).  
3) Inspect/edit factors and calibration → rescore.  
4) Reference axioms/anchors; manage anchors via modal; read the User Guide (`/user-guide`).  

---

## Transparency Principles

Deterministic scoring; all parameters visible/editable; strength reflects contestation; factors must be concrete, grounded to anchors, and cover both sides. 
