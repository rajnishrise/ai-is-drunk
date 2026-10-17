"use client";

import { useEffect, useState } from "react";
import { shameWall } from "@/lib/content";

const stampColor = { Tipsy: "#b07d10", Drunk: "#c4531c", Blackout: "#c2185b" } as const;
const KEY = "shame-votes";

export default function ShameWall() {
  const [voted, setVoted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try { setVoted(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch {}
  }, []);

  function toggle(i: number) {
    setVoted((v) => {
      const n = { ...v, [i]: !v[i] };
      try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
      return n;
    });
  }

  return (
    <div className="wall">
      {shameWall.map((s, i) => (
        <figure key={i} className="polaroid" style={{ "--r": `${((i * 37) % 7) - 3}deg` } as React.CSSProperties}>
          <div className="lineup">
            <p className="asked">Asked: {s.asked}</p>
            <p className="said">&ldquo;{s.said}&rdquo;</p>
          </div>
          <figcaption className="meta">
            <span>{s.who}</span>
            <span className="stamp" style={{ color: stampColor[s.level] }}>{s.level.toUpperCase()}</span>
            <button type="button" className="vote" aria-pressed={!!voted[i]} onClick={() => toggle(i)}>
              🍺 {s.votes + (voted[i] ? 1 : 0)}
            </button>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
