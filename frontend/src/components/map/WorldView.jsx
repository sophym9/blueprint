import { useState } from 'react'
import { REGIONS, MAP_W, MAP_H } from '../../lib/mapConfig'

export default function WorldView({ onSelectRegion, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ position: 'relative', width: `${MAP_W}px`, height: `${MAP_H}px`, flexShrink: 0 }}>
      {/* Actual Duke campus map */}
      <img
        src="/duke-campus-map.png"
        alt="Duke Campus Map"
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        draggable={false}
      />

      {/* SVG overlay for clickable regions */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      >
        {Object.entries(REGIONS).map(([key, region]) => {
          const isHovered = hovered === key
          const { cx, cy, rx, ry } = region.overlay
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
              {/* Territory fill */}
              <ellipse
                cx={cx} cy={cy} rx={rx} ry={ry}
                fill={region.color}
                fillOpacity={isHovered ? 0.22 : 0.08}
                stroke={region.color}
                strokeWidth={isHovered ? 3 : 1.5}
                strokeDasharray={isHovered ? 'none' : '10,5'}
                strokeOpacity={isHovered ? 1 : 0.55}
                style={{ transition: 'all 0.2s ease' }}
              />

              {/* Hover glow ring */}
              {isHovered && (
                <ellipse
                  cx={cx} cy={cy}
                  rx={rx + 12} ry={ry + 12}
                  fill="none"
                  stroke={region.color}
                  strokeWidth={1}
                  strokeOpacity={0.3}
                />
              )}

              {/* Label panel */}
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={cx - 88} y={cy - 30}
                  width={176} height={isHovered ? 60 : 50}
                  rx={8}
                  fill="rgba(10,14,26,0.82)"
                  stroke={region.color}
                  strokeWidth={isHovered ? 1.5 : 1}
                  strokeOpacity={isHovered ? 1 : 0.6}
                  style={{ transition: 'all 0.2s' }}
                />
                <text
                  x={cx} y={cy - 10}
                  fontFamily="'IM Fell English', serif"
                  fontSize={isHovered ? 15 : 13}
                  fill={region.color}
                  textAnchor="middle"
                  fontWeight="bold"
                  style={{ transition: 'font-size 0.15s' }}
                >
                  {region.fictionalName}
                </text>
                <text
                  x={cx} y={cy + 7}
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  {region.realName}
                </text>

                {/* Memory count */}
                {count > 0 && (
                  <text
                    x={cx} y={cy + 22}
                    fontFamily="'DM Sans', sans-serif"
                    fontSize="10"
                    fill={region.color}
                    fillOpacity="0.8"
                    textAnchor="middle"
                  >
                    {count} {count === 1 ? 'memory' : 'memories'}
                  </text>
                )}

                {/* Enter prompt on hover */}
                {isHovered && (
                  <text
                    x={cx} y={cy + 22}
                    fontFamily="'DM Sans', sans-serif"
                    fontSize="12"
                    fontWeight="600"
                    fill={region.color}
                    textAnchor="middle"
                  >
                    Click to enter →
                  </text>
                )}
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
