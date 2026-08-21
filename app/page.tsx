"use client";

import { useEffect, useMemo, useState } from "react";

type Mishap = {
  id: string;
  kicker: string;
  title: string;
  detail: string;
  points: number;
  icon: string;
};

const mishaps: Mishap[] = [
  {
    id: "sleep",
    kicker: "01 · Sleep",
    title: "Sleep went on strike",
    detail: "You woke up tired and somehow became more tired.",
    points: 6,
    icon: "Zz",
  },
  {
    id: "commute",
    kicker: "02 · Travel",
    title: "The commute held you hostage",
    detail: "Traffic, delays, cancellations—or the lot at once.",
    points: 8,
    icon: "↗",
  },
  {
    id: "tech",
    kicker: "03 · Technology",
    title: "A screen betrayed you",
    detail: "It froze precisely when another human was watching.",
    points: 7,
    icon: "404",
  },
  {
    id: "home",
    kicker: "04 · Domestic",
    title: "Your home chose violence",
    detail: "A leak, a breakage or one deeply suspicious smell.",
    points: 9,
    icon: "⌂",
  },
  {
    id: "money",
    kicker: "05 · Money",
    title: "Your balance did a vanishing act",
    detail: "An annual charge arrived with impeccable bad timing.",
    points: 10,
    icon: "€",
  },
  {
    id: "plans",
    kicker: "06 · Plans",
    title: "The plan collapsed beautifully",
    detail: "Everyone was ready—right up until nobody was.",
    points: 6,
    icon: "×",
  },
  {
    id: "pet",
    kicker: "07 · Animals",
    title: "A pet committed a small crime",
    detail: "Cute face. No remorse. Evidence everywhere.",
    points: 4,
    icon: "!",
  },
  {
    id: "social",
    kicker: "08 · Social",
    title: "You replayed one sentence all night",
    detail: "Nobody else remembers it. You always will.",
    points: 5,
    icon: "…",
  },
];

const multipliers = [
  { label: "Mildly tragic", value: 1, note: "A dignified grumble" },
  { label: "Proper ordeal", value: 1.5, note: "Tell the group chat" },
  { label: "Absolutely cinematic", value: 2, note: "Roll the credits" },
];

function verdictFor(score: number) {
  if (score === 0) {
    return {
      stamp: "SUSPICIOUSLY FINE",
      title: "Not even a groan.",
      copy: "Either life has been unusually kind, or you have omitted key evidence.",
    };
  }

  if (score < 16) {
    return {
      stamp: "MINOR PALAVER",
      title: "A respectable little wobble.",
      copy: "Annoying, yes. Memoir-worthy, not yet. A biscuit may resolve this.",
    };
  }

  if (score < 31) {
    return {
      stamp: "SOLID GROAN",
      title: "You have grounds for a dramatic sigh.",
      copy: "This is credible material. Take the evening off and mention it twice tomorrow.",
    };
  }

  if (score < 51) {
    return {
      stamp: "PREMIUM ORDEAL",
      title: "Life has been showing off.",
      copy: "A week with plot, jeopardy and an unnecessary third act. You may complain freely.",
    };
  }

  return {
    stamp: "SEASON FINALE",
    title: "What. A. Groan.",
    copy: "This stopped being a week and became prestige television. Surviving it counts as the win.",
  };
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [shareLabel, setShareLabel] = useState("Share the damage");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("what-a-groan-best");
      if (saved) setBestScore(Number(saved) || 0);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const baseScore = useMemo(
    () =>
      mishaps
        .filter((mishap) => selected.includes(mishap.id))
        .reduce((total, mishap) => total + mishap.points, 0),
    [selected],
  );
  const score = Math.round(baseScore * multiplier);
  const verdict = verdictFor(score);
  const meterValue = Math.min((score / 80) * 100, 100);

  function toggleMishap(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setShowResult(false);
  }

  function judgeWeek() {
    setShowResult(true);
    if (score > bestScore) {
      setBestScore(score);
      window.localStorage.setItem("what-a-groan-best", String(score));
    }
    window.setTimeout(() => {
      document.getElementById("verdict")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  }

  function resetGame() {
    setSelected([]);
    setMultiplier(1);
    setShowResult(false);
    setShareLabel("Share the damage");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function shareResult() {
    const text = `I scored ${score} on WHAT A GROAN! — ${verdict.stamp}. How was your week?`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "WHAT A GROAN!", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareLabel("Copied to clipboard");
      }
    } catch {
      setShareLabel("Share cancelled");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="WHAT A GROAN! home">
          WHAT A <span>GROAN!</span>
        </a>
        <details className="how-to">
          <summary>How to play</summary>
          <div className="how-to-card">
            <strong>Build your week in three moves:</strong>
            <ol>
              <li>Pick every indignity that applies.</li>
              <li>Choose the correct dramatic intensity.</li>
              <li>Submit the evidence and receive your verdict.</li>
            </ol>
            <p>No account. No tracking. No tragedy Olympics.</p>
          </div>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">The scientifically questionable misery index</p>
          <h1>
            How spectacularly has life <em>inconvenienced</em> you?
          </h1>
          <p className="hero-deck">
            Submit this week&apos;s minor catastrophes. Receive a definitive,
            totally unqualified groan score.
          </p>
          <a className="start-link" href="#evidence">
            Present the evidence <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-ticket" aria-label="Game instructions">
          <p className="ticket-top">One week · One verdict</p>
          <div className="ticket-number">03</div>
          <p className="ticket-title">Tiny disasters.<br />Huge feelings.</p>
          <p className="ticket-small">Results may cause perspective.</p>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          BAD TIMING ★ WEIRD NOISES ★ CANCELLED PLANS ★ LOW BATTERY ★ BAD
          TIMING ★ WEIRD NOISES ★ CANCELLED PLANS ★ LOW BATTERY ★
        </div>
      </div>

      <section className="game-section" id="evidence">
        <div className="section-heading">
          <div>
            <p className="step-label">Step 01</p>
            <h2>What happened?</h2>
          </div>
          <p>Select all that apply. Honesty is encouraged; melodrama is expected.</p>
        </div>

        <div className="mishap-grid">
          {mishaps.map((mishap) => {
            const active = selected.includes(mishap.id);
            return (
              <button
                className={`mishap-card${active ? " is-selected" : ""}`}
                type="button"
                key={mishap.id}
                onClick={() => toggleMishap(mishap.id)}
                aria-pressed={active}
              >
                <span className="mishap-meta">
                  <span>{mishap.kicker}</span>
                  <span className="mishap-points">+{mishap.points}</span>
                </span>
                <span className="mishap-icon" aria-hidden="true">
                  {active ? "✓" : mishap.icon}
                </span>
                <strong>{mishap.title}</strong>
                <span className="mishap-detail">{mishap.detail}</span>
                <span className="select-label">{active ? "Added to evidence" : "Add to evidence"}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="intensity-section">
        <div className="section-heading section-heading-light">
          <div>
            <p className="step-label">Step 02</p>
            <h2>How bad was it?</h2>
          </div>
          <p>Apply the appropriate level of theatrical interpretation.</p>
        </div>

        <fieldset className="intensity-options">
          <legend className="sr-only">Choose an intensity</legend>
          {multipliers.map((option) => (
            <label
              className={multiplier === option.value ? "is-selected" : ""}
              key={option.value}
            >
              <input
                type="radio"
                name="intensity"
                value={option.value}
                checked={multiplier === option.value}
                onChange={() => {
                  setMultiplier(option.value);
                  setShowResult(false);
                }}
              />
              <span className="radio-dot" aria-hidden="true" />
              <span>
                <strong>{option.label}</strong>
                <small>{option.note}</small>
              </span>
              <b>×{option.value}</b>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="score-dock" aria-label="Current score">
        <div className="score-copy">
          <span>Live groan reading</span>
          <strong aria-live="polite">{score}</strong>
        </div>
        <div className="meter" aria-hidden="true">
          <span style={{ width: `${meterValue}%` }} />
        </div>
        <button type="button" onClick={judgeWeek}>
          Judge my week <span aria-hidden="true">→</span>
        </button>
      </section>

      {showResult && (
        <section className="verdict-wrap" id="verdict" aria-live="polite">
          <div className="verdict-card">
            <p className="step-label">Official result</p>
            <div className="verdict-score">
              <span>{score}</span>
              <small>groan<br />points</small>
            </div>
            <p className="verdict-stamp">{verdict.stamp}</p>
            <h2>{verdict.title}</h2>
            <p>{verdict.copy}</p>
            <div className="verdict-actions">
              <button type="button" onClick={shareResult}>{shareLabel}</button>
              <button className="button-quiet" type="button" onClick={resetGame}>
                Try another week
              </button>
            </div>
            <p className="best-score">Personal best on this device: <strong>{Math.max(bestScore, score)}</strong></p>
          </div>
          <p className="result-note">
            Comedy score only. Real problems deserve real support—not a leaderboard.
          </p>
        </section>
      )}

      <footer>
        <a className="wordmark wordmark-footer" href="#top">WHAT A <span>GROAN!</span></a>
        <p>A darkly cheerful game about ordinary bad luck.</p>
        <p>Made for phones, bad weeks and dramatic sighing.</p>
      </footer>
    </main>
  );
}
