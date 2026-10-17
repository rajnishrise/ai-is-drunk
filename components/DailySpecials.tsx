"use client";

import { questPool, QUEST_XP } from "@/lib/game";
import { useGame } from "./GameProvider";

export default function DailySpecials({ compact = false }: { compact?: boolean }) {
  const { state, ready } = useGame();
  const qs = state.quests.ids.map((id) => questPool.find((q) => q.id === id)!).filter(Boolean);
  const doneCount = state.quests.done.length;

  return (
    <section className={`chalkboard${compact ? " compact" : ""}`} aria-labelledby="specials-title">
      <div className="chalk-head">
        <h2 id="specials-title">Today&apos;s Specials</h2>
        <span className="chalk-count">{ready ? `${doneCount}/3 served` : "…"}</span>
      </div>
      {!ready ? (
        <p className="chalk-empty">Writing on the board…</p>
      ) : (
        <ul className="specials">
          {qs.map((q) => {
            const p = Math.min(q.target, state.quests.progress[q.id] ?? 0);
            const done = state.quests.done.includes(q.id);
            return (
              <li key={q.id} className={done ? "done" : ""}>
                <span className="special-text">{q.text}</span>
                <span className="special-meta">
                  <span className="special-bar"><i style={{ width: `${(p / q.target) * 100}%` }} /></span>
                  <span>{done ? "Served ✓" : `${p}/${q.target}`}</span>
                  <span className="special-reward">+{q.reward} 🪙 +{QUEST_XP} XP</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="chalk-foot">New specials every night at midnight. Come back tomorrow to grow your streak{ready && state.dayStreak > 1 ? ` (currently ${state.dayStreak} nights)` : ""}.</p>
    </section>
  );
}
