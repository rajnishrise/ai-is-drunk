import type { Metadata } from "next";
import DnnTv from "@/components/DnnTv";

export const metadata: Metadata = { title: "Drunk News Network", description: "Chad Chatterbox reads the news. Confidently. Incorrectly." };

export default function Tv() {
  return (
    <main className="wrap page">
      <section className="hero small">
        <p className="eyebrow">Above the bar · Volume stuck on 11</p>
        <h1 className="room-sign amber">DRUNK NEWS <span className="flick">NETWORK</span></h1>
        <p className="tag">Every story is made up, and the anchor has no idea. Flip through all eight channels for the Couch Potato achievement.</p>
      </section>
      <DnnTv />
    </main>
  );
}
