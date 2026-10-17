import { MAX_BAC, tiers } from "@/lib/patrons";

// A breathalyzer gauge: a half dial from 0.00 to 0.30, banded by tier.
export default function BacDial({ bac }: { bac: number }) {
  const cx = 100, cy = 100, r = 78;
  const angle = (v: number) => Math.PI * (1 - v / MAX_BAC);
  const pt = (v: number, rad: number) => [cx + rad * Math.cos(angle(v)), cy - rad * Math.sin(angle(v))];
  const arc = (a: number, b: number) => {
    const [x1, y1] = pt(a, r);
    const [x2, y2] = pt(b, r);
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  let lo = 0;
  const bands = tiers.map((t) => {
    const hi = Math.min(t.max, MAX_BAC);
    const d = arc(lo, hi);
    lo = hi;
    return { d, color: t.color };
  });
  const ticks = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
  const needle = -90 + (Math.min(bac, MAX_BAC) / MAX_BAC) * 180;

  return (
    <svg className="dial" viewBox="0 0 200 142" role="img" aria-label={`Breathalyzer reading ${bac.toFixed(2)}`}>
      {bands.map((b, i) => (
        <path key={i} d={b.d} stroke={b.color} strokeWidth="14" fill="none" strokeLinecap="butt" opacity="0.9" />
      ))}
      {ticks.map((t) => {
        const [x1, y1] = pt(t, r - 12);
        const [x2, y2] = pt(t, r - 20);
        const [tx, ty] = pt(t, r - 32);
        return (
          <g key={t}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth="1.5" />
            <text x={tx} y={ty + 3} textAnchor="middle" className="dial-tick">{t.toFixed(2).slice(1)}</text>
          </g>
        );
      })}
      <g className="needle" style={{ transform: `rotate(${needle}deg)`, transformOrigin: "100px 100px" }}>
        <line x1="100" y1="100" x2="100" y2="30" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="100" r="7" fill="var(--neon)" />
      <text x="100" y="136" textAnchor="middle" className="dial-read">{bac.toFixed(2)}</text>
    </svg>
  );
}
