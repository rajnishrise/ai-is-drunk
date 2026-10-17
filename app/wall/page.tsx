import type { Metadata } from "next";
import ShameWall from "@/components/ShameWall";

export const metadata: Metadata = { title: "Hall of Shame", description: "The worst AI takes of the night, pinned to the wall by the door." };

export default function Wall() {
  return (
    <main className="wrap">
      <section className="hero">
        <h1 className="sign">HALL OF <span className="flick">SHAME</span></h1>
        <p className="tag">The photo wall by the door. Raise a glass for the takes you can&apos;t forget. <b>Submissions open soon.</b></p>
      </section>
      <ShameWall />
    </main>
  );
}
