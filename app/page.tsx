import Link from "next/link";
import BarCounter from "@/components/BarCounter";
import { rooms } from "@/lib/rooms";

export default function Home() {
  return (
    <main className="wrap">
      <section className="hero">
        <h1 className="sign">AI IS <span className="flick">DRUNK</span></h1>
        <p className="tag">
          Welcome to <b>The Tipsy Tavern</b>. Pick a patron, buy it a round, and ask it anything. The more it drinks, the more sure it gets.
        </p>
      </section>

      <BarCounter />

      <section aria-labelledby="rooms-title" style={{ display: "grid", gap: 14 }}>
        <h2 id="rooms-title" className="section-title">Other rooms in the tavern</h2>
        <div className="doors">
          {rooms.slice(1).map((r) => (
            <Link key={r.href} href={r.href} className="door">
              <span className="where">{r.where}</span>
              <h3>{r.name}</h3>
              <p>{r.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
