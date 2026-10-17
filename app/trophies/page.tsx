import type { Metadata } from "next";
import TrophyShelf from "@/components/TrophyShelf";

export const metadata: Metadata = { title: "Trophy Shelf", description: "Your level, daily specials, achievements and the VIP lounge." };

export default function Trophies() {
  return (
    <main className="wrap page">
      <section className="hero small">
        <p className="eyebrow">Behind the bar · Polished nightly</p>
        <h1 className="room-sign violet">TROPHY <span className="flick">SHELF</span></h1>
        <p className="tag">Everything you&apos;ve earned at the Tavern. Daily specials reset at midnight.</p>
      </section>
      <TrophyShelf />
    </main>
  );
}
