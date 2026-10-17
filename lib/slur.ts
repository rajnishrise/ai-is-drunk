// Client-side text distortion. Higher BAC means more swapped letters, stutters, shouting and hiccups.
export type Piece = { text: string; hic?: boolean };

export function slur(text: string, bac: number, rand: () => number = Math.random): Piece[] {
  if (bac < 0.05) return [{ text }];
  const p = bac * 0.5;
  const words: Piece[] = text.split(" ").map((w) => {
    let out = w;
    if (rand() < p && w.length > 3) {
      const i = 1 + Math.floor(rand() * (w.length - 2));
      out = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    }
    if (rand() < p * 0.6 && out.length > 0) {
      const i = Math.floor(rand() * out.length);
      out = out.slice(0, i) + out[i] + out.slice(i);
    }
    if (bac > 0.2 && rand() < 0.12) out = out.toUpperCase();
    return { text: out };
  });
  const hics = Math.round(bac * 12);
  for (let k = 0; k < hics; k++) {
    const at = 1 + Math.floor(rand() * words.length);
    words.splice(at, 0, { text: "*hic*", hic: true });
  }
  return words;
}
