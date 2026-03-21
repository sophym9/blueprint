import { useState } from 'react'

const ZONES = [
  { key: 'west', label: 'Western Keep', color: '#4A90E2' },
  { key: 'central', label: 'Central Crossing', color: '#C9A84C' },
]

export default function ZoneProgress({ memoryCounts = {}, unlockedZones = [] }) {
  const [justUnlocked, setJustUnlocked] = useState(null)
  const total = Object.values(memoryCounts).reduce((a, b) => a + b, 0) || 1

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 35,
        background: 'rgba(10,14,26,0.9)',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {ZONES.map(zone => {
        const count = memoryCounts[zone.key] || 0
        const pct = Math.min((count / Math.max(total, 1)) * 100, 100)
        const unlocked = unlockedZones.includes(zone.key)

        return (
          <div key={zone.key} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Zone label + unlock badge */}
            <div style={{ minWidth: '72px' }}>
              <span
                className="font-map"
                style={{ fontSize: '11px', color: unlocked ? zone.color : '#4B5563', display: 'block' }}
              >
                {unlocked && <span style={{ marginRight: '3px' }}>⚔</span>}
                {zone.label}
              </span>
              <span
                style={{ fontSize: '10px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
              >
                {count} {count === 1 ? 'pin' : 'pins'}
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                flex: 1,
                height: '6px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: zone.color,
                  borderRadius: '3px',
                  transition: 'width 0.6s ease',
                  boxShadow: `0 0 6px ${zone.color}60`,
                }}
              />
            </div>
          </div>
        )
      })}

      {/* Total */}
      <div style={{ textAlign: 'right', minWidth: '60px' }}>
        <span className="font-display" style={{ fontSize: '14px', color: '#C9A84C' }}>
          {Object.values(memoryCounts).reduce((a, b) => a + b, 0)}
        </span>
        <span style={{ fontSize: '10px', color: '#6B7280', display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
          total
        </span>
      </div>
    </div>
  )
}
