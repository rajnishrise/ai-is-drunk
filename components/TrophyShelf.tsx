"use client";

import { achievements, levelOf, levels, SECRET_COST, ACHIEVEMENT_XP } from "@/lib/game";
import { patrons } from "@/lib/patrons";
import DailySpecials from "./DailySpecials";
import { useGame } from "./GameProvider";

export default function TrophyShelf() {
  const { state, ready, spend } = useGame();
  const lv = levelOf(state.xp);
  const next = levels[lv.level];
  const got = achievements.filter((a) => state.unlocked[a.id]).length;
  const secret = patrons.find((p) => p.secret)!;
  const st = state.stats;

  const statRows: [string, number][] = [
    ["Questions asked", st.asks],
    ["Rounds bought", st.rounds],
    ["Patrons blacked out", st.blackouts],
    ["Arcade answers right", st.sodCorrect],
    ["Arcade high score", st.sodBestScore],
    ["Photos toasted", st.votes],
    ["Bots sponsored", st.sponsors],
    ["Daily specials served", st.questsDone],
  ];

  return (
    <>
      <section className="profile">
        <div className="badge-lv" aria-hidden="true">
          <span className="pixel">LV</span>
          <b>{ready ? lv.level : "–"}</b>
        </div>
        <div className="profile-main">
          <p className="eyebrow">Your rank</p>
          <h2 className="rank">{ready ? lv.rank : "Checking in…"}</h2>
          <div className="xpbar" role="progressbar" aria-valuemin={0} aria-valuemax={lv.span} aria-valuenow={lv.into} aria-label="XP to next level">
            <i style={{ width: `${Math.round(lv.progress * 100)}%` }} />
          </div>
          <p className="muted">
            {ready ? (lv.max ? `${state.xp} XP · Max level. The bar bows to you.` : `${state.xp} XP · ${next.xp - state.xp} XP to ${next.rank}`) : "…"}
          </p>
        </div>
        <div className="profile-stats">
          <div><b>🪙 {ready ? state.tokens : "–"}</b><span>Tokens</span></div>
          <div><b>🔥 {ready ? state.dayStreak : "–"}</b><span>Night streak</span></div>
          <div><b>🏆 {ready ? `${got}/${achievements.length}` : "–"}</b><span>Achievements</span></div>
        </div>
      </section>

      <div className="trophy-grid">
        <DailySpecials />
        <section className="panel vip">
          <p className="eyebrow">VIP Lounge</p>
          <h2 className="kicker">{state.secret ? `${secret.name} is in the house` : "A mysterious guest waits behind the rope"}</h2>
          <div className="vip-row">
            <span className="vip-face" aria-hidden="true">{state.secret ? secret.face : "🔒"}</span>
            <p className="muted">
              {state.secret
                ? `${secret.bio} Find them at the bar on the patron select screen.`
                : `A Legendary patron with confidence to spare. Unlock them for ${SECRET_COST} tokens and earn the VIP Access achievement.`}
            </p>
          </div>
          {!state.secret && (
            <button className="btn neon" type="button" disabled={!ready} onClick={() => spend(SECRET_COST, { type: "unlockSecret" })}>
              💎 Unlock for {SECRET_COST} 🪙
            </button>
          )}
        </section>
      </div>

      <section className="panel" aria-labelledby="ach-title">
        <div className="row spread">
          <h2 id="ach-title" className="kicker">Achievements</h2>
          <span className="muted">Each one is worth {ACHIEVEMENT_XP} XP and 10 🪙</span>
        </div>
        <div className="achievements">
          {achievements.map((a) => {
            const on = !!state.unlocked[a.id];
            const hidden = a.secret && !on;
            return (
              <div key={a.id} className={`ach${on ? " on" : ""}`}>
                <span className="ach-icon" aria-hidden="true">{hidden ? "❔" : a.icon}</span>
                <b>{hidden ? "Secret achievement" : a.name}</b>
                <span>{hidden ? "Keep exploring the tavern." : a.desc}</span>
                {on && <span className="ach-date">Unlocked {new Date(state.unlocked[a.id]).toLocaleDateString()}</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel" aria-labelledby="ladder-title">
        <h2 id="ladder-title" className="kicker">The rank ladder</h2>
        <ol className="ladder">
          {levels.map((l, i) => (
            <li key={l.rank} className={i + 1 === lv.level ? "here" : i + 1 < lv.level ? "past" : ""}>
              <span className="pixel">LV{i + 1}</span> <b>{l.rank}</b> <span className="muted">{l.xp} XP</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel" aria-labelledby="stats-title">
        <h2 id="stats-title" className="kicker">Your night in numbers</h2>
        <div className="numbers">
          {statRows.map(([k, v]) => (
            <div key={k}><b>{ready ? v : "–"}</b><span>{k}</span></div>
          ))}
        </div>
        <p className="note">Progress is saved in this browser only.</p>
      </section>
    </>
  );
}
