"use client";

import { useState } from "react";
import { segments, tickerItems } from "@/lib/content";

export default function DnnTv() {
  const [i, setI] = useState(0);
  const s = segments[i % segments.length];
  return (
    <div className="tv">
      <div className="tv-screen">
        <span className="live">● LIVE-ISH</span>
        <div className="anchor-row">
          <span className="anchor" aria-hidden="true">🤖</span>
          <h2 className="headline">{s.headline}</h2>
        </div>
        <p className="segment">{s.body}</p>
      </div>
      <div className="lower-third">
        Chad Chatterbox <span>DNN {s.desk} desk · BAC 0.19 and rising</span>
      </div>
      <div className="ticker" aria-label="News ticker">
        <div>{tickerItems.join("   ✦   ")}</div>
      </div>
      <div className="row" style={{ padding: 14, background: "#1b1429", justifyContent: "space-between" }}>
        <span className="lbl">Segment {(i % segments.length) + 1} of {segments.length}</span>
        <button className="btn" type="button" onClick={() => setI((n) => n + 1)}>Change the channel</button>
      </div>
    </div>
  );
}
