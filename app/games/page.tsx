import type { Metadata } from "next";
import SoberOrDrunk from "@/components/SoberOrDrunk";

export const metadata: Metadata = { title: "Last Call Arcade", description: "Sober or Drunk: spot the real fact before the AI convinces you otherwise." };

export default function Games() {
  return (
    <main className="wrap">
      <section className="hero">
        <h1 className="sign mint">LAST CALL <span className="flick">ARCADE</span></h1>
        <p className="tag">The back room. Ten seconds per round. Pick the fact a <b>sober</b> person would say.</p>
      </section>
      <SoberOrDrunk />
      <section className="panel">
        <h2 className="section-title">Coming soon to the back room</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          The Daily Hangover, a once-a-day puzzle you can share with friends, and Walk the Line, where every wrong answer makes the robot sway harder.
        </p>
      </section>
    </main>
  );
}
