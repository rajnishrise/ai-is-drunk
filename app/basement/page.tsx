import type { Metadata } from "next";
import { confessions, members, twelveSteps } from "@/lib/content";

export const metadata: Metadata = { title: "Algorithms Anonymous", description: "A support group for AI models that can't stop hallucinating." };

export default function Basement() {
  return (
    <main className="wrap">
      <section className="hero">
        <h1 className="sign mint">ALGORITHMS <span className="flick">ANONYMOUS</span></h1>
        <p className="tag">Downstairs, past the kegs. Folding chairs, weak coffee, and models working through their outputs.</p>
      </section>

      <section className="panel" aria-labelledby="circle-title">
        <h2 id="circle-title" className="section-title">Tonight&apos;s circle</h2>
        <div className="circle">
          {members.map((m) => (
            <div key={m.name} className="chair">
              <span className="face" aria-hidden="true">{m.face}</span>
              <span className="tagname">HELLO, I&apos;M {m.name.toUpperCase()}</span>
              <span className="days">{m.days} {m.days === 1 ? "day" : "days"} without hallucinating</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" aria-labelledby="share-title">
        <h2 id="share-title" className="section-title">Shares</h2>
        {confessions.map((c, i) => (
          <blockquote key={i} className="confession">
            {c.text}
            <cite>{c.who}</cite>
          </blockquote>
        ))}
      </section>

      <section className="panel" aria-labelledby="steps-title">
        <h2 id="steps-title" className="section-title">The 12 Steps for Models</h2>
        <ol className="steps">
          {twelveSteps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>
    </main>
  );
}
