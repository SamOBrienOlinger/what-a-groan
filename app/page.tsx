"use client";

import { useMemo, useState } from "react";
import {
  maximumWordingPoints,
  mishapScore,
  normaliseScore,
} from "./scoring";

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
  { label: "A real pain", value: 1 },
  { label: "Total nightmare", value: 1.5 },
  { label: "It broke me", value: 2 },
];

const maximumRawScore = mishaps.reduce(
  (total, mishap) =>
    total +
    Math.round(
      (mishap.points + maximumWordingPoints) *
        Math.max(...multipliers.map((option) => option.value)),
    ),
  0,
);
const maximumScore = 100;

function verdictFor(score: number) {
  if (score === 0) {
    return {
      label: "Complaint rejected",
      title: "You appear to have had a day.",
      copy: "Suck it up. Come back when something worth actually being annoyed about has happened.",
    };
  }

  if (score < 16) {
    return {
      label: "Sympathy unavailable",
      title: "You will somehow survive this.",
      copy: "Pull yourself together and return when the inconvenience has developed into an actual problem.",
    };
  }

  if (score < 31) {
    return {
      label: "Limited concern",
      title: "Annoying. Not historic.",
      copy: "You may sigh once. Then suck it up and come back with something that warrants a second sentence.",
    };
  }

  if (score < 51) {
    return {
      label: "Grudgingly accepted",
      title: "Fine. That was genuinely irritating.",
      copy: "You have earned a proper sulk. Try not to turn it into a memoir.",
    };
  }

  return {
    label: "Complaint sustained",
    title: "At last, an actual problem.",
    copy: "Finally, something worth being annoyed about. Please proceed with your entirely justified refusal to cope.",
  };
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [severities, setSeverities] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share finding");

  const rawScore = useMemo(
    () =>
      mishaps
        .filter((mishap) => selected.includes(mishap.id))
        .reduce(
          (total, mishap) =>
            total +
            mishapScore(
              mishap.points,
              details[mishap.id] ?? "",
              severities[mishap.id] ?? 1,
            ),
          0,
        ),
    [details, selected, severities],
  );
  const score = normaliseScore(rawScore, maximumRawScore);
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
    setSeverities({});
    setShowResult(false);
    setShareLabel("Share finding");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function shareResult() {
    const text = `My week scored ${score} out of ${maximumScore} on DON'T EVEN TALK TO ME: ${verdict.title}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "DON'T EVEN TALK TO ME", text });
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
        <a className="wordmark" href="#top" aria-label="Don't Even Talk to Me home">
          DON&apos;T EVEN TALK TO ME
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
            Assess each selected inconvenience separately. Details are optional;
            the computer will consider them with grave concern.
          </p>

          <div className="mishap-list">
            {mishaps.map((mishap) => {
              const active = selected.includes(mishap.id);
              const severity = severities[mishap.id] ?? 1;
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
                  </button>

                  {active && (
                    <div className="item-assessment">
                      <fieldset className="item-severity">
                        <legend>How bad was it?</legend>
                        <div className="severity-options">
                          {multipliers.map((option) => (
                            <label
                              className={severity === option.value ? "is-selected" : ""}
                              key={option.value}
                            >
                              <input
                                type="radio"
                                name={`severity-${mishap.id}`}
                                value={option.value}
                                checked={severity === option.value}
                                onChange={() => {
                                  setSeverities((current) => ({
                                    ...current,
                                    [mishap.id]: option.value,
                                  }));
                                  setShowResult(false);
                                }}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <div className="detail-field">
                        <label htmlFor={`detail-${mishap.id}`}>
                          <span>Optional details</span>
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
                          The computer will consider this quietly. Your notes stay in this browser.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="decision-bar" aria-label="Issue verdict">
          <button type="button" onClick={issueVerdict}>
            Issue verdict
          </button>
        </section>

        {showResult && (
          <section className="verdict" id="verdict" aria-live="polite">
            <p className="verdict-label">{verdict.label}</p>
            <div className="verdict-score">
              <strong>{score}</strong>
              <span>out of {maximumScore}</span>
            </div>
            <h2>{verdict.title}</h2>
            <p>{verdict.copy}</p>
            <div className="verdict-actions">
              <button type="button" onClick={shareResult}>{shareLabel}</button>
              <button className="button-secondary" type="button" onClick={resetGame}>
                Start again
              </button>
            </div>
          </section>
        )}

        <footer>
          <span>DON&apos;T EVEN TALK TO ME</span>
          <p>For ordinary bad luck only. Serious matters remain serious.</p>
        </footer>
      </div>
    </main>
  );
}
