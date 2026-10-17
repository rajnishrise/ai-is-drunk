"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAX_BAC, ROUND_BAC, ROUND_PRICE, WATER_BAC,
  patrons, samplePrompts, tierIndex, tiers, topicOf,
} from "@/lib/patrons";
import { slur, type Piece } from "@/lib/slur";

type Msg =
  | { id: number; kind: "you"; text: string }
  | { id: number; kind: "bot"; patronId: string; bac: number; pieces: Piece[]; footnote: string; tilt: number };

type Worst = { text: string; who: string; bac: number };

const clamp = (v: number) => Math.max(0, Math.min(MAX_BAC, Math.round(v * 100) / 100));

export default function BarCounter() {
  const [patronId, setPatronId] = useState(patrons[0].id);
  const [bac, setBacMap] = useState<Record<string, number>>(() => Object.fromEntries(patrons.map((p) => [p.id, 0])));
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);
  const [worst, setWorst] = useState<Worst | null>(null);
  const [question, setQuestion] = useState("");
  const [copyNote, setCopyNote] = useState("Every night ends with a shareable bar tab.");
  const nextId = useRef(1);
  const convoRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  const patron = patrons.find((p) => p.id === patronId)!;
  const level = bac[patronId];
  const tier = tiers[tierIndex(level)];

  function setLevel(id: string, v: number) {
    setBacMap((m) => ({ ...m, [id]: clamp(v) }));
  }

  function ask(q: string, asPatron = patron, atBac = level) {
    q = q.trim();
    if (!q) return;
    const ti = tierIndex(atBac);
    const raw = asPatron.lines[ti](topicOf(q));
    const tilt = atBac * 10 * (Math.random() < 0.5 ? -1 : 1);
    setMsgs((m) => [
      ...m,
      { id: nextId.current++, kind: "you", text: q },
      { id: nextId.current++, kind: "bot", patronId: asPatron.id, bac: atBac, pieces: slur(raw, atBac), footnote: asPatron.footnotes[ti], tilt },
    ]);
    setWorst((w) => (!w || atBac >= w.bac ? { text: raw, who: asPatron.name, bac: atBac } : w));
  }

  // Open on a night already under way. Runs on the client only, since the slurring is random.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const p = patrons[0];
    ask(samplePrompts[0], p, 0);
    setRounds([p.drink, p.drink, p.drink, p.drink]);
    setLevel(p.id, 0.16);
    ask(samplePrompts[2], p, 0.16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = convoRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  function buyRound() {
    setRounds((r) => [...r, patron.drink]);
    setLevel(patronId, level + ROUND_BAC);
  }

  function submit() {
    ask(question);
    setQuestion("");
  }

  const total = (rounds.length * ROUND_PRICE).toFixed(2);

  function tabText() {
    const lines = rounds.length ? rounds.map((d) => `${d}  $${ROUND_PRICE.toFixed(2)}`).join("\n") : "No rounds yet";
    const w = worst ? `\nWorst take: "${worst.text}" (${worst.who}, BAC ${worst.bac.toFixed(2)})` : "";
    return `BAR TAB, The Tipsy Tavern\n${lines}${w}\nTOTAL $${total}\nhttps://www.aiisdrunk.com`;
  }

  async function copyTab() {
    try {
      await navigator.clipboard.writeText(tabText());
      setCopyNote("Copied your tab. Paste it anywhere.");
    } catch {
      setCopyNote(tabText());
    }
  }

  return (
    <>
      <section className="stools" aria-label="Patrons at the bar">
        {patrons.map((p) => (
          <button key={p.id} type="button" className="patron" aria-pressed={p.id === patronId} onClick={() => setPatronId(p.id)}>
            <span className="face" aria-hidden="true">{p.face}</span>
            <span className="name">{p.name}</span>
            <span className="bio">{p.bio}</span>
            <span className="bac">BAC {bac[p.id].toFixed(2)}</span>
          </button>
        ))}
      </section>

      <div className="bar-main">
        <section className="counter" aria-label="Bar counter">
          <div className="meter">
            <div className="meter-top">
              <label className="lbl" htmlFor="bac">Blood Algorithm Content · {patron.name}</label>
              <span className="tier" style={{ color: tier.color }}>{tier.name}</span>
            </div>
            <div className="reading">{level.toFixed(2)}</div>
            <input id="bac" type="range" min={0} max={MAX_BAC} step={0.01} value={level} onChange={(e) => setLevel(patronId, parseFloat(e.target.value))} />
            <div className="scale"><span>0.00 sober</span><span>0.08 tipsy</span><span>0.15 drunk</span><span>0.30 blackout</span></div>
          </div>

          <div className="row">
            <button className="btn neon" type="button" onClick={buyRound}>Buy a round (+{ROUND_BAC.toFixed(2)})</button>
            <button className="btn ghost" type="button" onClick={() => setLevel(patronId, level - WATER_BAC)}>Glass of water</button>
          </div>

          <form className="row" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <input id="question" className="input" type="text" placeholder={`Ask ${patron.name} something`} autoComplete="off" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={200} />
            <button className="btn" type="submit">Ask</button>
          </form>
          <div className="chips">
            {samplePrompts.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => ask(s)}>{s}</button>
            ))}
          </div>

          <div className="convo" ref={convoRef} aria-live="polite">
            {msgs.map((m) => {
              if (m.kind === "you") return <div key={m.id} className="msg you">{m.text}</div>;
              const p = patrons.find((x) => x.id === m.patronId)!;
              const ti = tierIndex(m.bac);
              const style = {
                "--tilt": `${m.tilt.toFixed(2)}deg`,
                "--blur": ti === 3 ? "0.6px" : "0px",
                "--ghost": ti >= 2 ? `${(m.bac * 18).toFixed(1)}px 1px 0 rgba(42,34,48,.25)` : "none",
              } as React.CSSProperties;
              return (
                <div key={m.id} className={`msg bot${ti >= 2 ? " wobble" : ""}`} style={style}>
                  <div className="who">{p.face} {p.name} <span>BAC {m.bac.toFixed(2)} · {tiers[ti].name}</span></div>
                  <p>
                    {m.pieces.map((pc, i) => (
                      <span key={i}>{i > 0 ? " " : ""}{pc.hic ? <span className="hic">{pc.text}</span> : pc.text}</span>
                    ))}
                  </p>
                  {m.footnote && <div className="fn">{m.footnote}</div>}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="side">
          <div className="receipt" aria-label="Bar tab">
            <h2>BAR TAB</h2>
            <div className="sub">The Tipsy Tavern · aiisdrunk.com</div>
            <hr />
            {rounds.length === 0 ? (
              <div className="line"><span>No rounds yet</span><span>$0.00</span></div>
            ) : (
              rounds.map((d, i) => (
                <div className="line" key={i}><span>{d}</span><span>${ROUND_PRICE.toFixed(2)}</span></div>
              ))
            )}
            <hr />
            <div className="worst">
              {worst ? (
                <><b>Worst take of the night</b><br />&ldquo;{worst.text}&rdquo;<br />{worst.who}, BAC {worst.bac.toFixed(2)}</>
              ) : (
                "Ask a question to record the worst take of the night."
              )}
            </div>
            <hr />
            <div className="line total"><span>TOTAL</span><span>${total}</span></div>
            <div className="sub">Tip your bartender. Verify your facts.</div>
          </div>
          <button className="btn ghost" type="button" onClick={copyTab}>Copy tab to share</button>
          <p className="note">{copyNote}</p>
        </aside>
      </div>
    </>
  );
}
