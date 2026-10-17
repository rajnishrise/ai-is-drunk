"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { applyEvent, checkIn, hydrate, newGame, type GameEvent, type GameState, type Gains } from "@/lib/game";

const KEY = "aiisdrunk-player-v1";

export type Toast = { id: number; kind: "achievement" | "quest" | "level" | "checkin" | "info"; icon: string; title: string; body: string };

type Ctx = {
  state: GameState;
  ready: boolean;
  track: (e: GameEvent) => void;
  spend: (amount: number, then?: GameEvent) => boolean;
  lastGain: { xp: number; tokens: number; key: number } | null;
  toasts: Toast[];
  dismiss: (id: number) => void;
};

const GameContext = createContext<Ctx | null>(null);

export function useGame(): Ctx {
  const c = useContext(GameContext);
  if (!c) throw new Error("useGame must be used inside GameProvider");
  return c;
}

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(newGame);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastGain, setLastGain] = useState<Ctx["lastGain"]>(null);
  const ref = useRef<GameState>(state);
  const toastId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const announce = useCallback((g: Gains) => {
    const add: Toast[] = [];
    if (g.checkIn) add.push({ id: toastId.current++, kind: "checkin", icon: "🌙", title: g.checkIn > 1 ? `Night ${g.checkIn} in a row` : "Welcome to the Tavern", body: `Cover charge refunded: +${g.tokens - g.achievements.length * 10} tokens` });
    for (const q of g.quests) add.push({ id: toastId.current++, kind: "quest", icon: "📜", title: "Daily special complete", body: `${q.text} · +${q.reward} tokens` });
    for (const a of g.achievements) add.push({ id: toastId.current++, kind: "achievement", icon: a.icon, title: `Achievement unlocked: ${a.name}`, body: a.desc });
    if (g.levelUp) add.push({ id: toastId.current++, kind: "level", icon: "⬆️", title: `Level ${g.levelUp}!`, body: "New rank at the bar. Check the Trophy Shelf." });
    if (add.length) {
      setToasts((t) => [...t, ...add].slice(-4));
      for (const x of add) setTimeout(() => dismiss(x.id), 5200);
    }
    if (g.xp || g.tokens) setLastGain({ xp: g.xp, tokens: g.tokens, key: Date.now() + Math.random() });
  }, [dismiss]);

  const commit = useCallback((next: GameState, g: Gains) => {
    ref.current = next;
    setState(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    announce(g);
  }, [announce]);

  useEffect(() => {
    let saved: GameState = newGame();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) saved = hydrate(JSON.parse(raw));
    } catch {}
    const r = checkIn(saved);
    commit(r.state, r.gains);
    setReady(true);
  }, [commit]);

  const track = useCallback((e: GameEvent) => {
    const r = applyEvent(ref.current, e);
    commit(r.state, r.gains);
  }, [commit]);

  const spend = useCallback((amount: number, then?: GameEvent) => {
    if (ref.current.tokens < amount) {
      setToasts((t) => [...t, { id: toastId.current++, kind: "info" as const, icon: "🪙", title: "Not enough tokens", body: "Finish daily specials or unlock achievements to earn more." }].slice(-4));
      return false;
    }
    const paid = { ...ref.current, tokens: ref.current.tokens - amount };
    if (then) {
      const r = applyEvent(paid, then);
      commit(r.state, r.gains);
    } else {
      commit(paid, { xp: 0, tokens: 0, achievements: [], quests: [], levelUp: null, checkIn: null });
    }
    return true;
  }, [commit]);

  // Easter egg: typing "hic" anywhere outside a text field.
  useEffect(() => {
    let buf = "";
    const onKey = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      buf = (buf + ev.key.toLowerCase()).slice(-3);
      if (buf === "hic") track({ type: "hic" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [track]);

  return (
    <GameContext.Provider value={{ state, ready, track, spend, lastGain, toasts, dismiss }}>
      {children}
    </GameContext.Provider>
  );
}
