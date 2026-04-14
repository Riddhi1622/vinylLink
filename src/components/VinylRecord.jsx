// src/app/components/VinylRecord.js

/**
 *  Pure SVG vinyl record — no deps, fully CSS-animatable.
 *  Used in the Hero section with vinyl-rotating class for spin.
 */
export default function VinylRecord({ size = 440 }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;

  // 32 concentric groove rings with subtle thickness variation
  const grooves = [];
  const numGrooves = 32;
  const innerGrooveR = size * 0.182;
  const outerGrooveR = size * 0.468;
  const step = (outerGrooveR - innerGrooveR) / numGrooves;

  for (let i = 0; i < numGrooves; i++) {
    const r = innerGrooveR + i * step;
    const thick = i % 5 === 0;
    grooves.push(
      <circle
        key={`groove-${i}`}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={thick ? '#232018' : '#1c1a16'}
        strokeWidth={thick ? '1.2' : '0.55'}
        opacity={0.55 + (thick ? 0.2 : 0)}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="VinylLINK vinyl record"
    >
      {/* Outer disc */}
      <circle cx={cx} cy={cy} r={outerR} fill="#0b0a08" />
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#2e2a22" strokeWidth="2" />

      {/* Dead wax outer ring */}
      <circle cx={cx} cy={cy} r={size * 0.475} fill="none" stroke="#1e1c18" strokeWidth="1" opacity="0.6" />

      {/* Groove rings */}
      {grooves}

      {/* Dead wax inner ring (between grooves and label) */}
      <circle cx={cx} cy={cy} r={size * 0.19} fill="#121008" />

      {/* Label area */}
      <circle cx={cx} cy={cy} r={size * 0.178} fill="#1c1409" />

      {/* Label outer ring */}
      <circle cx={cx} cy={cy} r={size * 0.175} fill="none" stroke="#c9a256" strokeWidth="0.6" opacity="0.55" />

      {/* Label inner ring */}
      <circle cx={cx} cy={cy} r={size * 0.135} fill="none" stroke="#c9a256" strokeWidth="0.4" opacity="0.22" />

      {/* Label text — name */}
      <text
        x={cx}
        y={cy - size * 0.024}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#c9a256"
        fontSize={size * 0.033}
        fontFamily="Georgia, serif"
        letterSpacing="3"
        opacity="0.92"
      >
        VINYLLINK
      </text>

      {/* Label text — year */}
      <text
        x={cx}
        y={cy + size * 0.042}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#7a6540"
        fontSize={size * 0.02}
        fontFamily="Georgia, serif"
        letterSpacing="2.5"
      >
        EST. MMXXIV
      </text>

      {/* Spindle hole */}
      <circle cx={cx} cy={cy} r={size * 0.019} fill="#07070a" />

      {/* Specular highlights — gives the disc subtle 3D depth */}
      <ellipse
        cx={cx - size * 0.14}
        cy={cy - size * 0.2}
        rx={size * 0.14}
        ry={size * 0.055}
        fill="white"
        opacity="0.018"
        transform={`rotate(-38, ${cx - size * 0.14}, ${cy - size * 0.2})`}
      />
      <ellipse
        cx={cx + size * 0.18}
        cy={cy + size * 0.22}
        rx={size * 0.08}
        ry={size * 0.03}
        fill="white"
        opacity="0.009"
        transform={`rotate(25, ${cx + size * 0.18}, ${cy + size * 0.22})`}
      />
    </svg>
  );
}