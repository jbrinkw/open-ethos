export const EXAMPLE_JSON = `
{
  "id": "abortion-access-001",
  "question": "Should abortion be legally accessible in the first trimester?",
  "scope": "General/typical cases: consensual pregnancy, adult decision-maker, no immediate medical emergency, no severe fetal abnormalities incompatible with life. Focuses on elective first-trimester abortion (~0-12 weeks).",
  "context": "Policy decision about abortion access for pregnancies up to ~12 weeks. Considering individual rights, health impacts, and societal values. This analysis aims to weigh all moral dimensions transparently.",
  "excluded_scenarios": [
    {
      "scenario": "Pregnancy from rape or incest",
      "why_separate": "Compounded bodily autonomy violation (sexual assault + forced pregnancy) fundamentally changes the moral calculus. The autonomy violation is layered and includes severe trauma.",
      "separate_question": "Should abortion be accessible for pregnancies resulting from rape or incest?"
    },
    {
      "scenario": "Life-threatening medical complications",
      "why_separate": "This becomes a triage/medical necessity question rather than an elective choice question. The pregnant person's life is in immediate danger.",
      "separate_question": "Should abortion be accessible when pregnancy poses imminent threat to the pregnant person's life?"
    },
    {
      "scenario": "Severe fetal abnormalities incompatible with life",
      "why_separate": "Different question about quality of life, suffering of child, and compassionate end-of-life decisions rather than preventing a healthy birth.",
      "separate_question": "Should abortion be accessible for pregnancies with fatal fetal abnormalities?"
    },
    {
      "scenario": "Minors and those below age of consent",
      "why_separate": "Introduces questions of parental consent, guardianship, capacity to consent, and child welfare that are distinct from adult autonomy.",
      "separate_question": "What should the policy be for minors seeking abortion (parental consent, judicial bypass, etc.)?"
    },
    {
      "scenario": "Late-term abortion (second/third trimester)",
      "why_separate": "Fetal development at later stages raises different questions about personhood, viability, and potential suffering of the fetus.",
      "separate_question": "Should abortion remain accessible in the second or third trimester, and under what circumstances?"
    }
  ],
  "factors": [
    {
      "id": "bodily-autonomy-pregnant-person",
      "name": "Bodily autonomy of pregnant person",
      "description": "Right to control one's own body and medical decisions during pregnancy",
      "what_changes": "Whether person must continue pregnancy against their will",
      "who_affected": "Pregnant individuals",
      "how_much": "Complete control vs forced 9-month bodily use",
      "duration": "Duration of pregnancy plus recovery (9-10 months)",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "bodily_autonomy",
          "intensity_per_year": 0.8,
          "duration_years": 0.75,
          "confidence": 0.9,
          "polarity": 1.0,
          "rationale": "Forced pregnancy is severe bodily autonomy violation (confinement-level intensity); 9 months duration"
        },
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.6,
          "duration_years": 0.75,
          "confidence": 0.85,
          "polarity": 1.0,
          "rationale": "Forced intervention - liberty restricted for medical/personal decision; 9 months duration"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "US women seeking abortion annually (~1.5% of women 15-44) - cases per year"
        }
      ]
    },
    {
      "id": "health-risks-pregnancy",
      "name": "Health risks of pregnancy and childbirth",
      "description": "Medical complications, maternal mortality, and long-term health impacts of forced pregnancy",
      "what_changes": "Health outcomes when abortion access is restricted",
      "who_affected": "Pregnant individuals, especially high-risk cases",
      "how_much": "Ranges from moderate complications to death",
      "duration": "Immediate risks plus long-term complications",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.5,
          "duration_years": 1,
          "confidence": 0.8,
          "polarity": 1.0,
          "rationale": "Pregnancy carries serious health risks (hospitalization-level for complications); ~1 year impact"
        },
        {
          "axiom_id": "life_health",
          "intensity_per_year": 1.0,
          "duration_years": 40,
          "confidence": 0.3,
          "polarity": 1.0,
          "rationale": "~700 maternal deaths/year in US (death-level intensity, ~40 years lost life); low probability"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "Those seeking abortion - all face health risks - cases per year"
        },
        {
          "social_class_id": "citizens",
          "count": 700,
          "description": "Estimated maternal deaths if all forced to term - cases per year"
        }
      ]
    },
    {
      "id": "mental-health-forced-pregnancy",
      "name": "Mental health impact of forced pregnancy",
      "description": "Psychological trauma, depression, anxiety from being forced to continue unwanted pregnancy",
      "what_changes": "Mental health outcomes when denied abortion",
      "who_affected": "Those denied wanted abortion",
      "how_much": "Significant to severe psychological suffering",
      "duration": "During pregnancy and potentially years after",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.5,
          "duration_years": 2,
          "confidence": 0.75,
          "polarity": 1.0,
          "rationale": "Significant suffering during forced pregnancy and postpartum period; ~2 years impact"
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.3,
          "duration_years": 5,
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "Ongoing moderate anxiety/distress for some (moderate anxiety level); ~5 years for subset"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "Those seeking abortion - denied autonomy causes distress - cases per year"
        }
      ]
    },
    {
      "id": "economic-burden",
      "name": "Economic burden on pregnant person",
      "description": "Financial costs of pregnancy, childbirth, lost income, and potential childcare",
      "what_changes": "Long-term economic trajectory and opportunities",
      "who_affected": "Pregnant person and their existing family",
      "how_much": "Substantial financial burden, reduced career opportunities",
      "duration": "18+ years if raising child, immediate if adoption",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.3,
          "duration_years": 18,
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "Reduced education/career capacity (moderate-significant impact); 18 years if raising child"
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.2,
          "duration_years": 10,
          "confidence": 0.65,
          "polarity": 1.0,
          "rationale": "Financial stress and hardship (mild-moderate stress); ~10 years average impact"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 300000,
          "description": "Est. ~60% of those seeking abortion cite economic reasons - cases per year"
        }
      ]
    },
    {
      "id": "impact-existing-children",
      "name": "Impact on existing children in family",
      "description": "Reduced resources and parental attention for existing children",
      "what_changes": "Resource allocation and quality of life for existing children",
      "who_affected": "Existing children in family",
      "how_much": "Moderate reduction in resources and opportunities",
      "duration": "Throughout childhood",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "fairness_equality",
          "intensity_per_year": 0.2,
          "duration_years": 18,
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "Reduced fairness/resources for existing children; 18 years childhood impact"
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.15,
          "duration_years": 18,
          "confidence": 0.55,
          "polarity": 1.0,
          "rationale": "Mild reduction in wellbeing from stretched resources; 18 years childhood"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 300000,
          "description": "Est. ~60% have existing children (avg ~2 per family) - affected children per year of new births"
        }
      ]
    },
    {
      "id": "loss-potential-life",
      "name": "Loss of potential human life",
      "description": "Fetus that would develop into person with full lifespan is terminated",
      "what_changes": "Existence of potential future person",
      "who_affected": "Fetus/potential person",
      "how_much": "Complete loss of potential life (~80 year lifespan)",
      "duration": "Full expected human lifespan",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.4,
          "duration_years": 80,
          "confidence": 0.2,
          "polarity": -1.0,
          "rationale": "Significant moral uncertainty about personhood at <12 weeks; first-trimester embryo lacks developed nervous system, consciousness markers; many reject full moral status at this stage"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "Annual abortions - each a potential life - cases per year"
        }
      ]
    },
    {
      "id": "psychological-impact-abortion",
      "name": "Psychological impact on person having abortion",
      "description": "Some individuals experience grief, guilt, or regret after abortion (though studies show most feel relief)",
      "what_changes": "Mental health of subset who experience negative emotions",
      "who_affected": "Subset of those having abortion",
      "how_much": "Ranges from mild regret to significant distress for minority",
      "duration": "Can be long-term for some individuals",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.3,
          "duration_years": 5,
          "confidence": 0.4,
          "polarity": -1.0,
          "rationale": "Moderate anxiety/distress for minority who experience negative emotions; ~5 years for those affected; low confidence as most studies show relief, not regret"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 50000,
          "description": "Est. ~10% who may experience significant distress (contested estimate) - cases per year"
        }
      ]
    },
    {
      "id": "societal-devaluing-life",
      "name": "Societal impact on value of human life",
      "description": "Concern that widespread abortion normalizes devaluing human life in early stages",
      "what_changes": "Cultural attitudes toward sanctity of life and moral boundaries",
      "who_affected": "Society broadly",
      "how_much": "Incremental erosion of life-valuing norms (contested)",
      "duration": "Ongoing cultural impact",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "social_trust",
          "intensity_per_year": 0.01,
          "confidence": 0.15,
          "polarity": -1.0,
          "rationale": "Minimal empirical support for slippery slope claims; societies with legal abortion don't show decreased life-valuing; very low confidence"
        },
        {
          "axiom_id": "truth_epistemic",
          "intensity_per_year": 0.01,
          "confidence": 0.1,
          "polarity": -1.0,
          "rationale": "When life begins is philosophical/religious, not empirically decidable; abortion access doesn't preclude personal beliefs"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 330000000,
          "description": "US population - diffuse cultural impact"
        }
      ]
    }
  ]
}
`;
