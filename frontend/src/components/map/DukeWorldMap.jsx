import { useState, useRef, useEffect } from 'react'
import { ZOOM_LEVELS } from '../../lib/mapConfig'
import { useMapTransform } from '../../hooks/useMapTransform'
import WorldView from './WorldView'
import LandmarkView from './LandmarkView'
import MapControls from './MapControls'

export default function DukeWorldMap({ user, onPointsEarned, memoryCounts = {} }) {
  const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.WORLD)
  const [activeLandmark, setActiveLandmark] = useState(null)
  const [composerSeedPoint, setComposerSeedPoint] = useState(null)
  const [focusPoint, setFocusPoint] = useState(null)
  const { cssTransform, isDragging, handlers, makeWheelHandler, zoomTo, transform } = useMapTransform({ initialScale: 0.85 })
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
    setZoomLevel(ZOOM_LEVELS.LANDMARK)
    setComposerSeedPoint(
      clickedPoint
        ? { pin_x: clickedPoint.x, pin_y: clickedPoint.y }
        : { pin_x: 50, pin_y: 50 },
    )
    setFocusPoint(clickedPoint)
    zoomTo(1, 0, 0)
  }

  function handleBack() {
    if (zoomLevel === ZOOM_LEVELS.LANDMARK) {
      setZoomLevel(ZOOM_LEVELS.WORLD)
      setActiveLandmark(null)
      setComposerSeedPoint(null)
      setFocusPoint(null)
      zoomTo(0.85, 0, 0)
    }
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#1a1208',
      }}
      onPointerDown={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerDown : undefined}
      onPointerMove={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerMove : undefined}
      onPointerUp={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerUp : undefined}
      onPointerLeave={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerLeave : undefined}
    >
      {/* Controls overlay */}
      <MapControls
        zoomLevel={zoomLevel}
        activeLandmark={activeLandmark}
        onBack={handleBack}
        onZoomIn={() => zoomTo(Math.min(transform.scale + 0.3, 4), transform.x, transform.y)}
        onZoomOut={() => zoomTo(Math.max(transform.scale - 0.3, 0.4), transform.x, transform.y)}
      />

      {/* Map content */}
      {zoomLevel === ZOOM_LEVELS.LANDMARK ? (
        // Landmark view fills full screen, no transform
        <div style={{ width: '100%', height: '100%' }}>
          <LandmarkView
            landmarkId={activeLandmark}
            user={user}
            onPointsEarned={onPointsEarned}
            initialPendingPin={composerSeedPoint}
            onComposerConsumed={() => setComposerSeedPoint(null)}
            focusPoint={focusPoint}
          />
        </div>
      ) : (
        // World/region view — pannable/zoomable
        <div
          style={{
            transform: cssTransform,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <WorldView
            onSelectLandmark={handleSelectLandmark}
            memoryCounts={memoryCounts}
          />
        </div>
      )}
    </div>
  )
}
