import { useState, useRef, useEffect } from 'react'
import { ZOOM_LEVELS } from '../../lib/mapConfig'
import { useMapTransform } from '../../hooks/useMapTransform'
import WorldView from './WorldView'
import RegionView from './RegionView'
import LandmarkView from './LandmarkView'
import MapControls from './MapControls'

export default function DukeWorldMap({ user, onPointsEarned, memoryCounts = {} }) {
  const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.WORLD)
  const [activeRegion, setActiveRegion] = useState(null)
  const [activeLandmark, setActiveLandmark] = useState(null)
  const { cssTransform, handlers, zoomTo, reset, transform } = useMapTransform({ initialScale: 0.85 })
  const wrapperRef = useRef(null)

  // Prevent default wheel scroll on map
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const onWheel = e => { e.preventDefault(); handlers.onWheel(e) }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [handlers])

  function handleSelectRegion(regionKey) {
    setActiveRegion(regionKey)
    setZoomLevel(ZOOM_LEVELS.REGION)
    zoomTo(1, 0, 0)
  }

  function handleSelectLandmark(landmarkKey) {
    setActiveLandmark(landmarkKey)
    setZoomLevel(ZOOM_LEVELS.LANDMARK)
    zoomTo(1, 0, 0)
  }

  function handleBack() {
    if (zoomLevel === ZOOM_LEVELS.LANDMARK) {
      setZoomLevel(ZOOM_LEVELS.REGION)
      setActiveLandmark(null)
      zoomTo(1, 0, 0)
    } else if (zoomLevel === ZOOM_LEVELS.REGION) {
      setZoomLevel(ZOOM_LEVELS.WORLD)
      setActiveRegion(null)
      zoomTo(0.85, 0, 0)
    }
  }

  const regionMemoryCounts = {}
  const landmarkMemoryCounts = {}
  Object.entries(memoryCounts).forEach(([id, count]) => {
    landmarkMemoryCounts[id] = count
  })

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: zoomLevel === ZOOM_LEVELS.LANDMARK ? '#F5E6C8' : '#0A0E1A',
      }}
      onPointerDown={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerDown : undefined}
      onPointerMove={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerMove : undefined}
      onPointerUp={zoomLevel !== ZOOM_LEVELS.LANDMARK ? handlers.onPointerUp : undefined}
    >
      {/* Controls overlay */}
      <MapControls
        zoomLevel={zoomLevel}
        activeRegion={activeRegion}
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
          />
        </div>
      ) : (
        // World/region view — pannable/zoomable
        <div
          style={{
            transform: cssTransform,
            transition: 'transform 0.3s ease',
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {zoomLevel === ZOOM_LEVELS.WORLD && (
            <WorldView
              onSelectRegion={handleSelectRegion}
              memoryCounts={regionMemoryCounts}
            />
          )}
          {zoomLevel === ZOOM_LEVELS.REGION && activeRegion && (
            <RegionView
              region={activeRegion}
              onSelectLandmark={handleSelectLandmark}
              memoryCounts={landmarkMemoryCounts}
            />
          )}
        </div>
      )}
    </div>
  )
}
