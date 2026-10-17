"use client";

import { useEffect, useRef, useState } from "react";
import { factPairs } from "@/lib/content";
import { useGame } from "./GameProvider";

const ROUND_MS = 10000;
const LIVES = 3;

type Card = { text: string; real: boolean };
type Round = { topic: string; cards: [Card, Card] };
type Phase = "start" | "play" | "over";

function shuffled<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(index: number, order: number[]): Round {
  const f = factPairs[order[index % order.length]];
  const pair: [Card, Card] = [{ text: f.real, real: true }, { text: f.drunk, real: false }];
  return { topic: f.topic, cards: Math.random() < 0.5 ? pair : [pair[1], pair[0]] };
}

const multOf = (streak: number) => (streak >= 10 ? 4 : streak >= 6 ? 3 : streak >= 3 ? 2 : 1);

export default function SoberOrDrunk() {
  const { state, track } = useGame();
  const [phase, setPhase] = useState<Phase>("start");
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [left, setLeft] = useState(ROUND_MS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [lastPoints, setLastPoints] = useState(0);
  const [shareNote, setShareNote] = useState("");
  const started = useRef(0);
  const best = state.stats.sodBestScore;

  const done = picked !== null || timedOut;

  function start() {
    const o = shuffled(factPairs.map((_, i) => i));
    setOrder(o);
    setIndex(0);
    setRound(makeRound(0, o));
    setPicked(null);
    setTimedOut(false);
    setLeft(ROUND_MS);
    setScore(0);
    setStreak(0);
    setLives(LIVES);
    setShareNote("");
    started.current = Date.now();
    setPhase("play");
  }

  function loseLife() {
    setStreak(0);
    setLives((l) => l - 1);
    track({ type: "sod", correct: false, streak: 0 });
  }

  useEffect(() => {
    if (phase !== "play" || !round || done) return;
    const t = setInterval(() => {
      const remaining = ROUND_MS - (Date.now() - started.current);
      setLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        setTimedOut(true);
        setLastPoints(0);
        loseLife();
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round, done]);

  function pick(i: number) {
    if (!round || done) return;
    setPicked(i);
    if (round.cards[i].real) {
      const n = streak + 1;
      const pts = 100 * multOf(n) + Math.ceil(left / 1000) * 5;
      setStreak(n);
      setScore((s) => s + pts);
      setLastPoints(pts);
      track({ type: "sod", correct: true, streak: n });
    } else {
      setLastPoints(0);
      loseLife();
    }
  }

  function next() {
    if (lives <= 0) {
      setPhase("over");
      track({ type: "sodGameOver", score });
      return;
    }
    const n = index + 1;
    setIndex(n);
    setRound(makeRound(n, order));
    setPicked(null);
    setTimedOut(false);
    setLeft(ROUND_MS);
    started.current = Date.now();
  }

  async function share() {
    const text = `I scored ${score} in Sober or Drunk at the Tipsy Tavern 🍺 Can you spot the hallucination? https://www.aiisdrunk.com/games`;
    try {
      await navigator.clipboard.writeText(text);
      setShareNote("Copied. Go challenge a friend.");
      track({ type: "share" });
    } catch {
      setShareNote(text);
    }
  }

  const correct = picked !== null && round?.cards[picked].real;
  const mult = multOf(streak);

  if (phase === "start") {
    return (
      <section className="cabinet" aria-label="Sober or Drunk">
        <div className="screen start-screen">
          <p className="pixel blink">INSERT COIN</p>
          <h2 className="game-title">SOBER<span>or</span>DRUNK</h2>
          <ul className="howto">
            <li>One fact is true. One was said by a drunk AI.</li>
            <li>Pick the sober one before the 10 seconds run out.</li>
            <li>Streaks build a combo up to ×4. Three wrong and it&apos;s last call.</li>
          </ul>
          <button className="btn arcade-btn" type="button" onClick={start}>▶ PRESS START</button>
          <p className="pixel small">HI-SCORE {String(best).padStart(5, "0")}</p>
        </div>
      </section>
    );
  }

  if (phase === "over") {
    const isBest = score > 0 && score >= best;
    return (
      <section className="cabinet" aria-label="Sober or Drunk">
        <div className="screen start-screen">
          <p className="pixel">LAST CALL!</p>
          <h2 className="game-title">GAME<span>·</span>OVER</h2>
          <p className="final pixel">{String(score).padStart(5, "0")}</p>
          {isBest && <p className="new-best">New high score!</p>}
          <p className="muted">Tokens earned this run: {Math.floor(score / 100)} 🪙</p>
          <div className="row center">
            <button className="btn arcade-btn" type="button" onClick={start}>↻ PLAY AGAIN</button>
            <button className="btn ghost" type="button" onClick={share}>📣 Share score</button>
          </div>
          {shareNote && <p className="note">{shareNote}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="cabinet" aria-label="Sober or Drunk">
      <div className="screen">
        <div className="hud-row">
          <span className="pixel">SCORE {String(score).padStart(5, "0")}</span>
          <span className={`combo combo-${mult}`}>×{mult} COMBO</span>
          <span className="lives" aria-label={`${lives} lives left`}>
            {Array.from({ length: LIVES }, (_, i) => <span key={i} className={i < lives ? "" : "spent"}>🍺</span>)}
          </span>
        </div>
        <div className="timer" aria-hidden="true"><i style={{ width: `${(left / ROUND_MS) * 100}%` }} /></div>
        <p className="round-label">Round {index + 1} · {round?.topic} · Streak {streak}</p>
        <div className="facts">
          {round?.cards.map((c, i) => {
            let cls = "fact";
            if (done && c.real) cls += " right";
            else if (picked === i && !c.real) cls += " wrong";
            return (
              <button key={i} type="button" className={cls} onClick={() => pick(i)} disabled={done}>
                <span className="fact-key" aria-hidden="true">{i === 0 ? "A" : "B"}</span>
                {c.text}
              </button>
            );
          })}
        </div>
        <div className="row verdict-row">
          {done ? (
            <>
              <p className={`verdict ${correct ? "right" : "wrong"}`} aria-live="polite">
                {timedOut ? "Too slow! −1 🍺" : correct ? `Sober as a judge! +${lastPoints}` : "You've been drinking with the AI. −1 🍺"}
              </p>
              <button className="btn" type="button" onClick={next} autoFocus>{lives <= 0 ? "See score" : "Next round →"}</button>
            </>
          ) : (
            <span className="pixel small">{Math.ceil(left / 1000)}s</span>
          )}
        </div>
      </div>
    </section>
  );
}
