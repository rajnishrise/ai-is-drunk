"use client";

import { useEffect, useState } from "react";
import { shameWall } from "@/lib/content";
import { useGame } from "./GameProvider";

const stampColor = { Tipsy: "#b07d10", Drunk: "#c4531c", Blackout: "#c2185b" } as const;
const KEY = "shame-votes";
type Sort = "hot" | "top";

export default function ShameWall() {
  const { track } = useGame();
  const [voted, setVoted] = useState<Record<number, boolean>>({});
  const [sort, setSort] = useState<Sort>("top");

  useEffect(() => {
    try { setVoted(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch {}
  }, []);

  function toggle(i: number) {
    const on = !voted[i];
    const n = { ...voted, [i]: on };
    setVoted(n);
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
    if (on) track({ type: "vote" });
  }

  const items = shameWall.map((s, i) => ({ ...s, i }));
  if (sort === "top") items.sort((a, b) => b.votes - a.votes);
  else items.sort((a, b) => ["Blackout", "Drunk", "Tipsy"].indexOf(a.level) - ["Blackout", "Drunk", "Tipsy"].indexOf(b.level) || b.votes - a.votes);

  return (
    <>
      <div className="seg" role="group" aria-label="Sort the wall">
        <button type="button" aria-pressed={sort === "top"} onClick={() => setSort("top")}>🏆 Most toasted</button>
        <button type="button" aria-pressed={sort === "hot"} onClick={() => setSort("hot")}>🔥 Most drunk</button>
      </div>
      <div className="wall">
        {items.map((s) => (
          <figure key={s.i} className="polaroid" style={{ "--r": `${((s.i * 37) % 7) - 3}deg` } as React.CSSProperties}>
            <span className="tape" aria-hidden="true" />
            <div className="lineup">
              <p className="asked">Asked: {s.asked}</p>
              <p className="said">&ldquo;{s.said}&rdquo;</p>
            </div>
            <figcaption className="meta">
              <span>{s.who}</span>
              <span className="stamp" style={{ color: stampColor[s.level] }}>{s.level.toUpperCase()}</span>
              <button type="button" className="vote" aria-pressed={!!voted[s.i]} onClick={() => toggle(s.i)} aria-label={`Raise a glass, ${s.votes + (voted[s.i] ? 1 : 0)} so far`}>
                🍺 {s.votes + (voted[s.i] ? 1 : 0)}
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
