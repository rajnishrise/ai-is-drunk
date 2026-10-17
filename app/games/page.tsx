import type { Metadata } from "next";
import SoberOrDrunk from "@/components/SoberOrDrunk";

export const metadata: Metadata = { title: "Last Call Arcade", description: "Sober or Drunk: spot the real fact before the AI convinces you otherwise." };

export default function Games() {
  return (
    <main className="wrap page">
      <section className="hero small">
        <p className="eyebrow">Back room · Coins not accepted</p>
        <h1 className="room-sign cyan">LAST CALL <span className="flick">ARCADE</span></h1>
        <p className="tag">Ten seconds per round. Pick the fact a <b>sober</b> person would say. Every right answer earns XP, and every 100 points earns a token.</p>
      </section>
      <SoberOrDrunk />
      <section className="panel coming">
        <h2 className="kicker">Coming soon to the back room</h2>
        <div className="grid-2">
          <div><b>The Daily Hangover</b><p className="muted">One hallucinated fact a day. Six guesses. Share your grid.</p></div>
          <div><b>Walk the Line</b><p className="muted">Every wrong answer makes the robot sway harder. Don&apos;t fall off.</p></div>
        </div>
      </section>
    </main>
  );
}
