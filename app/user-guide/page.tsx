"use client";

import Link from "next/link";

export default function UserGuide() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Open Ethos</h1>
                  <p className="text-xs text-slate-500">User Guide</p>
                </div>
              </Link>
            </div>
            <Link href="/" className="btn btn-primary btn-sm">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to App
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Open Ethos User Guide</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            A comprehensive guide to understanding and using the Open Ethos Decision Engine for
            transparent, principled moral reasoning.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="card mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "#overview", label: "Overview & Philosophy" },
              { href: "#getting-started", label: "Getting Started" },
              { href: "#scoring-formula", label: "The Scoring Formula" },
              { href: "#axioms", label: "The Eight Axioms" },
              { href: "#time-integration", label: "Time Integration" },
              { href: "#social-distance", label: "Social Distance Weighting" },
              { href: "#json-structure", label: "JSON Structure" },
              { href: "#calibration", label: "Calibrating Your Profile" },
              { href: "#interpreting-results", label: "Interpreting Results" },
              { href: "#best-practices", label: "Best Practices" },
              { href: "#examples", label: "Worked Examples" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Overview Section */}
        <section id="overview" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview & Philosophy</h2>
          <div className="prose-content">
            <p>
              The Open Ethos Decision Engine is a <strong>transparent moral scoring calculator</strong> that helps
              you analyze ethical decisions using a principled, mathematical framework. Unlike opaque AI systems that
              give you a single answer, Open Ethos shows you exactly how it arrives at its conclusions.
            </p>

            <h3>Core Principles</h3>
            <ul>
              <li>
                <strong>Transparency:</strong> Every calculation is visible. You can see exactly how each factor
                contributes to the final score and understand why the engine recommends YES, NO, or NEUTRAL.
              </li>
              <li>
                <strong>Customizability:</strong> Your values matter. Adjust axiom weights to reflect your personal
                moral priorities. Someone who prioritizes autonomy over collective wellbeing will get different
                results than someone with opposite priorities.
              </li>
              <li>
                <strong>Contestation-Aware:</strong> The engine doesn&apos;t just give you a direction—it tells you how
                contested the decision is. A &quot;strong yes&quot; means most factors align; a &quot;weak yes&quot; means there are
                significant countervailing considerations.
              </li>
              <li>
                <strong>Time-Sensitive:</strong> Future impacts are discounted based on your moral half-life setting.
                This reflects the intuition that impacts happening 50 years from now may matter differently than
                impacts happening tomorrow.
              </li>
              <li>
                <strong>Client-Side Only:</strong> All processing happens in your browser. No data is sent to any server.
                Your moral deliberations remain private.
              </li>
            </ul>

            <h3>What This Tool Is NOT</h3>
            <ul>
              <li>
                <strong>Not a moral authority:</strong> The engine doesn&apos;t tell you what&apos;s right—it helps you think
                through the implications of your own values applied to a specific situation.
              </li>
              <li>
                <strong>Not a substitute for judgment:</strong> Edge cases, context, and nuance matter. Use this as
                a structured thinking aid, not a decision-maker.
              </li>
              <li>
                <strong>Not objective truth:</strong> The output depends entirely on the inputs. Garbage in, garbage out.
                The quality of your factor analysis determines the quality of the result.
              </li>
            </ul>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>
          <div className="prose-content">
            <p>
              Here&apos;s the basic workflow for using Open Ethos:
            </p>

            <ol>
              <li>
                <strong>Copy the AI Prompt:</strong> Click &quot;Copy Prompt&quot; to get a structured prompt you can paste
                into your preferred AI assistant (Claude, ChatGPT, etc.). This prompt guides the AI to generate
                properly formatted decision JSON.
              </li>
              <li>
                <strong>Describe Your Decision:</strong> Tell the AI about your ethical dilemma. Be specific about
                the context, stakeholders, and potential outcomes. The AI will generate a balanced analysis with
                factors on both sides.
              </li>
              <li>
                <strong>Paste the JSON:</strong> Copy the AI&apos;s response (the JSON object) and paste it into the
                Decision JSON textarea in the app.
              </li>
              <li>
                <strong>Score the Decision:</strong> Click &quot;Score Decision&quot; to run the calculation. The engine will
                compute scores for each factor and give you an overall recommendation.
              </li>
              <li>
                <strong>Review and Adjust:</strong> Examine the factor breakdown. If any parameters seem off, you can
                edit them directly and the score will update in real-time.
              </li>
              <li>
                <strong>Calibrate Your Profile:</strong> Go to the Calibration tab to adjust your axiom weights,
                social distance weights, and moral half-life. These persist across sessions via cookies.
              </li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Pro Tip</h4>
              <p className="text-blue-700 text-sm">
                Start with the example JSON to understand the format. Click &quot;Score Decision&quot; to see how the
                engine works before generating your own decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Scoring Formula Section */}
        <section id="scoring-formula" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Scoring Formula</h2>
          <div className="prose-content">
            <p>
              Each factor-axiom combination is scored using this formula:
            </p>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-center text-lg my-4">
              W = U × (I × T<sub>eff</sub>) × C × P × S
            </div>

            <p>
              Let&apos;s break down each component:
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">U — Axiom Weight (0 to 1)</h4>
                <p className="text-slate-600 mt-1">
                  How much you care about this moral dimension. Set in your profile&apos;s Calibration tab.
                  A weight of 1.0 means you consider this axiom maximally important; 0.5 means moderate importance;
                  0.0 means you don&apos;t consider it at all.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">I — Intensity Per Year (0 to 1)</h4>
                <p className="text-slate-600 mt-1">
                  How severe is the impact on this axiom, per year of duration? Use the intensity anchors as
                  reference points. For life/health: 0.1 = minor illness, 1.0 = death. Impacts are always measured
                  as a rate per year.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">T<sub>eff</sub> — Effective Duration (years)</h4>
                <p className="text-slate-600 mt-1">
                  The time-discounted duration of the impact. For <strong>transition</strong> profiles, T<sub>eff</sub> comes from the time stance and the physical time_type.
                  For <strong>steady</strong> profiles (case_flow / structural), impacts are modeled as per-year flows (T<sub>eff</sub> = 1) because they recur each policy-year.
                  See the Time Integration section for details.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">C — Confidence (0 to 1)</h4>
                <p className="text-slate-600 mt-1">
                  The probability that this impact actually occurs. Be honest here—avoid &quot;certainty theater&quot;
                  where you assign 0.95 to speculative outcomes. If you&apos;re genuinely uncertain, use 0.3-0.5.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">P — Polarity (-1 to +1)</h4>
                <p className="text-slate-600 mt-1">
                  The direction of the impact. Negative values push the decision toward NO; positive values
                  push toward YES. A value of -1 means this factor strongly argues against the action; +1 means
                  it strongly argues for it. Use intermediate values for factors that partially cut both ways.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">S — Scale (count × social weight)</h4>
                <p className="text-slate-600 mt-1">
                  The number of individuals affected, weighted by their social distance from you. Self = 1.0,
                  inner circle = 0.8, tribe = 0.5, citizens = 0.3, outsiders = 0.1 by default. Adjust these in calibration.
                </p>
              </div>
            </div>

            <h3 className="mt-6">Decision Strength</h3>
            <p>
              The final score is the sum of all factor scores. But the engine also calculates <strong>strength</strong>
              using a contestation-aware formula:
            </p>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-center my-4">
              strength ratio = |total score| / Σ|factor scores|
            </div>

            <ul>
              <li><strong>Strong</strong> (≥ 50%): Most factors align in the same direction</li>
              <li><strong>Medium</strong> (≥ 20%): Mixed factors with a clear lean</li>
              <li><strong>Weak</strong> (&lt; 20%): Highly contested—significant factors on both sides</li>
            </ul>
          </div>
        </section>

        {/* Axioms Section */}
        <section id="axioms" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Eight Axioms</h2>
          <div className="prose-content">
            <p>
              Open Ethos uses an 8-axis framework to capture diverse moral considerations. Each axiom represents
              a fundamental category of moral value.
            </p>

            <div className="space-y-4 mt-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Life and Physical Health</h4>
                    <p className="text-sm text-slate-500 font-mono">life_health</p>
                    <p className="text-slate-600 mt-2">
                      Survival, physical injury, disease burden, longevity. This covers anything that affects
                      whether someone lives or dies, or their physical wellbeing over time.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-slate-700">Intensity anchors:</span>
                      <span className="text-slate-600"> 0.1 minor illness → 0.5 hospitalization → 1.0 death</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Bodily Autonomy and Self-Ownership</h4>
                    <p className="text-sm text-slate-500 font-mono">bodily_autonomy</p>
                    <p className="text-slate-600 mt-2">
                      Control over one&apos;s own body, medical consent, reproductive rights. This covers the right
                      to make decisions about what happens to your physical person.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-slate-700">Intensity anchors:</span>
                      <span className="text-slate-600"> 0.1 inconvenience → 0.4 significant restriction → 0.8 confinement</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Freedom from Coercion / Civil Liberty</h4>
                    <p className="text-sm text-slate-500 font-mono">civil_liberty</p>
                    <p className="text-slate-600 mt-2">
                      Free speech, freedom of movement, freedom from state coercion, privacy rights. The ability
                      to act without external force or threat.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-slate-700">Intensity anchors:</span>
                      <span className="text-slate-600"> 0.1 inconvenience → 0.4 restriction → 0.6 forced intervention</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Suffering and Wellbeing</h4>
                    <p className="text-sm text-slate-500 font-mono">suffering_wellbeing</p>
                    <p className="text-slate-600 mt-2">
                      Pain, joy, mental health, quality of subjective experience. This is the utilitarian
                      dimension—the hedonic impact of actions on conscious beings.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-slate-700">Intensity anchors:</span>
                      <span className="text-slate-600"> 0.1 mild stress → 0.5 significant suffering → 1.0 breakdown</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Fairness / Equal Rules</h4>
                    <p className="text-sm text-slate-500 font-mono">fairness_equality</p>
                    <p className="text-slate-600 mt-2">
                      Procedural justice, non-discrimination, equal treatment under rules. Not equality of
                      outcomes, but equal application of principles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Truth and Epistemic Integrity</h4>
                    <p className="text-sm text-slate-500 font-mono">truth_epistemic</p>
                    <p className="text-slate-600 mt-2">
                      Honesty, accuracy, resistance to manipulation, informed consent. Does the action promote
                      or undermine people&apos;s ability to form true beliefs?
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">7</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Long-term Societal Capacity</h4>
                    <p className="text-sm text-slate-500 font-mono">long_term_capacity</p>
                    <p className="text-slate-600 mt-2">
                      Innovation, resilience, future potential, sustainability. Does the action strengthen
                      or weaken society&apos;s ability to handle future challenges?
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">8</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Social Trust and Cohesion</h4>
                    <p className="text-sm text-slate-500 font-mono">social_trust</p>
                    <p className="text-slate-600 mt-2">
                      Institutional legitimacy, stability, social fabric, community bonds. Does the action
                      strengthen or erode the trust that enables cooperation?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Time Integration Section */}
        <section id="time-integration" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Time Integration</h2>
          <div className="prose-content">
            <p>
              Not all impacts last the same duration, and future impacts may be valued differently than immediate
              ones. Open Ethos uses a sophisticated time integration system.
            </p>

            <h3>Moral Half-Life (H<sub>moral</sub>)</h3>
            <p>
              Your moral half-life setting determines how much you discount future impacts. If your moral half-life
              is 30 years (the default), then an impact occurring 30 years from now counts at 50% of its
              immediate value.
            </p>
            <ul>
              <li><strong>Short half-life (10-15 years):</strong> Prioritizes near-term effects. Good for practical,
              immediate-concern ethics.</li>
              <li><strong>Medium half-life (25-40 years):</strong> Balanced view. Default setting.</li>
              <li><strong>Long half-life (50-100+ years):</strong> Weights future generations more heavily.
              Good for longtermist perspectives.</li>
            </ul>


            <h3>Temporal Profiles</h3>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li><strong>transition:</strong> one-time/finite blob around the change. Uses T<sub>eff</sub> from the time stance + physical time_type.</li>
              <li><strong>steady_case_flow:</strong> new cohorts each policy-year. Treated as per-year flow (T<sub>eff</sub> = 1).</li>
              <li><strong>steady_structural:</strong> ambient background per policy-year. Treated as per-year flow (T<sub>eff</sub> = 1).</li>
            </ul>

            <h3>Physical Time Shape (time_type)</h3>
            <p>
              time_type describes the physical persistence of each axiom_pair:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li><strong>finite:</strong> provide <code>duration_years</code>. T_eff = (1 - exp(-λ<sub>m</sub> × duration)) / λ<sub>m</sub>.</li>
              <li><strong>indefinite:</strong> provide <code>physical_half_life_years</code>. For transition profiles, T_eff = 1 / (λ<sub>m</sub> + λ<sub>p</sub>); for steady profiles, flows remain per-year.</li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-amber-800 mb-2">Example</h4>
              <p className="text-amber-700 text-sm">
                A structural factor with physical half-life 20y and moral half-life 30y would have T_eff ≈ 12 years if modeled as a transition; if marked steady_structural, it is reported as MU/year.
              </p>
            </div>
</div>
        </section>

        {/* Social Distance Section */}
        <section id="social-distance" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Social Distance Weighting</h2>
          <div className="prose-content">
            <p>
              Most people naturally weight impacts on themselves and loved ones more heavily than impacts on
              strangers. Open Ethos makes this explicit through social distance weights.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">Self (default: 1.0)</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Impacts on you personally. Maximum weight by default.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">Inner Circle (default: 0.8)</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Close family and friends. People you interact with regularly and care about deeply.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">Tribe (default: 0.5)</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Extended community—colleagues, neighbors, members of groups you identify with.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">Citizens (default: 0.3)</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Strangers in your country or humanity generally. Distant but morally considerable.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">Outsiders (default: 0.1)</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Foreign nationals, distant populations, or those outside your community entirely.
                </p>
              </div>
            </div>

            <h3>Adjusting for Your Ethics</h3>
            <ul>
              <li>
                <strong>Strict impartiality:</strong> Set all weights to 1.0. Every person counts equally
                regardless of relationship to you.
              </li>
              <li>
                <strong>Moderate partiality:</strong> Use the defaults. Most ethical frameworks acknowledge
                some special obligations to those close to us.
              </li>
              <li>
                <strong>Strong partiality:</strong> Increase self/inner_circle, decrease citizens. Reflects
                a more agent-relative ethics.
              </li>
            </ul>

            <p>
              The scale factor (S) is calculated as: <code>S = count × social_weight</code>. So 1000 citizens
              at 0.3 weight contributes 300 to the scale, while 1 self at 1.0 contributes 1.
            </p>
          </div>
        </section>

        {/* JSON Structure Section */}
        <section id="json-structure" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">JSON Structure</h2>
          <div className="prose-content">
            <p>
              When you generate a decision with AI or create one manually, it must follow this structure:
            </p>

            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm my-4">
{`{
  "id": "unique-decision-id",
  "question": "The ethical question being analyzed",
  "context": "Background information and circumstances",
  "factors": [
    {
      "id": "factor-1",
      "name": "Short factor name",
      "description": "Detailed explanation of this factor",
      "what_changes": "What specifically changes if action is taken",
      "who_affected": "Who is impacted by this factor",
      "how_much": "Qualitative description of magnitude",
      "duration": "How long the effect lasts",
      "temporal_profile": "transition",
      "axiom_pairs": [
        {
          "axiom_id": "life_health",
          "intensity_per_year": 0.5,
          "time_type": "finite",
          "duration_years": 5,
          "physical_half_life_years": null,
          "confidence": 0.7,
          "polarity": -1.0,
          "rationale": "Why this axiom applies"
        }
      ],
      "scale_groups": [
        {
          "social_class_id": "citizens",
          "count": 10000,
          "description": "Population affected"
        }
      ]
    }
  ]
}`}
            </pre>

            <h3>Key Fields Explained</h3>
            <ul>
              <li><strong>factors:</strong> Array of distinct considerations. Include factors on BOTH sides
              of the decision (pro and con).</li>
              <li><strong>temporal_profile:</strong> "transition", "steady_case_flow", or "steady_structural". Transition uses T<sub>eff</sub>; steady profiles are per-year flows.</li>
              <li><strong>axiom_pairs:</strong> Each factor can affect multiple axioms. For instance, a factor
              might impact both health and autonomy.</li>
              <li><strong>time_type:</strong> Physical shape per axiom_pair: "finite" (with duration_years) or "indefinite" (with physical_half_life_years).</li>
              <li><strong>polarity:</strong> Negative = pushes toward NO; Positive = pushes toward YES.</li>
              <li><strong>scale_groups:</strong> Who is affected and how many. Use social_class_id (self, inner_circle, tribe, citizens, etc.).</li>
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-red-800 mb-2">Common Mistakes</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Forgetting to include factors on both sides of the decision</li>
                <li>• Setting confidence too high (0.9+) for uncertain outcomes</li>
                <li>• Using intensity 1.0 for non-death-equivalent impacts</li>
                <li>• Mixing up polarity (remember: negative = against action)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Calibration Section */}
        <section id="calibration" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Calibrating Your Profile</h2>
          <div className="prose-content">
            <p>
              The Calibration tab lets you customize the engine to reflect your personal values. Your settings
              are saved in browser cookies and persist across sessions.
            </p>

            <h3>Axiom Weights</h3>
            <p>
              Set a weight from 0 to 1 for each of the eight axioms. This represents how important each moral
              dimension is to you:
            </p>
            <ul>
              <li><strong>0.0:</strong> This axiom doesn&apos;t factor into my moral reasoning at all</li>
              <li><strong>0.25:</strong> Minor consideration</li>
              <li><strong>0.5:</strong> Moderate importance (default)</li>
              <li><strong>0.75:</strong> High priority</li>
              <li><strong>1.0:</strong> Maximum importance—I weight this very heavily</li>
            </ul>

            <h3>Social Distance Weights</h3>
            <p>
              Adjust how much you weight impacts based on relationship proximity. See the Social Distance section
              for details on what each group means.
            </p>

            <h3>Moral Half-Life</h3>
            <p>
              Set the number of years after which an equal impact matters 50% as much. Lower values prioritize
              immediate effects; higher values give more weight to long-term consequences.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-green-800 mb-2">Calibration Tips</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Start with defaults and adjust based on your intuitions</li>
                <li>• Try running the same decision with different calibrations to see how results change</li>
                <li>• There&apos;s no &quot;correct&quot; calibration—it should reflect YOUR values</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interpreting Results Section */}
        <section id="interpreting-results" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Interpreting Results</h2>
          <div className="prose-content">
            <h3>The Overall Verdict</h3>
            <p>
              After scoring, you&apos;ll see one of three results:
            </p>
            <ul>
              <li><strong>YES (positive score):</strong> The weighted factors favor taking the action</li>
              <li><strong>NO (negative score):</strong> The weighted factors favor not taking the action</li>
              <li><strong>NEUTRAL (near-zero score):</strong> Factors roughly balance out</li>
            </ul>

            <h3>Strength Indicators</h3>
            <p>
              The strength tells you how contested the decision is:
            </p>
            <ul>
              <li><strong>Strong:</strong> 50%+ of factor weight aligns with the verdict. Clear direction.</li>
              <li><strong>Medium:</strong> 20-50% alignment. There are significant countervailing factors.</li>
              <li><strong>Weak:</strong> Under 20% alignment. Highly contested—proceed with caution.</li>
            </ul>

            <h3>Factor Breakdown</h3>
            <p>
              Click on each factor to see:
            </p>
            <ul>
              <li>The factor&apos;s individual score and contribution to the total</li>
              <li>Which axioms are involved and their parameters</li>
              <li>Scale groups showing who is affected</li>
              <li>Editable fields to adjust parameters and see real-time score updates</li>
            </ul>

            <h3>What the Score Means</h3>
            <p>
              The absolute magnitude of the score reflects the overall weight of moral considerations. A score
              of +0.5 is modest; a score of +50.0 indicates massive scale (many people, severe impacts, long
              duration). Don&apos;t compare scores across different decisions—they&apos;re not normalized.
            </p>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          <div className="prose-content">
            <h3>When Generating Decisions</h3>
            <ol>
              <li>
                <strong>Be specific about context.</strong> The more detail you give the AI, the better it can
                identify relevant factors.
              </li>
              <li>
                <strong>Always include factors on both sides.</strong> A one-sided analysis defeats the purpose.
                Ask &quot;what are the strongest arguments FOR and AGAINST?&quot;
              </li>
              <li>
                <strong>Ground intensities in anchors.</strong> Don&apos;t just guess—reference the intensity scales
                to maintain consistency.
              </li>
              <li>
                <strong>Be honest about uncertainty.</strong> Use appropriate confidence levels. Most predictions
                about the future should be 0.3-0.7, not 0.95.
              </li>
            </ol>

            <h3>When Reviewing Results</h3>
            <ol>
              <li>
                <strong>Check the factor breakdown.</strong> Does each factor make sense? Are the parameters
                reasonable?
              </li>
              <li>
                <strong>Adjust suspicious values.</strong> If something seems off, edit it and see how the
                score changes.
              </li>
              <li>
                <strong>Consider what&apos;s missing.</strong> Are there important factors that weren&apos;t included?
                You can add them to the JSON and rescore.
              </li>
              <li>
                <strong>Don&apos;t take the result as gospel.</strong> This is a thinking aid, not an oracle. Use
                it to structure your reasoning, not replace it.
              </li>
            </ol>

            <h3>Calibration Philosophy</h3>
            <ol>
              <li>
                <strong>Your weights should reflect your actual values,</strong> not what you think you &quot;should&quot;
                believe.
              </li>
              <li>
                <strong>Experiment with different calibrations</strong> to understand how sensitive the result
                is to your assumptions.
              </li>
              <li>
                <strong>Recalibrate periodically.</strong> Your values may evolve over time.
              </li>
            </ol>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Worked Examples</h2>
          <div className="prose-content">
            <h3>Example 1: Lying to Protect Feelings</h3>
            <p>
              <strong>Question:</strong> Should I lie to a friend about their artwork to spare their feelings?
            </p>
            <p>
              <strong>Factors that push NO (truth-telling):</strong>
            </p>
            <ul>
              <li>Damages trust if discovered (social_trust, polarity -1)</li>
              <li>Prevents artistic growth (long_term_capacity, polarity -1)</li>
              <li>Violates epistemic integrity (truth_epistemic, polarity -1)</li>
            </ul>
            <p>
              <strong>Factors that push YES (lying):</strong>
            </p>
            <ul>
              <li>Prevents immediate emotional pain (suffering_wellbeing, polarity +1)</li>
              <li>Preserves immediate relationship harmony (social_trust, polarity +1)</li>
            </ul>
            <p>
              A typical result might be NO (weak) or NO (medium)—the truth-telling factors often outweigh,
              but it&apos;s contested because there are real benefits to the lie.
            </p>

            <div className="border-t border-slate-200 my-6"></div>

            <h3>Example 2: Vaccine Mandates</h3>
            <p>
              <strong>Question:</strong> Should a company mandate vaccines for employees?
            </p>
            <p>
              <strong>Factors that push YES (mandate):</strong>
            </p>
            <ul>
              <li>Reduces disease spread (life_health, many citizens affected)</li>
              <li>Protects vulnerable populations (life_health, fairness_equality)</li>
            </ul>
            <p>
              <strong>Factors that push NO (no mandate):</strong>
            </p>
            <ul>
              <li>Violates bodily autonomy (bodily_autonomy, employees affected)</li>
              <li>Coercive pressure on employment (civil_liberty)</li>
              <li>May erode trust in institutions (social_trust)</li>
            </ul>
            <p>
              This often produces a contested result. The direction depends heavily on your calibration—how
              much you weight collective health vs. individual autonomy.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="card mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="prose-content">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900">Is my data sent to any server?</h4>
                <p className="text-slate-600">
                  No. All scoring happens entirely in your browser. The only external call is to your AI
                  assistant when generating decision JSON—and that&apos;s done by you manually copying/pasting.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Can I use this for important real-world decisions?</h4>
                <p className="text-slate-600">
                  This is a thinking aid, not a decision-maker. It can help you structure your reasoning and
                  identify considerations you might miss, but the final judgment should always be yours.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Why does the score seem very large/small?</h4>
                <p className="text-slate-600">
                  Score magnitude depends on scale (number of people affected), duration, and intensity. A
                  factor affecting millions of people will produce a much larger score than one affecting
                  yourself. This is by design.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">What if I disagree with the result?</h4>
                <p className="text-slate-600">
                  Good! That means you should examine why. Either (a) some parameter is wrong and should be
                  adjusted, (b) an important factor is missing, or (c) the engine has surfaced a genuine
                  tension between your stated values and intuitions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">How do I reset my calibration to defaults?</h4>
                <p className="text-slate-600">
                  Clear your browser cookies for this site. Your profile is stored in cookies and will
                  reset to defaults when cleared.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Can I add my own axioms?</h4>
                <p className="text-slate-600">
                  Not currently. The 8-axiom framework is fixed to ensure consistency. However, most moral
                  considerations can be mapped to one or more of the existing axioms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-slate-500">
          <p>
            Open Ethos Decision Engine — Transparent moral reasoning for complex decisions.
          </p>
          <p className="mt-2">
            <Link href="/" className="text-blue-600 hover:underline">Return to App</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
