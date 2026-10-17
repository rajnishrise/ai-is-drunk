// The tavern's game layer: XP, levels, tokens, achievements and daily quests.
// Pure functions only; components/GameProvider.tsx owns state and persistence.

export type GameEvent =
  | { type: "ask"; patron: string; hour: number }
  | { type: "round"; patron: string }
  | { type: "barRound" }
  | { type: "water" }
  | { type: "blackout"; patron: string }
  | { type: "visit"; room: string }
  | { type: "sod"; correct: boolean; streak: number }
  | { type: "sodGameOver"; score: number }
  | { type: "vote" }
  | { type: "channel" }
  | { type: "share" }
  | { type: "sponsor"; who: string }
  | { type: "unlockSecret" }
  | { type: "hic" };

export type Stats = {
  asks: number;
  rounds: number;
  waters: number;
  blackouts: number;
  sodCorrect: number;
  sodBestStreak: number;
  sodBestScore: number;
  votes: number;
  channels: number;
  shares: number;
  sponsors: number;
  questsDone: number;
  nightAsks: number;
  hics: number;
};

export type GameState = {
  v: 1;
  xp: number;
  tokens: number;
  stats: Stats;
  rooms: string[];
  unlocked: Record<string, number>;
  lastDay: string;
  dayStreak: number;
  quests: { day: string; ids: string[]; progress: Record<string, number>; done: string[] };
  secret: boolean;
  sponsored: Record<string, number>;
};

const emptyStats: Stats = {
  asks: 0, rounds: 0, waters: 0, blackouts: 0, sodCorrect: 0, sodBestStreak: 0, sodBestScore: 0,
  votes: 0, channels: 0, shares: 0, sponsors: 0, questsDone: 0, nightAsks: 0, hics: 0,
};

export function newGame(): GameState {
  return {
    v: 1, xp: 0, tokens: 20, stats: { ...emptyStats }, rooms: [], unlocked: {},
    lastDay: "", dayStreak: 0, quests: { day: "", ids: [], progress: {}, done: [] },
    secret: false, sponsored: {},
  };
}

// Fills in fields added after a player's save was written.
export function hydrate(raw: unknown): GameState {
  const base = newGame();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<GameState>;
  return { ...base, ...r, stats: { ...emptyStats, ...(r.stats ?? {}) }, quests: { ...base.quests, ...(r.quests ?? {}) } };
}

/* Levels */

export const levels = [
  { xp: 0, rank: "Designated Driver" },
  { xp: 100, rank: "First-Timer" },
  { xp: 250, rank: "Tipsy Tourist" },
  { xp: 450, rank: "Regular" },
  { xp: 700, rank: "Barfly" },
  { xp: 1000, rank: "Tab Runner" },
  { xp: 1400, rank: "Last-Call Legend" },
  { xp: 1900, rank: "Tavern Royalty" },
  { xp: 2500, rank: "Myth of the Bar" },
  { xp: 3200, rank: "Blackout Deity" },
];

export function levelOf(xp: number) {
  let i = 0;
  while (i + 1 < levels.length && xp >= levels[i + 1].xp) i++;
  const cur = levels[i];
  const next = levels[i + 1];
  const into = xp - cur.xp;
  const span = next ? next.xp - cur.xp : 1;
  return { level: i + 1, rank: cur.rank, into, span, progress: next ? into / span : 1, max: !next };
}

/* Achievements */

export type Achievement = { id: string; name: string; desc: string; icon: string; secret?: boolean; check: (s: GameState) => boolean };

export const ALL_ROOMS = ["/", "/games", "/tv", "/wall", "/basement", "/trophies"];

export const achievements: Achievement[] = [
  { id: "first-round", icon: "🍺", name: "First Round's On You", desc: "Buy a patron a drink.", check: (s) => s.stats.rounds >= 1 },
  { id: "chatterbox", icon: "💬", name: "Chatterbox", desc: "Ask 25 questions at the bar.", check: (s) => s.stats.asks >= 25 },
  { id: "blackout", icon: "🌀", name: "Blackout Bingo", desc: "Push any patron to a BAC of 0.30.", check: (s) => s.stats.blackouts >= 1 },
  { id: "hydration", icon: "💧", name: "Hydration Hero", desc: "Hand out 5 glasses of water.", check: (s) => s.stats.waters >= 5 },
  { id: "hopper", icon: "🚪", name: "Bar Hopper", desc: "Visit every room in the tavern.", check: (s) => ALL_ROOMS.every((r) => s.rooms.includes(r)) },
  { id: "lie-detector", icon: "🕵️", name: "Lie Detector", desc: "Hit a 5-answer streak in Sober or Drunk.", check: (s) => s.stats.sodBestStreak >= 5 },
  { id: "stone-cold", icon: "🧊", name: "Stone-Cold Sober", desc: "Get 25 answers right in the arcade.", check: (s) => s.stats.sodCorrect >= 25 },
  { id: "high-score", icon: "🕹️", name: "High Roller", desc: "Score 500 points in a single arcade run.", check: (s) => s.stats.sodBestScore >= 500 },
  { id: "critic", icon: "📸", name: "Wall Critic", desc: "Raise a glass to 5 photos on the wall.", check: (s) => s.stats.votes >= 5 },
  { id: "couch", icon: "📺", name: "Couch Potato", desc: "Flip through 8 channels of DNN.", check: (s) => s.stats.channels >= 8 },
  { id: "influencer", icon: "📣", name: "Spread the Word", desc: "Share your bar tab.", check: (s) => s.stats.shares >= 1 },
  { id: "samaritan", icon: "🕯️", name: "Good Samaritan", desc: "Sponsor 3 bots in the basement.", check: (s) => s.stats.sponsors >= 3 },
  { id: "regular", icon: "📅", name: "Regular", desc: "Come back 3 nights in a row.", check: (s) => s.dayStreak >= 3 },
  { id: "questor", icon: "📜", name: "Daily Specialist", desc: "Finish 3 daily specials.", check: (s) => s.stats.questsDone >= 3 },
  { id: "vip", icon: "💎", name: "VIP Access", desc: "Unlock the secret patron.", check: (s) => s.secret },
  { id: "night-owl", icon: "🦉", name: "Night Owl", desc: "Ask a question between midnight and 4am.", secret: true, check: (s) => s.stats.nightAsks >= 1 },
  { id: "hiccup", icon: "🫧", name: "Hiccup", desc: "Type the magic word anywhere in the tavern.", secret: true, check: (s) => s.stats.hics >= 1 },
];

export const ACHIEVEMENT_XP = 50;
export const ACHIEVEMENT_TOKENS = 10;

/* Daily specials (quests) */

export type Quest = {
  id: string;
  text: string;
  target: number;
  reward: number;
  // How much an event advances this quest; 0 means it doesn't.
  measure: (e: GameEvent) => number;
  mode?: "sum" | "max";
};

export const questPool: Quest[] = [
  { id: "ask5", text: "Ask 5 questions at the bar", target: 5, reward: 15, measure: (e) => (e.type === "ask" ? 1 : 0) },
  { id: "karen3", text: "Ask Karen GPT 3 questions", target: 3, reward: 20, measure: (e) => (e.type === "ask" && e.patron === "karen" ? 1 : 0) },
  { id: "round3", text: "Buy 3 rounds", target: 3, reward: 15, measure: (e) => (e.type === "round" ? 1 : 0) },
  { id: "blackout1", text: "Get a patron to Blackout", target: 1, reward: 25, measure: (e) => (e.type === "blackout" ? 1 : 0) },
  { id: "sod5", text: "Get 5 right in Sober or Drunk", target: 5, reward: 20, measure: (e) => (e.type === "sod" && e.correct ? 1 : 0) },
  { id: "streak3", text: "Hit a 3-answer streak in the arcade", target: 3, reward: 25, mode: "max", measure: (e) => (e.type === "sod" ? e.streak : 0) },
  { id: "vote3", text: "Raise a glass to 3 photos", target: 3, reward: 15, measure: (e) => (e.type === "vote" ? 1 : 0) },
  { id: "tv4", text: "Flip through 4 DNN channels", target: 4, reward: 15, measure: (e) => (e.type === "channel" ? 1 : 0) },
  { id: "water2", text: "Hand out 2 glasses of water", target: 2, reward: 15, measure: (e) => (e.type === "water" ? 1 : 0) },
  { id: "share1", text: "Share your bar tab", target: 1, reward: 20, measure: (e) => (e.type === "share" ? 1 : 0) },
  { id: "sponsor1", text: "Sponsor a bot in the basement", target: 1, reward: 15, measure: (e) => (e.type === "sponsor" ? 1 : 0) },
];

export const QUEST_XP = 40;

export function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Three distinct quests per calendar day, the same for every player.
export function questsFor(day: string): string[] {
  const ids: string[] = [];
  let seed = hash(day);
  while (ids.length < 3) {
    const q = questPool[seed % questPool.length];
    if (!ids.includes(q.id)) ids.push(q.id);
    seed = hash(String(seed));
  }
  return ids;
}

/* Applying things that happen */

export type Gains = {
  xp: number;
  tokens: number;
  achievements: Achievement[];
  quests: Quest[];
  levelUp: number | null;
  checkIn: number | null; // the new night streak, when this is the first visit of the day
};

const XP: Record<GameEvent["type"], number> = {
  ask: 5, round: 3, barRound: 5, water: 2, blackout: 15, visit: 0, sod: 0, sodGameOver: 0,
  vote: 3, channel: 2, share: 15, sponsor: 5, unlockSecret: 25, hic: 10,
};

function settle(before: GameState, s: GameState, g: Gains): Gains {
  for (const a of achievements) {
    if (!s.unlocked[a.id] && a.check(s)) {
      s.unlocked[a.id] = Date.now();
      s.xp += ACHIEVEMENT_XP;
      s.tokens += ACHIEVEMENT_TOKENS;
      g.xp += ACHIEVEMENT_XP;
      g.tokens += ACHIEVEMENT_TOKENS;
      g.achievements.push(a);
    }
  }
  const a = levelOf(before.xp).level;
  const b = levelOf(s.xp).level;
  if (b > a) g.levelUp = b;
  return g;
}

function clone(s: GameState): GameState {
  return {
    ...s, stats: { ...s.stats }, rooms: [...s.rooms], unlocked: { ...s.unlocked },
    quests: { ...s.quests, ids: [...s.quests.ids], progress: { ...s.quests.progress }, done: [...s.quests.done] },
    sponsored: { ...s.sponsored },
  };
}

// Rolls the night over: streak, check-in bonus and a fresh set of daily specials.
export function checkIn(prev: GameState, now = new Date()): { state: GameState; gains: Gains } {
  const s = clone(prev);
  const g: Gains = { xp: 0, tokens: 0, achievements: [], quests: [], levelUp: null, checkIn: null };
  const today = dayKey(now);
  if (s.lastDay !== today) {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    s.dayStreak = s.lastDay === dayKey(y) ? s.dayStreak + 1 : 1;
    s.lastDay = today;
    const bonus = 10 + Math.min(s.dayStreak - 1, 5) * 5;
    s.tokens += bonus;
    g.tokens += bonus;
    g.checkIn = s.dayStreak;
  }
  if (s.quests.day !== today) s.quests = { day: today, ids: questsFor(today), progress: {}, done: [] };
  return { state: s, gains: settle(prev, s, g) };
}

export function applyEvent(prev: GameState, e: GameEvent): { state: GameState; gains: Gains } {
  const s = clone(prev);
  const g: Gains = { xp: XP[e.type], tokens: 0, achievements: [], quests: [], levelUp: null, checkIn: null };
  const st = s.stats;

  switch (e.type) {
    case "ask":
      st.asks++;
      if (e.hour < 4) st.nightAsks++;
      break;
    case "round": st.rounds++; break;
    case "barRound": st.rounds++; break;
    case "water": st.waters++; break;
    case "blackout": st.blackouts++; break;
    case "visit":
      if (!s.rooms.includes(e.room)) {
        s.rooms.push(e.room);
        g.xp += 20;
      }
      break;
    case "sod":
      if (e.correct) {
        st.sodCorrect++;
        g.xp += 8 + Math.min(e.streak, 5) * 2;
      }
      st.sodBestStreak = Math.max(st.sodBestStreak, e.streak);
      break;
    case "sodGameOver":
      st.sodBestScore = Math.max(st.sodBestScore, e.score);
      g.tokens += Math.floor(e.score / 100);
      break;
    case "vote": st.votes++; break;
    case "channel": st.channels++; break;
    case "share": st.shares++; break;
    case "sponsor":
      st.sponsors++;
      s.sponsored[e.who] = (s.sponsored[e.who] ?? 0) + 1;
      break;
    case "unlockSecret": s.secret = true; break;
    case "hic": st.hics++; break;
  }

  for (const id of s.quests.ids) {
    if (s.quests.done.includes(id)) continue;
    const q = questPool.find((x) => x.id === id);
    if (!q) continue;
    const m = q.measure(e);
    if (!m) continue;
    const cur = s.quests.progress[id] ?? 0;
    s.quests.progress[id] = q.mode === "max" ? Math.max(cur, m) : cur + m;
    if (s.quests.progress[id] >= q.target) {
      s.quests.done.push(id);
      st.questsDone++;
      g.xp += QUEST_XP;
      g.tokens += q.reward;
      g.quests.push(q);
    }
  }

  s.xp += g.xp;
  s.tokens += g.tokens;
  return { state: s, gains: settle(prev, s, g) };
}

export const SECRET_COST = 60;
export const BAR_ROUND_COST = 10;
export const SPONSOR_COST = 5;
