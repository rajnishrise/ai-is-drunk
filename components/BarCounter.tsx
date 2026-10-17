"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAX_BAC, ROUND_BAC, ROUND_PRICE, WATER_BAC,
  patronStats, patrons, samplePrompts, tierIndex, tiers, topicOf, type Patron,
} from "@/lib/patrons";
import { slur, type Piece } from "@/lib/slur";
import { BAR_ROUND_COST, SECRET_COST } from "@/lib/game";
import { useGame } from "./GameProvider";
import BacDial from "./BacDial";

type Msg =
  | { id: number; kind: "you"; text: string }
  | { id: number; kind: "bot"; patronId: string; bac: number; pieces: Piece[]; footnote: string; tilt: number };

type Worst = { text: string; who: string; bac: number };

const clamp = (v: number) => Math.max(0, Math.min(MAX_BAC, Math.round(v * 100) / 100));

function StatBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-track"><i style={{ width: `${value}%`, background: tone }} /></span>
      <span className="stat-num">{value}</span>
    </div>
  );
}

function PatronCard({ p, bac, selected, locked, onPick, onUnlock }: {
  p: Patron; bac: number; selected: boolean; locked: boolean; onPick: () => void; onUnlock: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const s = patronStats(p, bac);

  // A gentle 3D tilt that follows the pointer, like a character-select card.
  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
    el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
  }
  function onLeave() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div ref={ref} className={`card rarity-${p.rarity.toLowerCase()}${selected ? " is-selected" : ""}${locked ? " is-locked" : ""}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <button type="button" className="card-hit" onClick={locked ? onUnlock : onPick} aria-pressed={locked ? undefined : selected}
        aria-label={locked ? `Unlock ${p.name} for ${SECRET_COST} tokens` : `Sit next to ${p.name}`} />
      <div className="card-top">
        <span className="rarity">{p.rarity}</span>
        <span className="card-bac">BAC {bac.toFixed(2)}</span>
      </div>
      <div className="portrait" aria-hidden="true">
        <span className="portrait-face">{locked ? "🔒" : p.face}</span>
      </div>
      <div className="card-name">{locked ? "??? VIP Guest" : p.name}</div>
      <div className="card-class">{locked ? `Unlock for ${SECRET_COST} 🪙` : `Class: ${p.klass}`}</div>
      {!locked && (
        <div className="stats">
          <StatBar label="CONF" value={s.confidence} tone="var(--neon)" />
          <StatBar label="ACC" value={s.accuracy} tone="var(--lime)" />
          <StatBar label="CHAOS" value={s.chaos} tone="var(--amber)" />
        </div>
      )}
      {!locked && <p className="card-bio">{p.bio}</p>}
    </div>
  );
}

export default function BarCounter() {
  const { state, ready, track, spend } = useGame();
  const [patronId, setPatronId] = useState(patrons[0].id);
  const [bac, setBacMap] = useState<Record<string, number>>(() => Object.fromEntries(patrons.map((p) => [p.id, 0])));
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);
  const [worst, setWorst] = useState<Worst | null>(null);
  const [question, setQuestion] = useState("");
  const [copyNote, setCopyNote] = useState("Share your tab for a bonus.");
  const nextId = useRef(1);
  const convoRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  const patron = patrons.find((p) => p.id === patronId)!;
  const level = bac[patronId];
  const ti = tierIndex(level);
  const tier = tiers[ti];

  function setLevel(id: string, v: number) {
    const nv = clamp(v);
    if (bac[id] < MAX_BAC && nv >= MAX_BAC) track({ type: "blackout", patron: id });
    setBacMap((m) => ({ ...m, [id]: nv }));
  }

  function ask(q: string, asPatron = patron, atBac = level, counted = true) {
    q = q.trim();
    if (!q) return;
    const t = tierIndex(atBac);
    const raw = asPatron.lines[t](topicOf(q));
    const tilt = atBac * 10 * (Math.random() < 0.5 ? -1 : 1);
    setMsgs((m) => [
      ...m,
      { id: nextId.current++, kind: "you", text: q },
      { id: nextId.current++, kind: "bot", patronId: asPatron.id, bac: atBac, pieces: slur(raw, atBac), footnote: asPatron.footnotes[t], tilt },
    ]);
    setWorst((w) => (!w || atBac >= w.bac ? { text: raw, who: asPatron.name, bac: atBac } : w));
    if (counted) track({ type: "ask", patron: asPatron.id, hour: new Date().getHours() });
  }

  // Open on a night already under way. Client only, since the slurring is random.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const p = patrons[0];
    ask(samplePrompts[0], p, 0, false);
    setRounds([p.drink, p.drink, p.drink, p.drink]);
    setBacMap((m) => ({ ...m, [p.id]: 0.16 }));
    ask(samplePrompts[2], p, 0.16, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = convoRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  function buyRound() {
    setRounds((r) => [...r, patron.drink]);
    setLevel(patronId, level + ROUND_BAC);
    track({ type: "round", patron: patronId });
  }

  function roundForTheBar() {
    if (!spend(BAR_ROUND_COST, { type: "barRound" })) return;
    setRounds((r) => [...r, "Round for the whole bar"]);
    const open = patrons.filter((p) => !p.secret || state.secret);
    for (const p of open) if (bac[p.id] < MAX_BAC && bac[p.id] + ROUND_BAC >= MAX_BAC) track({ type: "blackout", patron: p.id });
    setBacMap((m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, open.some((p) => p.id === k) ? clamp(v + ROUND_BAC) : v])));
  }

  function water() {
    if (level <= 0) return;
    setLevel(patronId, level - WATER_BAC);
    track({ type: "water" });
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
      setCopyNote("Copied. Paste it anywhere.");
      track({ type: "share" });
    } catch {
      setCopyNote(tabText());
    }
  }

  const drunk = level / MAX_BAC;

  return (
    <div className="scene" style={{ "--drunk": drunk.toFixed(3) } as React.CSSProperties}>
      <section aria-labelledby="select-title" className="select">
        <div className="select-head">
          <h2 id="select-title" className="kicker">Choose your drinking buddy</h2>
          <button className="btn tokens" type="button" onClick={roundForTheBar} disabled={!ready}>
            Round for the whole bar · {BAR_ROUND_COST} 🪙
          </button>
        </div>
        <div className="cards">
          {patrons.map((p) => {
            const locked = !!p.secret && !state.secret;
            return (
              <PatronCard key={p.id} p={p} bac={bac[p.id]} selected={p.id === patronId} locked={locked}
                onPick={() => setPatronId(p.id)}
                onUnlock={() => { if (spend(SECRET_COST, { type: "unlockSecret" })) setPatronId(p.id); }} />
            );
          })}
        </div>
      </section>

      <div className="bar-main">
        <section className="counter" aria-label="Bar counter">
          <div className="counter-top">
            <BacDial bac={level} />
            <div className="counter-controls">
              <div className="meter-top">
                <label className="lbl" htmlFor="bac">Blood Algorithm Content · {patron.name}</label>
                <span className={`tier tier-${ti}`} style={{ color: tier.color }}>{tier.name}</span>
              </div>
              <input id="bac" type="range" min={0} max={MAX_BAC} step={0.01} value={level} onChange={(e) => setLevel(patronId, parseFloat(e.target.value))} />
              <div className="row">
                <button className="btn neon" type="button" onClick={buyRound}>🍺 Buy a round <small>+3 XP</small></button>
                <button className="btn ghost" type="button" onClick={water}>💧 Water</button>
              </div>
            </div>
          </div>

          <form className="row ask" onSubmit={(e) => { e.preventDefault(); ask(question); setQuestion(""); }}>
            <input id="question" className="input" type="text" placeholder={`Ask ${patron.name} anything…`} autoComplete="off" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={200} />
            <button className="btn" type="submit">Ask <small>+5 XP</small></button>
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
              const t = tierIndex(m.bac);
              const style = {
                "--tilt": `${m.tilt.toFixed(2)}deg`,
                "--blur": t === 3 ? "0.6px" : "0px",
                "--ghost": t >= 2 ? `${(m.bac * 18).toFixed(1)}px 1px 0 rgba(255,62,165,.28), ${(-m.bac * 14).toFixed(1)}px -1px 0 rgba(62,240,255,.22)` : "none",
              } as React.CSSProperties;
              return (
                <div key={m.id} className={`msg bot${t >= 2 ? " wobble" : ""}`} style={style}>
                  <div className="who"><span className="who-face">{p.face}</span> {p.name} <span className="who-bac">BAC {m.bac.toFixed(2)} · {tiers[t].name}</span></div>
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
          <button className="btn ghost" type="button" onClick={copyTab}>📣 Copy tab to share <small>+15 XP</small></button>
          <p className="note">{copyNote}</p>
        </aside>
      </div>
    </div>
  );
}
