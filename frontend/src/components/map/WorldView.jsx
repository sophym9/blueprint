import { useState } from 'react'
import { MAP_W, MAP_H } from '../../lib/mapConfig'
import { LANDMARKS } from '../../lib/landmarks'

function heatColor(count) {
  if (count === 0) return '#4A90E2'
  if (count < 3)   return '#FACC15'
  if (count < 7)   return '#FB923C'
  return '#EF4444'
}

function heatRadius(count) {
  return 28 + Math.sqrt(count) * 18
}

export default function WorldView({ onSelectLandmark, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)

  const landmarks = Object.entries(LANDMARKS).map(([id, l]) => ({
    id, ...l,
    count: memoryCounts[id] || 0,
    cx: (l.mapX / 100) * MAP_W,
    cy: (l.mapY / 100) * MAP_H,
  }))

  return (
    <div style={{ position: 'relative', width: `${MAP_W}px`, height: `${MAP_H}px`, flexShrink: 0 }}>
      <img
        src="/duke-campus-map.png"
        alt="Duke Campus Map"
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        draggable={false}
      />

      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      >
        <defs>
          <filter id="heat-blur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="pin-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Layer 1: blurred heat blobs */}
        {landmarks.map(({ id, cx, cy, count }) => (
          count > 0 && (
            <circle
              key={`heat-${id}`}
              cx={cx} cy={cy}
              r={heatRadius(count)}
              fill={heatColor(count)}
              opacity={0.35 + Math.min(count, 10) * 0.03}
              filter="url(#heat-blur)"
              style={{ pointerEvents: 'none' }}
            />
          )
        ))}

        {/* Layer 2: clickable pins */}
        {landmarks.map(({ id, cx, cy, count, fictionalName, realName, description }) => {
          const isHovered = hovered === id
          const color = count > 0 ? heatColor(count) : '#6B7280'

          return (
            <g
              key={`pin-${id}`}
              style={{ cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); onSelectLandmark(id, { x: (cx / MAP_W) * 100, y: (cy / MAP_H) * 100 }) }}
              onPointerDown={e => e.stopPropagation()}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Outer pulse ring */}
              <circle
                cx={cx} cy={cy}
                r={isHovered ? 22 : 14}
                fill={color}
                fillOpacity={isHovered ? 0.25 : 0.15}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1}
                strokeOpacity={isHovered ? 0.9 : 0.5}
                filter={count > 0 ? 'url(#pin-glow)' : undefined}
                style={{ transition: 'all 0.2s ease' }}
              />
              {/* Inner dot */}
              <circle
                cx={cx} cy={cy}
                r={isHovered ? 7 : 5}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'all 0.2s ease' }}
              />
              {/* Count badge */}
              {count > 0 && (
                <text
                  x={cx} y={cy - 18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="'DM Sans', sans-serif"
                  fill={color}
                  opacity={isHovered ? 1 : 0.7}
                  style={{ pointerEvents: 'none', transition: 'opacity 0.2s' }}
                >
                  {count}
                </text>
              )}

              {/* Tooltip on hover */}
              {isHovered && (
                <foreignObject
                  x={cx + 14}
                  y={cy - 54}
                  width="170"
                  height="100"
                  style={{ pointerEvents: 'none', overflow: 'visible' }}
                >
                  <div style={{
                    background: 'rgba(10,14,26,0.95)',
                    border: `1px solid ${color}`,
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <div style={{ fontFamily: "'IM Fell English', serif", fontSize: '12px', color, marginBottom: '2px' }}>
                      {fictionalName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '3px' }}>
                      {realName}
                    </div>
                    <div style={{ fontSize: '10px', color: count > 0 ? color : '#4B5563' }}>
                      {count > 0 ? `${count} ${count === 1 ? 'memory' : 'memories'} · click to enter` : 'No memories yet · be first!'}
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
