import { useState } from 'react'
import { REGIONS } from '../../lib/mapConfig'
import { getLandmarksForRegion } from '../../lib/landmarks'
import LandmarkCard from './LandmarkCard'

// Dynamic SVG imports
const regionSvgs = {
  west: new URL('../../assets/svg/west-campus.svg', import.meta.url).href,
  east: new URL('../../assets/svg/east-campus.svg', import.meta.url).href,
  central: new URL('../../assets/svg/central-campus.svg', import.meta.url).href,
}

const landmarkSvgs = {
  chapel: new URL('../../assets/svg/chapel.svg', import.meta.url).href,
  cameron: new URL('../../assets/svg/cameron.svg', import.meta.url).href,
  quad: new URL('../../assets/svg/quad.svg', import.meta.url).href,
  perkins: new URL('../../assets/svg/perkins.svg', import.meta.url).href,
  marketplace: new URL('../../assets/svg/marketplace.svg', import.meta.url).href,
  eastdorms: new URL('../../assets/svg/eastdorms.svg', import.meta.url).href,
  baldwin: new URL('../../assets/svg/baldwin.svg', import.meta.url).href,
  bryan: new URL('../../assets/svg/bryan.svg', import.meta.url).href,
  brodhead: new URL('../../assets/svg/brodhead.svg', import.meta.url).href,
}

export default function RegionView({ region, onSelectLandmark, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)
  const landmarks = getLandmarksForRegion(region)
  const regionData = REGIONS[region]

  return (
    <div style={{ position: 'relative', width: '1200px', height: '800px' }}>
      {/* Region background */}
      <img
        src={regionSvgs[region]}
        alt={regionData.fictionalName}
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        draggable={false}
      />

      {/* Landmark buildings */}
      {landmarks.map((landmark) => {
        const isHovered = hovered === landmark.id
        const count = memoryCounts[landmark.id] || 0

        return (
          <div
            key={landmark.id}
            onClick={() => onSelectLandmark(landmark.id)}
            onMouseEnter={() => setHovered(landmark.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: landmark.position.x,
              top: landmark.position.y,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            {/* Hover tooltip */}
            {isHovered && (
              <LandmarkCard landmark={landmark} memoryCount={count} />
            )}

            {/* Building illustration */}
            <div
              style={{
                position: 'relative',
                filter: isHovered
                  ? 'drop-shadow(0 0 12px #C9A84C) drop-shadow(0 0 24px rgba(201,168,76,0.5))'
                  : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                transition: 'filter 0.25s ease',
                animation: isHovered ? 'goldPulse 1.5s ease-in-out infinite' : 'none',
              }}
            >
              <img
                src={landmarkSvgs[landmark.id]}
                alt={landmark.realName}
                style={{
                  width: '140px',
                  height: '105px',
                  objectFit: 'contain',
                  display: 'block',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
                draggable={false}
              />
            </div>

            {/* Memory count badge */}
            {count > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: regionData.color,
                  color: '#0A0E1A',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  fontFamily: "'DM Sans', sans-serif",
                  zIndex: 11,
                }}
              >
                {count}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
