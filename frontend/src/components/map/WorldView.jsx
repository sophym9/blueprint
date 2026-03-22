import { useState } from 'react'
import { MAP_W, MAP_H } from '../../lib/mapConfig'
import { LANDMARKS } from '../../lib/landmarks'

const YEAR_HEAT_COLORS = {
  freshman: '#4ADE80',
  sophomore: '#FACC15',
  junior: '#FB923C',
  senior: '#003087',
}
const DEFAULT_HEAT_COLOR = '#C9A84C'

const DOT_ZOOM_THRESHOLD = 1.8

export default function WorldView({
  onSelectLandmark, onSelectMapPoint, onSelectMemory,
  memoryCounts = {}, memories = [], pendingPin = null,
  zoomScale = 1,
}) {
  const [hovered, setHovered] = useState(null)

  const landmarks = Object.entries(LANDMARKS).map(([id, l]) => ({
    id, ...l,
    count: memoryCounts[id] || 0,
    cx: (l.mapX / 100) * MAP_W,
    cy: (l.mapY / 100) * MAP_H,
  }))

  return (
    <div
      style={{ position: 'relative', width: `${MAP_W}px`, height: `${MAP_H}px`, flexShrink: 0 }}
      onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        onSelectMapPoint?.({ x, y })
      }}
    >
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
          <filter id="mem-heat-blur" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="pin-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Layer 1a: blurred heat blobs for density (non-interactive) */}
        {memories.map(memory => {
          const color = YEAR_HEAT_COLORS[memory.year_tag] || DEFAULT_HEAT_COLOR
          const cx = (memory.pin_x / 100) * MAP_W
          const cy = (memory.pin_y / 100) * MAP_H
          return (
            <circle key={`blur-${memory.id}`} cx={cx} cy={cy} r={42}
              fill={color} opacity={0.3} filter="url(#mem-heat-blur)"
              style={{ pointerEvents: 'none' }} />
          )
        })}

        {/* Layer 1b: clickable memory dots — visible only when zoomed in */}
        {zoomScale >= DOT_ZOOM_THRESHOLD && memories.map(memory => {
          const color = YEAR_HEAT_COLORS[memory.year_tag] || DEFAULT_HEAT_COLOR
          const cx = (memory.pin_x / 100) * MAP_W
          const cy = (memory.pin_y / 100) * MAP_H
          const fadeIn = Math.min((zoomScale - DOT_ZOOM_THRESHOLD) / 0.4, 1)
          return (
            <g key={`dot-${memory.id}`}
              style={{ cursor: 'pointer', opacity: fadeIn, transition: 'opacity 0.2s' }}
              onClick={e => { e.stopPropagation(); onSelectMemory?.(memory) }}
              onPointerDown={e => e.stopPropagation()}
            >
              <circle cx={cx} cy={cy} r={12} fill={color} opacity={0} />
              <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.15} />
              <circle cx={cx} cy={cy} r={4} fill={color} opacity={0.7} />
            </g>
          )
        })}

        {/* Layer 2: clickable landmark pins */}
        {landmarks.map(({ id, cx, cy, count, fictionalName, realName }) => {
          const isHovered = hovered === id
          const color = count > 0 ? '#C9A84C' : '#6B7280'

          return (
            <g
              key={`pin-${id}`}
              style={{ cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); onSelectLandmark(id, { x: (cx / MAP_W) * 100, y: (cy / MAP_H) * 100 }) }}
              onPointerDown={e => e.stopPropagation()}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
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
              <circle
                cx={cx} cy={cy}
                r={isHovered ? 7 : 5}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'all 0.2s ease' }}
              />

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

      {/* Pending pin crosshair */}
      {pendingPin && (
        <div
          style={{
            position: 'absolute',
            left: `${pendingPin.pin_x}%`,
            top: `${pendingPin.pin_y}%`,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            border: '2px solid #C9A84C',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}
    </div>
  )
}
