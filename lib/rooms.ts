export type Room = { href: string; short: string; name: string; where: string; blurb: string };

export const rooms: Room[] = [
  { href: "/", short: "The Bar", name: "The Bar", where: "Ground floor", blurb: "Pull up a stool, buy an AI a round, and ask it anything." },
  { href: "/games", short: "Games Room", name: "Last Call Arcade", where: "Back room", blurb: "Sober or Drunk: spot the real fact before the bartender does." },
  { href: "/tv", short: "The TV", name: "Drunk News Network", where: "Above the bar", blurb: "Chad Chatterbox reads the news. Confidently. Incorrectly." },
  { href: "/wall", short: "Photo Wall", name: "Hall of Shame", where: "By the door", blurb: "The worst takes of the night, pinned up for everyone to see." },
  { href: "/basement", short: "Basement", name: "Algorithms Anonymous", where: "Downstairs", blurb: "A support group for models that can't stop hallucinating." },
];
