// Decorative backdrop: drifting neon bokeh, film grain and a vignette. Pure CSS, no JS.
const lights = [
  { x: 8, y: 18, s: 220, c: "var(--neon)", d: 0 },
  { x: 78, y: 10, s: 280, c: "var(--cyan)", d: -6 },
  { x: 60, y: 62, s: 240, c: "var(--amber)", d: -12 },
  { x: 18, y: 78, s: 200, c: "var(--violet)", d: -3 },
  { x: 92, y: 70, s: 180, c: "var(--neon)", d: -9 },
];

export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      {lights.map((l, i) => (
        <span
          key={i}
          className="bokeh"
          style={{ left: `${l.x}%`, top: `${l.y}%`, width: l.s, height: l.s, background: l.c, animationDelay: `${l.d}s` }}
        />
      ))}
    </div>
  );
}
