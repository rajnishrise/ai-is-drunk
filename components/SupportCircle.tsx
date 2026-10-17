"use client";

import { members } from "@/lib/content";
import { SPONSOR_COST } from "@/lib/game";
import { useGame } from "./GameProvider";

export default function SupportCircle() {
  const { state, spend } = useGame();
  return (
    <div className="circle">
      {members.map((m) => {
        const days = m.days + (state.sponsored[m.name] ?? 0);
        return (
          <div key={m.name} className="chair">
            <span className="face" aria-hidden="true">{m.face}</span>
            <span className="tagname">HELLO, I&apos;M<br />{m.name.toUpperCase()}</span>
            <span className="days"><b>{days}</b> {days === 1 ? "day" : "days"} without hallucinating</span>
            <button type="button" className="btn tiny" onClick={() => spend(SPONSOR_COST, { type: "sponsor", who: m.name })}>
              🕯️ Sponsor · {SPONSOR_COST} 🪙
            </button>
          </div>
        );
      })}
    </div>
  );
}
