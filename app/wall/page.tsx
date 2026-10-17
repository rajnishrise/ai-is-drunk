import type { Metadata } from "next";
import ShameWall from "@/components/ShameWall";

export const metadata: Metadata = { title: "Hall of Shame", description: "The worst AI takes of the night, pinned to the wall by the door." };

export default function Wall() {
  return (
    <main className="wrap page">
      <section className="hero small">
        <p className="eyebrow">By the door · Flash photography encouraged</p>
        <h1 className="room-sign">HALL OF <span className="flick">SHAME</span></h1>
        <p className="tag">Raise a glass for the takes you can&apos;t forget. Each toast earns XP. <b>Submissions open soon.</b></p>
      </section>
      <ShameWall />
    </main>
  );
}
