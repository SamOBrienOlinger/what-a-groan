"use client";

import { useEffect, useMemo, useState } from "react";
import { maximumWordingPoints, negativeWordScore } from "./scoring";

type Mishap = {
  id: string;
  title: string;
  detail: string;
  points: number;
};

const mishaps: Mishap[] = [
  {
    id: "sleep",
    title: "Sleep declined to participate",
    detail: "You were unconscious for hours and achieved very little.",
    points: 6,
  },
  {
    id: "commute",
    title: "The journey acquired a plot",
    detail: "Delays occurred. Several were explained badly.",
    points: 8,
  },
  {
    id: "tech",
    title: "A device became principled",
    detail: "It stopped working at the precise moment this mattered.",
    points: 7,
  },
  {
    id: "home",
    title: "The house requested money",
    detail: "Something leaked, cracked or began making a sound.",
    points: 9,
  },
  {
    id: "money",
    title: "A charge presented itself",
    detail: "Annual. Forgotten. Entirely legitimate, apparently.",
    points: 10,
  },
  {
    id: "plans",
    title: "The plan ceased to be the plan",
    detail: "Everyone remained enthusiastic from elsewhere.",
    points: 6,
  },
  {
    id: "pet",
    title: "The animal made a decision",
    detail: "The decision was expensive or damp.",
    points: 4,
  },
  {
    id: "social",
    title: "You said a perfectly normal thing",
    detail: "It has since been reviewed 46 times.",
    points: 5,
  },
];

const multipliers = [
  { label: "Technically happened", value: 1 },
  { label: "Was a bit much", value: 1.5 },
  { label: "Became the week", value: 2 },
];

function verdictFor(score: number) {
  if (score === 0) {
    return {
      label: "No case to answer",
      title: "Nothing much happened.",
      copy: "This is irritating for people who came prepared.",
    };
  }

  if (score < 16) {
    return {
      label: "Minor nuisance",
      title: "A manageable inconvenience.",
      copy: "You may mention it once, preferably without a preamble.",
    };
  }

  if (score < 31) {
    return {
      label: "Complaint approved",
      title: "A proper week.",
      copy: "Your complaint has merit. Tea remains the recommended intervention.",
    };
  }

  if (score < 51) {
    return {
      label: "Rather a lot",
      title: "Quite a lot, actually.",
      copy: "You may cancel one plan and become difficult to reach.",
    };
  }

  return {
    label: "Formal groan",
    title: "An administrative failure of reality.",
    copy: "No lessons need be learned from this.",
  };
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [multiplier, setMultiplier] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [shareLabel, setShareLabel] = useState("Share finding");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("what-a-groan-best");
      if (saved) setBestScore(Number(saved) || 0);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const evidenceScore = useMemo(
    () =>
      mishaps
        .filter((mishap) => selected.includes(mishap.id))
        .reduce(
          (total, mishap) =>
            total +
            mishap.points +
            negativeWordScore(details[mishap.id] ?? ""),
          0,
        ),
    [details, selected],
  );
  const score = Math.round(evidenceScore * multiplier);
  const verdict = verdictFor(score);

  function toggleMishap(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setShowResult(false);
  }

  function issueVerdict() {
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
    setDetails({});
    setMultiplier(1);
    setShowResult(false);
    setShareLabel("Share finding");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function shareResult() {
    const text = `My week received ${score} points from WHAT A GROAN!: ${verdict.title}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "WHAT A GROAN!", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareLabel("Copied. Very modern.");
      }
    } catch {
      setShareLabel("Not shared. Fine.");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="WHAT A GROAN! home">
          WHAT A GROAN!
        </a>
        <span>No login, mercifully.</span>
      </header>

      <div className="page-shell" id="top">
        <section className="intro">
          <p className="eyebrow">A minor administrative exercise</p>
          <h1>How bad was your week, objectively?</h1>
          <p>
            Tick the applicable inconveniences. The computer will issue a
            finding. It has no qualifications.
          </p>
        </section>

        <section className="panel" aria-labelledby="events-heading">
          <div className="section-heading">
            <h2 id="events-heading">What happened?</h2>
            <span>{selected.length} selected</span>
          </div>
          <p className="scoring-note">
            Add details if required. Gloomy vocabulary attracts a modest
            surcharge, assessed locally by the computer.
          </p>

          <div className="mishap-list">
            {mishaps.map((mishap) => {
              const active = selected.includes(mishap.id);
              const wordingPoints = negativeWordScore(details[mishap.id] ?? "");
              return (
                <div
                  className={`mishap-item${active ? " is-selected" : ""}`}
                  key={mishap.id}
                >
                  <button
                    className="mishap-row"
                    type="button"
                    onClick={() => toggleMishap(mishap.id)}
                    aria-pressed={active}
                  >
                    <span className="check" aria-hidden="true">
                      {active ? "✓" : ""}
                    </span>
                    <span className="mishap-copy">
                      <strong>{mishap.title}</strong>
                      <small>{mishap.detail}</small>
                    </span>
                    <span className="points">+{mishap.points}</span>
                  </button>

                  {active && (
                    <div className="detail-field">
                      <label htmlFor={`detail-${mishap.id}`}>
                        <span>Optional details</span>
                        <small aria-live="polite">
                          {wordingPoints > 0
                            ? `Wording +${wordingPoints}`
                            : "No wording points"}
                        </small>
                      </label>
                      <textarea
                        id={`detail-${mishap.id}`}
                        value={details[mishap.id] ?? ""}
                        onChange={(event) => {
                          setDetails((current) => ({
                            ...current,
                            [mishap.id]: event.target.value,
                          }));
                          setShowResult(false);
                        }}
                        rows={2}
                        maxLength={220}
                        placeholder="What happened, in your own unnecessarily bleak words?"
                        aria-describedby={`detail-help-${mishap.id}`}
                      />
                      <p id={`detail-help-${mishap.id}`}>
                        Negative words add up to {maximumWordingPoints} points.
                        Your notes stay in this browser.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel" aria-labelledby="severity-heading">
          <div className="section-heading">
            <h2 id="severity-heading">How bad was it?</h2>
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
                <span>{option.label}</span>
                <small>×{option.value}</small>
              </label>
            ))}
          </fieldset>
        </section>

        <section className="decision-bar" aria-label="Current score">
          <div>
            <span>Current reading</span>
            <strong aria-live="polite">{score}</strong>
          </div>
          <button type="button" onClick={issueVerdict}>
            Issue verdict
          </button>
        </section>

        {showResult && (
          <section className="verdict" id="verdict" aria-live="polite">
            <p className="verdict-label">{verdict.label}</p>
            <div className="verdict-score">
              <strong>{score}</strong>
              <span>groan points</span>
            </div>
            <h2>{verdict.title}</h2>
            <p>{verdict.copy}</p>
            <div className="verdict-actions">
              <button type="button" onClick={shareResult}>{shareLabel}</button>
              <button className="button-secondary" type="button" onClick={resetGame}>
                Start again
              </button>
            </div>
            <small>Best on this device: {Math.max(bestScore, score)}. A proud record.</small>
          </section>
        )}

        <footer>
          <span>WHAT A GROAN!</span>
          <p>For ordinary bad luck only. Serious matters remain serious.</p>
        </footer>
      </div>
    </main>
  );
}
