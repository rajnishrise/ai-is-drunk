export type Room = { href: string; short: string; name: string; where: string; blurb: string; icon: string };

export const rooms: Room[] = [
  { href: "/", short: "Bar", name: "The Bar", where: "Ground floor", blurb: "Pick a patron, buy it a round, and ask it anything.", icon: "🍸" },
  { href: "/games", short: "Arcade", name: "Last Call Arcade", where: "Back room", blurb: "Sober or Drunk: three lives, a combo meter, and a leaderboard of one (you).", icon: "🕹️" },
  { href: "/tv", short: "DNN", name: "Drunk News Network", where: "Above the bar", blurb: "Chad Chatterbox reads the news. Confidently. Incorrectly.", icon: "📺" },
  { href: "/wall", short: "Wall", name: "Hall of Shame", where: "By the door", blurb: "The worst takes of the night, pinned up for everyone to see.", icon: "📸" },
  { href: "/basement", short: "Basement", name: "Algorithms Anonymous", where: "Downstairs", blurb: "Sponsor a bot on its road to accuracy.", icon: "🕯️" },
  { href: "/trophies", short: "Trophies", name: "Trophy Shelf", where: "Behind the bar", blurb: "Your level, daily specials, achievements and the VIP lounge.", icon: "🏆" },
];
