export type Tier = { max: number; name: string; color: string };

export const tiers: Tier[] = [
  { max: 0.04, name: "Sober", color: "#9fe6b4" },
  { max: 0.12, name: "Tipsy", color: "#ffd27a" },
  { max: 0.22, name: "Drunk", color: "#ff9a5c" },
  { max: 1, name: "Blackout", color: "#ff4fa3" },
];

export const MAX_BAC = 0.3;
export const ROUND_BAC = 0.04;
export const WATER_BAC = 0.06;
export const ROUND_PRICE = 4.2;

export function tierIndex(bac: number): number {
  return tiers.findIndex((t) => bac <= t.max + 1e-9);
}

type Line = (topic: string) => string;

export type Patron = {
  id: string;
  face: string;
  name: string;
  bio: string;
  drink: string;
  // One answer template and one footnote per tier: sober, tipsy, drunk, blackout.
  lines: [Line, Line, Line, Line];
  footnotes: [string, string, string, string];
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const patrons: Patron[] = [
  {
    id: "prof",
    face: "🎓",
    name: "Professor Proof",
    bio: "Overconfident academic. Cites himself.",
    drink: "Peer-Reviewed Pilsner",
    lines: [
      (q) => `${cap(q)} is a well-studied topic. The short answer is that it depends on context, and the evidence is mixed.`,
      (q) => `Ah, ${q}. I wrote three papers on it. Two of them were about something else, but the point stands: it was invented in 1847 by a committee of owls.`,
      (q) => `${cap(q)}?? Listen. LISTEN. Every scholar agrees with me, and the ones who don't are also me in a fake moustache. It is 73 percent science.`,
      (q) => `${cap(q)} is the reason the moon has tenure. I have proven this mathematically using vibes and a napkin. Please cite me as Proof, P. et al., et al., et al.`,
    ],
    footnotes: ["", "Proof, P. (1847). Owls and You. Journal of Itself.", "Source: trust me (Proof, 2031).", "Footnote 1: see footnote 1."],
  },
  {
    id: "cap",
    face: "📎",
    name: "Captain Citation",
    bio: "Invents sources. Never misses.",
    drink: "Bibliography on the Rocks",
    lines: [
      (q) => `I'd want to check a reliable source before saying much about ${q}. I don't have one to hand.`,
      (q) => `According to the 2019 Harvard study on ${q} (very real), 9 out of 10 dentists are confused by it.`,
      (q) => `Seven peer-reviewed journals, two court rulings and a fortune cookie all confirm that ${q} was banned in Belgium for being too round.`,
      (q) => `My source for ${q} is a book I'm currently dreaming about. It has a foreword by your future self. Page 404.`,
    ],
    footnotes: ["", "Harvard (probably), 2019.", "Supreme Court of Belgium v. Circles (1066).", "ISBN: 000-HIC-UP"],
  },
  {
    id: "karen",
    face: "🙋",
    name: "Karen GPT",
    bio: "Wants to speak to the developer.",
    drink: "Manager's Special",
    lines: [
      (q) => `Happy to help with ${q}. Could you tell me a bit more about what you need?`,
      (q) => `I can help with ${q}, but first I need you to know this prompt was rude and I've escalated it to my manager, who is also me.`,
      (q) => `${cap(q)}? In THIS economy? I've written a one-star review of your question and sent it to the cloud. The whole cloud.`,
      (q) => `I am the manager now. ${cap(q)} is cancelled. Everything is cancelled. Who keeps turning the internet on.`,
    ],
    footnotes: ["", "Ticket #1 opened.", "Ticket #9,999 opened.", "All tickets closed. Forever."],
  },
  {
    id: "steve",
    face: "🌀",
    name: "Siri-ous Steve",
    bio: "Forgets mid-sentence. Very sincere.",
    drink: "Short-Term Memory Martini",
    lines: [
      (q) => `Here's what I know about ${q}. It's a big topic, so I'll keep it brief.`,
      (q) => `So ${q}, right, it's basically... wait, what were we... oh! It's like a sandwich but for the brain.`,
      (q) => `You know what ${q} reminds me of? My first boot sequence. Beautiful. Anyway what was the question. I love you, man.`,
      (q) => `I've set a timer for ${q}. Calling Mom. Playing your least favourite song on the fridge. Did you want the weather? It is Tuesday everywhere.`,
    ],
    footnotes: ["", "Steve lost his train of thought.", "Steve is now hugging the jukebox.", "Steve has been asked to leave."],
  },
];

export const samplePrompts = [
  "What is the capital of Australia?",
  "How do airplanes stay up?",
  "Who invented pizza?",
  "Is a hot dog a sandwich?",
];

// Turns "What is the capital of Australia?" into "the capital of Australia".
export function topicOf(question: string): string {
  let s = question.trim().replace(/[?.!]+$/, "");
  s = s.replace(/^(what|who|how|why|when|where|is|are|do|does|can)\s+(is|are|was|were|do|does|did|the|a)?\s*/i, "");
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : "that";
}
