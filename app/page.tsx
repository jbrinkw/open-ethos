"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Decision, DecisionResult, Factor } from "../lib/models";
import { EXAMPLE_JSON } from "../lib/example";
import { buildPrompt } from "../lib/prompt";
import { scoreDecision, formatScoreBreakdown } from "../lib/scoring";
import { validateDecision } from "../lib/validate";
import {
  Profile,
  defaultProfile,
  loadProfileFromCookie,
  saveProfileToCookie,
} from "../lib/profile";
import { DEFAULT_AXIOMS } from "../lib/constants";

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

export default function Home() {
  const [promptText] = useState<string>(buildPrompt);
  const [inputJson, setInputJson] = useState<string>(EXAMPLE_JSON);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("input");
  const [intensityAnchors, setIntensityAnchors] = useState<IntensityAnchor[]>(DEFAULT_INTENSITY_ANCHORS);
  const [newAnchorLabel, setNewAnchorLabel] = useState("");

  useEffect(() => {
    setProfile(loadProfileFromCookie());
  }, []);

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
    try {
      const parsed: Decision = JSON.parse(inputJson);
      const errors = validateDecision(parsed);
      if (errors.length) {
        setStatus({ type: "error", message: errors.join("; ") });
        return;
      }
      const scored = scoreDecision(parsed, profile.axiomWeights, profile.socialWeights, profile.moralHalfLifeYears);
      setDecision(parsed);
      setResult(scored);
      setStatus({ type: "success", message: "Scored successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setStatus({ type: "error", message });
    }
  }, [inputJson, profile]);

  const breakdown = useMemo(() => {
    if (!result || !decision) return "";
    return formatScoreBreakdown(result, decision, profile.moralHalfLifeYears, profile.axiomWeights, profile.socialWeights);
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

  const updateSocialWeight = (id: string, value: number) => {
    persistProfile({ ...profile, socialWeights: { ...profile.socialWeights, [id]: value } });
  };

  const updateMoralHalfLife = (value: number) => {
    persistProfile({ ...profile, moralHalfLifeYears: value });
  };

  const updateDecision = (updater: (factors: Factor[]) => Factor[]) => {
    if (!decision) return;
    const updatedFactors = updater(decision.factors);
    const updatedDecision = { ...decision, factors: updatedFactors };
    setDecision(updatedDecision);
    const rescored = scoreDecision(updatedDecision, profile.axiomWeights, profile.socialWeights, profile.moralHalfLifeYears);
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
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                User Guide
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-6">
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
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="section-title">Decision JSON</h2>
                    <p className="section-subtitle">Paste AI-generated decision JSON or edit the example</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowPrompt(true)} className="btn btn-ghost btn-sm">
                      View Prompt
                    </button>
                    <button onClick={copyPrompt} className="btn btn-primary btn-sm">
                      Copy Prompt
                    </button>
                  </div>
                </div>
                <textarea
                  className="textarea h-64 scrollbar-thin"
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder="Paste decision JSON here..."
                  spellCheck={false}
                />
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={pasteJson} className="btn btn-ghost">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Paste from Clipboard
                  </button>
                  <button onClick={runScore} className="btn btn-primary">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Score Decision
                  </button>
                </div>
              </div>

              {/* Quick Settings */}
              <div className="card">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-sm">Moral Half-Life (years)</label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={profile.moralHalfLifeYears}
                      onChange={(e) => updateMoralHalfLife(parseFloat(e.target.value) || 30)}
                      className="input input-sm mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">How far until future impacts count 50%</p>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => setActiveTab("calibration")} className="btn btn-ghost btn-sm w-full">
                      All Settings →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
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
                        </div>
                        <p className="text-slate-600 mt-1">
                          Total Score: <span className="font-semibold">{result.total_score.toFixed(3)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Top contributors</p>
                        <p className="text-sm text-slate-700">{result.top_contributors.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>

                    {decision.question && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500">Question</p>
                        <p className="text-slate-800 font-medium">{decision.question}</p>
                      </div>
                    )}
                  </div>

                  {/* Factor Breakdown */}
                  <div className="card">
                    <h3 className="section-title mb-4">Factor Breakdown</h3>
                    <div className="space-y-3">
                      {[...result.factor_scores]
                        .sort((a, b) => Math.abs(b.total_score) - Math.abs(a.total_score))
                        .map((fs) => {
                          const factor = decision.factors.find((f) => f.id === fs.factor_id);
                          if (!factor) return null;
                          const isPositive = fs.total_score > 0;
                          return (
                            <details key={fs.factor_id} className="group border border-slate-200 rounded-lg overflow-hidden">
                              <summary className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${isPositive ? "bg-emerald-500" : "bg-red-500"}`} />
                                  <span className="font-medium text-slate-900">{factor.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                    {isPositive ? "+" : ""}{fs.total_score.toFixed(3)}
                                  </span>
                                  <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </summary>
                              <div className="p-4 bg-white space-y-4">
                                <p className="text-sm text-slate-600">{factor.description}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-slate-50 p-2 rounded">
                                    <span className="text-slate-500">What changes:</span>
                                    <p className="text-slate-700">{factor.what_changes}</p>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded">
                                    <span className="text-slate-500">Who affected:</span>
                                    <p className="text-slate-700">{factor.who_affected}</p>
                                  </div>
                                </div>

                                {/* Axiom Pairs */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Axiom Parameters</h4>
                                  {factor.axiom_pairs.map((pair, idx) => (
                                    <div key={`${pair.axiom_id}-${idx}`} className="border border-slate-100 rounded-lg p-3 mb-2 bg-slate-50/50">
                                      <div className="text-sm font-medium text-slate-800 mb-2">{pair.axiom_id.replace(/_/g, " ")}</div>
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="label-sm">Intensity/yr</label>
                                          <input
                                            type="number"
                                            min={0} max={1} step={0.01}
                                            value={pair.intensity_per_year}
                                            onChange={(e) => updateDecision((factors) => {
                                              const copy = structuredClone(factors);
                                              copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].intensity_per_year = parseFloat(e.target.value);
                                              return copy;
                                            })}
                                            className="input input-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="label-sm">Confidence</label>
                                          <input
                                            type="number"
                                            min={0} max={1} step={0.01}
                                            value={pair.confidence}
                                            onChange={(e) => updateDecision((factors) => {
                                              const copy = structuredClone(factors);
                                              copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].confidence = parseFloat(e.target.value);
                                              return copy;
                                            })}
                                            className="input input-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="label-sm">Polarity</label>
                                          <input
                                            type="number"
                                            min={-1} max={1} step={0.1}
                                            value={pair.polarity}
                                            onChange={(e) => updateDecision((factors) => {
                                              const copy = structuredClone(factors);
                                              copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].polarity = parseFloat(e.target.value);
                                              return copy;
                                            })}
                                            className="input input-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="label-sm">Time type</label>
                                          <select
                                            value={pair.time_type}
                                            onChange={(e) => updateDecision((factors) => {
                                              const copy = structuredClone(factors);
                                              copy.find((f) => f.id === factor.id)!.axiom_pairs[idx].time_type = e.target.value as "finite" | "indefinite";
                                              return copy;
                                            })}
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
                                              onChange={(e) => updateDecision((factors) => {
                                                const copy = structuredClone(factors);
                                                const p = copy.find((f) => f.id === factor.id)!.axiom_pairs[idx];
                                                p.duration_years = parseFloat(e.target.value);
                                                p.physical_half_life_years = null;
                                                return copy;
                                              })}
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
                                              onChange={(e) => updateDecision((factors) => {
                                                const copy = structuredClone(factors);
                                                const p = copy.find((f) => f.id === factor.id)!.axiom_pairs[idx];
                                                p.physical_half_life_years = parseFloat(e.target.value);
                                                p.duration_years = null;
                                                return copy;
                                              })}
                                              className="input input-sm"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Scale Groups */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Scale Groups</h4>
                                  {factor.scale_groups.map((sg, sgIdx) => (
                                    <div key={`${sg.group_type}-${sgIdx}`} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg mb-2">
                                      <span className="badge badge-gray">{sg.group_type}</span>
                                      <input
                                        type="number"
                                        min={0} step={1}
                                        value={sg.count}
                                        onChange={(e) => updateDecision((factors) => {
                                          const copy = structuredClone(factors);
                                          copy.find((f) => f.id === factor.id)!.scale_groups[sgIdx].count = parseInt(e.target.value, 10);
                                          return copy;
                                        })}
                                        className="input input-sm w-24"
                                      />
                                      <span className="text-xs text-slate-600 flex-1">{sg.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </details>
                          );
                        })}
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
          </div>
        )}

        {/* Calibration Tab */}
        {activeTab === "calibration" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Axiom Weights */}
            <div className="card lg:col-span-2">
              <h2 className="section-title mb-1">Axiom Weights</h2>
              <p className="section-subtitle mb-4">Set your priority for each moral dimension (0-1)</p>
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
                            min={0} max={1} step={0.01}
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
                <h2 className="section-title mb-1">Social Distance</h2>
                <p className="section-subtitle mb-4">Weight by relationship proximity</p>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { id: "self", label: "Self", desc: "You" },
                      { id: "inner_circle", label: "Inner Circle", desc: "Family, close friends" },
                      { id: "tribe", label: "Tribe", desc: "Coworkers, neighbors" },
                      { id: "citizens", label: "Citizens", desc: "Strangers, public" },
                      { id: "outsiders", label: "Outsiders", desc: "Foreign, distant others" },
                    ].map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 pr-2">
                          <div className="font-medium text-slate-900">{item.label}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </td>
                        <td className="py-2 w-16">
                          <input
                            type="number"
                            min={0} max={1} step={0.01}
                            value={profile.socialWeights[item.id] ?? 0.5}
                            onChange={(e) => updateSocialWeight(item.id, parseFloat(e.target.value))}
                            className="input input-sm w-full text-right"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card">
                <h2 className="section-title mb-1">Time Discounting</h2>
                <p className="section-subtitle mb-3">How much future impacts matter</p>
                <div>
                  <label className="label">Moral Half-Life (years)</label>
                  <input
                    type="number"
                    min={1} max={200} step={1}
                    value={profile.moralHalfLifeYears}
                    onChange={(e) => updateMoralHalfLife(parseFloat(e.target.value))}
                    className="input"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Years until future impacts count 50%
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Lower = near-term focus; Higher = long-term focus
                  </p>
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

    </div>
  );
}
