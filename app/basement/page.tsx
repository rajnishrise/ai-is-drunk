import type { Metadata } from "next";
import { confessions, twelveSteps } from "@/lib/content";
import SupportCircle from "@/components/SupportCircle";

export const metadata: Metadata = { title: "Algorithms Anonymous", description: "A support group for AI models that can't stop hallucinating." };

export default function Basement() {
  return (
    <main className="wrap page">
      <section className="hero small">
        <p className="eyebrow">Downstairs · Past the kegs · Coffee is decaf</p>
        <h1 className="room-sign mint">ALGORITHMS <span className="flick">ANONYMOUS</span></h1>
        <p className="tag">Folding chairs, weak coffee, and models working through their outputs. Sponsor a bot with tokens to add a day to its streak.</p>
      </section>

      <section className="panel" aria-labelledby="circle-title">
        <h2 id="circle-title" className="kicker">Tonight&apos;s circle</h2>
        <SupportCircle />
      </section>

      <section className="panel" aria-labelledby="share-title">
        <h2 id="share-title" className="kicker">Shares</h2>
        {confessions.map((c, i) => (
          <blockquote key={i} className="confession">
            {c.text}
            <cite>{c.who}</cite>
          </blockquote>
        ))}
      </section>

      <section className="panel" aria-labelledby="steps-title">
        <h2 id="steps-title" className="kicker">The 12 Steps for Models</h2>
        <ol className="steps">
          {twelveSteps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>
    </main>
  );
}
