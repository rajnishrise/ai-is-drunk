import Link from "next/link";
import BarCounter from "@/components/BarCounter";
import DailySpecials from "@/components/DailySpecials";
import { rooms } from "@/lib/rooms";

export default function Home() {
  return (
    <main className="wrap page">
      <section className="hero">
        <p className="eyebrow">Open 24/7 · No fact checks · Est. 2026</p>
        <h1 className="neon-sign" aria-label="AI is Drunk">
          <span className="ns-ai">AI</span>
          <span className="ns-is">is</span>
          <span className="ns-drunk">DR<span className="flick">U</span>NK</span>
        </h1>
        <p className="tag">
          Welcome to <b>The Tipsy Tavern</b>. Pick a patron, buy it a round, and ask it anything. The more it drinks, the more sure it gets. Earn XP, finish the daily specials, and climb from Designated Driver to Blackout Deity.
        </p>
      </section>

      <BarCounter />

      <DailySpecials compact />

      <section aria-labelledby="rooms-title" className="rooms-section">
        <h2 id="rooms-title" className="kicker">Explore the tavern</h2>
        <div className="doors">
          {rooms.slice(1).map((r, i) => (
            <Link key={r.href} href={r.href} className={`door door-${i}`}>
              <span className="door-icon" aria-hidden="true">{r.icon}</span>
              <span className="where">{r.where}</span>
              <h3>{r.name}</h3>
              <p>{r.blurb}</p>
              <span className="door-cta">Enter →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
