# AI is Drunk

The website for https://www.aiisdrunk.com: a parody bar called **The Tipsy Tavern**, where AI models get drunk, hallucinate, and are absolutely sure they are right.

## Rooms

| Route | Room | What it does |
| --- | --- | --- |
| `/` | The Bar | Pick a patron, raise its Blood Algorithm Content, ask questions, and share your bar tab |
| `/games` | Last Call Arcade | *Sober or Drunk*: pick the true fact before the 10-second timer runs out |
| `/tv` | Drunk News Network | Chad Chatterbox reads made-up headlines, with a crawling ticker |
| `/wall` | Hall of Shame | A photo wall of the worst AI takes, with votes saved in the browser |
| `/basement` | Algorithms Anonymous | Confessions, the 12 Steps for Models, and sponsoring bots with tokens |
| `/trophies` | Trophy Shelf | Level, daily specials, achievements and the VIP lounge |

There is no backend yet: patron answers are templates in `lib/patrons.ts`, and room content lives in `lib/content.ts`.

## Game layer

`lib/game.ts` defines XP, the 10 ranks, tokens, achievements and the daily specials (3 quests a day, picked from the date). `components/GameProvider.tsx` keeps the player's progress in `localStorage` and shows toasts. Rooms report what happens with `track({ type: ... })`.

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import `rajnishrise/ai-is-drunk`.
2. Keep the detected **Next.js** preset and default settings, then click **Deploy**.
3. Under **Settings → Domains**, add `aiisdrunk.com` and `www.aiisdrunk.com`, then set the DNS records Vercel shows at your domain registrar.

Every push to `main` deploys to production, and every pull request gets a preview URL.

## Project layout

- `app/`: one folder per room, plus the shared layout and styles in `app/globals.css`
- `components/`: the interactive pieces (bar counter, arcade game, TV, photo wall, nav)
- `lib/`: patrons, room content, and the text-slurring effect
