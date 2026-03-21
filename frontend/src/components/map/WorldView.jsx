import { useState } from 'react'

// Inline SVG world map — regions are directly clickable SVG groups, no overlay divs
export default function WorldView({ onSelectRegion, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)

  const regions = {
    west: {
      fictionalName: 'The Western Keep',
      sub: 'Chapel · Cameron · Quad · Perkins',
      color: '#4A90E2',
      cx: 240, cy: 400, rx: 175, ry: 185,
      labelY: 530,
      buildingPath: 'M215,330 L230,300 L245,330 Z M225,330 L225,390 L255,390 L255,330 Z M238,370 L252,370 L252,390 L238,390 Z',
    },
    central: {
      fictionalName: 'The Central Crossing',
      sub: 'Bryan Center · Brodhead',
      color: '#C9A84C',
      cx: 580, cy: 420, rx: 155, ry: 130,
      labelY: 530,
      buildingPath: 'M555,380 L555,450 L605,450 L605,380 Z M568,380 L568,360 L592,360 L592,380 Z M540,410 L620,410',
    },
    east: {
      fictionalName: 'The Eastern Grove',
      sub: 'East Dorms · Baldwin',
      color: '#4ADE80',
      cx: 895, cy: 275, rx: 160, ry: 145,
      labelY: 400,
      buildingPath: 'M850,230 L860,210 L870,230 Z M858,230 L858,268 L872,268 L872,230 Z M880,235 L892,212 L904,235 Z M889,235 L889,268 L903,268 L903,235 Z M915,238 L927,215 L939,238 Z M924,238 L924,268 L938,268 L938,238 Z',
    },
  }

  return (
    <svg
      viewBox="0 0 1200 800"
      style={{ width: '1200px', height: '800px', display: 'block', userSelect: 'none' }}
    >
      <defs>
        {/* Parchment paper texture */}
        <filter id="paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
          <feBlend in="SourceGraphic" in2="grey" mode="multiply"/>
        </filter>
        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {Object.entries(regions).map(([key, r]) => (
          <radialGradient key={key} id={`bg-${key}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={r.color} stopOpacity={hovered === key ? '0.28' : '0.14'}/>
            <stop offset="100%" stopColor={r.color} stopOpacity="0"/>
          </radialGradient>
        ))}
      </defs>

      {/* Parchment base */}
      <rect width="1200" height="800" fill="#F0DDB8"/>
      <rect width="1200" height="800" fill="#E2C98A" opacity="0.35" filter="url(#paper)"/>

      {/* Outer border */}
      <rect x="10" y="10" width="1180" height="780" fill="none" stroke="#8B6914" strokeWidth="3" rx="4"/>
      <rect x="18" y="18" width="1164" height="764" fill="none" stroke="#C9A84C" strokeWidth="1.5" rx="2"/>
      <circle cx="18" cy="18" r="5" fill="#C9A84C"/>
      <circle cx="1182" cy="18" r="5" fill="#C9A84C"/>
      <circle cx="18" cy="782" r="5" fill="#C9A84C"/>
      <circle cx="1182" cy="782" r="5" fill="#C9A84C"/>

      {/* Title */}
      <text x="600" y="52" fontFamily="'IM Fell English', serif" fontSize="30" fill="#4A2C0A" textAnchor="middle" fontStyle="italic">The Realm of Duke</text>
      <line x1="370" y1="62" x2="830" y2="62" stroke="#C9A84C" strokeWidth="1.5"/>

      {/* Terrain patches */}
      <ellipse cx="240" cy="400" rx="200" ry="210" fill="#6B7A5A" opacity="0.07"/>
      <ellipse cx="580" cy="420" rx="170" ry="145" fill="#B8A060" opacity="0.07"/>
      <ellipse cx="895" cy="275" rx="175" ry="160" fill="#3A7A4A" opacity="0.07"/>

      {/* Roads */}
      <path d="M 380 400 Q 480 390 530 420" stroke="#8B6914" strokeWidth="4" fill="none" strokeDasharray="10,5" opacity="0.5"/>
      <path d="M 640 415 Q 740 350 810 285" stroke="#8B6914" strokeWidth="4" fill="none" strokeDasharray="10,5" opacity="0.5"/>
      <path d="M 360 365 Q 580 200 810 250" stroke="#8B6914" strokeWidth="2" fill="none" strokeDasharray="6,7" opacity="0.25"/>

      {/* Water */}
      <path d="M 370 650 Q 460 620 540 640 Q 600 655 660 628" stroke="#6AAFD4" strokeWidth="5" fill="none" opacity="0.45" strokeLinecap="round"/>
      <text x="510" y="672" fontFamily="'IM Fell English', serif" fontSize="12" fill="#4A82A8" textAnchor="middle" fontStyle="italic">The Blue Run</text>

      {/* Trees (decorative) */}
      <g opacity="0.3" fill="#4A6B3A">
        {[90,105,120].map((x,i) => <polygon key={i} points={`${x},${315+i*10} ${x+8},${340+i*10} ${x-8},${340+i*10}`}/>)}
        {[1010,1028,1044].map((x,i) => <polygon key={i} points={`${x},${175+i*8} ${x+8},${198+i*8} ${x-8},${198+i*8}`}/>)}
        {[440,455].map((x,i) => <polygon key={i} points={`${x},${610+i*8} ${x+7},${628+i*8} ${x-7},${628+i*8}`}/>)}
      </g>

      {/* Clickable region territories */}
      {Object.entries(regions).map(([key, r]) => {
        const isHovered = hovered === key
        const count = memoryCounts[key] || 0
        return (
          <g
            key={key}
            style={{ cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); onSelectRegion(key) }}
            onPointerDown={e => e.stopPropagation()}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Glow halo */}
            <ellipse
              cx={r.cx} cy={r.cy}
              rx={r.rx + (isHovered ? 20 : 0)}
              ry={r.ry + (isHovered ? 20 : 0)}
              fill={`url(#bg-${key})`}
              style={{ transition: 'all 0.2s ease' }}
            />

            {/* Territory border ring */}
            <ellipse
              cx={r.cx} cy={r.cy}
              rx={r.rx - 10} ry={r.ry - 10}
              fill="none"
              stroke={r.color}
              strokeWidth={isHovered ? 3 : 2}
              strokeDasharray={isHovered ? 'none' : '12,6'}
              opacity={isHovered ? 1 : 0.65}
              style={{ transition: 'all 0.2s ease' }}
            />

            {/* Building silhouettes */}
            <g opacity={isHovered ? 0.9 : 0.55} fill={r.color} stroke={r.color} strokeWidth="1.5" strokeLinejoin="round" style={{ transition: 'opacity 0.2s' }}>
              <path d={r.buildingPath}/>
            </g>

            {/* Region name label */}
            <text
              x={r.cx} y={r.labelY}
              fontFamily="'IM Fell English', serif"
              fontSize={isHovered ? 20 : 18}
              fill={isHovered ? r.color : '#4A2C0A'}
              textAnchor="middle"
              fontWeight={isHovered ? 'bold' : 'normal'}
              style={{ transition: 'all 0.2s', pointerEvents: 'none' }}
            >
              {r.fictionalName}
            </text>
            <text
              x={r.cx} y={r.labelY + 18}
              fontFamily="'DM Sans', sans-serif"
              fontSize="11"
              fill="#7A5C2A"
              textAnchor="middle"
              fontStyle="italic"
              style={{ pointerEvents: 'none' }}
            >
              {r.sub}
            </text>

            {/* Memory count badge */}
            {count > 0 && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={r.cx + r.rx - 42} y={r.cy - r.ry + 4}
                  width="38" height="20" rx="10"
                  fill={r.color}
                />
                <text
                  x={r.cx + r.rx - 23} y={r.cy - r.ry + 18}
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="11"
                  fontWeight="700"
                  fill="#0A0E1A"
                  textAnchor="middle"
                >
                  {count}
                </text>
              </g>
            )}

            {/* Hover "Enter" prompt */}
            {isHovered && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={r.cx - 42} y={r.cy - 14}
                  width="84" height="28" rx="14"
                  fill={r.color} opacity="0.9"
                />
                <text
                  x={r.cx} y={r.cy + 5}
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="13"
                  fontWeight="600"
                  fill="#0A0E1A"
                  textAnchor="middle"
                >
                  Enter →
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Compass rose */}
      <g transform="translate(1100,700)">
        <circle cx="0" cy="0" r="40" fill="#EDD99A" stroke="#C9A84C" strokeWidth="1.5"/>
        <polygon points="0,-33 5,-7 -5,-7" fill="#003087"/>
        <polygon points="0,33 5,7 -5,7" fill="#8B7A5A"/>
        <polygon points="-33,0 -7,5 -7,-5" fill="#8B7A5A"/>
        <polygon points="33,0 7,5 7,-5" fill="#8B7A5A"/>
        <circle cx="0" cy="0" r="5" fill="#C9A84C"/>
        <text x="0" y="-40" fontFamily="'IM Fell English', serif" fontSize="12" fill="#003087" textAnchor="middle">N</text>
        <text x="0" y="52" fontFamily="'IM Fell English', serif" fontSize="12" fill="#5C3D11" textAnchor="middle">S</text>
        <text x="-48" y="4" fontFamily="'IM Fell English', serif" fontSize="12" fill="#5C3D11" textAnchor="middle">W</text>
        <text x="48" y="4" fontFamily="'IM Fell English', serif" fontSize="12" fill="#5C3D11" textAnchor="middle">E</text>
      </g>

      {/* Scale */}
      <g transform="translate(60,745)">
        <line x1="0" y1="0" x2="110" y2="0" stroke="#5C3D11" strokeWidth="2"/>
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#5C3D11" strokeWidth="2"/>
        <line x1="110" y1="-4" x2="110" y2="4" stroke="#5C3D11" strokeWidth="2"/>
        <text x="55" y="-7" fontFamily="'IM Fell English', serif" fontSize="11" fill="#5C3D11" textAnchor="middle">One League</text>
      </g>
    </svg>
  )
}
