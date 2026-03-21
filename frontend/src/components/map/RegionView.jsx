import { useState } from 'react'
import { REGIONS, MAP_W, MAP_H } from '../../lib/mapConfig'
import { getLandmarksForRegion } from '../../lib/landmarks'

export default function RegionView({ region, onSelectLandmark, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)
  const landmarks = getLandmarksForRegion(region)
  const regionData = REGIONS[region]

  return (
    <div style={{ position: 'relative', width: `${MAP_W}px`, height: `${MAP_H}px`, flexShrink: 0 }}>
      {/* Same campus map — DukeWorldMap has already zoomed/panned to this region */}
      <img
        src="/duke-campus-map.png"
        alt="Duke Campus Map"
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        draggable={false}
      />

      {/* Landmark hotspots */}
      {landmarks.map(landmark => {
        const isHovered = hovered === landmark.id
        const count = memoryCounts[landmark.id] || 0

        return (
          <div
            key={landmark.id}
            onClick={e => { e.stopPropagation(); onSelectLandmark(landmark.id) }}
            onPointerDown={e => e.stopPropagation()}
            onMouseEnter={() => setHovered(landmark.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${landmark.mapX}%`,
              top: `${landmark.mapY}%`,
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            {/* Tooltip card */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10,14,26,0.95)',
                border: `1px solid ${regionData.color}`,
                borderRadius: '8px',
                padding: '10px 14px',
                width: '180px',
                marginBottom: '6px',
                pointerEvents: 'none',
                whiteSpace: 'normal',
              }}>
                <div style={{ fontFamily: "'IM Fell English', serif", fontSize: '13px', color: regionData.color, marginBottom: '2px' }}>
                  {landmark.fictionalName}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>
                  {landmark.realName}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#6B7280', lineHeight: '1.4' }}>
                  {landmark.description}
                </div>
                {count > 0 && (
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: regionData.color, marginTop: '4px' }}>
                    {count} {count === 1 ? 'memory' : 'memories'}
                  </div>
                )}
              </div>
            )}

            {/* Pin marker */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Pin head */}
              <div style={{
                width: isHovered ? '36px' : '28px',
                height: isHovered ? '36px' : '28px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                background: isHovered
                  ? regionData.color
                  : `${regionData.color}CC`,
                border: `2px solid ${isHovered ? '#FFFFFF' : regionData.color}`,
                boxShadow: isHovered
                  ? `0 0 16px ${regionData.color}80, 0 2px 8px rgba(0,0,0,0.5)`
                  : '0 2px 6px rgba(0,0,0,0.4)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Inner dot */}
                <div style={{
                  width: isHovered ? '10px' : '8px',
                  height: isHovered ? '10px' : '8px',
                  borderRadius: '50%',
                  background: isHovered ? '#0A0E1A' : 'rgba(255,255,255,0.8)',
                  transform: 'rotate(45deg)',
                  transition: 'all 0.15s',
                }}/>
              </div>

              {/* Pin stem */}
              <div style={{
                width: '2px',
                height: '10px',
                background: isHovered ? regionData.color : `${regionData.color}99`,
                borderRadius: '0 0 2px 2px',
                transition: 'all 0.15s',
              }}/>
            </div>

            {/* Label below */}
            <div style={{
              marginTop: '2px',
              background: isHovered ? 'rgba(10,14,26,0.95)' : 'rgba(10,14,26,0.7)',
              border: `1px solid ${regionData.color}${isHovered ? 'CC' : '55'}`,
              borderRadius: '4px',
              padding: '2px 6px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              color: isHovered ? regionData.color : '#D1D5DB',
              whiteSpace: 'nowrap',
              transform: 'translateX(-50%) translateX(50%)',
              // Offset so label is centered under pin
              marginLeft: '-50%',
              textAlign: 'center',
              transition: 'all 0.15s',
            }}>
              {landmark.realName}
              {count > 0 && <span style={{ color: regionData.color, marginLeft: '4px' }}>·{count}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
