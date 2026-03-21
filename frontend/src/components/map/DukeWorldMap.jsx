import { useState, useRef, useEffect } from 'react'
import { ZOOM_LEVELS, MAP_W, MAP_H } from '../../lib/mapConfig'
import { useMapTransform } from '../../hooks/useMapTransform'
import WorldView from './WorldView'
import LandmarkView from './LandmarkView'
import MapControls from './MapControls'

export default function DukeWorldMap({ user, onPointsEarned, memoryCounts = {} }) {
  const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.WORLD)
  const [activeLandmark, setActiveLandmark] = useState(null)
  const [focusPoint, setFocusPoint] = useState(null)

  const { cssTransform, isDragging, handlers, makeWheelHandler, zoomTo, transform } = useMapTransform({
    initialScale: 1,
    maxScale: 4,
    mapW: MAP_W,
    mapH: MAP_H,
  })
  const wrapperRef = useRef(null)

  // Attach non-passive wheel listener so we can preventDefault
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const onWheel = makeWheelHandler(wrapperRef)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [makeWheelHandler])

  function handleSelectLandmark(landmarkKey, clickedPoint = null) {
    setActiveLandmark(landmarkKey)
    setFocusPoint(clickedPoint)
    setZoomLevel(ZOOM_LEVELS.LANDMARK)
    zoomTo(1, 0, 0)
  }

  function handleBack() {
    setZoomLevel(ZOOM_LEVELS.WORLD)
    setActiveLandmark(null)
    setFocusPoint(null)
    // Let the clamper compute the right fit-to-screen scale
    zoomTo(1, 0, 0)
  }

  const isLandmark = zoomLevel === ZOOM_LEVELS.LANDMARK

  return (
    <div
      ref={wrapperRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#1a1208' }}
      onPointerDown={!isLandmark ? handlers.onPointerDown : undefined}
      onPointerMove={!isLandmark ? handlers.onPointerMove : undefined}
      onPointerUp={!isLandmark ? handlers.onPointerUp : undefined}
      onPointerLeave={!isLandmark ? handlers.onPointerLeave : undefined}
    >
      <MapControls
        zoomLevel={zoomLevel}
        activeLandmark={activeLandmark}
        onBack={handleBack}
        onZoomIn={!isLandmark ? () => zoomTo(transform.scale + 0.4, transform.x, transform.y) : null}
        onZoomOut={!isLandmark ? () => zoomTo(transform.scale - 0.4, transform.x, transform.y) : null}
      />

      {isLandmark ? (
        <div style={{ width: '100%', height: '100%' }}>
          <LandmarkView
            landmarkId={activeLandmark}
            user={user}
            onPointsEarned={onPointsEarned}
            focusPoint={focusPoint}
          />
        </div>
      ) : (
        <div style={{
          transform: cssTransform,
          transition: isDragging ? 'none' : 'transform 0.35s ease',
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
          <WorldView onSelectLandmark={handleSelectLandmark} memoryCounts={memoryCounts} />
        </div>
      )}
    </div>
  )
}
