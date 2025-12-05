"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Decision, DecisionResult, Factor } from "../lib/models";
import { EXAMPLE_ABORTION, EXAMPLE_FACIAL_RECOGNITION, EXAMPLE_VACCINATION } from "../lib/example";
import { buildPrompt } from "../lib/prompt";
import { scoreDecision, formatScoreBreakdown } from "../lib/scoring";
import { validateDecision } from "../lib/validate";
import {
  Profile,
  defaultProfile,
  loadProfileFromCookie,
  saveProfileToCookie,
} from "../lib/profile";
import { DEFAULT_AXIOMS, DEFAULT_AXIOM_WEIGHTS, DEFAULT_SOCIAL_CLASSES } from "../lib/constants";

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const formatCompact = (value: number) => {
  const formatted = compactFormatter.format(value);
  const match = formatted.match(/^([+-]?[0-9.,]+)([A-Za-z]*)$/);
  return {
    formatted,
    numberPart: match?.[1] ?? formatted,
    suffix: match?.[2] ?? "",
  };
};

const renderCompactValue = (value: number, withSign = true) => {
  const { formatted } = formatCompact(value);
  const sign = value > 0 && withSign ? "+" : "";
  return <>{sign}{formatted}</>;
};

type Status = { type: "idle" | "error" | "success"; message: string };
type Tab = "input" | "calibration" | "reference";
type IntensityAnchor = { id: string; value: number; label: string };

const DEFAULT_INTENSITY_ANCHORS: IntensityAnchor[] = [
  { id: "a1", value: 0.1, label: "Minor / negligible impact" },
  { id: "a2", value: 0.3, label: "Moderate impact" },
  { id: "a3", value: 0.5, label: "Significant impact" },
  { id: "a4", value: 0.7, label: "Severe impact" },
  { id: "a5", value: 1.0, label: "Extreme / maximum impact" },
];

const DOMAIN_EXAMPLES = [
  { domain: "Life/Health", examples: "0.1 minor illness → 0.5 hospitalization → 1.0 death" },
  { domain: "Autonomy/Liberty", examples: "0.1 inconvenience → 0.4 restriction → 0.8 confinement" },
  { domain: "Suffering/Wellbeing", examples: "0.1 mild stress → 0.5 significant suffering → 1.0 breakdown" },
  { domain: "Fairness/Trust", examples: "0.1 slight unfairness → 0.5 systemic bias → 1.0 complete breakdown" },
];

type ExampleKey = "vaccination" | "facial_recognition" | "abortion";

const EXAMPLE_ORDER: ExampleKey[] = ["vaccination", "facial_recognition", "abortion"];

const EXAMPLES: Record<ExampleKey, { label: string; json: string }> = {
  vaccination: { label: "Mandatory Vaccination", json: EXAMPLE_VACCINATION },
  facial_recognition: { label: "Facial Recognition Ban", json: EXAMPLE_FACIAL_RECOGNITION },
  abortion: { label: "Abortion Access", json: EXAMPLE_ABORTION },
};

export default function Home() {
  const [promptText] = useState<string>(buildPrompt);
  const [activeExample, setActiveExample] = useState<ExampleKey>("vaccination");
  const [inputJson, setInputJson] = useState<string>(EXAMPLE_VACCINATION);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("input");
  const [intensityAnchors, setIntensityAnchors] = useState<IntensityAnchor[]>(DEFAULT_INTENSITY_ANCHORS);
  const [newAnchorLabel, setNewAnchorLabel] = useState("");

  useEffect(() => {
    setProfile(loadProfileFromCookie());
  }, []);

  // Auto-rescore when profile or decision changes
  useEffect(() => {
    if (decision) {
      const rescored = scoreDecision(
        decision,
        profile.axiomWeights,
        profile.socialClasses,
        profile.timeStance,
        profile.customAnchors || [],
        profile.muCalibration
      );
      setResult(rescored);
    }
  }, [profile, decision]);

  // Helper to score a given JSON string with a given profile
  const scoreJson = useCallback((json: string, p: Profile) => {
    try {
      const parsed: Decision = JSON.parse(json);
      const errors = validateDecision(parsed);
      if (errors.length) {
        setStatus({ type: "error", message: errors.join("; ") });
        return;
      }
      const scored = scoreDecision(
        parsed,
        p.axiomWeights,
        p.socialClasses,
        p.timeStance,
        p.customAnchors || [],
        p.muCalibration
      );
      setDecision(parsed);
      setResult(scored);
      setStatus({ type: "success", message: "Scored successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setStatus({ type: "error", message });
    }
  }, []);

  // Auto-score on initial load
  useEffect(() => {
    const loadedProfile = loadProfileFromCookie();
    scoreJson(EXAMPLE_VACCINATION, loadedProfile);
  }, [scoreJson]);

  const switchExample = useCallback((key: ExampleKey) => {
    setActiveExample(key);
    const json = EXAMPLES[key].json;
    setInputJson(json);
    scoreJson(json, profile);
  }, [profile, scoreJson]);

  const persistProfile = useCallback((p: Profile) => {
    setProfile(p);
    saveProfileToCookie(p);
  }, []);

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setStatus({ type: "success", message: "Prompt copied to clipboard" });
    } catch {
      setStatus({ type: "error", message: "Clipboard copy failed" });
    }
  }, [promptText]);

  const pasteJson = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInputJson(text);
      setStatus({ type: "success", message: "Pasted from clipboard" });
    } catch {
      setStatus({ type: "error", message: "Clipboard paste failed" });
    }
  }, []);

  const runScore = useCallback(() => {
    setStatus({ type: "idle", message: "" });
    scoreJson(inputJson, profile);
  }, [inputJson, profile, scoreJson]);

  const breakdown = useMemo(() => {
    if (!result || !decision) return "";
    return formatScoreBreakdown(
      result,
      decision,
      profile.timeStance,
      profile.axiomWeights,
      profile.socialClasses,
      profile.customAnchors || []
    );
  }, [result, decision, profile]);

  useEffect(() => {
    if (status.type === "success") {
      const id = setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
      return () => clearTimeout(id);
    }
  }, [status]);

  const updateAxiomWeight = (id: string, value: number) => {
    persistProfile({ ...profile, axiomWeights: { ...profile.axiomWeights, [id]: value } });
  };

  const updateSocialClass = (id: string, field: 'label' | 'weight', value: string | number) => {
    const updated = profile.socialClasses.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    );
    persistProfile({ ...profile, socialClasses: updated });
  };

  const addSocialClass = () => {
    const newClass = {
      id: `custom_${Date.now()}`,
      label: "New Class",
      weight: 0.5
    };
    persistProfile({ ...profile, socialClasses: [...profile.socialClasses, newClass] });
  };

  const deleteSocialClass = (id: string) => {
    persistProfile({ ...profile, socialClasses: profile.socialClasses.filter(c => c.id !== id) });
  };

  const updateTimeStance = (updates: Partial<typeof profile.timeStance>) => {
    persistProfile({ ...profile, timeStance: { ...profile.timeStance, ...updates } });
  };

  const updateDecisionOnly = (updater: (factors: Factor[]) => Factor[]) => {
    if (!decision) return;
    const updatedFactors = updater(decision.factors);
    const updatedDecision = { ...decision, factors: updatedFactors };
    setDecision(updatedDecision);
  };

  const rescoreDecision = () => {
    if (!decision) return;
    const rescored = scoreDecision(
      decision,
      profile.axiomWeights,
      profile.socialClasses,
      profile.timeStance,
      profile.customAnchors || [],
      profile.muCalibration
    );
    setResult(rescored);
  };

  const updateDecision = (updater: (factors: Factor[]) => Factor[]) => {
    if (!decision) return;
    const updatedFactors = updater(decision.factors);
    const updatedDecision = { ...decision, factors: updatedFactors };
    setDecision(updatedDecision);
    const rescored = scoreDecision(
      updatedDecision,
      profile.axiomWeights,
      profile.socialClasses,
      profile.timeStance,
      profile.customAnchors || [],
      profile.muCalibration
    );
    setResult(rescored);
  };

  const getResultColor = (res: string) => {
    if (res === "YES") return "text-emerald-600";
    if (res === "NO") return "text-red-600";
    return "text-slate-600";
  };

  const getStrengthBadge = (strength: string) => {
    if (strength.includes("strong")) return "badge-green";
    if (strength.includes("medium")) return "badge-yellow";
    return "badge-gray";
  };

  // Find all factors that contribute to a stakeholder (by matching scale_groups)
  const getContributingFactors = (
    stakeholder: import("../lib/models").StakeholderImpact,
    mode: "transition" | "case_flow" | "structural"
  ) => {
    if (!decision || !result) return [];
    
    const contributing: Array<{
      factor: Factor;
      factorScore: import("../lib/models").FactorScore;
      contribution: number;
    }> = [];

    for (const factorScore of result.factor_scores) {
      // Only include factors that match the temporal mode
      const profileMatch = 
        (mode === "transition" && factorScore.temporal_profile === "transition") ||
        (mode === "case_flow" && factorScore.temporal_profile === "steady_case_flow") ||
        (mode === "structural" && factorScore.temporal_profile === "steady_structural");
      
      if (!profileMatch) continue;

      const factor = decision.factors.find((f) => f.id === factorScore.factor_id);
      if (!factor) continue;

      // Check if this factor's scale_groups match the stakeholder
      const matchingGroup = factor.scale_groups.find(
        (sg) =>
          sg.social_class_id === stakeholder.social_class_id &&
          sg.count === stakeholder.count &&
          (sg.description ?? "") === stakeholder.description
      );

      if (matchingGroup) {
        // Calculate approximate contribution from this factor to this stakeholder
        const totalScale = factor.scale_groups.reduce((sum, sg) => {
          const weight = profile.socialClasses.find((sc) => sc.id === sg.social_class_id)?.weight ?? 0.3;
          return sum + sg.count * weight;
        }, 0);
        const groupWeight = profile.socialClasses.find((sc) => sc.id === matchingGroup.social_class_id)?.weight ?? 0.3;
        const groupScale = matchingGroup.count * groupWeight;
        const groupShare = totalScale > 0 ? groupScale / totalScale : 0;
        const contribution = factorScore.total_score * groupShare;

        contributing.push({ factor, factorScore, contribution });
      }
    }

    // Sort by absolute contribution
    return contributing.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Open Ethos</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Decision Engine</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <a href="/user-guide" className="btn btn-ghost btn-sm">
                User Guide
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Example Selector */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 mr-2">Example:</span>
            {EXAMPLE_ORDER.map((key) => (
              <button
                key={key}
                onClick={() => switchExample(key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeExample === key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {EXAMPLES[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation and Action Buttons */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: "input" as Tab, label: "Input & Score", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { id: "calibration" as Tab, label: "Calibration", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
              { id: "reference" as Tab, label: "Reference", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "input" && (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowInputModal(true)} className="btn btn-ghost btn-sm">
                View Input
              </button>
              <button onClick={() => setShowPrompt(true)} className="btn btn-ghost btn-sm">
                View Prompt
              </button>
              <button onClick={copyPrompt} className="btn btn-ghost btn-sm">
                Copy Prompt
              </button>
              <button onClick={pasteJson} className="btn btn-ghost btn-sm">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Paste from Clipboard
              </button>
              <button onClick={runScore} className="btn btn-primary btn-sm">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Score Decision
              </button>
            </div>
          )}
        </div>


        {/* Status Message */}
        {status.type !== "idle" && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            status.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}>
            <div className="flex items-center gap-2">
              {status.type === "error" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {status.message}
            </div>
          </div>
        )}

        {/* Input Tab */}
        {activeTab === "input" && (
          <div className="space-y-4">
            {result && decision ? (
              <>
                  {/* Result Summary */}
                  <div className={`card border-2 ${
                    result.result === "YES" ? "border-emerald-200 bg-emerald-50/30" :
                    result.result === "NO" ? "border-red-200 bg-red-50/30" :
                    "border-slate-200"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className={`text-3xl font-bold ${getResultColor(result.result)}`}>
                            {result.result}
                          </span>
                          <span className={`badge ${getStrengthBadge(result.strength)}`}>
                            {result.strength.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({(result.strength_ratio * 100).toFixed(1)}% alignment)
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mt-2 space-y-1">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                              <span>
                                Transition: <span className={`font-semibold ${result.transition_total_MU >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                  {renderCompactValue(result.transition_total_MU)} MU
                                </span>
                              </span>
                              <span>
                                Case flow: <span className={`font-semibold ${result.case_flow_MU_per_year >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                  {renderCompactValue(result.case_flow_MU_per_year)} MU/yr
                                </span>
                              </span>
                              <span>
                                Structural: <span className={`font-semibold ${result.structural_MU_per_year >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                  {renderCompactValue(result.structural_MU_per_year)} MU/yr
                                </span>
                              </span>
                            </div>
                            <p>
                              Total: <span className="font-semibold">{renderCompactValue(result.total_score)} MU</span>
                              {result.total_score_usd !== undefined && (
                                <span className="text-sm ml-2">
                                  (${result.total_score_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-slate-500">Top contributors</p>
                        {(() => {
                          const factorName = (id: string) =>
                            decision.factors.find((f) => f.id === id)?.name || id;
                          const topTransition = [...result.factor_scores]
                            .filter((fs) => fs.temporal_profile === "transition")
                            .sort((a, b) => Math.abs(b.total_score) - Math.abs(a.total_score))
                            .slice(0, 2)
                            .map((fs) => factorName(fs.factor_id));
                          const topCaseFlow = [...result.factor_scores]
                            .filter((fs) => fs.temporal_profile === "steady_case_flow")
                            .sort((a, b) => Math.abs(b.total_score) - Math.abs(a.total_score))
                            .slice(0, 2)
                            .map((fs) => factorName(fs.factor_id));
                          const topStructural = [...result.factor_scores]
                            .filter((fs) => fs.temporal_profile === "steady_structural")
                            .sort((a, b) => Math.abs(b.total_score) - Math.abs(a.total_score))
                            .slice(0, 2)
                            .map((fs) => factorName(fs.factor_id));
                          return (
                            <>
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-slate-400">Transition</p>
                                <p className="text-sm text-slate-700">
                                  {topTransition.length > 0 ? topTransition.join(", ") : "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-slate-400">Case flow</p>
                                <p className="text-sm text-slate-700">
                                  {topCaseFlow.length > 0 ? topCaseFlow.join(", ") : "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-slate-400">Structural</p>
                                <p className="text-sm text-slate-700">
                                  {topStructural.length > 0 ? topStructural.join(", ") : "—"}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {decision.question && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500">Question</p>
                        <p className="text-slate-800 font-medium">{decision.question}</p>
                      </div>
                    )}
                  </div>

                  {/* Scope and Excluded Scenarios */}
                  {(decision.scope || (decision.excluded_scenarios && decision.excluded_scenarios.length > 0)) && (
                    <div className="card bg-blue-50/30 border border-blue-200">
                      {decision.scope && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Analysis Scope</p>
                          <p className="text-sm text-slate-700">{decision.scope}</p>
                        </div>
                      )}
                      {decision.excluded_scenarios && decision.excluded_scenarios.length > 0 && (
                        <div className={decision.scope ? "pt-4 border-t border-blue-200" : ""}>
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Excluded Edge Cases</p>
                          <p className="text-xs text-slate-600 mb-3">These scenarios are fundamentally different questions and require separate analysis:</p>
                          <div className="space-y-3">
                            {decision.excluded_scenarios.map((excluded, idx) => (
                              <details key={idx} className="group bg-white border border-blue-100 rounded-lg overflow-hidden">
                                <summary className="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between">
                                  <span className="text-sm font-medium text-slate-800">{excluded.scenario}</span>
                                  <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </summary>
                                <div className="px-3 pb-3 space-y-2">
                                  <div>
                                    <p className="text-xs text-slate-500 font-semibold">Why separate:</p>
                                    <p className="text-xs text-slate-700">{excluded.why_separate}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 font-semibold">Different question:</p>
                                    <p className="text-xs text-slate-700 italic">&ldquo;{excluded.separate_question}&rdquo;</p>
                                  </div>
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Temporal Profile Summary */}
                  <div className="card">
                    <h3 className="section-title mb-4">Impact Timeline</h3>
                    <div className="grid md:grid-cols-3 gap-4 items-stretch">
                      {/* Transition Section */}
                      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 md:col-span-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Transition Impacts
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total MU (transition):</span>
                            <span className={`font-semibold ${result.transition_total_MU >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                              {renderCompactValue(result.transition_total_MU)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Population:</span>
                            <span className="font-medium text-slate-800">
                              {result.transition_total_population.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">MU per capita:</span>
                            <span className={`font-semibold ${result.transition_MU_per_capita >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                              {renderCompactValue(result.transition_MU_per_capita)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">MU per person-year:</span>
                            <span className={`font-semibold ${result.transition_MU_per_year_population >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                              {renderCompactValue(result.transition_MU_per_year_population)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Steady Flow Section */}
                      <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/30 md:col-span-2">
                        <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Steady Flows (per policy-year)
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm divide-y sm:divide-y-0 sm:divide-x divide-purple-100">
                          <div className="space-y-2 sm:pr-3">
                            <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide">Case flow</p>
                            <div className="flex justify-between">
                              <span className="text-slate-600">MU per year:</span>
                              <span className={`font-semibold ${result.case_flow_MU_per_year >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {renderCompactValue(result.case_flow_MU_per_year)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Population:</span>
                              <span className="font-medium text-slate-800">
                                {result.case_flow_total_population.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">MU per capita per year:</span>
                              <span className={`font-semibold ${result.case_flow_MU_per_capita_per_year >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {renderCompactValue(result.case_flow_MU_per_capita_per_year)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 sm:pl-3">
                            <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide">Structural</p>
                            <div className="flex justify-between">
                              <span className="text-slate-600">MU per year:</span>
                              <span className={`font-semibold ${result.structural_MU_per_year >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {renderCompactValue(result.structural_MU_per_year)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Population:</span>
                              <span className="font-medium text-slate-800">
                                {result.structural_total_population.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">MU per capita per year:</span>
                              <span className={`font-semibold ${result.structural_MU_per_capita_per_year >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {renderCompactValue(result.structural_MU_per_capita_per_year)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 italic">
                          Per year, if current structure persists
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transition Impact Time Graph */}
                  {result.transition_time_graph && result.transition_time_graph.length > 1 && (
                    <div className="card">
                      <h3 className="section-title mb-4">Transition Impact Over Time</h3>
                      <div className="h-64 relative">
                        <svg viewBox="0 0 800 250" className="w-full h-full">
                          {/* Background grid */}
                          <defs>
                            <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="800" height="250" fill="url(#grid)" />

                          {/* Calculate scales */}
                          {(() => {
                            const maxYear = Math.max(...result.transition_time_graph.map(p => p.year));
                            const maxAbsMU = Math.max(...result.transition_time_graph.map(p => Math.abs(p.mu_per_year)));
                            const minMU = Math.min(...result.transition_time_graph.map(p => p.mu_per_year));
                            const maxMU = Math.max(...result.transition_time_graph.map(p => p.mu_per_year));

                            const padding = 40;
                            const width = 800 - 2 * padding;
                            const height = 250 - 2 * padding;

                            const xScale = (year: number) => padding + (year / maxYear) * width;
                            const yScale = (mu: number) => {
                              const range = maxMU - minMU;
                              return padding + height - ((mu - minMU) / range) * height;
                            };

                            // Zero line
                            const zeroY = yScale(0);

                            // Generate path
                            const path = result.transition_time_graph
                              .map((p, i) => {
                                const x = xScale(p.year);
                                const y = yScale(p.mu_per_year);
                                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                              })
                              .join(" ");

                            return (
                              <>
                                {/* Zero line */}
                                <line
                                  x1={padding}
                                  y1={zeroY}
                                  x2={800 - padding}
                                  y2={zeroY}
                                  stroke="#94a3b8"
                                  strokeWidth="1"
                                  strokeDasharray="4 2"
                                />

                                {/* Area fill */}
                                <path
                                  d={`${path} L ${xScale(maxYear)} ${zeroY} L ${xScale(0)} ${zeroY} Z`}
                                  fill={maxMU >= 0 ? "#10b98166" : "#ef444466"}
                                  stroke="none"
                                />

                                {/* Line */}
                                <path
                                  d={path}
                                  fill="none"
                                  stroke={maxMU >= 0 ? "#10b981" : "#ef4444"}
                                  strokeWidth="2"
                                />

                                {/* Axes */}
                                <line x1={padding} y1={padding} x2={padding} y2={250 - padding} stroke="#475569" strokeWidth="1.5" />
                                <line x1={padding} y1={250 - padding} x2={800 - padding} y2={250 - padding} stroke="#475569" strokeWidth="1.5" />

                                {/* Labels */}
                                <text x={400} y={240} textAnchor="middle" fontSize="12" fill="#475569">Years from now</text>
                                <text x={20} y={130} textAnchor="middle" fontSize="12" fill="#475569" transform={`rotate(-90, 20, 130)`}>MU/year</text>

                                {/* Y-axis ticks */}
                                <text x={padding - 5} y={yScale(maxMU) + 4} textAnchor="end" fontSize="10" fill="#64748b">
                                  {formatCompact(maxMU).formatted}
                                </text>
                                <text x={padding - 5} y={zeroY + 4} textAnchor="end" fontSize="10" fill="#64748b">0</text>
                                {minMU < 0 && (
                                  <text x={padding - 5} y={yScale(minMU) + 4} textAnchor="end" fontSize="10" fill="#64748b">
                                    {formatCompact(minMU).formatted}
                                  </text>
                                )}

                                {/* X-axis ticks */}
                                {[0, Math.floor(maxYear / 4), Math.floor(maxYear / 2), Math.floor(3 * maxYear / 4), maxYear].map(year => (
                                  <text key={year} x={xScale(year)} y={250 - padding + 15} textAnchor="middle" fontSize="10" fill="#64748b">
                                    {year}
                                  </text>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Stakeholder Impact Summary */}
                  {result.stakeholder_impacts && result.stakeholder_impacts.length > 0 && (() => {
                    const transitionStakeholders = result.stakeholder_impacts.filter(
                      (s) => s.transition_total_MU !== 0 || s.transition_per_capita_MU !== 0
                    );
                    const caseFlowStakeholders = result.stakeholder_impacts.filter(
                      (s) => s.case_flow_MU_per_year !== 0 || s.case_flow_per_capita_MU_per_year !== 0
                    );
                    const structuralStakeholders = result.stakeholder_impacts.filter(
                      (s) => s.structural_MU_per_year !== 0 || s.structural_per_capita_MU_per_year !== 0
                    );

                    const renderStakeholderSection = (
                      title: string,
                      list: typeof result.stakeholder_impacts,
                      mode: "transition" | "case_flow" | "structural"
                    ) => {
                      const totalAbsImpact = list.reduce(
                        (sum, s) =>
                          sum +
                          Math.abs(
                            mode === "transition"
                              ? s.transition_total_MU
                              : mode === "case_flow"
                              ? s.case_flow_MU_per_year
                              : s.structural_MU_per_year
                          ),
                        0
                      );

                      const totalAbsPerCapita = list.reduce(
                        (sum, s) =>
                          sum +
                          Math.abs(
                            mode === "transition"
                              ? s.transition_per_capita_MU
                              : mode === "case_flow"
                              ? s.case_flow_per_capita_MU_per_year
                              : s.structural_per_capita_MU_per_year
                          ),
                        0
                      );

                      const sorted = [...list].sort((a, b) => {
                        const aVal =
                          mode === "transition"
                            ? a.transition_total_MU
                            : mode === "case_flow"
                            ? a.case_flow_MU_per_year
                            : a.structural_MU_per_year;
                        const bVal =
                          mode === "transition"
                            ? b.transition_total_MU
                            : mode === "case_flow"
                            ? b.case_flow_MU_per_year
                            : b.structural_MU_per_year;
                        // Sort by absolute magnitude - biggest first
                        return Math.abs(bVal) - Math.abs(aVal);
                      });

                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
                            <p className="text-xs text-slate-500">
                              Percentages normalized within this section
                            </p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {sorted.map((sh, idx) => {
                              const totalValue =
                                mode === "transition"
                                  ? sh.transition_total_MU
                                  : mode === "case_flow"
                                  ? sh.case_flow_MU_per_year
                                  : sh.structural_MU_per_year;
                              const perCapita =
                                mode === "transition"
                                  ? sh.transition_per_capita_MU
                                  : mode === "case_flow"
                                  ? sh.case_flow_per_capita_MU_per_year
                                  : sh.structural_per_capita_MU_per_year;

                              const percentOfTotal =
                                totalAbsImpact !== 0
                                  ? (Math.abs(totalValue) / totalAbsImpact) * 100
                                  : 0;

                              const percentOfPerCapita =
                                totalAbsPerCapita !== 0
                                  ? (Math.abs(perCapita) / totalAbsPerCapita) * 100
                                  : 0;

                              const contributing = getContributingFactors(sh, mode);
                              const totalAbsContribution = contributing.reduce((sum, c) => sum + Math.abs(c.contribution), 0);

                              return (
                                <details 
                                  key={`${mode}-${idx}`} 
                                  className="group border border-slate-200 rounded-lg overflow-hidden"
                                >
                                  <summary className="cursor-pointer hover:bg-slate-50 transition-colors list-none">
                                    <div className="bg-slate-50 p-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <p className="font-medium text-slate-900">{sh.description}</p>
                                          </div>
                                          <p className="text-sm text-slate-600 mt-1 ml-6">{sh.count.toLocaleString()} people</p>
                                        </div>
                                        {/* Stacked metrics */}
                                        <div className="text-xs w-36">
                                          {/* Relative percentages */}
                                          <div className="flex justify-between gap-2 pb-1">
                                            <div className="text-right flex-1">
                                              <p className={`font-semibold ${totalValue >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                                {percentOfTotal.toFixed(1)}%
                                              </p>
                                              <p className="text-slate-500">of total</p>
                                            </div>
                                            <div className="text-right flex-1">
                                              <p className={`font-semibold ${perCapita >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                                {percentOfPerCapita.toFixed(1)}%
                                              </p>
                                              <p className="text-slate-500">per capita</p>
                                            </div>
                                          </div>
                                          {/* Divider */}
                                          <div className="border-t border-slate-200 my-1"></div>
                                          {/* Absolute values */}
                                          <div className="flex justify-between gap-2 pt-1">
                                            {mode === "transition" ? (
                                              <>
                                                <div className="text-right flex-1">
                                                  <p className={`font-semibold ${sh.transition_total_MU >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                                    {renderCompactValue(sh.transition_total_MU)}
                                                  </p>
                                                  <p className="text-slate-500">net MU</p>
                                                </div>
                                                <div className="text-right flex-1">
                                                  <p className={`font-semibold ${sh.transition_per_capita_MU >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                                    {renderCompactValue(sh.transition_per_capita_MU)}
                                                  </p>
                                                  <p className="text-slate-500">per person</p>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="text-right flex-1">
                                                  <p className={`font-semibold ${(mode === "case_flow" ? sh.case_flow_MU_per_year : sh.structural_MU_per_year) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                                    {mode === "case_flow"
                                                      ? renderCompactValue(sh.case_flow_MU_per_year)
                                                      : renderCompactValue(sh.structural_MU_per_year)}
                                                  </p>
                                                  <p className="text-slate-500">net/yr</p>
                                                </div>
                                                <div className="text-right flex-1">
                                                  <p className={`font-semibold ${(mode === "case_flow" ? sh.case_flow_per_capita_MU_per_year : sh.structural_per_capita_MU_per_year) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                                    {mode === "case_flow"
                                                      ? renderCompactValue(sh.case_flow_per_capita_MU_per_year)
                                                      : renderCompactValue(sh.structural_per_capita_MU_per_year)}
                                                  </p>
                                                  <p className="text-slate-500">per person/yr</p>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </summary>

                                  {/* Expanded content - Contributing Factors */}
                                  <div className="border-t border-slate-200">
                                    {contributing.length > 0 ? (
                                      <div className="p-3 bg-white">
                                        <p className="text-xs font-semibold text-slate-700 mb-2">Contributing Factors</p>
                                        <div className="space-y-2">
                                          {contributing.map(({ factor, factorScore, contribution }) => {
                                            const isPositive = contribution >= 0;
                                            const percentOfImpact = totalAbsContribution > 0 ? (Math.abs(contribution) / totalAbsContribution) * 100 : 0;
                                            return (
                                              <div 
                                                key={factor.id} 
                                                className="flex items-start justify-between text-xs p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100 transition-colors"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const factorElement = document.getElementById(`factor-${factor.id}`);
                                                  if (factorElement) {
                                                    factorElement.setAttribute('open', 'true');
                                                    factorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                  }
                                                }}
                                              >
                                                <div className="flex items-start gap-2 flex-1">
                                                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isPositive ? "bg-emerald-500" : "bg-red-500"}`} />
                                                  <div>
                                                    <p className="font-medium text-slate-800">{factor.name}</p>
                                                    <p className="text-slate-500 mt-0.5">{factor.description}</p>
                                                  </div>
                                                </div>
                                                <div className="text-right ml-2 shrink-0 flex items-center gap-2">
                                                  <div>
                                                    <p className={`font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                                      {isPositive ? "+" : ""}{renderCompactValue(contribution, false)}
                                                    </p>
                                                    <p className="text-slate-400">{percentOfImpact.toFixed(0)}%</p>
                                                  </div>
                                                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                  </svg>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="p-3 bg-white">
                                        <p className="text-xs text-slate-500">No contributing factors found.</p>
                                      </div>
                                    )}
                                  </div>
                                </details>
                              );
                            })}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <div className="card">
                        <h3 className="section-title mb-4">Stakeholder Impact Summary</h3>
                        <div className="space-y-6">
                          {transitionStakeholders.length > 0 && renderStakeholderSection("Transition stakeholders", transitionStakeholders, "transition")}
                          {caseFlowStakeholders.length > 0 && renderStakeholderSection("Steady case-flow stakeholders", caseFlowStakeholders, "case_flow")}
                          {structuralStakeholders.length > 0 && renderStakeholderSection("Steady structural stakeholders", structuralStakeholders, "structural")}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Factor Breakdown */}
                  <div className="card">
                    <h3 className="section-title mb-4">Factor Breakdown</h3>
                    <div className="space-y-6">
                      {(() => {
                        const renderFactorSection = (
                          title: string,
                          factors: typeof result.factor_scores,
                          typeLabel: "transition" | "steady_case_flow" | "steady_structural"
                        ) => {
                          if (factors.length === 0) return null;
                          const sumAbsScores = factors.reduce((sum, fs) => sum + Math.abs(fs.total_score), 0);
                          const normalizedLabel = typeLabel.replace(/_/g, " ");
                          return (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
                                <p className="text-xs text-slate-500">
                                  Percentages normalized within {normalizedLabel}
                                </p>
                              </div>
                              {[...factors]
                                .sort((a, b) => {
                                  // Sort by absolute magnitude - biggest first
                                  return Math.abs(b.total_score) - Math.abs(a.total_score);
                                })
                                .map((fs) => {
                                  const factor = decision.factors.find((f) => f.id === fs.factor_id);
                                  if (!factor) return null;
                                  const isPositive = fs.total_score > 0;
                                  const normalizedScore = sumAbsScores > 0 ? (Math.abs(fs.total_score) / sumAbsScores) * 100 : 0;
                                  return (
                                    <details key={fs.factor_id} id={`factor-${fs.factor_id}`} className="group border border-slate-200 rounded-lg overflow-hidden">
                                      <summary className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-2 h-2 rounded-full ${isPositive ? "bg-emerald-500" : "bg-red-500"}`} />
                                          <span className="font-medium text-slate-900">{factor.name}</span>
                                          <span className={`badge badge-sm ${
                                            fs.temporal_profile === "transition"
                                              ? "badge-blue"
                                              : fs.temporal_profile === "steady_case_flow"
                                              ? "badge-green"
                                              : "badge-purple"
                                          }`}>
                                            {fs.temporal_profile.replace(/_/g, " ")}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                            {isPositive ? "+" : ""}{normalizedScore.toFixed(1)}%
                                          </span>
                                          <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </summary>
                                      <div className="p-4 bg-white space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <p className="text-sm text-slate-600">{factor.description}</p>
                                          <div className="text-right ml-4 shrink-0">
                                            <p className="text-xs text-slate-500">Raw Score</p>
                                            <p className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                              {renderCompactValue(fs.total_score)} MU
                                            </p>
                                            <p className="text-xs text-slate-500">({normalizedScore.toFixed(1)}% of {normalizedLabel})</p>
                                          </div>
                                        </div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-50 p-2 rounded">
                                          <span className="text-slate-500">What changes:</span>
                                          <p className="text-slate-700">{factor.what_changes}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                          <span className="text-slate-500">Who affected:</span>
                                          <p className="text-slate-700">{factor.who_affected}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                          <span className="text-slate-500">How much:</span>
                                          <p className="text-slate-700">{factor.how_much}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                          <span className="text-slate-500">Duration:</span>
                                          <p className="text-slate-700">{factor.duration}</p>
                                        </div>
                                      </div>

                                      {/* Axiom Pairs */}
                                      <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Axiom Parameters</h4>
                                        {factor.axiom_pairs.map((pair, idx) => {
                                          const axiomScore = fs.axiom_scores[pair.axiom_id] || 0;
                                          const axiomContribution = fs.total_score !== 0
                                            ? (Math.abs(axiomScore) / Math.abs(fs.total_score)) * 100
                                            : 0;
                                          return (
                                          <div key={`${pair.axiom_id}-${idx}`} className="border border-slate-100 rounded-lg p-3 mb-2 bg-slate-50/50">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="text-sm font-medium text-slate-800">{pair.axiom_id.replace(/_/g, " ")}</div>
                                              <div className="text-xs text-slate-500">
                                                {axiomContribution.toFixed(1)}% of factor
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                              <div>
                                                <label className="label-sm">Intensity/yr</label>
                                                <input
                                                  type="number"
                                                  min={0} max={1} step={0.01}
                                                  value={pair.intensity_per_year}
                                                  onChange={(e) => updateDecisionOnly((factors) => {
                                                    const copy = structuredClone(factors);
                                                    copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].intensity_per_year = parseFloat(e.target.value);
                                                    return copy;
                                                  })}
                                                  onBlur={rescoreDecision}
                                                  className="input input-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="label-sm">Confidence</label>
                                                <input
                                                  type="number"
                                                  min={0} max={1} step={0.01}
                                                  value={pair.confidence}
                                                  onChange={(e) => updateDecisionOnly((factors) => {
                                                    const copy = structuredClone(factors);
                                                    copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].confidence = parseFloat(e.target.value);
                                                    return copy;
                                                  })}
                                                  onBlur={rescoreDecision}
                                                  className="input input-sm"
                                                />
                                              </div>
                                        <div>
                                          <label className="label-sm">Polarity</label>
                                          <input
                                            type="number"
                                            min={-1} max={1} step={0.1}
                                                  value={pair.polarity}
                                                  onChange={(e) => updateDecisionOnly((factors) => {
                                                    const copy = structuredClone(factors);
                                                    copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].polarity = parseFloat(e.target.value);
                                                    return copy;
                                                  })}
                                                  onBlur={rescoreDecision}
                                                  className="input input-sm"
                                                />
                                        </div>
                                        <div>
                                          <label className="label-sm">Temporal profile</label>
                                          <select
                                            value={factor.temporal_profile}
                                            onChange={(e) => {
                                              updateDecisionOnly((factors) => {
                                                const copy = structuredClone(factors);
                                                copy.find((f) => f.id === factor.id)!.temporal_profile = e.target.value as "transition" | "steady_case_flow" | "steady_structural";
                                                return copy;
                                              });
                                              rescoreDecision();
                                            }}
                                            className="select text-xs py-1.5"
                                          >
                                            <option value="transition">transition</option>
                                            <option value="steady_case_flow">steady_case_flow</option>
                                            <option value="steady_structural">steady_structural</option>
                                          </select>
                                        </div>
                                        {factor.temporal_profile === "transition" && (
                                          <>
                                            <div>
                                              <label className="label-sm">Time type</label>
                                              <select
                                                value={pair.time_type}
                                                onChange={(e) => {
                                                  updateDecisionOnly((factors) => {
                                                    const copy = structuredClone(factors);
                                                    copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].time_type = e.target.value as "finite" | "indefinite";
                                                    return copy;
                                                  });
                                                  rescoreDecision();
                                                }}
                                                className="select text-xs py-1.5"
                                              >
                                                <option value="finite">finite</option>
                                                <option value="indefinite">indefinite</option>
                                              </select>
                                            </div>
                                            {pair.time_type === "finite" ? (
                                              <div>
                                                <label className="label-sm">Duration (yrs)</label>
                                                <input
                                                  type="number"
                                                  min={0} step={0.1}
                                                  value={pair.duration_years ?? 0}
                                                  onChange={(e) => updateDecisionOnly((factors) => {
                                                    const copy = structuredClone(factors);
                                                    const p = copy.find((f) => f.id === factor.id)!.axiom_pairs[idx];
                                                    p.duration_years = parseFloat(e.target.value);
                                                    p.physical_half_life_years = null;
                                                    return copy;
                                                  })}
                                                  onBlur={rescoreDecision}
                                                  className="input input-sm"
                                                />
                                              </div>
                                            ) : (
                                              <div>
                                                <label className="label-sm">Phys. half-life</label>
                                                <input
                                                  type="number"
                                                  min={0} step={0.1}
                                                  value={pair.physical_half_life_years ?? 0}
                                                  onChange={(e) => updateDecisionOnly((factors) => {
                                                    const copy = structuredClone(factors);
                                                    const p = copy.find((f) => f.id === factor.id)!.axiom_pairs[idx];
                                                    p.physical_half_life_years = parseFloat(e.target.value);
                                                    p.duration_years = null;
                                                    return copy;
                                                  })}
                                                  onBlur={rescoreDecision}
                                                  className="input input-sm"
                                                />
                                              </div>
                                            )}
                                          </>
                                        )}
                                        {factor.temporal_profile === "steady_case_flow" && (
                                          <div>
                                            <label className="label-sm">Duration (yrs)</label>
                                            <input
                                              type="number"
                                              min={0} step={0.1}
                                              value={pair.duration_years ?? 1}
                                              onChange={(e) => updateDecisionOnly((factors) => {
                                                const copy = structuredClone(factors);
                                                const p = copy.find((f) => f.id === factor.id)!.axiom_pairs[idx];
                                                p.duration_years = parseFloat(e.target.value);
                                                return copy;
                                              })}
                                              onBlur={rescoreDecision}
                                              className="input input-sm"
                                            />
                                          </div>
                                        )}
                                            </div>
                                            {/* Rationale */}
                                            {pair.rationale && (
                                              <p className="text-xs text-slate-600 mt-2 italic border-t border-slate-200 pt-2">
                                                {pair.rationale}
                                              </p>
                                            )}
                                          </div>
                                          );
                                        })}
                                      </div>

                                      {/* Scale Groups (with Social Distance) */}
                                      <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Scale Groups</h4>
                                        {factor.scale_groups.map((sg, sgIdx) => {
                                          const socialClass = profile.socialClasses.find(sc => sc.id === sg.social_class_id);
                                          const weight = socialClass?.weight ?? 0.3;
                                          return (
                                            <div key={`${sg.social_class_id}-${sgIdx}`} className="border border-slate-100 rounded-lg p-3 mb-2 bg-slate-50/50">
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="badge badge-gray">{sg.social_class_id}</span>
                                                <span className="text-xs text-slate-500">{sg.description}</span>
                                              </div>
                                              <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                  <label className="label-sm">Count</label>
                                                  <input
                                                    type="number"
                                                    min={0} step={1}
                                                    value={sg.count}
                                                    onChange={(e) => updateDecisionOnly((factors) => {
                                                      const copy = structuredClone(factors);
                                                      copy.find((f) => f.id === factor.id)!.scale_groups[sgIdx].count = parseInt(e.target.value, 10);
                                                      return copy;
                                                    })}
                                                    onBlur={rescoreDecision}
                                                    className="input input-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="label-sm">Social Distance</label>
                                                  <input
                                                    type="number"
                                                    min={0} max={1} step={0.1}
                                                    value={weight}
                                                    onChange={(e) => {
                                                      const newWeight = parseFloat(e.target.value);
                                                      if (socialClass) {
                                                        updateSocialClass(socialClass.id, 'weight', newWeight);
                                                      }
                                                    }}
                                                    className="input input-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="label-sm">Weighted Scale</label>
                                                  <p className="text-sm font-medium text-slate-700 py-1.5">
                                                    {(sg.count * weight).toLocaleString()}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </details>
                                );
                              })}
                            </div>
                          );
                        };

                        const transitionFactors = result.factor_scores.filter((fs) => fs.temporal_profile === "transition");
                        const caseFlowFactors = result.factor_scores.filter((fs) => fs.temporal_profile === "steady_case_flow");
                        const structuralFactors = result.factor_scores.filter((fs) => fs.temporal_profile === "steady_structural");

                        return (
                          <>
                            {renderFactorSection("Transition factors", transitionFactors, "transition")}
                            {renderFactorSection("Steady case-flow factors", caseFlowFactors, "steady_case_flow")}
                            {renderFactorSection("Steady structural factors", structuralFactors, "steady_structural")}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Export */}
                  <details className="card">
                    <summary className="flex items-center justify-between cursor-pointer">
                      <h3 className="section-title">Export Breakdown</h3>
                      <svg className="w-4 h-4 text-slate-400 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <pre className="mt-4 text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto scrollbar-thin">
                      {breakdown}
                    </pre>
                  </details>
                </>
              ) : (
                <div className="card text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Results Yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Paste your decision JSON and click &quot;Score Decision&quot; to see the moral analysis results.
                  </p>
                </div>
              )}
            </div>
        )}

        {/* Calibration Tab */}
        {activeTab === "calibration" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Axiom Weights */}
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="section-title">Axiom Weights (MU)</h2>
                <button 
                  onClick={() => {
                    persistProfile({ ...profile, axiomWeights: { ...DEFAULT_AXIOM_WEIGHTS } });
                  }}
                  className="btn btn-ghost btn-sm text-xs"
                >
                  Reset to Defaults
                </button>
              </div>
              <p className="section-subtitle mb-4">Moral Units per person-year at full intensity</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {DEFAULT_AXIOMS.map((ax) => (
                      <tr key={ax.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-slate-900">{ax.name}</div>
                          <div className="text-xs text-slate-500">{ax.description}</div>
                        </td>
                        <td className="py-3 w-24">
                          <input
                            type="number"
                            min={0} step={1}
                            value={profile.axiomWeights[ax.id] ?? ax.default_weight}
                            onChange={(e) => updateAxiomWeight(ax.id, parseFloat(e.target.value))}
                            className="input input-sm w-full text-right"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social Distance & Time */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="section-title">Social Distances</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => persistProfile({ ...profile, socialClasses: [...DEFAULT_SOCIAL_CLASSES] })}
                      className="btn btn-ghost btn-sm text-xs"
                    >
                      Reset
                    </button>
                    <button onClick={addSocialClass} className="btn btn-ghost btn-sm text-xs">
                      + Add
                    </button>
                  </div>
                </div>
                <p className="section-subtitle mb-4">Editable relationship categories and weights</p>
                <div className="space-y-2">
                  {profile.socialClasses.map((sc) => (
                    <div key={sc.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={sc.label}
                            onChange={(e) => updateSocialClass(sc.id, 'label', e.target.value)}
                            className="input input-sm w-full"
                            placeholder="Label"
                          />
                          <div className="text-xs text-slate-500 mt-1">ID: {sc.id}</div>
                        </div>
                        <div className="w-20">
                          <label className="label-sm">Weight</label>
                          <input
                            type="number"
                            min={0} step={0.1}
                            value={sc.weight}
                            onChange={(e) => updateSocialClass(sc.id, 'weight', parseFloat(e.target.value))}
                            className="input input-sm w-full text-right"
                          />
                        </div>
                        <button
                          onClick={() => deleteSocialClass(sc.id)}
                          className="text-slate-400 hover:text-red-500 mt-5"
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                      {sc.note && (
                        <p className="text-xs text-slate-600 mt-2 italic border-t border-slate-200 pt-2">
                          {sc.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="section-title mb-1">Time Stance</h2>
                <p className="section-subtitle mb-3">How to value impacts over time</p>
                <div className="space-y-3">
                  <div>
                    <label className="label-sm">Time Model</label>
                    <select
                      value={profile.timeStance.model}
                      onChange={(e) => updateTimeStance({ model: e.target.value as any })}
                      className="input w-full"
                    >
                      <option value="linear">Linear (no discounting)</option>
                      <option value="half_life">Half-life (exponential decay)</option>
                      <option value="bucketed">Bucketed (short/medium/long-term)</option>
                    </select>
                  </div>

                  {profile.timeStance.model === "half_life" && (
                    <div>
                      <label className="label-sm">Moral Half-Life (years)</label>
                      <input
                        type="number"
                        min={1} max={200} step={1}
                        value={profile.timeStance.moral_half_life_years || 30}
                        onChange={(e) => updateTimeStance({ moral_half_life_years: parseFloat(e.target.value) })}
                        className="input w-full"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Years until future impacts count 50%
                      </p>
                    </div>
                  )}

                  {profile.timeStance.model === "bucketed" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="label-sm">Short term (years)</label>
                          <input
                            type="number"
                            min={1} step={1}
                            value={profile.timeStance.short_term_years || 5}
                            onChange={(e) => updateTimeStance({ short_term_years: parseFloat(e.target.value) })}
                            className="input input-sm w-full"
                          />
                        </div>
                        <div>
                          <label className="label-sm">Short term weight</label>
                          <input
                            type="number"
                            min={0} step={0.1}
                            value={profile.timeStance.short_term_weight || 1.0}
                            onChange={(e) => updateTimeStance({ short_term_weight: parseFloat(e.target.value) })}
                            className="input input-sm w-full"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="label-sm">Medium term (years)</label>
                          <input
                            type="number"
                            min={1} step={1}
                            value={profile.timeStance.medium_term_years || 30}
                            onChange={(e) => updateTimeStance({ medium_term_years: parseFloat(e.target.value) })}
                            className="input input-sm w-full"
                          />
                        </div>
                        <div>
                          <label className="label-sm">Medium term weight</label>
                          <input
                            type="number"
                            min={0} step={0.1}
                            value={profile.timeStance.medium_term_weight || 0.5}
                            onChange={(e) => updateTimeStance({ medium_term_weight: parseFloat(e.target.value) })}
                            className="input input-sm w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label-sm">Long term weight</label>
                        <input
                          type="number"
                          min={0} step={0.1}
                          value={profile.timeStance.long_term_weight || 0.2}
                          onChange={(e) => updateTimeStance({ long_term_weight: parseFloat(e.target.value) })}
                          className="input w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reference Tab */}
        {activeTab === "reference" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Axioms Reference */}
            <div className="card">
              <h2 className="section-title mb-4">Axioms</h2>
              <div className="space-y-3">
                {DEFAULT_AXIOMS.map((ax) => (
                  <div key={ax.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-900">{ax.name}</p>
                    <p className="text-sm text-slate-600 mt-1">{ax.description}</p>
                    <p className="text-xs text-slate-500 mt-2">ID: <code className="bg-slate-200 px-1 rounded">{ax.id}</code></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity Anchors */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="section-title">Intensity Scale (per year)</h2>
                  <button
                    onClick={() => setIntensityAnchors(DEFAULT_INTENSITY_ANCHORS)}
                    className="btn btn-ghost btn-sm text-xs"
                  >
                    Reset to Defaults
                  </button>
                </div>
                <p className="section-subtitle mb-4">General reference values for any axiom (0-1)</p>

                <table className="w-full text-xs mb-4">
                  <tbody>
                    {intensityAnchors.map((anchor) => (
                      <tr key={anchor.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-1.5 w-14">
                          <input
                            type="number"
                            min={0} max={1} step={0.01}
                            value={anchor.value}
                            onChange={(e) => {
                              const newVal = parseFloat(e.target.value) || 0;
                              setIntensityAnchors(anchors => anchors.map(a =>
                                a.id === anchor.id ? { ...a, value: newVal } : a
                              ));
                            }}
                            className="w-14 px-2 py-1 border border-slate-200 rounded text-center font-mono text-blue-600 font-semibold bg-white"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={anchor.label}
                            onChange={(e) => {
                              const newLabel = e.target.value;
                              setIntensityAnchors(anchors => anchors.map(a =>
                                a.id === anchor.id ? { ...a, label: newLabel } : a
                              ));
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-slate-700 bg-white"
                            placeholder="Enter label..."
                          />
                        </td>
                        <td className="py-1.5 w-8">
                          <button
                            onClick={() => setIntensityAnchors(anchors => anchors.filter(a => a.id !== anchor.id))}
                            className="text-slate-400 hover:text-red-500 p-1"
                            title="Delete"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-1.5 w-14 text-center text-slate-400">0.5</td>
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          placeholder="Add new anchor..."
                          value={newAnchorLabel}
                          onChange={(e) => setNewAnchorLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newAnchorLabel.trim()) {
                              setIntensityAnchors(anchors => [...anchors, { id: Date.now().toString(), label: newAnchorLabel.trim(), value: 0.5 }]);
                              setNewAnchorLabel("");
                            }
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-slate-700 bg-slate-50"
                        />
                      </td>
                      <td className="py-1.5 w-8">
                        <button
                          onClick={() => {
                            if (newAnchorLabel.trim()) {
                              setIntensityAnchors(anchors => [...anchors, { id: Date.now().toString(), label: newAnchorLabel.trim(), value: 0.5 }]);
                              setNewAnchorLabel("");
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold p-1"
                          title="Add"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Domain-specific examples */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-xs font-semibold text-slate-600 mb-2">Domain Examples</h3>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    {DOMAIN_EXAMPLES.map((ex) => (
                      <div key={ex.domain}>
                        <span className="font-medium text-slate-700">{ex.domain}:</span>{" "}
                        <span>{ex.examples}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="section-title mb-2">Social Distance Defaults</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { group: "Self", weight: "1.0" },
                    { group: "Inner Circle", weight: "0.8" },
                    { group: "Tribe", weight: "0.5" },
                    { group: "Citizens", weight: "0.3" },
                    { group: "Outsiders", weight: "0.1" },
                  ].map((item) => (
                    <div key={item.group} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-slate-600">{item.group}</span>
                      <span className="font-mono font-semibold text-slate-800">{item.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Prompt Modal */}
      {showPrompt && (
        <div className="modal-backdrop" onClick={() => setShowPrompt(false)}>
          <div className="modal-content w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold">AI Prompt</h3>
              <button onClick={() => setShowPrompt(false)} className="btn btn-ghost btn-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <pre className="text-sm bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {promptText}
              </pre>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setShowPrompt(false)} className="btn btn-ghost">Close</button>
              <button onClick={() => { copyPrompt(); setShowPrompt(false); }} className="btn btn-primary">
                Copy Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Modal */}
      {showInputModal && (
        <div className="modal-backdrop" onClick={() => setShowInputModal(false)}>
          <div className="modal-content w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold">Decision JSON</h3>
                <p className="text-sm text-slate-600 mt-1">Paste or edit the decision JSON</p>
              </div>
              <button onClick={() => setShowInputModal(false)} className="btn btn-ghost btn-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <textarea
                className="textarea h-96 scrollbar-thin"
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder="Paste decision JSON here..."
                spellCheck={false}
              />
            </div>
            <div className="flex justify-end p-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setShowInputModal(false)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
