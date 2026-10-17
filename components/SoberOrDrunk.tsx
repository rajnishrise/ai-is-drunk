"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { factPairs } from "@/lib/content";

const ROUND_MS = 10000;
type Card = { text: string; real: boolean };
type Round = { topic: string; cards: [Card, Card] };

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

export default function SoberOrDrunk() {
  const [order, setOrder] = useState<number[] | null>(null);
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [left, setLeft] = useState(ROUND_MS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const started = useRef(0);

  // Shuffle on the client so server and client render the same first frame.
  useEffect(() => {
    const o = shuffled(factPairs.map((_, i) => i));
    setOrder(o);
    setRound(makeRound(0, o));
    started.current = Date.now();
    try { setBest(Number(localStorage.getItem("sod-best") || 0)); } catch {}
  }, []);

  const done = picked !== null || timedOut;

  useEffect(() => {
    if (!round || done) return;
    const t = setInterval(() => {
      const remaining = ROUND_MS - (Date.now() - started.current);
      setLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        setTimedOut(true);
        setStreak(0);
      }
    }, 100);
    return () => clearInterval(t);
  }, [round, done]);

  function pick(i: number) {
    if (!round || done) return;
    setPicked(i);
    if (round.cards[i].real) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const n = s + 1;
        setBest((b) => {
          const nb = Math.max(b, n);
          try { localStorage.setItem("sod-best", String(nb)); } catch {}
          return nb;
        });
        return n;
      });
    } else {
      setStreak(0);
    }
  }

  const next = useCallback(() => {
    if (!order) return;
    const n = index + 1;
    setIndex(n);
    setRound(makeRound(n, order));
    setPicked(null);
    setTimedOut(false);
    setLeft(ROUND_MS);
    started.current = Date.now();
  }, [index, order]);

  const correct = picked !== null && round?.cards[picked].real;

  return (
    <section className="panel arcade" aria-label="Sober or Drunk">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="lbl">Round {index + 1} · {round?.topic ?? "Loading"}</span>
        <div className="score">
          <span>Score <b>{score}</b></span>
          <span>Streak <b>{streak}</b></span>
          <span>Best <b>{best}</b></span>
        </div>
      </div>
      <div className="timer" aria-hidden="true"><i style={{ width: `${(left / ROUND_MS) * 100}%` }} /></div>
      <p style={{ margin: 0 }}>One of these is true. The other was said by a drunk AI. Tap the sober one.</p>
      <div className="grid-2">
        {round?.cards.map((c, i) => {
          let cls = "fact";
          if (done && c.real) cls += " right";
          else if (picked === i && !c.real) cls += " wrong";
          return (
            <button key={i} type="button" className={cls} onClick={() => pick(i)} disabled={done}>
              {c.text}
            </button>
          );
        })}
      </div>
      <div className="row" style={{ justifyContent: "space-between", minHeight: 44 }}>
        {done ? (
          <>
            <p className={`verdict ${correct ? "right" : "wrong"}`} aria-live="polite">
              {timedOut ? "Last call! Too slow." : correct ? "Sober as a judge." : "You've been drinking with the AI."}
            </p>
            <button className="btn" type="button" onClick={next}>Next round</button>
          </>
        ) : (
          <span className="lbl">{Math.ceil(left / 1000)}s left</span>
        )}
      </div>
    </section>
  );
}
