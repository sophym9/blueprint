import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LANDMARKS } from '../../lib/landmarks'
import { useMemories } from '../../hooks/useMemories'
import MapPin from './MapPin'
import MemoryModal from '../memory/MemoryModal'
import CreateMemoryForm from '../memory/CreateMemoryForm'

const ZOOM_SCALE = 2.35
const clampPercent = (value) => Math.max(0, Math.min(100, value))

export default function LandmarkView({
  landmarkId,
  user,
  onPointsEarned,
  initialPendingPin = null,
  onComposerConsumed,
  focusPoint = null,
}) {
  const landmark = LANDMARKS[landmarkId]
  const navigate = useNavigate()
  const { memories, loading, fetchMemories, createMemory, updateMemory, deleteMemory, addReaction, removeReaction } = useMemories()
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [pendingPin, setPendingPin] = useState(null) // { pin_x, pin_y }
  const [showForm, setShowForm] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchMemories({ landmarkId })
  }, [landmarkId])

  useEffect(() => {
    if (!initialPendingPin) return
    setSelectedMemory(null)
    setSubmitError(null)
    setPendingPin(initialPendingPin)
    onComposerConsumed?.()
  }, [initialPendingPin, onComposerConsumed])

  function projectMapPointToScreen(point) {
    return {
      pin_x: 50 + (point.pin_x - mapFocusX) * ZOOM_SCALE,
      pin_y: 50 + (point.pin_y - mapFocusY) * ZOOM_SCALE,
    }
  }

  function handleContainerClick(e) {
    if (
      e.target.closest('.map-pin') ||
      e.target.closest('.memory-modal') ||
      e.target.closest('.create-memory-form')
    ) {
      return
    }
    const rect = containerRef.current.getBoundingClientRect()
    const screen_x = ((e.clientX - rect.left) / rect.width) * 100
    const screen_y = ((e.clientY - rect.top) / rect.height) * 100
    const pin_x = clampPercent(mapFocusX + (screen_x - 50) / ZOOM_SCALE)
    const pin_y = clampPercent(mapFocusY + (screen_y - 50) / ZOOM_SCALE)
    setSubmitError(null)
    setPendingPin({ pin_x, pin_y })
    setShowForm(true)
  }

  async function handleCreateMemory(formData) {
    try {
      const data = {
        ...formData,
        pin_x: pendingPin.pin_x,
        pin_y: pendingPin.pin_y,
      }
      if (landmarkId && landmark) {
        data.landmark_id = landmarkId
        data.region = landmark.region
      }
      const newMemory = await createMemory(data)
      setSubmitError(null)
      setPendingPin(null)
      setSelectedMemory(newMemory)
      if (newMemory.points_earned && onPointsEarned) {
        onPointsEarned(newMemory.points_earned)
      }
    } catch (error) {
      const status = error?.response?.status
      setSubmitError(
        status === 401 || status === 422
          ? 'Log in first to pin a memory.'
          : 'Could not pin this memory. Please try again.'
      )
    }
  }

  if (!landmark) return null

  const mapFocusX = focusPoint?.x ?? landmark.mapX
  const mapFocusY = focusPoint?.y ?? landmark.mapY
  const imageLeft = `${50 - mapFocusX * ZOOM_SCALE}%`
  const imageTop = `${50 - mapFocusY * ZOOM_SCALE}%`
  const pendingPinScreen = pendingPin ? projectMapPointToScreen(pendingPin) : null

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#1a1208',
        cursor: user ? 'crosshair' : 'default',
      }}
    >
      {/* Zoomed campus map */}
      <img
        src="/duke-campus-map.png"
        alt="Duke Campus Map"
        style={{
          position: 'absolute',
          left: imageLeft,
          top: imageTop,
          width: `${ZOOM_SCALE * 100}%`,
          height: `${ZOOM_SCALE * 100}%`,
          maxWidth: 'none',
          maxHeight: 'none',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />

      {/* Landmark tag */}
      <div
        style={{
          position: 'absolute',
          left: '16px',
          bottom: '16px',
          zIndex: 20,
          background: 'rgba(10,14,26,0.82)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '8px',
          padding: '8px 12px',
          maxWidth: '280px',
        }}
      >
        <div style={{ color: '#C9A84C', fontFamily: "'IM Fell English', serif", fontSize: '15px' }}>
          {landmark.fictionalName}
        </div>
        <div style={{ color: '#D1D5DB', fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}>
          {landmark.realName}
        </div>
      </div>

      {/* Memory pins */}
      {memories.map(memory => (
        <div key={memory.id} className="map-pin">
          <MapPin
            memory={{ ...memory, ...projectMapPointToScreen(memory) }}
            onClick={e => { e.stopPropagation(); setSelectedMemory(memory) }}
          />
        </div>
      ))}

      {/* Pending pin crosshair */}
      {pendingPinScreen && (
        <div
          style={{
            position: 'absolute',
            left: `${pendingPinScreen.pin_x}%`,
            top: `${pendingPinScreen.pin_y}%`,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            border: '2px solid #C9A84C',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}

      {/* Memory modal */}
      {selectedMemory && (
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

      {/* Confirm pin button — shown after tap, before form opens */}
      {pendingPin && !showForm && !selectedMemory && (
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
            📍 Drop Pin Here
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

      {/* Create memory form */}
      {pendingPin && showForm && !selectedMemory && (
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
    </div>
  )
}
