import { useState } from 'react'
import { REGIONS } from '../../lib/mapConfig'
import worldMapSvg from '../../assets/svg/world-map.svg'

export default function WorldView({ onSelectRegion, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ position: 'relative', width: '1200px', height: '800px' }}>
      {/* Parchment world map background */}
      <img
        src={worldMapSvg}
        alt="Duke realm map"
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        draggable={false}
      />

      {/* Clickable region overlays */}
      {Object.entries(REGIONS).map(([key, region]) => {
        const count = memoryCounts[key] || 0
        const isHovered = hovered === key
        return (
          <div
            key={key}
            onClick={() => onSelectRegion(key)}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: region.position.x,
              top: region.position.y,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            {/* Pulsing ring -->*/}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: `3px solid ${region.color}`,
                background: isHovered
                  ? `${region.color}25`
                  : `${region.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                boxShadow: isHovered
                  ? `0 0 24px ${region.color}60, 0 0 48px ${region.color}30`
                  : `0 0 8px ${region.color}30`,
                animation: 'goldPulse 2.5s ease-in-out infinite',
              }}
            >
              <span
                className="font-map"
                style={{
                  color: isHovered ? '#FFFFFF' : region.color,
                  fontSize: '10px',
                  textAlign: 'center',
                  padding: '0 4px',
                  transition: 'color 0.2s',
                  lineHeight: '1.2',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                }}
              >
                {region.fictionalName}
              </span>
              {count > 0 && (
                <span
                  style={{
                    marginTop: '4px',
                    background: region.color,
                    color: '#0A0E1A',
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
