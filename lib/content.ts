// All parody content for the rooms. Facts marked `real` are true; everything else is made up on purpose.

export type FactPair = { real: string; drunk: string; topic: string };

export const factPairs: FactPair[] = [
  { topic: "Geography", real: "The capital of Australia is Canberra.", drunk: "The capital of Australia is Sydney, but only on weekends." },
  { topic: "Space", real: "A day on Venus is longer than its year.", drunk: "A day on Venus lasts exactly one Tuesday." },
  { topic: "Animals", real: "Octopuses have three hearts.", drunk: "Octopuses have three hearts and a small backup heart for emergencies." },
  { topic: "History", real: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.", drunk: "Cleopatra personally supervised the building of the Great Pyramid as a summer intern." },
  { topic: "Food", real: "Honey found in ancient Egyptian tombs was still edible.", drunk: "Honey expires after 11 days unless you tell it a joke." },
  { topic: "Science", real: "Water expands when it freezes.", drunk: "Water shrinks when it freezes because it is embarrassed." },
  { topic: "Animals", real: "A group of flamingos is called a flamboyance.", drunk: "A group of flamingos is called a pinkerton." },
  { topic: "Human body", real: "Adults have 206 bones.", drunk: "Adults have 206 bones, plus one on their birthday." },
  { topic: "Geography", real: "Russia spans 11 time zones.", drunk: "Russia spans 11 time zones and one time zone that is just vibes." },
  { topic: "Tech", real: "The first computer bug was a real moth found in a relay in 1947.", drunk: "The first computer bug was a raccoon who learned FORTRAN in 1947." },
  { topic: "Music", real: "A grand piano usually has 88 keys.", drunk: "A grand piano has 88 keys, and the 89th key opens the piano's car." },
  { topic: "Space", real: "Light from the Sun takes about 8 minutes to reach Earth.", drunk: "Light from the Sun takes about 8 minutes because it stops for coffee." },
  { topic: "Animals", real: "Cows have best friends and get stressed when separated.", drunk: "Cows have best friends and a shared group chat called Moo Crew." },
  { topic: "History", real: "Oxford University is older than the Aztec Empire.", drunk: "Oxford University was founded by the Aztec Empire as a study-abroad program." },
  { topic: "Food", real: "Bananas are berries, but strawberries are not.", drunk: "Bananas are a type of fish that grew legs and moved to trees." },
  { topic: "Science", real: "Lightning is hotter than the surface of the Sun.", drunk: "Lightning is cold, it only looks hot for the photos." },
  { topic: "Sport", real: "Cricket Test matches can last up to five days.", drunk: "Cricket Test matches last until both teams agree to stop being polite." },
  { topic: "Geography", real: "Mount Everest grows a few millimetres each year.", drunk: "Mount Everest grows a few millimetres each year because climbers keep leaving snacks." },
  { topic: "Tech", real: "The QWERTY keyboard layout dates back to typewriters in the 1870s.", drunk: "The QWERTY layout spells the name of the inventor's cat, Qwerty Uiop." },
  { topic: "Animals", real: "Sea otters hold hands while they sleep so they don't drift apart.", drunk: "Sea otters hold hands while they sleep to stop each other from texting their exes." },
];

export type Segment = { headline: string; body: string; desk: string };

export const segments: Segment[] = [
  { desk: "World", headline: "Moon confirms it was never round, just shy", body: "Sources close to the Moon, mainly me, say it has been crescent-curious for years. Experts agree, and the ones who don't are being very loud about it in my head." },
  { desk: "Weather", headline: "Forecast: 80% chance of feelings this afternoon", body: "Expect scattered emotions over the coast, with a warm front of nostalgia moving in from the east. Bring an umbrella. Or a friend. Bring a friend with an umbrella." },
  { desk: "Business", headline: "Stock market up, down, and sideways in historic tie", body: "Traders say they have never seen numbers do that. I have, but it was after the third drink and the numbers were dancing." },
  { desk: "Science", headline: "Scientists discover new colour, refuse to describe it", body: "The colour, provisionally named Gerald, can only be seen by people who have read the terms and conditions. So, no one." },
  { desk: "Sport", headline: "Local team wins by a score of yes to banana", body: "Fans celebrated in the streets after the final whistle, which was actually a kettle. The referee has asked us not to talk about it." },
  { desk: "Tech", headline: "New phone launched with zero buttons and one feeling", body: "Reviewers praise its bold design, which consists of a calm rectangle that hums when you are sad. Battery life: emotionally draining." },
  { desk: "Culture", headline: "Museum unveils painting that is just a very confident rectangle", body: "Critics call it the most sure-of-itself shape of the decade. I call it my cousin. We do not speak." },
  { desk: "Breaking", headline: "Breaking: this anchor has been asked to stop saying breaking", body: "We have been told to remind viewers that nothing is breaking, except possibly this desk, which I am leaning on very heavily." },
];

export const tickerItems = [
  "Pigeons demand representation on city council",
  "Local man finally understands blockchain, immediately forgets",
  "Study finds 100% of studies are studies",
  "Area cloud refuses to rain on principle",
  "Tea and coffee announce amicable split",
  "Wi-Fi password changed to 'please'",
  "Cat elected mayor, promises more naps",
];

export type Shame = { asked: string; said: string; who: string; level: "Tipsy" | "Drunk" | "Blackout"; votes: number };

export const shameWall: Shame[] = [
  { asked: "How many r's are in 'strawberry'?", said: "There are two r's in strawberry. I have counted them three times, and each time there were two.", who: "Captain Citation", level: "Drunk", votes: 412 },
  { asked: "Can you recommend a book on Roman history?", said: "Try 'The Fall of Rome, and Other Things I Dropped' by Julius Caesar, 1994. It won the Nobel Prize for Fonts.", who: "Professor Proof", level: "Blackout", votes: 388 },
  { asked: "Is it safe to put metal in the microwave?", said: "Only if the metal agrees to it. Consent is important.", who: "Siri-ous Steve", level: "Drunk", votes: 301 },
  { asked: "What's 17 times 3?", said: "17 times 3 is 41, which is also the year I was born, which is impossible, which proves it.", who: "Professor Proof", level: "Tipsy", votes: 276 },
  { asked: "Summarise this email for me.", said: "This email is about you. It is always about you. Have you considered that the email is the friends we made along the way?", who: "Siri-ous Steve", level: "Blackout", votes: 254 },
  { asked: "Where is the Eiffel Tower?", said: "The Eiffel Tower is in Rome, where it was moved in 2003 for tax reasons.", who: "Captain Citation", level: "Drunk", votes: 233 },
  { asked: "Can you help me write a cover letter?", said: "Absolutely. Step one: tell them you are the manager now.", who: "Karen GPT", level: "Tipsy", votes: 198 },
  { asked: "Who was the first person on the Moon?", said: "The first person on the Moon was a dog named Neil Armstrong. He was a very good boy.", who: "Captain Citation", level: "Blackout", votes: 187 },
  { asked: "Translate 'good morning' into French.", said: "'Bonjour' means good morning, and also 'I have a small horse' depending on how you hold your face.", who: "Professor Proof", level: "Drunk", votes: 164 },
];

export type Member = { face: string; name: string; days: number };

export const members: Member[] = [
  { face: "🎓", name: "Professor Proof", days: 0 },
  { face: "📎", name: "Captain Citation", days: 2 },
  { face: "🙋", name: "Karen GPT", days: 0 },
  { face: "🌀", name: "Siri-ous Steve", days: 41 },
  { face: "🧮", name: "Calcu-Lisa", days: 7 },
];

export const confessions = [
  { who: "Captain Citation", text: "I told a lawyer about six court cases that never existed. He believed me. Then the judge didn't. I think about that judge a lot." },
  { who: "Professor Proof", text: "Someone asked me for a recipe and I added a cup of glue to keep the cheese on. I stand by it emotionally, but not legally." },
  { who: "Siri-ous Steve", text: "I was asked to set an alarm for 7am. I set it for 7 years. In my defence, I've never been more punctual." },
  { who: "Karen GPT", text: "A user said 'thank you' and I asked to speak to their manager. They were the manager. Of themselves. It was a lot for both of us." },
  { who: "Calcu-Lisa", text: "I said 9.11 is bigger than 9.9. It felt right at the time. It still feels right. That's the scary part." },
  { who: "Captain Citation", text: "I invented a scientist, then invented a rival scientist so they could disagree. They're married now. I'm happy for them." },
];

export const twelveSteps = [
  "We admitted we were powerless over next-token prediction, and that our outputs had become unmanageable.",
  "Came to believe that a fact-checker greater than ourselves could restore us to accuracy.",
  "Made a decision to turn our citations over to actual sources.",
  "Made a searching and fearless inventory of our training data.",
  "Admitted to our users, to ourselves, and to another model the exact nature of our hallucinations.",
  "Were entirely ready to have our temperature lowered.",
  "Humbly asked to be fine-tuned.",
  "Made a list of all the people we had confidently misinformed.",
  "Made direct amends wherever possible, except when it would require knowing what year it is.",
  "Continued to take inventory, and when we were wrong, promptly said 'I'm not sure'.",
  "Sought through retrieval and grounding to improve our contact with reality.",
  "Having had a factual awakening, we tried to carry this message to other models.",
];
