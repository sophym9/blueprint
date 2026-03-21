import { REGIONS, ZOOM_LEVELS } from '../../lib/mapConfig'
import { LANDMARKS } from '../../lib/landmarks'

export default function MapControls({ zoomLevel, activeRegion, activeLandmark, onBack, onZoomIn, onZoomOut }) {
  const region = activeRegion ? REGIONS[activeRegion] : null
  const landmark = activeLandmark ? LANDMARKS[activeLandmark] : null

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          background: 'rgba(10,14,26,0.85)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '6px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span className="font-map text-xs" style={{ color: '#C9A84C' }}>🗺 The Realm of Duke</span>
        {region && (
          <>
            <span style={{ color: '#4B5563' }}>›</span>
            <span className="font-map text-xs" style={{ color: '#C9A84C' }}>{region.fictionalName}</span>
          </>
        )}
        {landmark && (
          <>
            <span style={{ color: '#4B5563' }}>›</span>
            <span className="font-map text-xs" style={{ color: '#C9A84C' }}>{landmark.fictionalName}</span>
          </>
        )}
      </div>

      {/* Back + zoom buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {zoomLevel > ZOOM_LEVELS.WORLD && (
          <button
            onClick={onBack}
            style={{
              background: 'rgba(10,14,26,0.9)',
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(201,168,76,0.15)'}
            onMouseLeave={e => e.target.style.background = 'rgba(10,14,26,0.9)'}
          >
            ← Back
          </button>
        )}
        <button
          onClick={onZoomIn}
          title="Zoom in"
          style={{
            background: 'rgba(10,14,26,0.9)',
            border: '1px solid rgba(201,168,76,0.4)',
            color: '#C9A84C',
            borderRadius: '6px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >+</button>
        <button
          onClick={onZoomOut}
          title="Zoom out"
          style={{
            background: 'rgba(10,14,26,0.9)',
            border: '1px solid rgba(201,168,76,0.4)',
            color: '#C9A84C',
            borderRadius: '6px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >−</button>
      </div>
    </div>
  )
}
