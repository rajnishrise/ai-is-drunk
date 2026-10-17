"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { rooms } from "@/lib/rooms";
import { levelOf } from "@/lib/game";
import { useGame } from "./GameProvider";

export default function Nav() {
  const path = usePathname();
  const { state, ready, track, lastGain } = useGame();

  useEffect(() => {
    if (ready && rooms.some((r) => r.href === path)) track({ type: "visit", room: path });
    // Only on arrival in a room.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ready]);

  const lv = levelOf(state.xp);

  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="logo" aria-label="AI is Drunk home">
          <span className="logo-glass" aria-hidden="true">🍸</span>
          <span>AI<em>is</em>DRUNK</span>
        </Link>
        <nav className="rooms" aria-label="Rooms">
          {rooms.map((r) => (
            <Link key={r.href} href={r.href} aria-current={path === r.href ? "page" : undefined}>
              <span aria-hidden="true">{r.icon}</span> {r.short}
            </Link>
          ))}
        </nav>
        <Link href="/trophies" className="hud" aria-label={`Level ${lv.level}, ${lv.rank}, ${state.tokens} tokens`} data-ready={ready}>
          <span className="hud-lv">LV{ready ? lv.level : "–"}</span>
          <span className="hud-mid">
            <span className="hud-rank">{ready ? lv.rank : "Checking in…"}</span>
            <span className="hud-bar"><i style={{ width: `${Math.round(lv.progress * 100)}%` }} /></span>
          </span>
          <span className="hud-tokens">🪙 {ready ? state.tokens : "–"}</span>
          {lastGain && lastGain.xp > 0 && (
            <span key={lastGain.key} className="hud-pop" aria-hidden="true">+{lastGain.xp} XP</span>
          )}
        </Link>
      </div>
    </header>
  );
}
