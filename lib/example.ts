export const EXAMPLE_ABORTION = `
{
  "id": "abortion-access-first-trimester",
  "question": "Should abortion be legally accessible in the first trimester?",
  "scope": "Typical first-trimester elective abortions for adult women (no immediate medical emergency, not involving rape/incest or severe fetal anomaly).",
  "context": "Assumes a society (e.g., the contemporary United States) where abortion access is contested. We examine general cases of early pregnancy abortion without extraordinary circumstances.",
  "excluded_scenarios": [
    {
      "scenario": "Pregnancies resulting from rape or incest",
      "why_separate": "These involve additional trauma and non-consent, raising distinct moral considerations beyond a standard elective abortion.",
      "separate_question": "Should abortion be allowed in cases of rape or incest?"
    },
    {
      "scenario": "Life-threatening medical emergencies for the mother",
      "why_separate": "When the pregnancy endangers the mother's life, it becomes a question of medical triage and self-defense, fundamentally different from elective situations.",
      "separate_question": "Should abortion be permitted when the pregnant person's life is at risk?"
    },
    {
      "scenario": "Severe fetal anomalies (incompatible with life)",
      "why_separate": "If the fetus has no chance of survival or will suffer greatly, the moral calculus changes, focusing on compassion and medical prognosis.",
      "separate_question": "Should abortion be allowed for pregnancies with fatal fetal anomalies?"
    },
    {
      "scenario": "Underage (minor) pregnant girls",
      "why_separate": "Minors may not have full legal autonomy and involve guardianship issues, making the decision framework different from that for adult women.",
      "separate_question": "Should minors be allowed to obtain an abortion without parental consent?"
    },
    {
      "scenario": "Late-term abortions (second or third trimester)",
      "why_separate": "Later-term abortions involve a more developed fetus and different medical risks, leading to distinct ethical and practical questions than first-trimester cases.",
      "separate_question": "Should abortion be legally accessible in the third trimester (or after fetal viability)?"
    }
  ],
  "factors": [
    {
      "id": "bodily-autonomy-pregnant-person",
      "name": "Bodily Autonomy Violation for Pregnant Person",
      "description": "If abortions are not accessible, pregnant individuals are forced to carry unwanted pregnancies to term, violating their bodily autonomy and freedom.",
      "what_changes": "With a ban, the state compels pregnant people to continue pregnancies they seek to end.",
      "who_affected": "Women (and other pregnant people) who would otherwise choose first-trimester abortion.",
      "how_much": "This imposes a severe personal burden and loss of bodily control, akin to a substantial violation of autonomy and liberty.",
      "duration": "Approximately 9 months of pregnancy (full gestation period).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "bodily_autonomy",
          "intensity_per_year": 0.8,
          "duration_years": 0.75,
          "time_type": "finite",
          "confidence": 0.9,
          "polarity": 1.0,
          "rationale": "Forcing someone to remain pregnant against their will is a major violation of bodily autonomy, comparable to coerced medical intervention. The duration is ~9 months, the length of gestation."
        },
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.6,
          "duration_years": 0.75,
          "time_type": "finite",
          "confidence": 0.85,
          "polarity": 1.0,
          "rationale": "Denying abortion access infringes on personal freedom to make family and life choices. It significantly restricts the individual's liberty for the duration of the pregnancy."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "Approximate number of people per year who would seek an abortion in the first trimester"
        }
      ]
    },
    {
      "id": "health-risks-pregnancy-complications",
      "name": "Health Complications from Forced Pregnancy",
      "description": "Carrying an unwanted pregnancy to term can lead to various health complications for the pregnant person, including pregnancy-related illnesses or injuries.",
      "what_changes": "Without access to abortion, individuals must endure health risks of pregnancy and childbirth that could have been avoided.",
      "who_affected": "Pregnant people who cannot terminate an unwanted pregnancy and thus face the full health risks of gestation and childbirth.",
      "how_much": "Moderate to severe health impacts, ranging from manageable complications to life-altering injuries, occur in a significant minority of cases.",
      "duration": "Complications can have lasting effects, potentially persisting for years after childbirth.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.4,
          "duration_years": 10,
          "time_type": "finite",
          "confidence": 0.15,
          "polarity": 1.0,
          "rationale": "Pregnancy complications requiring medical intervention (hypertension, hemorrhage, etc.) represent serious health issues. Intensity 0.4 is between minor illness (0.1) and hospitalization (0.5). About 10-20% experience significant issues, lasting ~10 years."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "Annual number of additional pregnancies carried to term due to lack of abortion access"
        }
      ]
    },
    {
      "id": "health-risks-maternal-mortality",
      "name": "Increase in Maternal Deaths",
      "description": "If abortions are not accessible, more people will die from pregnancy-related causes (including childbirth and unsafe abortions).",
      "what_changes": "Allowing abortion prevents some pregnancy-related deaths; banning it leads to an uptick in maternal mortality.",
      "who_affected": "Pregnant people who, in absence of abortion access, experience life-threatening complications or resort to unsafe methods.",
      "how_much": "Pregnancy carries a risk of death that is low but real; removing abortion access increases maternal deaths by a notable percentage.",
      "duration": "Permanent loss of life (decades of lost life per death).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 1.0,
          "duration_years": 40,
          "time_type": "finite",
          "confidence": 0.8,
          "polarity": 1.0,
          "rationale": "Death is the ultimate harm (intensity 1.0). Studies estimate a nationwide abortion ban would raise maternal deaths ~24%. In the US context, that means hundreds of extra deaths yearly. Each death represents on average ~40 years of lost life."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 200,
          "description": "Estimated additional pregnancy-related deaths per year without abortion access"
        }
      ]
    },
    {
      "id": "mental-health-forced-pregnancy",
      "name": "Mental Health Strain on Birth Parents",
      "description": "Being forced to carry and birth an unwanted child can cause significant psychological stress, anxiety, and depression for the birth parent.",
      "what_changes": "Without abortion access, some individuals experience worsened mental health due to the stress and life changes of an imposed pregnancy and child-rearing (or adoption process).",
      "who_affected": "People denied abortions who must carry unwanted pregnancies; especially those lacking support or facing challenging circumstances.",
      "how_much": "Elevated stress and risk of depression or other mental health issues, particularly in the short term after being denied an abortion.",
      "duration": "Emotional distress may last months or years, though often subsides over time especially if circumstances improve.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.5,
          "duration_years": 2,
          "time_type": "finite",
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "Research shows women denied abortions have higher anxiety and lower self-esteem. Intensity 0.5 represents significant suffering (the midpoint of the scale). Duration ~2 years reflects the acute adjustment period."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.2,
          "duration_years": 5,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "Some individuals face prolonged stress raising an unplanned child. Intensity 0.2 represents mild-to-moderate ongoing stress over ~5 years as circumstances stabilize."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "People per year forced to continue unwanted pregnancies, experiencing mental health impacts"
        }
      ]
    },
    {
      "id": "economic-burden",
      "name": "Economic Hardship for Birth Parent",
      "description": "Raising an unplanned child (or bearing medical costs of birth) can impose a serious financial strain, especially on those already in difficult economic circumstances.",
      "what_changes": "Without access to abortion, many individuals (disproportionately low-income) must bear child-rearing costs or medical bills they might not be able to afford.",
      "who_affected": "Birth parents (and their households) who are denied abortions, often resulting in greater poverty or financial insecurity.",
      "how_much": "Significant long-term financial impact: women denied abortions are more likely to fall into poverty and have lasting economic setbacks.",
      "duration": "The economic disadvantage can persist for decades (e.g., throughout the child's upbringing or beyond).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.3,
          "duration_years": 18,
          "time_type": "finite",
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "Long-term economic prospects are harmed. Studies (e.g., Turnaway) found women denied abortions had 4x greater odds of poverty. Intensity 0.3 reflects a notable reduction in life opportunities (education, career) over the ~18 years of raising a child."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.15,
          "duration_years": 10,
          "time_type": "finite",
          "confidence": 0.65,
          "polarity": 1.0,
          "rationale": "Financial stress causes mild-to-moderate suffering: anxiety about bills, restricted choices. Intensity 0.15 is between mild stress (0.1) and significant suffering (0.5). Duration ~10 years acknowledging some recovery/adjustment."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 300000,
          "description": "Approximate number of women per year who would face significant financial hardship from being unable to get an abortion"
        }
      ]
    },
    {
      "id": "impact-existing-children",
      "name": "Effects on Existing Children in the Family",
      "description": "When a woman is forced to carry an unplanned pregnancy to term, any children she already has may receive less attention and resources, potentially harming their well-being.",
      "what_changes": "Abortion access allows women to time and plan their children; banning it means some children grow up in larger, less financially secure families than parents intended.",
      "who_affected": "Existing sons and daughters of women who are denied abortions, and the newborn half-sibling who arrives into a possibly unstable situation.",
      "how_much": "Moderate negative impact: less parental time and money per child, possibly leading to worse developmental outcomes or opportunities for those children.",
      "duration": "Persistent through childhood years of the affected children (e.g., until they reach adulthood).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "fairness_equality",
          "intensity_per_year": 0.3,
          "duration_years": 18,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "For existing siblings, the unplanned birth creates inequity: resources spread thinner. Intensity 0.3 is between slight unfairness (0.1) and systemic bias (0.5). Persists throughout new child's upbringing (~18 years)."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.2,
          "duration_years": 18,
          "time_type": "finite",
          "confidence": 0.55,
          "polarity": 1.0,
          "rationale": "Existing children experience some reduction in well-being (more stress, less attention, possibly more poverty). Intensity 0.2 represents mild-to-moderate suffering across childhood."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 300000,
          "description": "Estimated number of existing children per year affected by a parent's inability to abort an unintended pregnancy"
        }
      ]
    },
    {
      "id": "loss-potential-life",
      "name": "Loss of Fetal Life (Potential Person)",
      "description": "Each abortion ends the life of a fetus, which some consider a human being with moral rights. Legal access means a large number of embryos/fetuses do not survive to birth.",
      "what_changes": "If abortion is legal and accessible, many fetuses that would have been born are instead terminated, which opponents view as the loss of a human life.",
      "who_affected": "Human fetuses in utero (potential children) who are aborted in the first trimester.",
      "how_much": "The moral significance is debated. Those who assign full personhood to the fetus see abortion as equivalent to taking a human life; others see it as a lesser harm given early development stage.",
      "duration": "Permanent loss of a potential lifetime (decades) for each fetus that would have developed into a person.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.5,
          "duration_years": 80,
          "time_type": "finite",
          "confidence": 0.15,
          "polarity": -1.0,
          "rationale": "Moral status of a first-trimester fetus is contested. Full personhood would be 1.0 (death). Given early development stage, intensity 0.5 represents a weighted average (hospitalization-equivalent impact). Duration 80 years = potential lifespan. Very low confidence (15%) reflects uncertainty about fetal moral status."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500000,
          "description": "Approximate number of abortions (and thus fetal lives terminated) per year"
        }
      ]
    },
    {
      "id": "psychological-impact-abortion",
      "name": "Emotional/Psychological Regret or Trauma from Abortion",
      "description": "Some women experience emotional difficulties (such as guilt, sadness, or regret) after having an abortion.",
      "what_changes": "If abortion is accessible, some who undergo the procedure may later struggle emotionally with the decision or feel societal/religious guilt.",
      "who_affected": "Women who have abortions (a subset may experience negative emotional aftermath).",
      "how_much": "Typically mild-to-moderate and short-term psychological effects for a minority of patients; most women predominantly feel relief, but negative feelings can occur.",
      "duration": "Usually within the first months to a year post-abortion (long-term serious mental health effects are rare).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.2,
          "duration_years": 0.5,
          "time_type": "finite",
          "confidence": 0.4,
          "polarity": -1.0,
          "rationale": "While 95% of women believe abortion was right, a minority experience remorse. Intensity 0.2 represents mild-to-moderate emotional difficulty. Duration ~6 months for typical adjustment period. Low confidence as outcomes vary."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 50000,
          "description": "Approximate number of abortion patients per year who experience significant regret or psychological difficulty"
        }
      ]
    },
    {
      "id": "societal-devaluing-life",
      "name": "Societal Devaluation of Life Norms",
      "description": "Widespread acceptance of abortion may cultivate a societal attitude that early human life is disposable, potentially eroding respect for life in general.",
      "what_changes": "Keeping abortion legal might normalize the idea that ending unwanted pregnancies is morally acceptable, which critics argue can chip away at a cultural 'sanctity of life'.",
      "who_affected": "Society at large (the general population) in terms of moral/ethical climate and trust.",
      "how_much": "An intangible, diffuse effect: most people may not consciously feel it, but some fear a slippery slope where human life is less respected, affecting social trust and ethical standards.",
      "duration": "Continuous as a background societal condition for as long as abortion is normalized.",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "social_trust",
          "intensity_per_year": 0.01,
          "confidence": 0.15,
          "polarity": -1.0,
          "rationale": "If society condones ending fetuses' lives, some argue it might subtly reduce overall trust and value placed on life. The effect per person is extremely small (intensity 0.01), and it's speculative (low confidence). However, it is a common moral argument from the pro-life perspective."
        },
        {
          "axiom_id": "truth_epistemic",
          "intensity_per_year": 0.01,
          "confidence": 0.1,
          "polarity": -1.0,
          "rationale": "Debates around abortion involve contested truths (e.g., about when life begins). Permissive abortion laws might encourage denial of the fetus's humanity in some eyes, which could be seen as eroding society's commitment to acknowledging inconvenient truths. This effect is very speculative and minor."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 330000000,
          "description": "Entire society (population living under these norms)"
        }
      ]
    }
  ]
}
`;

export const EXAMPLE_FACIAL_RECOGNITION = `
{
  "id": "facial-recognition-ban",
  "question": "Should facial recognition technology be banned in public spaces?",
  "scope": "General use of facial recognition by government or law enforcement in public venues (e.g., streets, airports, mass surveillance). Focuses on a democratic society context.",
  "context": "Balancing public safety benefits of facial recognition against privacy, civil liberties, and potential misuse in a modern society (e.g., current debates in US/EU).",
  "excluded_scenarios": [
    {
      "scenario": "Private or voluntary use of facial recognition",
      "why_separate": "Using facial recognition for personal devices or with user consent (like unlocking phones or private security cameras) raises different issues of consent and utility.",
      "separate_question": "Should individuals and private companies be allowed to use facial recognition technology with consent?"
    },
    {
      "scenario": "Facial recognition for narrowly targeted purposes (e.g., finding specific missing persons or terrorists)",
      "why_separate": "The moral calculus might differ if the technology is used only in specific cases rather than blanket surveillance. This becomes a question of regulated use rather than a total ban.",
      "separate_question": "Should facial recognition be permitted for limited use cases such as locating known terror suspects or missing children?"
    },
    {
      "scenario": "Use in authoritarian regimes",
      "why_separate": "In a non-democratic context, the lack of checks could make any surveillance technology a different scope question (likely unmitigated abuse). Our analysis assumes rule-of-law context.",
      "separate_question": "How should the morality of facial recognition be evaluated in authoritarian contexts?"
    }
  ],
  "factors": [
    {
      "id": "privacy-erosion-constant-tracking",
      "name": "Constant Surveillance Erodes Privacy",
      "description": "Ubiquitous facial recognition in public means people are continuously monitored, undermining privacy and personal autonomy.",
      "what_changes": "Banning facial recognition would end the current trajectory toward 24/7 identification tracking of citizens in public spaces.",
      "who_affected": "Ordinary citizens in public areas who value anonymity and privacy.",
      "how_much": "A significant loss of privacy and chill on personal autonomy (people feel they're always watched). Removing this is a major positive for civil liberties.",
      "duration": "Continuous as long as the technology is in use (ongoing, structural effect year after year).",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.4,
          "confidence": 0.85,
          "polarity": 1.0,
          "rationale": "Constant face-scanning acts like a pervasive surveillance dragnet, curtailing freedom of movement and association. This is a substantial civil liberties intrusion (intensity ~0.4). Confidence is high that widespread surveillance is happening or imminent in many places."
        },
        {
          "axiom_id": "bodily_autonomy",
          "intensity_per_year": 0.2,
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "While not a physical violation, unconsented biometric scanning violates personal autonomy over one's own biometric data/identity. It's a moderate concern (0.2)."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 150000000,
          "description": "Population regularly subject to public facial recognition surveillance (e.g., residents of major cities)"
        }
      ]
    },
    {
      "id": "chilling-effect-assembly",
      "name": "Chilling Effect on Protest and Free Assembly",
      "description": "If people know they can be identified and tracked at rallies or in public, they may be deterred from exercising free speech or joining gatherings.",
      "what_changes": "Banning facial recognition would remove a tool that can be used to identify and potentially penalize protesters or dissidents, thereby protecting freedom of assembly.",
      "who_affected": "Activists, protesters, minority communities, or anyone who might avoid public expression due to surveillance fears.",
      "how_much": "Substantial chilling of democratic participation and trust. Surveillance can dissuade people from normal social or political activities, undermining social trust.",
      "duration": "Ongoing as a backdrop to society under surveillance.",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.5,
          "confidence": 0.75,
          "polarity": 1.0,
          "rationale": "Freedom of assembly and speech are directly threatened. People self-censor or avoid protests when watched (a significant chilling effect). Intensity ~0.5 since core democratic rights are at stake."
        },
        {
          "axiom_id": "social_trust",
          "intensity_per_year": 0.3,
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "When surveillance is omnipresent, social trust erodes – people feel less free to interact. Communities under heavy monitoring saw neighbors stop visiting each other out of fear. So, persistent surveillance undermines the social fabric (moderate intensity)."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 30000000,
          "description": "Est. number of people per year deterred or psychologically impacted in their public participation"
        }
      ]
    },
    {
      "id": "racial-bias-misidentification",
      "name": "Racial Bias & Wrongful Identifications",
      "description": "Facial recognition algorithms are less accurate for certain demographic groups (especially people of color), leading to false matches, wrongful police stops, or arrests.",
      "what_changes": "Banning the technology avoids these false identifications and the injustices that follow from them (which disproportionately impact marginalized groups).",
      "who_affected": "Innocent individuals misidentified as suspects (often Black or other minorities), who may face police action or legal trouble due to an algorithm's error.",
      "how_much": "High individual harm in each case (being arrested or investigated wrongfully is traumatic). The overall incidence might be relatively low, but growing use could mean many such cases.",
      "duration": "Each misidentification incident might have consequences lasting days to years (clearing one's name, legal battles, trauma).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "fairness_equality",
          "intensity_per_year": 0.5,
          "duration_years": 2,
          "time_type": "finite",
          "confidence": 0.85,
          "polarity": 1.0,
          "rationale": "The technology is not equally accurate for all – studies show error rates 10-100x higher for Black and Asian faces. This is a fairness violation. Each wrong ID incident (lasting potentially months through legal processes) is a serious equity harm."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.4,
          "duration_years": 1,
          "time_type": "finite",
          "confidence": 0.8,
          "polarity": 1.0,
          "rationale": "Being falsely accused or detained causes significant suffering: stress, fear, reputational damage. Intensity 0.4 is between mild stress (0.1) and significant suffering (0.5). Effects typically last ~1 year."
        },
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.7,
          "duration_years": 0.1,
          "time_type": "finite",
          "confidence": 0.9,
          "polarity": 1.0,
          "rationale": "In those moments of wrongful detention/arrest, individuals lose liberty. While the time per incident may be short (days or weeks, encoded as 0.1 year), it's a stark rights violation."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 50000,
          "description": "Estimated false identification incidents per year nationwide (police investigations or stops based on face recognition mismatches)"
        }
      ]
    },
    {
      "id": "mission-creep-abuse",
      "name": "Mission Creep & Authoritarian Abuse",
      "description": "Once facial recognition is deployed, there's a risk it will expand beyond initial uses – e.g., used by government to monitor political opponents or marginalized communities, leading to oppressive outcomes.",
      "what_changes": "Banning it preempts a slippery slope toward a Big Brother surveillance state, preventing potential future human rights abuses.",
      "who_affected": "All citizens, especially vulnerable groups (ethnic minorities, activists) who might be specifically targeted by enhanced surveillance.",
      "how_much": "A broad but diffuse threat: in worst-case scenarios, it enables severe oppression (as seen in some authoritarian regimes). Even in mild cases, it creates fear and self-censorship.",
      "duration": "Continuous structural effect; potential to worsen over years if left unchecked.",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.3,
          "confidence": 0.5,
          "polarity": 1.0,
          "rationale": "The mere existence of the tech in law enforcement can creep into broader uses (tracking political dissidents, etc.). This threatens civil liberties in the long run (moderate intensity). It's moderately likely (50% confidence) if not strictly limited, given historical tendencies for surveillance to expand."
        },
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.4,
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "Authoritarian uses of FR could undermine society's long-term democratic capacity (people afraid to innovate, dissent, or trust institutions). The long-term societal development could be hampered (intensity ~0.4). There's a significant risk (confidence 60%) if allowed to proliferate without a ban."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 330000000,
          "description": "Entire population potentially subject to expanded surveillance powers"
        }
      ]
    },
    {
      "id": "crime-prevention-deterrence",
      "name": "Crime Prevention & Deterrence",
      "description": "Facial recognition can help deter crime by increasing the likelihood that offenders will be identified and caught, potentially preventing some crimes from occurring.",
      "what_changes": "Banning it would remove a tool that law enforcement could use proactively to discourage criminal activity in public spaces.",
      "who_affected": "Potential crime victims who might have been spared harm, and society which benefits from lower crime rates.",
      "how_much": "Somewhat significant for serious crimes like violent assaults or terrorism – a certain number might be prevented or lessened. However, the overall crime prevention attributable solely to FR is uncertain.",
      "duration": "Each prevented crime avoids harm that would have happened at a specific time, but deterrence value is ongoing year by year with tech in place.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.35,
          "duration_years": 3,
          "time_type": "finite",
          "confidence": 0.3,
          "polarity": -1.0,
          "rationale": "Prevented violent crimes include murders (1.0), serious assaults causing hospitalization (0.5), minor injuries (0.1). Weighted across crime mix, average intensity ~0.35 per case. Duration 3 years for physical/psychological recovery. Low confidence (30%) due to uncertainty about FR's actual deterrence."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.5,
          "duration_years": 2,
          "time_type": "finite",
          "confidence": 0.3,
          "polarity": -1.0,
          "rationale": "Crime victims experience significant suffering: trauma, fear, disruption to life. Intensity 0.5 represents the midpoint of suffering scale. Duration ~2 years for psychological recovery."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 10000,
          "description": "Estimated serious crimes (violent incidents) per year potentially deterred or prevented by facial recognition"
        }
      ]
    },
    {
      "id": "solving-serious-crimes",
      "name": "Solving Serious Crimes (Justice Served)",
      "description": "Facial recognition can aid in identifying suspects or locating criminals, leading to more crimes being solved that otherwise might remain unsolved.",
      "what_changes": "If FR is banned, police lose a tool that can close difficult cases, possibly leaving some victims without justice and criminals at large.",
      "who_affected": "Victims of serious crimes (and their families) who get closure and justice when perpetrators are caught.",
      "how_much": "Moderate fairness and well-being gain per case solved: victims see justice (fairness) and feel safer (well-being). However, only a limited number of cases are uniquely solved by FR.",
      "duration": "Each solved case has a one-time closure effect, but the sense of justice and safety for victims can last for years.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "fairness_equality",
          "intensity_per_year": 0.5,
          "duration_years": 0.5,
          "time_type": "finite",
          "confidence": 0.7,
          "polarity": -1.0,
          "rationale": "Catching a perpetrator provides justice – a moral balance is restored. Intensity ~0.5 (important but not life-saving level of good). Confidence ~70% that FR contributes to some otherwise unsolved cases being solved."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.4,
          "duration_years": 0.5,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": -1.0,
          "rationale": "When crimes are solved, victims feel safer and emotionally relieved. Intensity 0.4 represents the relief from moderate suffering. Duration ~6 months for the primary emotional benefit of closure."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 5000,
          "description": "Number of major criminal cases per year where facial recognition helps identify a suspect who might otherwise go uncaught"
        }
      ]
    },
    {
      "id": "finding-missing-persons",
      "name": "Rescuing Missing or Trafficked Persons",
      "description": "Facial recognition can scan crowds or databases to find missing children or victims of human trafficking, reuniting them with families or saving lives.",
      "what_changes": "If banned, authorities lose a potentially powerful tool to locate endangered missing people quickly.",
      "who_affected": "Missing children, kidnapped victims, or lost individuals who might be found faster via FR; and their families who otherwise suffer uncertainty or loss.",
      "how_much": "Potentially life-saving in some cases and a huge relief for families. The numbers are not large, but each case is very high impact.",
      "duration": "Permanent benefit for the found person (they get to live their life) and long-lasting emotional relief for loved ones.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.7,
          "duration_years": 40,
          "time_type": "finite",
          "confidence": 0.5,
          "polarity": -1.0,
          "rationale": "For trafficking victims or kidnapped children, being found can be life-saving. Some would die (1.0), many suffer severe ongoing harm (0.6). Intensity 0.7 represents the severe nature of these cases. Duration 40 years is the remaining lifespan saved. Confidence 50% as not all missing persons cases are life-threatening."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.7,
          "duration_years": 10,
          "time_type": "finite",
          "confidence": 0.55,
          "polarity": -1.0,
          "rationale": "Reuniting a missing person with family relieves profound suffering for both victim and family. Intensity 0.7 is between significant suffering (0.5) and breakdown (1.0). Duration 10 years represents long-term trauma/uncertainty avoided."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 500,
          "description": "Number of missing person cases per year that could be resolved via facial recognition"
        }
      ]
    },
    {
      "id": "implementation-transition-costs",
      "name": "Implementation & Transition Costs",
      "description": "Banning facial recognition might involve scrapping existing systems, retraining police, and foregoing investments, incurring one-time economic and administrative costs.",
      "what_changes": "Police and agencies must dismantle or repurpose surveillance infrastructure. There is also an opportunity cost of not using a cutting-edge tool.",
      "who_affected": "Law enforcement agencies, tech companies and employees who developed or operate FR systems, and possibly taxpayers funding the change.",
      "how_much": "Moderate short-term disruption and cost: money spent on systems is lost; new policies and training needed.",
      "duration": "One-time transition period (months to a few years) as the ban is implemented and systems are wound down.",
      "temporal_profile": "transition",
      "axiom_pairs": [
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.2,
          "time_type": "finite",
          "duration_years": 1,
          "confidence": 0.7,
          "polarity": -1.0,
          "rationale": "In the short term, law enforcement effectiveness might dip as they lose a tool and adjust (intensity ~0.2, mild impact on capacity). The transition period to fully remove FR is assumed ~1 year of adjustments."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 800000,
          "description": "Law enforcement and related personnel/systems affected during the transition"
        }
      ]
    }
  ]
}
`;

export const EXAMPLE_VACCINATION = `
{
  "id": "mandatory-vaccination-schools",
  "question": "Should childhood vaccination be mandatory for public school attendance?",
  "scope": "Routine childhood immunizations (e.g., MMR, polio, DTaP, etc.) for school-aged children in a developed country context. Focus is on typical cases without medical contraindications.",
  "context": "We assume widely available vaccines and an existing public health infrastructure. The debate centers on public health vs individual choice in the context of school requirements.",
  "excluded_scenarios": [
    {
      "scenario": "Medical exemptions (children who cannot safely be vaccinated)",
      "why_separate": "These cases are generally accommodated even with mandates (not the focus of the moral question, since nearly everyone agrees genuine medical exemptions should be allowed).",
      "separate_question": "How should policies handle individuals who medically cannot be vaccinated?"
    },
    {
      "scenario": "Emergent or less-tested vaccines (e.g., new pandemic vaccines)",
      "why_separate": "Mandating a novel vaccine (like for COVID-19) involves different risk-benefit perceptions and public trust dynamics than long-established childhood vaccines.",
      "separate_question": "Should a new vaccine (e.g., for a novel pandemic) be mandated for schoolchildren?"
    },
    {
      "scenario": "Adult vaccination mandates",
      "why_separate": "Requiring vaccines for adults (workplaces, travel, etc.) raises somewhat different autonomy and consent issues, since adults directly control their own healthcare decisions.",
      "separate_question": "Should vaccines be mandatory for adults in certain contexts (work, travel, etc.)?"
    },
    {
      "scenario": "Homeschool or alternative schooling contexts",
      "why_separate": "If parents opt out of public school to avoid vaccination, the question shifts to what responsibilities or regulations apply in homeschool scenarios, which is a different policy discussion.",
      "separate_question": "Should unvaccinated children be allowed to attend any in-person group activities (e.g., private schools or daycares)?"
    }
  ],
  "factors": [
    {
      "id": "disease-prevention-vaccinated",
      "name": "Disease Prevention for Vaccinated Children",
      "description": "Mandatory school vaccinations ensure nearly all children are immunized, protecting those children from contracting serious diseases (like measles, polio, etc).",
      "what_changes": "With a mandate, more children get vaccinated, reducing the number of kids who suffer from vaccine-preventable illnesses.",
      "who_affected": "Children who, without a mandate, might have gone unvaccinated and caught diseases. Now they remain healthy.",
      "how_much": "Each vaccinated child avoids risks of potentially severe illness. The benefit per child is significant (some diseases can be fatal or cause lasting harm), though the probability of disease for one child is low if others are vaccinated.",
      "duration": "Protection lasts through childhood (and in some cases lifelong immunity for that individual).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.15,
          "duration_years": 70,
          "time_type": "finite",
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "Vaccines prevent deadly diseases. For children who would have caught a serious disease: some die (1.0), some get hospitalization-level harm (0.5), most recover after minor illness (0.1). Weighted across outcomes and probability, intensity ~0.15 per child-year. Duration 70 years = lifespan of protection."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 200000,
          "description": "Approximate number of children per cohort who, without a mandate, would have been unvaccinated and at real risk of serious disease"
        }
      ]
    },
    {
      "id": "herd-immunity-protection",
      "name": "Herd Immunity Protects the Vulnerable",
      "description": "When nearly all schoolchildren are vaccinated, it creates herd immunity, shielding those who cannot be vaccinated (e.g., kids with immune disorders or infants) from outbreaks.",
      "what_changes": "Mandatory vaccination increases overall coverage to levels that make outbreaks very unlikely, indirectly protecting everyone.",
      "who_affected": "Immunocompromised children, infants too young for certain shots, and others who rely on community immunity to stay safe from disease.",
      "how_much": "A moderate continuous benefit: it reduces worry and health risks for these vulnerable groups considerably.",
      "duration": "Ongoing each year the policy is in effect (as long as high coverage is maintained).",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.1,
          "confidence": 0.7,
          "polarity": 1.0,
          "rationale": "Herd immunity means fewer disease outbreaks. This saves lives among those who can't get vaccinated. Intensity 0.1 represents minor illness prevention (minor on the scale) spread across the protected population."
        },
        {
          "axiom_id": "fairness_equality",
          "intensity_per_year": 0.15,
          "confidence": 0.75,
          "polarity": 1.0,
          "rationale": "High vaccination rates ensure protection isn't only for kids whose parents choose it; it's more equitable. Intensity 0.15 is between slight unfairness (0.1) and systemic bias (0.5)."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 10000000,
          "description": "General population significantly benefiting from herd immunity (esp. those who medically cannot be vaccinated)"
        }
      ]
    },
    {
      "id": "outbreak-prevention",
      "name": "Prevention of Outbreaks/Epidemics",
      "description": "By maintaining high vaccine uptake, society avoids large outbreaks of diseases that could otherwise occasionally flare up (measles outbreaks, etc.), preventing mass sickness and some deaths each year.",
      "what_changes": "Mandatory vaccines reduce the frequency and size of disease outbreaks in schools and communities.",
      "who_affected": "Entire communities that avoid experiencing contagious disease outbreaks.",
      "how_much": "Significant public health benefit: an outbreak can infect thousands and cause hospitalizations/deaths. Preventing it avoids many cases of suffering in a given year.",
      "duration": "Each year, potential outbreaks are averted (especially as long as mandate keeps coverage high).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.2,
          "duration_years": 0.25,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "Outbreak cases range from minor illness (0.1) to hospitalization (0.5) to death (1.0). Weighted average ~0.2 per case (between minor and hospitalization). Duration ~3 months for illness plus recovery."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.3,
          "duration_years": 0.25,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": 1.0,
          "rationale": "Being sick causes real suffering: pain, fear, disruption. Intensity 0.3 is between mild stress (0.1) and significant suffering (0.5). Duration ~3 months for illness and recovery."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 50000,
          "description": "Estimated number of would-be infection cases per year averted by maintaining herd immunity"
        }
      ]
    },
    {
      "id": "reduced-healthcare-burden",
      "name": "Reduced Burden on Healthcare System",
      "description": "Fewer sick children means fewer hospitalizations and medical treatments, freeing healthcare resources and saving costs.",
      "what_changes": "Mandatory vaccination prevents diseases that would have required medical care, thereby reducing strain on hospitals.",
      "who_affected": "Healthcare providers and society at large benefit from not having to treat avoidable illnesses.",
      "how_much": "Moderate systemic benefit each year: thousands of hospital stays avoided, saving money and improving capacity.",
      "duration": "Continuous benefit each year; cumulative long-term positive effect on public health and system resilience.",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.2,
          "confidence": 0.75,
          "polarity": 1.0,
          "rationale": "Vaccination is highly cost-saving: the CDC estimates US childhood vaccines for 1994-2023 saved $2.7 trillion in societal costs. With mandates ensuring coverage, we consistently avert large costs."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 330000000,
          "description": "Entire population enjoys the improved public health and economic savings"
        }
      ]
    },
    {
      "id": "parental-autonomy-violation",
      "name": "Violation of Parental Autonomy",
      "description": "Mandatory vaccination overrides some parents' personal or religious choices for their children, forcing a medical intervention regardless of their consent.",
      "what_changes": "With the mandate, the state dictates a medical decision for children. If it were not mandatory, parents would have the freedom to choose whether to vaccinate.",
      "who_affected": "Parents who, for personal, philosophical, or religious reasons, would prefer not to vaccinate their kids, but must comply or keep their kids out of school.",
      "how_much": "Significant perceived harm for those parents: they feel their rights and authority over their child's upbringing are infringed.",
      "duration": "This conflict persists throughout the child's school years whenever vaccination is required on schedule.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "bodily_autonomy",
          "intensity_per_year": 0.2,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.8,
          "polarity": -1.0,
          "rationale": "Parents feel their authority over medical decisions is overridden. Vaccinations are brief procedures but recurring. Intensity 0.2 is between inconvenience (0.1) and restriction (0.4). Duration covers K-12 schooling."
        },
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.3,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.75,
          "polarity": -1.0,
          "rationale": "Government compulsion in child-rearing is a civil liberties concern. Intensity 0.3 is between inconvenience (0.1) and restriction (0.4). Duration covers schooling years."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "unscientific",
          "count": 100000,
          "description": "Estimated number of families per cohort who strongly object but must vaccinate (or else forego public schooling)"
        }
      ]
    },
    {
      "id": "religious-freedom-conflict",
      "name": "Conflict with Religious or Personal Beliefs",
      "description": "Some parents have religious objections to vaccines or philosophical beliefs against vaccination. A mandate forces them to act against their conscience or faith.",
      "what_changes": "Without a mandate, such families might abstain from vaccination on religious grounds. With the mandate, they must either violate their beliefs or face exclusion from school.",
      "who_affected": "Religious communities or individuals and others with deep convictions against vaccines.",
      "how_much": "Emotional and spiritual distress for those who feel the law compels them into sin or moral compromise.",
      "duration": "As long as the child is in the school system requiring vaccines (years).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.35,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.65,
          "polarity": -1.0,
          "rationale": "Religious liberty is a civil liberty. For parents who believe vaccination is forbidden by their faith, mandates violate their conscience. Intensity 0.35 is between inconvenience (0.1) and restriction (0.4)."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.25,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": -1.0,
          "rationale": "These families experience distress at being forced to act against their beliefs. Intensity 0.25 is between mild stress (0.1) and significant suffering (0.5). Duration covers the child's schooling."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "unscientific",
          "count": 20000,
          "description": "Number of children per year from families with sincere religious/philosophical objections"
        }
      ]
    },
    {
      "id": "vaccine-adverse-events",
      "name": "Risk of Vaccine Adverse Reactions",
      "description": "A small number of children will experience serious adverse reactions to vaccines. Mandating vaccination means these rare harms will occur to some individuals.",
      "what_changes": "With a mandate, all are exposed to vaccine risk, however small.",
      "who_affected": "The children (and families) who suffer a vaccine injury or severe side effect. Though rare, these events can be life-threatening.",
      "how_much": "Very high impact per case (e.g., anaphylactic shock, neurological damage, or even death). But such events are extremely rare.",
      "duration": "If a severe adverse event happens, it could mean days in hospital, or long-term disability, or death.",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.6,
          "duration_years": 20,
          "time_type": "finite",
          "confidence": 0.9,
          "polarity": -1.0,
          "rationale": "Severe adverse events include: death (~5%, intensity 1.0), permanent disability (~20%, intensity 0.7), hospitalization with recovery (~75%, intensity 0.5). Weighted average ~0.6 (above hospitalization level). Duration 20 years for lasting effects."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 100,
          "description": "Approximate number of severe vaccine adverse events per year among the vaccinated cohort"
        }
      ]
    },
    {
      "id": "medical-distrust-erosion",
      "name": "Erosion of Trust in Medical and Public Institutions",
      "description": "Forcing vaccines on hesitant populations can backfire, fueling conspiracy theories or general mistrust in government and healthcare.",
      "what_changes": "With mandates, the dissenters might feel oppressed, possibly reducing overall trust in health authorities.",
      "who_affected": "Segments of the population skeptical of vaccines or government. Also, public health officials who may find it harder to convince people on other health measures.",
      "how_much": "Diffuse negative impact: increased polarization, potential decline in voluntary compliance with other health programs.",
      "duration": "Persistent as a social undercurrent; could last a generation if people feel deeply alienated by mandates.",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "social_trust",
          "intensity_per_year": 0.2,
          "confidence": 0.5,
          "polarity": -1.0,
          "rationale": "Coercive policies can damage trust in authorities. Intensity 0.2 is between slight unfairness/distrust (0.1) and systemic bias (0.5). This represents mild-to-moderate erosion of trust."
        },
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.1,
          "confidence": 0.45,
          "polarity": -1.0,
          "rationale": "Public health works best with public cooperation. If mandates spur anti-establishment sentiment, it could hinder future health campaigns or scientific initiatives."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "unscientific",
          "count": 15000000,
          "description": "Estimated population with increased distrust due to feeling forced"
        }
      ]
    },
    {
      "id": "educational-exclusion-harm",
      "name": "Harm from Excluding Unvaccinated Kids from School",
      "description": "Children whose parents refuse vaccines may be barred from public school, which could harm their education and social development.",
      "what_changes": "With a strict mandate and no or few exemptions, some kids are kept out of school.",
      "who_affected": "Children from anti-vaccine families who might be removed from the school system.",
      "how_much": "Moderate harm: potentially lower educational quality and social isolation from peers.",
      "duration": "Lasts as long as the child is excluded (potentially their entire K-12 education).",
      "temporal_profile": "steady_case_flow",
      "axiom_pairs": [
        {
          "axiom_id": "long_term_capacity",
          "intensity_per_year": 0.4,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.6,
          "polarity": -1.0,
          "rationale": "Missing out on formal schooling can significantly impair a child's educational attainment and future prospects. Intensity ~0.4 to reflect a serious setback."
        },
        {
          "axiom_id": "fairness_equality",
          "intensity_per_year": 0.3,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.65,
          "polarity": -1.0,
          "rationale": "These children are treated differently (excluded) due to their parents' beliefs, raising equality concerns."
        },
        {
          "axiom_id": "suffering_wellbeing",
          "intensity_per_year": 0.25,
          "duration_years": 13,
          "time_type": "finite",
          "confidence": 0.55,
          "polarity": -1.0,
          "rationale": "The child may suffer socially and emotionally from isolation or conflict. They could feel stigma or have less socialization."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "unscientific",
          "count": 30000,
          "description": "Number of children per year likely kept out of public schooling due to vaccine refusal"
        }
      ]
    },
    {
      "id": "precedent-medical-autonomy",
      "name": "Precedent of State Overriding Medical Choice",
      "description": "Enforcing vaccines sets a precedent that the government can mandate medical procedures for the greater good. Some fear this could lead to further infringements on personal medical decisions.",
      "what_changes": "With a mandate, the principle is established that individual consent can be overridden, which could be extended to other scenarios.",
      "who_affected": "All citizens conceptually, as future policies could invoke this precedent.",
      "how_much": "Abstract but important ethical implication. While it doesn't cause direct harm now, it lowers the barrier for coercive health measures.",
      "duration": "Structural, as a lasting legal/ethical precedent in society's policies.",
      "temporal_profile": "steady_structural",
      "axiom_pairs": [
        {
          "axiom_id": "civil_liberty",
          "intensity_per_year": 0.1,
          "confidence": 0.4,
          "polarity": -1.0,
          "rationale": "This factor represents a slippery-slope concern. The actual immediate impact on liberty per year is small (0.1) because it's theoretical. However, it is a principled erosion of the line of consent."
        },
        {
          "axiom_id": "bodily_autonomy",
          "intensity_per_year": 0.1,
          "confidence": 0.35,
          "polarity": -1.0,
          "rationale": "Once we accept that the state can dictate injecting a medicine into you for the social good, some autonomy purists see this as fundamentally changing the citizen-state relationship."
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 330000000,
          "description": "All citizens living under the legal precedent that the government can mandate medical interventions"
        }
      ]
    }
  ]
}
`;

export const EXAMPLES: Record<string, string> = {
  abortion: EXAMPLE_ABORTION,
  facial_recognition: EXAMPLE_FACIAL_RECOGNITION,
  vaccination: EXAMPLE_VACCINATION,
};
