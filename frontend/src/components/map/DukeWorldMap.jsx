import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ZOOM_LEVELS, MAP_W, MAP_H } from '../../lib/mapConfig'
import { useMapTransform } from '../../hooks/useMapTransform'
import { useMemories } from '../../hooks/useMemories'
import WorldView from './WorldView'
import LandmarkView from './LandmarkView'
import MapControls from './MapControls'
import CreateMemoryForm from '../memory/CreateMemoryForm'
import MemoryModal from '../memory/MemoryModal'

export default function DukeWorldMap({ user, onPointsEarned, memoryCounts = {} }) {
  const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.WORLD)
  const [activeLandmark, setActiveLandmark] = useState(null)
  const [composerSeedPoint, setComposerSeedPoint] = useState(null)
  const [focusPoint, setFocusPoint] = useState(null)

  const [pendingPin, setPendingPin] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const navigate = useNavigate()

  const {
    memories, fetchMemories, createMemory, updateMemory, deleteMemory,
    addReaction, removeReaction,
  } = useMemories()

  const { cssTransform, isDragging, handlers, makeWheelHandler, zoomTo, transform } = useMapTransform({
    initialScale: 1,
    maxScale: 4,
    mapW: MAP_W,
    mapH: MAP_H,
  })
  const wrapperRef = useRef(null)

  useEffect(() => {
    fetchMemories()
  }, [fetchMemories])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const onWheel = makeWheelHandler(wrapperRef)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [makeWheelHandler])

  function handleSelectLandmark(landmarkKey, clickedPoint = null) {
    setPendingPin(null)
    setShowForm(false)
    setSelectedMemory(null)
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

  function handleSelectMapPoint(clickedPoint) {
    setPendingPin({ pin_x: clickedPoint.x, pin_y: clickedPoint.y })
    setShowForm(false)
    setSelectedMemory(null)
    setSubmitError(null)
  }

  async function handleCreateMemory(formData) {
    try {
      const data = {
        ...formData,
        pin_x: pendingPin.pin_x,
        pin_y: pendingPin.pin_y,
      }
      const newMemory = await createMemory(data)
      setSubmitError(null)
      setPendingPin(null)
      setShowForm(false)
      setSelectedMemory(newMemory)
      if (newMemory.points_earned && onPointsEarned) {
        onPointsEarned(newMemory.points_earned)
      }
    } catch (error) {
      const status = error?.response?.status
      setSubmitError(
        status === 401 || status === 422
          ? 'Log in first to pin a memory.'
          : 'Could not pin this memory. Please try again.',
      )
    }
  }

  function handleBack() {
    if (zoomLevel === ZOOM_LEVELS.LANDMARK) {
      setZoomLevel(ZOOM_LEVELS.WORLD)
      setActiveLandmark(null)
      setComposerSeedPoint(null)
      setFocusPoint(null)
      zoomTo(0.85, 0, 0)
      fetchMemories()
    }
  }

  const isWorld = zoomLevel !== ZOOM_LEVELS.LANDMARK

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
      onPointerDown={isWorld ? handlers.onPointerDown : undefined}
      onPointerMove={isWorld ? handlers.onPointerMove : undefined}
      onPointerUp={isWorld ? handlers.onPointerUp : undefined}
      onPointerLeave={isWorld ? handlers.onPointerLeave : undefined}
    >
      <MapControls
        zoomLevel={zoomLevel}
        activeLandmark={activeLandmark}
        onBack={handleBack}
        onZoomIn={isWorld ? () => zoomTo(transform.scale + 0.4, transform.x, transform.y) : null}
        onZoomOut={isWorld ? () => zoomTo(transform.scale - 0.4, transform.x, transform.y) : null}
      />

      {!isWorld ? (
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
            onSelectMapPoint={handleSelectMapPoint}
            onSelectMemory={setSelectedMemory}
            memoryCounts={memoryCounts}
            memories={memories}
            pendingPin={pendingPin}
            zoomScale={transform.scale}
          />
        </div>
      )}

      {/* World-level: confirm pin placement */}
      {isWorld && pendingPin && !showForm && !selectedMemory && (
        <div
          className="create-memory-form"
          style={{
            position: 'fixed', bottom: '24px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: '8px', zIndex: 90,
          }}
        >
          <button
            onClick={e => { e.stopPropagation(); setShowForm(true) }}
            className="font-display"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
              border: 'none', color: '#0A0E1A',
              borderRadius: '999px', padding: '10px 24px',
              cursor: 'pointer', fontSize: '14px',
              letterSpacing: '0.08em',
              boxShadow: '0 0 20px rgba(201,168,76,0.5)',
            }}
          >
            📍 Drop Memory Here
          </button>
          <button
            onClick={e => { e.stopPropagation(); setPendingPin(null); setSubmitError(null) }}
            style={{
              background: 'rgba(10,14,26,0.85)', border: '1px solid #374151',
              color: '#6B7280', borderRadius: '999px',
              padding: '10px 16px', cursor: 'pointer', fontSize: '13px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* World-level: create memory form */}
      {isWorld && pendingPin && showForm && !selectedMemory && (
        <CreateMemoryForm
          onSubmit={handleCreateMemory}
          onCancel={() => {
            setPendingPin(null)
            setShowForm(false)
            setSubmitError(null)
          }}
          requireLogin={!user}
          onLoginRequired={() => navigate('/login')}
          errorMessage={submitError}
        />
      )}

      {/* World-level: memory modal */}
      {isWorld && selectedMemory && (
        <div className="memory-modal">
          <MemoryModal
            memory={memories.find(m => m.id === selectedMemory.id) || selectedMemory}
            user={user}
            onClose={() => setSelectedMemory(null)}
            onAddReaction={addReaction}
            onRemoveReaction={removeReaction}
            onUpdate={async (data) => {
              const updated = await updateMemory(selectedMemory.id, data)
              setSelectedMemory(updated)
            }}
            onDelete={async () => {
              await deleteMemory(selectedMemory.id)
              setSelectedMemory(null)
            }}
          />
        </div>
      )}
    </div>
  )
}
