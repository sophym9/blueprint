import { ZOOM_LEVELS } from '../../lib/mapConfig'

export default function MapControls({ zoomLevel, activeRegion, activeLandmark, onBack, onZoomIn, onZoomOut }) {
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
        {onZoomIn && (
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
        )}
        {onZoomOut && (
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
        )}
      </div>
    </div>
  )
}
