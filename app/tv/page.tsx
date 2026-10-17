import type { Metadata } from "next";
import DnnTv from "@/components/DnnTv";

export const metadata: Metadata = { title: "Drunk News Network", description: "Chad Chatterbox reads the news. Confidently. Incorrectly." };

export default function Tv() {
  return (
    <main className="wrap">
      <section className="hero">
        <h1 className="sign amber">DRUNK NEWS <span className="flick">NETWORK</span></h1>
        <p className="tag">The TV above the bar. Every story is made up, and the anchor has no idea.</p>
      </section>
      <DnnTv />
    </main>
  );
}
