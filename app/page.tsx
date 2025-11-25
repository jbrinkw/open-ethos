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
type Anchor = { id: string; axiom_id: string; magnitude: number; name: string; description: string };

export default function Home() {
  const [promptText] = useState<string>(buildPrompt);
  const [inputJson, setInputJson] = useState<string>(EXAMPLE_JSON);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAnchors, setShowAnchors] = useState(false);
  const [anchors, setAnchors] = useState<Anchor[]>([
    {
      id: "life-death",
      axiom_id: "life_health",
      magnitude: 1.0,
      name: "Death",
      description: "Loss of remaining lifespan",
    },
    {
      id: "autonomy-confinement",
      axiom_id: "bodily_autonomy",
      magnitude: 0.8,
      name: "Confinement",
      description: "Detention or physical confinement",
    },
  ]);
  const [newAnchor, setNewAnchor] = useState<Anchor>({
    id: "",
    axiom_id: "life_health",
    magnitude: 0.5,
    name: "",
    description: "",
  });

  // Load profile from cookie on mount
  useEffect(() => {
    setProfile(loadProfileFromCookie());
  }, []);

  const persistProfile = useCallback(
    (p: Profile) => {
      setProfile(p);
      saveProfileToCookie(p);
    },
    [setProfile]
  );

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setStatus({ type: "success", message: "Prompt copied to clipboard" });
    } catch (err) {
      setStatus({ type: "error", message: "Clipboard copy failed" });
    }
  }, [promptText]);

  const openPrompt = useCallback(() => setShowPrompt(true), []);
  const closePrompt = useCallback(() => setShowPrompt(false), []);

  const pasteJson = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInputJson(text);
      setStatus({ type: "success", message: "Pasted from clipboard" });
    } catch (err) {
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
      const scored = scoreDecision(
        parsed,
        profile.axiomWeights,
        profile.socialWeights,
        profile.moralHalfLifeYears
      );
      setDecision(parsed);
      setResult(scored);
      setStatus({ type: "success", message: "Scored successfully" });
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Invalid JSON" });
    }
  }, [inputJson, profile]);

  const breakdown = useMemo(() => {
    if (!result || !decision) return "";
    return formatScoreBreakdown(
      result,
      decision,
      profile.moralHalfLifeYears,
      profile.axiomWeights,
      profile.socialWeights
    );
  }, [result, decision, profile]);

  useEffect(() => {
    if (status.type === "success") {
      const id = setTimeout(() => setStatus({ type: "idle", message: "" }), 2000);
      return () => clearTimeout(id);
    }
  }, [status]);

  const updateAxiomWeight = (id: string, value: number) => {
    const next = {
      ...profile,
      axiomWeights: { ...profile.axiomWeights, [id]: value },
    };
    persistProfile(next);
  };

  const updateSocialWeight = (id: string, value: number) => {
    const next = {
      ...profile,
      socialWeights: { ...profile.socialWeights, [id]: value },
    };
    persistProfile(next);
  };

  const updateMoralHalfLife = (value: number) => {
    const next = { ...profile, moralHalfLifeYears: value };
    persistProfile(next);
  };

  const updateDecision = (updater: (factors: Factor[]) => Factor[]) => {
    if (!decision) return;
    const updatedFactors = updater(decision.factors);
    const updatedDecision = { ...decision, factors: updatedFactors };
    setDecision(updatedDecision);
    const rescored = scoreDecision(
      updatedDecision,
      profile.axiomWeights,
      profile.socialWeights,
      profile.moralHalfLifeYears
    );
    setResult(rescored);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Open Ethos Decision Engine</h1>
            <p className="text-slate-600">
              Client-side moral scoring with transparent math (no server calls).
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/user-guide"
              className="btn btn-ghost"
              title="Open the user guide"
            >
              User guide
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={copyPrompt}
            title="Copy the full AI prompt text to your clipboard"
          >
            Copy prompt
          </button>
          <button
            className="btn btn-ghost"
            onClick={openPrompt}
            title="View the full prompt in a modal"
          >
            View prompt
          </button>
          <button
            className="btn btn-ghost"
            onClick={pasteJson}
            title="Paste decision JSON from clipboard"
          >
            Paste
          </button>
          <input
            className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-40 h-10 font-mono"
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="JSON"
            title="Short box for quick paste (full JSON still accepted)"
          />
          <button
            className="btn btn-primary"
            onClick={runScore}
            title="Parse and score locally using your current weights"
          >
            Score
          </button>
        </div>

        {status.type !== "idle" && (
          <div
            className={`text-sm ${
              status.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {status.message}
          </div>
        )}
      </header>

      {result && decision && (
        <section className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {result.result} ({result.strength.replace("_", " ")})
              </p>
              <p className="text-slate-600">Total Score: {result.total_score.toFixed(2)}</p>
            </div>
            <div className="text-sm text-slate-500">
              Top factors: {result.top_contributors.join(", ")}
            </div>
          </div>

          <div className="space-y-2">
            {[...result.factor_scores]
              .sort((a, b) => Math.abs(b.total_score) - Math.abs(a.total_score))
              .map((fs) => {
                const factor = decision.factors.find((f) => f.id === fs.factor_id);
                if (!factor) return null;
                return (
                  <details key={fs.factor_id} className="border border-slate-200 rounded-lg p-3">
                    <summary className="cursor-pointer flex justify-between">
                      <span className="font-medium">
                        {factor.name} ({fs.total_score.toFixed(2)})
                      </span>
                    </summary>
                    <div className="mt-2 text-sm text-slate-700 space-y-3">
                      <div>{factor.description}</div>
                      <div className="text-slate-600">
                        {factor.what_changes} | {factor.who_affected}
                      </div>

                      <div className="space-y-2">
                        <div className="font-semibold">Axiom parameters</div>
                        {factor.axiom_pairs.map((pair, idx) => (
                          <div
                            key={`${pair.axiom_id}-${idx}`}
                            className="border border-slate-100 rounded p-2 space-y-2"
                          >
                            <div className="font-semibold">{pair.axiom_id}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <label className="flex flex-col gap-1">
                                <span>Intensity/year</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={pair.intensity_per_year}
                                  onChange={(e) =>
                                    updateDecision((factors) => {
                                      const copy = structuredClone(factors);
                                      copy
                                        .find((f) => f.id === factor.id)!
                                        .axiom_pairs[idx].intensity_per_year =
                                        parseFloat(e.target.value);
                                      return copy;
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                />
                              </label>
                              <label className="flex flex-col gap-1">
                                <span>Polarity</span>
                                <input
                                  type="number"
                                  min={-1}
                                  max={1}
                                  step={0.1}
                                  value={pair.polarity}
                                  onChange={(e) =>
                                    updateDecision((factors) => {
                                      const copy = structuredClone(factors);
                                      copy.find((f) => f.id === factor.id)!.axiom_pairs[
                                        idx
                                      ].polarity = parseFloat(e.target.value);
                                      return copy;
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                />
                              </label>
                              <label className="flex flex-col gap-1">
                                <span>Confidence</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={pair.confidence}
                                  onChange={(e) =>
                                    updateDecision((factors) => {
                                      const copy = structuredClone(factors);
                                      copy
                                        .find((f) => f.id === factor.id)!
                                        .axiom_pairs[idx].confidence = parseFloat(
                                        e.target.value
                                      );
                                      return copy;
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                />
                              </label>
                              <label className="flex flex-col gap-1">
                                <span>Time type</span>
                                <select
                                  value={pair.time_type}
                                  onChange={(e) =>
                                    updateDecision((factors) => {
                                      const copy = structuredClone(factors);
                                      copy
                                        .find((f) => f.id === factor.id)!
                                        .axiom_pairs[idx].time_type = e.target.value as any;
                                      return copy;
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                >
                                  <option value="finite">finite</option>
                                  <option value="indefinite">indefinite</option>
                                </select>
                              </label>
                              {pair.time_type === "finite" ? (
                                <label className="flex flex-col gap-1">
                                  <span>Duration (years)</span>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.1}
                                    value={pair.duration_years ?? 0}
                                    onChange={(e) =>
                                      updateDecision((factors) => {
                                        const copy = structuredClone(factors);
                                        copy
                                          .find((f) => f.id === factor.id)!
                                          .axiom_pairs[idx].duration_years =
                                          parseFloat(e.target.value);
                                        copy
                                          .find((f) => f.id === factor.id)!
                                          .axiom_pairs[idx].physical_half_life_years = null;
                                        return copy;
                                      })
                                    }
                                    className="border rounded px-2 py-1"
                                  />
                                </label>
                              ) : (
                                <label className="flex flex-col gap-1">
                                  <span>Physical half-life (years)</span>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.1}
                                    value={pair.physical_half_life_years ?? 0}
                                    onChange={(e) =>
                                      updateDecision((factors) => {
                                        const copy = structuredClone(factors);
                                        copy
                                          .find((f) => f.id === factor.id)!
                                          .axiom_pairs[idx].physical_half_life_years =
                                          parseFloat(e.target.value);
                                        copy
                                          .find((f) => f.id === factor.id)!
                                          .axiom_pairs[idx].duration_years = null;
                                        return copy;
                                      })
                                    }
                                    className="border rounded px-2 py-1"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="font-semibold">Scale groups</div>
                        {factor.scale_groups.map((sg, sgIdx) => (
                          <div
                            key={`${sg.group_type}-${sgIdx}`}
                            className="border border-slate-100 rounded p-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{sg.group_type}</span>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={sg.count}
                                onChange={(e) =>
                                  updateDecision((factors) => {
                                    const copy = structuredClone(factors);
                                    copy.find((f) => f.id === factor.id)!.scale_groups[sgIdx].count =
                                      parseInt(e.target.value, 10);
                                    return copy;
                                  })
                                }
                                className="border rounded px-2 py-1 w-28"
                              />
                              <span className="text-slate-600">{sg.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
          </div>

          <details className="border border-slate-200 rounded-lg p-3">
            <summary className="cursor-pointer font-medium">Export breakdown</summary>
            <pre className="mt-2 text-xs whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
              {breakdown}
            </pre>
          </details>
        </section>
      )}

      {/* Calibration (direct value editor) */}
      <section className="card space-y-4">
        <h2 className="text-xl font-semibold">Calibration</h2>
        <p className="text-sm text-slate-600">
          Directly edit axiom weights, social distance weights, and moral half-life. Saved to cookies.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-semibold">Axiom weights</div>
            {DEFAULT_AXIOMS.map((ax) => (
              <label key={ax.id} className="flex items-center justify-between text-sm">
                <span>{ax.name}</span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={profile.axiomWeights[ax.id] ?? ax.default_weight}
                  onChange={(e) => updateAxiomWeight(ax.id, parseFloat(e.target.value))}
                  className="border rounded px-2 py-1 w-24"
                />
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <div className="font-semibold">Social distance weights</div>
            {Object.entries(profile.socialWeights).map(([id, val]) => (
              <label key={id} className="flex items-center justify-between text-sm">
                <span>{id}</span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={val}
                  onChange={(e) => updateSocialWeight(id, parseFloat(e.target.value))}
                  className="border rounded px-2 py-1 w-24"
                />
              </label>
            ))}
            <div className="pt-2 space-y-1">
              <div className="font-semibold">Moral half-life (years)</div>
              <input
                type="number"
                min={1}
                max={200}
                step={1}
                value={profile.moralHalfLifeYears}
                onChange={(e) => updateMoralHalfLife(parseFloat(e.target.value))}
                className="border rounded px-2 py-1 w-32"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reference */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reference</h2>
          <button
            className="btn btn-ghost"
            onClick={() => setShowAnchors(true)}
            title="Add or edit anchors (local only)"
          >
            Manage anchors
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-semibold">Axioms</div>
            {DEFAULT_AXIOMS.map((ax) => (
              <div key={ax.id} className="border border-slate-200 rounded p-2">
                <div className="font-medium">{ax.name}</div>
                <p className="text-sm text-slate-600 mt-1">{ax.description}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="font-semibold">Intensity Anchors (per year)</div>
            <div className="text-sm text-slate-700 space-y-1">
              <p className="font-semibold">Life/Health</p>
              <p>0.1 minor illness, 0.3 moderate, 0.5 serious/hospitalization, 0.7 severe/chronic, 1.0 death</p>
              <p className="font-semibold pt-2">Autonomy/Liberty</p>
              <p>0.1 inconvenience, 0.2 moderate coercion, 0.4 significant restriction, 0.6 forced intervention, 0.8 confinement</p>
              <p className="font-semibold pt-2">Suffering/Wellbeing</p>
              <p>0.1 mild stress, 0.3 moderate anxiety, 0.5 significant suffering, 0.7 severe psychological harm, 1.0 breakdown</p>
            </div>
          </div>
        </div>
      </section>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Full prompt</h3>
              <button className="btn btn-ghost" onClick={closePrompt}>
                Close
              </button>
            </div>
            <textarea
              className="w-full h-96 p-3 border border-slate-200 rounded-lg text-sm font-mono"
              readOnly
              value={promptText}
            />
          </div>
        </div>
      )}

      {showAnchors && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Anchors (local only)</h3>
              <button className="btn btn-ghost" onClick={() => setShowAnchors(false)}>
                Close
              </button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {anchors.map((a, idx) => (
                <div
                  key={a.id || idx}
                  className="border border-slate-200 rounded p-3 grid md:grid-cols-4 gap-2 items-center text-sm"
                >
                  <input
                    className="border rounded px-2 py-1"
                    value={a.name}
                    onChange={(e) => {
                      const copy = [...anchors];
                      copy[idx].name = e.target.value;
                      setAnchors(copy);
                    }}
                    placeholder="Name"
                  />
                  <select
                    className="border rounded px-2 py-1"
                    value={a.axiom_id}
                    onChange={(e) => {
                      const copy = [...anchors];
                      copy[idx].axiom_id = e.target.value;
                      setAnchors(copy);
                    }}
                  >
                    {DEFAULT_AXIOMS.map((ax) => (
                      <option key={ax.id} value={ax.id}>
                        {ax.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    className="border rounded px-2 py-1"
                    value={a.magnitude}
                    onChange={(e) => {
                      const copy = [...anchors];
                      copy[idx].magnitude = parseFloat(e.target.value);
                      setAnchors(copy);
                    }}
                  />
                  <input
                    className="border rounded px-2 py-1 md:col-span-1"
                    value={a.description}
                    onChange={(e) => {
                      const copy = [...anchors];
                      copy[idx].description = e.target.value;
                      setAnchors(copy);
                    }}
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-4 gap-2 text-sm">
              <input
                className="border rounded px-2 py-1"
                value={newAnchor.name}
                onChange={(e) => setNewAnchor({ ...newAnchor, name: e.target.value })}
                placeholder="Name"
              />
              <select
                className="border rounded px-2 py-1"
                value={newAnchor.axiom_id}
                onChange={(e) => setNewAnchor({ ...newAnchor, axiom_id: e.target.value })}
              >
                {DEFAULT_AXIOMS.map((ax) => (
                  <option key={ax.id} value={ax.id}>
                    {ax.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                className="border rounded px-2 py-1"
                value={newAnchor.magnitude}
                onChange={(e) =>
                  setNewAnchor({ ...newAnchor, magnitude: parseFloat(e.target.value) })
                }
                placeholder="Magnitude"
              />
              <input
                className="border rounded px-2 py-1"
                value={newAnchor.description}
                onChange={(e) =>
                  setNewAnchor({ ...newAnchor, description: e.target.value })
                }
                placeholder="Description"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!newAnchor.name) return;
                  setAnchors([...anchors, { ...newAnchor, id: newAnchor.name }]);
                  setNewAnchor({
                    id: "",
                    axiom_id: "life_health",
                    magnitude: 0.5,
                    name: "",
                    description: "",
                  });
                }}
              >
                Add anchor
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
