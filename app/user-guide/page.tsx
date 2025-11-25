"use client";

export default function UserGuide() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Open Ethos User Guide</h1>
        <p className="text-slate-600">
          How scoring works, what the inputs mean, and how to use the app effectively.
        </p>
      </header>

      <section className="card space-y-2">
        <h2 className="text-xl font-semibold">Scoring Formula</h2>
        <p className="text-sm text-slate-700">
          Per axiom pair: <strong>W = U x (I x T_eff) x C x P x S</strong>
        </p>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>
            <strong>U</strong>: Axiom weight (0-1) — your priority for that axiom.
          </li>
          <li>
            <strong>I</strong>: Intensity per year (0-1) — severity of impact each year.
          </li>
          <li>
            <strong>T_eff</strong>: Effective duration (years) — derived from moral half-life and duration/physical half-life.
          </li>
          <li>
            <strong>C</strong>: Confidence (0-1) — probability the impact is real.
          </li>
          <li>
            <strong>P</strong>: Polarity (-1 to +1) — pushes NO (negative) or YES (positive).
          </li>
          <li>
            <strong>S</strong>: Scale — count x social-distance weight.
          </li>
        </ul>
        <p className="text-sm text-slate-700">
          Strength is contestation-aware: ratio = |total| / sum(|factor scores|). Strong ≥ 50%, Medium ≥ 20%, Weak otherwise.
        </p>
      </section>

      <section className="card space-y-2">
        <h2 className="text-xl font-semibold">Time Handling</h2>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>
            <strong>Moral half-life (H_moral)</strong>: how far into the future an equal impact counts at 50%. Controls discount on all factors.
          </li>
          <li>
            <strong>Finite</strong>: provide duration_years. T_eff = (1 - exp(-λ_m * D)) / λ_m.
          </li>
          <li>
            <strong>Indefinite</strong>: provide physical_half_life_years. T_eff = 1 / (λ_m + λ_p).
          </li>
        </ul>
      </section>

      <section className="card space-y-2">
        <h2 className="text-xl font-semibold">Profiles & Storage</h2>
        <p className="text-sm text-slate-700">
          Axiom weights, social weights, and moral half-life are stored locally in cookies. No server storage is used.
        </p>
      </section>

      <section className="card space-y-2">
        <h2 className="text-xl font-semibold">Workflow</h2>
        <ol className="text-sm text-slate-700 list-decimal pl-5 space-y-1">
          <li>Copy the prompt (header) and generate decision JSON with your AI.</li>
          <li>Paste the JSON in the header box and click Score (client-side only).</li>
          <li>Inspect factors, edit parameters (intensity, time, confidence, polarity, scale), rescore.</li>
          <li>Adjust calibration sliders (axiom weights, social weights, moral half-life) as needed.</li>
          <li>Reference axioms and anchors in the Reference section; manage custom anchors in Anchors.</li>
        </ol>
      </section>

      <section className="card space-y-2">
        <h2 className="text-xl font-semibold">Tips</h2>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>Use anchors to keep intensities consistent across factors.</li>
          <li>Set confidence realistically; avoid certainty theater.</li>
          <li>Polarity direction: negative pushes “NO”, positive pushes “YES”.</li>
          <li>Keep time_type consistent: finite for bounded events, indefinite with half-life for structural effects.</li>
          <li>Scale uses social-distance weights; adjust them in calibration if your circle of concern differs.</li>
        </ul>
      </section>
    </main>
  );
}
