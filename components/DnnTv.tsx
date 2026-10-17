"use client";

import { useState } from "react";
import { segments, tickerItems } from "@/lib/content";
import { useGame } from "./GameProvider";

export default function DnnTv() {
  const { track } = useGame();
  const [i, setI] = useState(0);
  const [static_, setStatic] = useState(0);
  const s = segments[i % segments.length];

  function flip(dir: 1 | -1) {
    setI((n) => (n + dir + segments.length) % segments.length);
    setStatic((k) => k + 1);
    track({ type: "channel" });
  }

  return (
    <div className="tv-set">
      <div className="tv">
        <div className="tv-screen">
          {static_ > 0 && <span key={static_} className="tv-static" aria-hidden="true" />}
          <div className="tv-top">
            <span className="live">● LIVE-ISH</span>
            <span className="channel pixel">CH {String((i % segments.length) + 1).padStart(2, "0")}</span>
          </div>
          <div className="anchor-row">
            <span className="anchor" aria-hidden="true">🤖</span>
            <h2 className="headline" key={i}>{s.headline}</h2>
          </div>
          <p className="segment">{s.body}</p>
        </div>
        <div className="lower-third">
          <b>Chad Chatterbox</b> <span>DNN {s.desk} desk · BAC 0.19 and rising</span>
        </div>
        <div className="ticker" aria-label="News ticker">
          <div>{tickerItems.join("   ✦   ")}</div>
        </div>
      </div>
      <div className="tv-controls">
        <button className="knob" type="button" onClick={() => flip(-1)} aria-label="Previous channel">◀</button>
        <span className="lbl">Change the channel · +2 XP</span>
        <button className="knob" type="button" onClick={() => flip(1)} aria-label="Next channel">▶</button>
      </div>
    </div>
  );
}
