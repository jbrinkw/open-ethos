"use client";

import Link from "next/link";

const TOC_ITEMS = [
  { href: "#why", label: "Why Open Ethos Exists" },
  { href: "#what", label: "What Open Ethos Is" },
  { href: "#broader-stack", label: "The Broader Civic Stack" },
  { href: "#public-profiles", label: "Public Profiles" },
  { href: "#scoring-formula", label: "The Scoring Formula" },
  { href: "#axioms", label: "The Eight Axioms" },
  { href: "#time-integration", label: "Time Integration" },
  { href: "#social-distance", label: "Social Distance Weighting" },
  { href: "#magic-factor", label: "The Magic Factor" },
  { href: "#getting-started", label: "Getting Started" },
  { href: "#calibration", label: "Calibrating Your Profile" },
  { href: "#interpreting-results", label: "Interpreting Results" },
  { href: "#coherence", label: "Working Toward Coherence" },
  { href: "#best-practices", label: "Best Practices" },
  { href: "#examples", label: "Worked Examples" },
  { href: "#faq", label: "FAQ" },
];

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
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Open Ethos User Guide</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Transparent, principled moral reasoning for complex decisions.
          </p>
        </div>

        {/* Project status banner */}
        <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-amber-900">
                Project status: working proof of concept, broader vision still in concept phase
              </h2>
              <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                Open Ethos is a developing idea. The decision engine and this interface are a working
                proof of concept &mdash; the scoring math and editor you see here run real decisions in your
                browser today. The broader civic-stack vision, public profiles, political accountability
                tooling, cross-cultural value mapping, and AI-alignment dataset described below are{" "}
                <strong>directional ideas, not built features</strong>. Sections marked
                {" "}<span className="badge badge-yellow align-middle">Direction &mdash; not built yet</span>
                {" "}describe where this could go, not what currently ships. That&apos;s okay: the PoC is real
                and strong enough that this guide can honestly describe the destination.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents - Mobile */}
        <details className="card mb-4 sm:hidden" open>
          <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-slate-900">
            Table of Contents
            <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {TOC_ITEMS.map((item) => (
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
        </details>

        {/* Table of Contents - Desktop */}
        <nav className="card mb-8 hidden sm:block">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOC_ITEMS.map((item) => (
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

        {/* Why Open Ethos Exists */}
        <section id="why" className="card mb-6 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">Why Open Ethos Exists</h2>
            <span className="badge badge-yellow">Direction &mdash; not built yet</span>
          </div>
          <div className="prose-content">
            <p>
              Open Ethos is built to address five problems, ordered here from the most far-reaching to the
              most personal. The first two are the reason the project matters at scale. The last three are
              the foundation everything else is built on.
            </p>
            <ul>
              <li><a href="#ai-alignment" className="text-blue-600 hover:underline">The Value Specification Problem: Making AI Alignment Possible</a></li>
              <li><a href="#political-dysfunction" className="text-blue-600 hover:underline">The Political Dysfunction Problem: Accountability Without Bias</a></li>
              <li><a href="#cross-cultural" className="text-blue-600 hover:underline">The Cross-Cultural Understanding Problem: Seeing Through the Noise</a></li>
              <li><a href="#decision-quality" className="text-blue-600 hover:underline">The Decision Quality Problem: Reasoning Instead of Reacting</a></li>
              <li><a href="#self-knowledge" className="text-blue-600 hover:underline">The Self-Knowledge Problem: Knowing What You Actually Believe</a></li>
            </ul>

            <h3 id="ai-alignment" className="scroll-mt-24">The Value Specification Problem: Making AI Alignment Possible</h3>
            <p>
              The paperclip problem isn&apos;t about paperclips. It&apos;s about the gap between what humans
              value and what we can formally specify to an optimization system. Every current alignment
              approach tries to close that gap from the AI side: RLHF infers values from
              thumbs-up/thumbs-down (noisy, shallow, biased toward the feedback population), Constitutional
              AI has a small team write principles (whose values?), inverse reward design reverse-engineers
              values from behavior (behavior reflects constraints and incentives, not just values). All are
              indirect approximations of something that does not exist yet: a large-scale, structured,
              machine-readable dataset of what humans actually value, stated directly, verified for
              consistency, and honest about where values conflict.
            </p>
            <p>
              Open Ethos produces exactly that. When a user calibrates weights across eight moral axioms,
              sets social distance preferences and time horizons, then demonstrates coherence between that
              calibration and their judgments across diverse cases, they generate a formally articulated
              value specification richer than anything alignment research currently has access to. At
              population scale, across millions of users from different cultures, political orientations,
              and moral traditions, this becomes a map of human values with structure and verification that
              has never existed.
            </p>
            <p>
              Critically, the data captures genuine disagreement. Different users weight axioms differently,
              and the system does not pretend there is a single correct answer. An alignment system trained
              on this data learns not just what humans value but where they agree, where they disagree, by
              how much, and what the shape of disagreement looks like. That lets alignment systems navigate
              real moral uncertainty rather than flattening it into a single reward signal.
            </p>

            <h3 id="political-dysfunction" className="scroll-mt-24">The Political Dysfunction Problem: Accountability Without Bias</h3>
            <p>
              Every high-stakes professional domain has accountability mechanisms tying decision-makers to
              their stated reasoning. Scientists publish falsifiable predictions. Traders take positions
              marked to market. Engineers sign specifications. Politicians have nothing comparable: vague
              promises, untracked position shifts, zero scored consistency. The system selects for people
              skilled at performing conviction rather than holding it.
            </p>
            <p>
              Open Ethos makes political reasoning auditable. A politician who publishes their profile
              commits to a formal value model: specific axiom weights, demonstrated through case judgments,
              verified for coherence. Every subsequent vote becomes checkable against their own framework.
              Not against an external standard, not against the opposition&apos;s values, against the
              politician&apos;s own stated calibration. Drift becomes visible. Contradictions become
              quantifiable. Consistency becomes comparable across politicians and across time.
            </p>
            <p>
              For voters, this means you can read what a candidate actually commits to valuing and compare
              it to alternatives. For journalists, it means accountability reporting that does not require
              taking sides, because the standard was set by the subject. For the system, it means the same
              commitment-and-verification discipline that makes every other professional domain function,
              imported into the one domain operating without it.
            </p>
            <p>
              Adoption does not require mandates. Challengers publish profiles as a differentiator.
              Incumbents face growing cost of refusal. Competitive pressure does the rest, the same dynamic
              that made tax return disclosure a de facto presidential requirement.
            </p>

            <h3 id="cross-cultural" className="scroll-mt-24">The Cross-Cultural Understanding Problem: Seeing Through the Noise</h3>
            <p>
              Most cross-cultural conflict looks like a clash of civilizations. Much of it is actually a
              small gap in value weighting, amplified by language differences, historical grievance, and
              tribal psychology until it feels impassable. We cannot tell the difference because we have
              never had a shared framework for comparing values across cultures that is structured enough
              to be precise but flexible enough to accommodate genuine diversity.
            </p>
            <p>
              Open Ethos gives every user the same eight-axiom framework regardless of culture, language,
              or political tradition. A user in Tokyo and a user in Lagos calibrate the same dimensions.
              The comparison is direct: not &quot;what policies do you support&quot; (culturally loaded) but
              &quot;how do you weight these moral dimensions&quot; (culturally portable).
            </p>
            <p>
              At scale, this produces a map of where human values actually converge and diverge across
              cultural boundaries. Some conflicts that feel deep would turn out to rest on small weighting
              differences both sides could negotiate around. Some apparent agreements would turn out to
              mask deeper divergences being papered over by shared language. Both findings are valuable.
            </p>
            <p>
              For diplomacy, negotiators enter knowing the actual shape of value disagreement rather than
              guessing from stereotypes. For multicultural societies, it offers concrete identification of
              common ground across communities that currently interact through suspicion. For ordinary
              people, it gives a specific answer to &quot;why do they see it differently&quot;: not
              &quot;because they are wrong&quot; but &quot;because they weight autonomy at 0.8 and social
              trust at 0.4 while you do the reverse, and here is where that produces different
              conclusions.&quot;
            </p>
            <p>
              The framework does not erase disagreement. It makes disagreement legible. Legible
              disagreement is the precondition for every form of resolution.
            </p>

            <h3 id="decision-quality" className="scroll-mt-24">The Decision Quality Problem: Reasoning Instead of Reacting</h3>
            <p>
              Most decisions are made by gut reaction, then post-hoc rationalized into something that
              sounds principled. Not because people are stupid, but because holding multiple stakeholders,
              competing values, uncertain outcomes, and different time horizons in mind simultaneously is
              genuinely beyond unaided human cognition.
            </p>
            <p>
              Open Ethos forces what intuition skips: enumerate the actual factors, identify who is
              affected, estimate intensity and duration, assign honest confidence levels, and weigh
              everything against stated values with the math visible. The output is not &quot;the right
              answer.&quot; It is a structured view of what your own values imply, including how contested
              the decision is and which parameters would flip the verdict.
            </p>
            <p>
              This matters most where intuition is least reliable: long time horizons (hyperbolic
              discounting biases toward the present), impacts on distant people (social distance bias
              underweights their interests), multi-value conflicts (the loudest value drowns the others),
              and decisions under uncertainty (overconfidence masquerades as conviction). The engine does
              not replace judgment. It structures it, so the user sees exactly which considerations push
              which direction and by how much before making the call.
            </p>

            <h3 id="self-knowledge" className="scroll-mt-24">The Self-Knowledge Problem: Knowing What You Actually Believe</h3>
            <p>
              Most people can list their values: freedom, fairness, honesty, compassion. The list is real
              and nearly useless, because it contains no information about how these values relate when
              they conflict, which they do in virtually every interesting decision. Do you value freedom
              more than fairness? By how much? Does it depend on who is affected? Does your answer match
              how you actually reasoned the last time they conflicted?
            </p>
            <p>
              Open Ethos makes the gaps visible. Formalize values as specific weights, test those weights
              against real case judgments, and contradictions surface: you say you weight fairness at 0.8
              but your judgment implies 0.3. You say you care about future impacts but your time settings
              discount them to near zero. You say outsiders matter but your social distance weights
              effectively ignore them.
            </p>
            <p>
              These are not accusations. They are the user&apos;s own inputs reflected back. Resolution
              happens however the user sees fit: update the calibration, update the judgment, add a magic
              factor for something the framework does not capture, or sit with a genuine value conflict.
              All four produce self-knowledge that did not exist before.
            </p>
            <p>
              Over time, a user who has resolved dozens of contradictions and refined their calibration
              until it predicts their own judgments on unseen cases has achieved something rare: they know
              what they believe, they know why, and they can demonstrate consistency between stated values
              and actual reasoning. Open Ethos is the thing that forces the examination, not by telling
              you what to believe, but by showing you what you already believe and asking whether you are
              okay with it.
            </p>
          </div>
        </section>

        {/* What Open Ethos Is */}
        <section id="what" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Open Ethos Is</h2>
          <div className="prose-content">
            <p>
              Open Ethos is a transparent moral scoring engine. It makes values explicit, structured, and
              checkable. Unlike opaque systems that return a single answer, Open Ethos shows exactly how
              it reaches every conclusion.
            </p>

            <h3>Core principles</h3>
            <ul>
              <li>
                <strong>Transparency.</strong> Every calculation is visible. You see how each factor
                contributes to the final score and why the engine returns YES, NO, or NEUTRAL.
              </li>
              <li>
                <strong>Customizability.</strong> Your values are the input. Axiom weights, social
                distance weights, and time discounting are all user-controlled. Someone who prioritizes
                autonomy over collective welfare gets different results than someone with the opposite
                calibration.
              </li>
              <li>
                <strong>Contestation-awareness.</strong> The engine reports not just a direction but how
                contested the decision is. A strong YES means most factors align. A weak YES means
                significant countervailing considerations exist.
              </li>
              <li>
                <strong>Time-sensitivity.</strong> Future impacts are discounted based on your moral
                half-life setting.
              </li>
              <li>
                <strong>Client-side only.</strong> All processing happens in your browser. No data is
                sent to any server unless you explicitly choose to publish a profile.
              </li>
            </ul>

            <h3>What Open Ethos is not</h3>
            <ul>
              <li>
                <strong>Not a moral authority.</strong> It does not tell you what is right. It tells you
                what your own values imply about a specific situation.
              </li>
              <li>
                <strong>Not a political alignment tool.</strong> It does not sort you left or right. It
                maps your actual value weightings, which may not match any party.
              </li>
              <li>
                <strong>Not an opinion machine.</strong> It does not generate conclusions. It checks
                whether your conclusions are consistent with your stated framework.
              </li>
              <li>
                <strong>Not a substitute for judgment.</strong> Edge cases, context, and nuance matter.
                The final decision is always yours.
              </li>
              <li>
                <strong>Not claiming to capture everything.</strong> The magic factor mechanism
                explicitly acknowledges that some moral intuitions resist formalization.
              </li>
            </ul>

            <p>
              The same tool serves everyone: individuals, activists, journalists, and politicians use the
              identical framework. That shared framework is what makes comparison and accountability
              possible.
            </p>
          </div>
        </section>

        {/* The Broader Civic Stack */}
        <section id="broader-stack" className="card mb-6 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">The Broader Civic Stack</h2>
            <span className="badge badge-yellow">Direction &mdash; not built yet</span>
          </div>
          <div className="prose-content">
            <p>
              Open Ethos is the values layer in a five-layer civic reasoning stack. Each layer depends on
              the others. The decision engine (layer 3) is the working PoC; the other four layers describe
              the surrounding system this could become part of.
            </p>

            <ol>
              <li>
                <strong>Information Ingestion.</strong> AI-powered faithful translation of political
                reality (bills, votes, candidates, ballot measures) into plain-language, source-linked
                explanations.
              </li>
              <li>
                <strong>Guided Exploration.</strong> A conversational tutor that walks users through
                material, probes understanding, plays devil&apos;s advocate, and pushes users to articulate
                why they believe what they believe.
              </li>
              <li>
                <strong>Value Formalization.</strong> Open Ethos itself: making values explicit and
                structured. <em>This is the layer the PoC implements.</em>
              </li>
              <li>
                <strong>Coherence Verification.</strong> The integrated loop where the tutor and Open
                Ethos work together, surfacing contradictions between stated values and stated judgments
                to drive reflection.
              </li>
              <li>
                <strong>Collective Reasoning.</strong> Aggregated, anonymized profiles that reveal where
                disagreements are factual, value-based, tribal, or merely linguistic, enabling
                deliberation that addresses conflict at the right layer.
              </li>
            </ol>

            <p>
              Information without engagement is passive. Engagement without value formalization produces
              articulate tribalism. Formalization without coherence checking is shallow. Individual
              coherence without collective aggregation does not improve collective decisions. Open Ethos
              is the layer that makes the rest meaningful, because it is the part that turns implicit
              values into something explicit enough to test.
            </p>
          </div>
        </section>

        {/* Public Profiles */}
        <section id="public-profiles" className="card mb-6 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">Public Profiles</h2>
            <span className="badge badge-yellow">Direction &mdash; not built yet</span>
          </div>
          <div className="prose-content">
            <p>
              By default, everything in Open Ethos is private and client-side. Publishing a profile is
              optional and would be a deliberate, separate choice. The publishing flow is not built yet;
              this section describes the design intent.
            </p>
            <p>
              A public profile would make your calibration and case history visible and queryable. For
              most individual users, privacy is the right default and there is no reason to publish. The
              public profile exists for a specific purpose: it turns a value model into a commitment
              device.
            </p>
            <p>
              Once a profile is public, changing a stated judgment on a new case requires either updating
              the profile openly (a visible, accountable act) or accepting a visible inconsistency.
              Profile update history is itself public, so genuine value evolution is legible and silent
              backsliding is not. People reason differently when their reasoning is on the record.
            </p>
            <p>
              This is the foundation of the political accountability application. A politician,
              candidate, or public figure who publishes a profile commits to a formal value model that
              every subsequent vote and statement can be checked against. Third parties (journalists,
              watchdogs, opponents, ordinary citizens) can run real-world actions through the published
              calibration and report the coherence result. The standard being applied is the public
              figure&apos;s own. That is what makes the accountability resistant to claims of bias.
            </p>
            <p>
              The same tool, the same eight axioms, the same scoring. The only difference between an
              individual user and a politician is who is watching, and the politician chose to be watched.
            </p>
          </div>
        </section>

        {/* Scoring Formula Section */}
        <section id="scoring-formula" className="card mb-6 scroll-mt-24">
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
                <h4 className="font-semibold text-slate-900">U &mdash; Axiom Weight (0 to 1)</h4>
                <p className="text-slate-600 mt-1">
                  How much you care about this moral dimension. Set in your profile&apos;s Calibration tab.
                  A weight of 1.0 means you consider this axiom maximally important; 0.5 means moderate importance;
                  0.0 means you don&apos;t consider it at all.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">I &mdash; Intensity Per Year (0 to 1)</h4>
                <p className="text-slate-600 mt-1">
                  How severe is the impact on this axiom, per year of duration? Use the intensity anchors as
                  reference points. For life/health: 0.1 = minor illness, 1.0 = death. Impacts are always measured
                  as a rate per year.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">T<sub>eff</sub> &mdash; Effective Duration (years)</h4>
                <p className="text-slate-600 mt-1">
                  The time-discounted duration of the impact. For <strong>transition</strong> profiles, T<sub>eff</sub> comes from the time stance and the physical time_type.
                  For <strong>steady</strong> profiles (case_flow / structural), impacts are modeled as per-year flows (T<sub>eff</sub> = 1) because they recur each policy-year.
                  See the Time Integration section for details.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">C &mdash; Confidence (0 to 1)</h4>
                <p className="text-slate-600 mt-1">
                  The probability that this impact actually occurs. Be honest here &mdash; avoid &quot;certainty theater&quot;
                  where you assign 0.95 to speculative outcomes. If you&apos;re genuinely uncertain, use 0.3-0.5.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">P &mdash; Polarity (-1 to +1)</h4>
                <p className="text-slate-600 mt-1">
                  The direction of the impact. Negative values push the decision toward NO; positive values
                  push toward YES. A value of -1 means this factor strongly argues against the action; +1 means
                  it strongly argues for it. Use intermediate values for factors that partially cut both ways.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900">S &mdash; Scale (count × social weight)</h4>
                <p className="text-slate-600 mt-1">
                  The number of individuals affected, weighted by their social distance from you. Self = 1.0,
                  inner circle = 0.8, tribe = 0.5, citizens = 0.3, outsiders = 0.1 by default. Adjust these in calibration.
                </p>
              </div>
            </div>

            <h3 className="mt-6">Decision Strength</h3>
            <p>
              The final score is the sum of all factor scores. The engine also reports{" "}
              <strong>strength</strong> using a contestation-aware ratio:
            </p>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-center my-4">
              strength ratio = |total score| / Σ|factor scores|
            </div>

            <ul>
              <li><strong>Strong</strong> (≥ 50%): Most factors align in the same direction.</li>
              <li><strong>Medium</strong> (≥ 20%): Mixed factors with a clear lean.</li>
              <li><strong>Weak</strong> (&lt; 20%): Highly contested &mdash; significant factors on both sides.</li>
            </ul>
          </div>
        </section>

        {/* Axioms Section */}
        <section id="axioms" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Eight Axioms</h2>
          <div className="prose-content">
            <p>
              Open Ethos uses a fixed set of eight axioms. The set is fixed deliberately: a stable
              framework is what makes decisions comparable across cases, across users, and across time.
              If everyone could invent their own axioms, no two profiles could be meaningfully compared,
              and the cross-cultural and accountability applications would collapse.
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
                      Pain, joy, mental health, quality of subjective experience. The hedonic dimension &mdash;
                      the impact of actions on conscious beings.
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
                      outcomes &mdash; equal application of principles.
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
                      Honesty, accuracy, resistance to manipulation, informed consent. Does the action
                      help or hurt people&apos;s ability to form true beliefs?
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
        <section id="time-integration" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Time Integration</h2>
          <div className="prose-content">
            <p>
              Not all impacts last the same duration, and future impacts may be valued differently than
              immediate ones. Open Ethos uses a sophisticated time integration system.
            </p>

            <h3>Moral Half-Life (H<sub>moral</sub>)</h3>
            <p>
              Your moral half-life setting determines how much you discount future impacts. If your moral
              half-life is 30 years (the default), then an impact occurring 30 years from now counts at
              50% of its immediate value.
            </p>
            <ul>
              <li><strong>Short half-life (10-15 years):</strong> Prioritizes near-term effects. Good for practical, immediate-concern ethics.</li>
              <li><strong>Medium half-life (25-40 years):</strong> Balanced view. Default setting.</li>
              <li><strong>Long half-life (50-100+ years):</strong> Weights future generations more heavily. Good for longtermist perspectives.</li>
            </ul>

            <h3>Temporal Profiles</h3>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li><strong>transition:</strong> one-time/finite impact around the change. Uses T<sub>eff</sub> from the time stance + physical time_type.</li>
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
        <section id="social-distance" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Social Distance Weighting</h2>
          <div className="prose-content">
            <p>
              Most people weight impacts on themselves and those close to them more heavily than impacts
              on strangers. Open Ethos makes that explicit rather than hidden.
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
                  Extended community &mdash; colleagues, neighbors, members of groups you identify with.
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
                <strong>Strict impartiality:</strong> set all weights to 1.0. Every person counts equally
                regardless of relationship to you.
              </li>
              <li>
                <strong>Moderate partiality:</strong> use the defaults. Most ethical frameworks
                acknowledge some special obligations to those close to us.
              </li>
              <li>
                <strong>Strong partiality:</strong> raise self and inner_circle, lower citizens and
                outsiders. Reflects a more agent-relative ethics.
              </li>
            </ul>

            <p>
              The scale factor (S) is calculated as: <code>S = count × social_weight</code>. So 1000
              citizens at 0.3 weight contributes 300 to the scale, while 1 self at 1.0 contributes 1.
            </p>
          </div>
        </section>

        {/* Magic Factor Section */}
        <section id="magic-factor" className="card mb-6 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">The Magic Factor</h2>
            <span className="badge badge-yellow">Direction &mdash; not built yet</span>
          </div>
          <div className="prose-content">
            <p>
              The eight axioms will not capture everything. Sometimes a judgment rests on a moral
              intuition the framework cannot express: a sense of sacredness, of betrayal, of dignity
              violated. The magic factor is an honest escape hatch &mdash; you can add a factor outside the
              axiom set, with a note explaining what it tracks.
            </p>
            <p>
              Magic factors are displayed prominently and carry a negative visual treatment in the
              interface. This is intentional. A magic factor is debt: a part of your reasoning you have
              not yet articulated into the shared framework. The discomfort is the point. It pushes you
              to either formalize the intuition into existing axioms over time or decide it does not
              belong in your moral reasoning.
            </p>
            <p>
              Magic factors are not failures. They are the visible edge of where your self-knowledge is
              still incomplete, which is exactly where the most valuable work happens.
            </p>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>
          <div className="prose-content">
            <p>
              The basic workflow:
            </p>

            <ol>
              <li>
                <strong>Copy the AI Prompt.</strong> Click &quot;Copy Prompt&quot; to get a structured
                prompt for your preferred AI assistant. It guides the AI to generate properly formatted
                decision JSON.
              </li>
              <li>
                <strong>Describe Your Decision.</strong> Tell the AI about your dilemma. Be specific
                about context, stakeholders, and potential outcomes. The AI generates a balanced analysis
                with factors on both sides.
              </li>
              <li>
                <strong>Paste the JSON.</strong> Copy the AI&apos;s response into the Decision JSON
                textarea.
              </li>
              <li>
                <strong>Score the Decision.</strong> Click &quot;Score Decision.&quot; The engine
                computes per-factor scores and an overall recommendation.
              </li>
              <li>
                <strong>Review and Adjust.</strong> Examine the factor breakdown. Edit any parameter
                directly and the score updates in real time.
              </li>
              <li>
                <strong>Calibrate Your Profile.</strong> Use the Calibration tab to set axiom weights,
                social distance weights, and moral half-life. Settings persist across sessions via
                cookies.
              </li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Pro Tip</h4>
              <p className="text-blue-700 text-sm">
                Start with the example JSON. Score it before generating your own to see how the engine
                behaves.
              </p>
            </div>
          </div>
        </section>

        {/* Calibration Section */}
        <section id="calibration" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Calibrating Your Profile</h2>
          <div className="prose-content">
            <p>
              The Calibration tab customizes the engine to your values. Settings are saved in browser
              cookies.
            </p>

            <h3>Axiom Weights</h3>
            <p>
              Set 0 to 1 for each of the eight axioms.
            </p>
            <ul>
              <li><strong>0.0:</strong> does not factor into my reasoning at all.</li>
              <li><strong>0.25:</strong> minor consideration.</li>
              <li><strong>0.5:</strong> moderate importance (default).</li>
              <li><strong>0.75:</strong> high priority.</li>
              <li><strong>1.0:</strong> maximum importance.</li>
            </ul>

            <h3>Social Distance Weights</h3>
            <p>
              Adjust how much you weight impacts by relationship proximity. See the Social Distance
              section for details.
            </p>

            <h3>Moral Half-Life</h3>
            <p>
              Set the number of years after which an equal impact matters 50% as much. Lower prioritizes
              immediate effects, higher weights long-term consequences.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-green-800 mb-2">Calibration philosophy</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Your weights should reflect your <strong>actual</strong> values, not what you think you &quot;should&quot; believe. The gap between those two is exactly what the engine is designed to surface, and you cannot find it if you calibrate aspirationally.</li>
                <li>• Experiment with different calibrations to see how sensitive a result is to your assumptions.</li>
                <li>• Recalibrate periodically. Values evolve, and that is legitimate. What is not legitimate is recalibrating case-by-case to produce the verdict you already wanted.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interpreting Results Section */}
        <section id="interpreting-results" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Interpreting Results</h2>
          <div className="prose-content">
            <h3>The Overall Verdict</h3>
            <ul>
              <li><strong>YES (positive score):</strong> weighted factors favor the action.</li>
              <li><strong>NO (negative score):</strong> weighted factors favor not taking the action.</li>
              <li><strong>NEUTRAL (near-zero score):</strong> factors roughly balance.</li>
            </ul>

            <h3>Strength Indicators</h3>
            <ul>
              <li><strong>Strong:</strong> 50%+ of factor weight aligns with the verdict. Clear direction.</li>
              <li><strong>Medium:</strong> 20 to 50% alignment. Significant countervailing factors.</li>
              <li><strong>Weak:</strong> under 20% alignment. Highly contested, proceed with caution.</li>
            </ul>

            <h3>Factor Breakdown</h3>
            <p>
              Click any factor to see its individual score and contribution, the axioms involved and
              their parameters, the scale groups affected, and editable fields that update the score in
              real time.
            </p>

            <h3>What the Score Means</h3>
            <p>
              Magnitude reflects the total weight of moral considerations. +0.5 is modest. +50.0
              indicates massive scale: many people, severe impacts, long duration. Do not compare scores
              across different decisions &mdash; they are not normalized.
            </p>

            <h3>When You Disagree with the Result</h3>
            <p>
              This is the most valuable moment the engine produces. A result that contradicts your
              intuition means one of three things: a parameter is wrong and should be adjusted, an
              important factor is missing and should be added, or the engine has surfaced a genuine
              tension between your stated values and your gut. The first two are fixes. The third is
              the entire point. See the next section.
            </p>
          </div>
        </section>

        {/* Working Toward Coherence */}
        <section id="coherence" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Working Toward Coherence</h2>
          <div className="prose-content">
            <p>
              A single scored decision is useful. The real value comes from scoring many decisions and
              watching whether your results stay consistent with each other.
            </p>
            <p>
              When the engine returns a verdict that does not match the judgment you would have made on
              your own, you have found a contradiction between your stated values and your actual
              reasoning. There are four productive responses:
            </p>
            <ol>
              <li>
                <strong>Update the calibration.</strong> The weights were wrong. You said you valued
                fairness at 0.8 but this case reveals you treat it more like 0.4. Fix the calibration
                to match what you actually believe.
              </li>
              <li>
                <strong>Update the judgment.</strong> Your gut reaction was a cached take, absorbed
                from somewhere and never examined. The formal model is right and your intuition was
                lazy. Update the judgment.
              </li>
              <li>
                <strong>Add a magic factor.</strong> The framework genuinely missed something. Name it,
                note it, and carry it as visible debt until you can formalize it.
              </li>
              <li>
                <strong>Sit with a genuine value conflict.</strong> Two values you really hold point in
                opposite directions on this case and neither is wrong. The engine cannot resolve this
                for you. Acknowledging it clearly is still progress.
              </li>
            </ol>
            <p>
              None of these is a failure. Each one produces self-knowledge that did not exist before.
            </p>
            <p>
              The long game is generalization. A user who has worked through dozens of diverse cases and
              resolved the contradictions has a calibration that reliably predicts their own judgments
              on cases they have never seen. That is the measurable end state: not correct opinions, but
              a value model coherent enough to generalize. Coherence across many unseen cases is far
              harder to fake than a good answer on any single one, which is what makes it meaningful as
              a signal, both to yourself and, if you publish, to others.
            </p>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          <div className="prose-content">
            <h3>When Generating Decisions</h3>
            <ul>
              <li>
                <strong>Be specific about context.</strong> More detail lets the AI identify better
                factors.
              </li>
              <li>
                <strong>Always include factors on both sides.</strong> A one-sided analysis defeats the
                purpose. Ask for the strongest arguments for and against.
              </li>
              <li>
                <strong>Ground intensities in the anchors.</strong> Do not guess. Reference the
                intensity scales for consistency.
              </li>
              <li>
                <strong>Be honest about uncertainty.</strong> Most predictions about the future belong
                at 0.3 to 0.7 confidence, not 0.95.
              </li>
            </ul>

            <h3>When Reviewing Results</h3>
            <ul>
              <li>
                <strong>Check the factor breakdown.</strong> Does each factor make sense? Are the
                parameters reasonable?
              </li>
              <li>
                <strong>Adjust suspicious values</strong> and watch how the score moves.
              </li>
              <li>
                <strong>Consider what is missing.</strong> Add important omitted factors and rescore.
              </li>
              <li>
                <strong>Run sensitivity analysis.</strong> Find which parameter changes would flip the
                verdict. That tells you where the real moral action is.
              </li>
              <li>
                <strong>Do not treat the result as gospel.</strong> It is a thinking aid, not an oracle.
              </li>
            </ul>

            <h3>Calibration</h3>
            <ul>
              <li>Weights should reflect your actual values, not aspirational ones.</li>
              <li>Experiment with alternative calibrations to test sensitivity.</li>
              <li>Recalibrate as your values genuinely evolve, never to reverse-engineer a verdict you already wanted.</li>
            </ul>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Worked Examples</h2>
          <div className="prose-content">
            <h3>Example 1: Lying to Protect Feelings</h3>
            <p>
              <strong>Question:</strong> Should I lie to a friend about their artwork to spare their
              feelings?
            </p>
            <p><strong>Factors pushing NO (truth-telling):</strong></p>
            <ul>
              <li>Damages trust if discovered (<code>social_trust</code>, polarity -1).</li>
              <li>Prevents artistic growth (<code>long_term_capacity</code>, polarity -1).</li>
              <li>Violates epistemic integrity (<code>truth_epistemic</code>, polarity -1).</li>
            </ul>
            <p><strong>Factors pushing YES (lying):</strong></p>
            <ul>
              <li>Prevents immediate emotional pain (<code>suffering_wellbeing</code>, polarity +1).</li>
              <li>Preserves immediate relationship harmony (<code>social_trust</code>, polarity +1).</li>
            </ul>
            <p>
              A typical result is NO (weak) or NO (medium). The truth-telling factors usually outweigh,
              but it is contested because the lie has real benefits.
            </p>

            <div className="border-t border-slate-200 my-6"></div>

            <h3>Example 2: Vaccine Mandates</h3>
            <p>
              <strong>Question:</strong> Should a company mandate vaccines for employees?
            </p>
            <p><strong>Factors pushing YES (mandate):</strong></p>
            <ul>
              <li>Reduces disease spread (<code>life_health</code>, many citizens affected).</li>
              <li>Protects vulnerable populations (<code>life_health</code>, <code>fairness_equality</code>).</li>
            </ul>
            <p><strong>Factors pushing NO (no mandate):</strong></p>
            <ul>
              <li>Violates bodily autonomy (<code>bodily_autonomy</code>, employees affected).</li>
              <li>Coercive pressure on employment (<code>civil_liberty</code>).</li>
              <li>May erode trust in institutions (<code>social_trust</code>).</li>
            </ul>
            <p>
              This often produces a contested result. The direction depends heavily on your calibration:
              how much you weight collective health against individual autonomy.
            </p>

            <div className="border-t border-slate-200 my-6"></div>

            <h3>Example 3: Evaluating a Ballot Measure</h3>
            <p>
              <strong>Question:</strong> Should I vote for a measure that raises property taxes to fund
              public transit?
            </p>
            <p><strong>Factors pushing YES:</strong></p>
            <ul>
              <li>Improved mobility for low-income residents (<code>suffering_wellbeing</code>, <code>fairness_equality</code>; citizens and outsiders affected).</li>
              <li>Long-term reduction in emissions and congestion (<code>long_term_capacity</code>, <code>steady_structural</code> profile).</li>
            </ul>
            <p><strong>Factors pushing NO:</strong></p>
            <ul>
              <li>Financial burden on property owners (<code>suffering_wellbeing</code>, polarity -1; self and tribe affected).</li>
              <li>Uncertain execution and cost overruns (low confidence on the benefit factors).</li>
            </ul>
            <p>
              The verdict here is highly calibration-dependent. A user with strong partiality (high self
              and tribe weights) and a short moral half-life may get NO. A user with strict impartiality
              and a long half-life will likely get YES. Running both calibrations on the same measure
              shows you exactly where your own values sit and why reasonable people vote differently on
              the same ballot line.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="card mb-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="prose-content">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900">Is my data sent to any server?</h4>
                <p className="text-slate-600">
                  No. All scoring happens in your browser. The only external call is to your AI
                  assistant when generating decision JSON, and that is done by you manually copying and
                  pasting. Publishing a public profile is the one exception, and it is an explicit,
                  separate, opt-in action (and not yet built).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Can I use this for important real-world decisions?</h4>
                <p className="text-slate-600">
                  It is a thinking aid, not a decision-maker. It helps you structure reasoning and catch
                  considerations you would miss. The final judgment is always yours.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Why does the score seem very large or very small?</h4>
                <p className="text-slate-600">
                  Magnitude depends on scale, duration, and intensity. A factor affecting millions
                  produces a much larger score than one affecting only you. This is by design.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">What if I disagree with the result?</h4>
                <p className="text-slate-600">
                  Good. That is the engine working. Either a parameter is wrong, a factor is missing, or
                  there is a genuine tension between your stated values and your intuition. See{" "}
                  <a href="#coherence" className="text-blue-600 hover:underline">Working Toward Coherence</a>.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">How do I reset my calibration to defaults?</h4>
                <p className="text-slate-600">
                  Clear your browser cookies for this site.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Can I add my own axioms?</h4>
                <p className="text-slate-600">
                  No. The eight-axiom framework is fixed to keep decisions comparable across cases,
                  users, and cultures. If everyone used a different framework, no two profiles could be
                  compared and the cross-cultural and accountability applications would not work. For
                  intuitions the axioms genuinely miss, use a magic factor.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Is the framework biased?</h4>
                <p className="text-slate-600">
                  The framework defines eight dimensions of moral consideration. It does not assign
                  their weights. You do. A libertarian and a progressive using Open Ethos will reach
                  different verdicts on the same decision because they calibrate differently, and
                  neither is being told they are wrong. The engine checks consistency between your
                  values and your judgments. It does not supply the values.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">How does this relate to the broader civic reasoning stack?</h4>
                <p className="text-slate-600">
                  Open Ethos is the value formalization layer. It can be used entirely on its own, but
                  it is designed to connect to information, tutoring, coherence verification, and
                  collective reasoning layers. See{" "}
                  <a href="#broader-stack" className="text-blue-600 hover:underline">The Broader Civic Stack</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-slate-500">
          <p>
            Open Ethos Decision Engine &mdash; Transparent moral reasoning for complex decisions.
          </p>
          <p className="mt-2">
            <Link href="/" className="text-blue-600 hover:underline">Return to App</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
