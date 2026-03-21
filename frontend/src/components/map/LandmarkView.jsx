import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LANDMARKS } from '../../lib/landmarks'
import { useMemories } from '../../hooks/useMemories'
import MapPin from './MapPin'
import MemoryModal from '../memory/MemoryModal'
import CreateMemoryForm from '../memory/CreateMemoryForm'

const ZOOM_SCALE = 2.35

export default function LandmarkView({ landmarkId, user, onPointsEarned, focusPoint = null }) {
  const landmark = LANDMARKS[landmarkId]
  const navigate = useNavigate()
  const { memories, loading, fetchMemories, createMemory, updateMemory, deleteMemory, addReaction, removeReaction } = useMemories()
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [pendingPin, setPendingPin] = useState(null) // { pin_x, pin_y }
  const [submitError, setSubmitError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchMemories({ landmarkId })
  }, [landmarkId])

  function handleContainerClick(e) {
    if (
      e.target.closest('.map-pin') ||
      e.target.closest('.memory-modal') ||
      e.target.closest('.create-memory-form')
    ) {
      return
    }
    const rect = containerRef.current.getBoundingClientRect()
    const pin_x = ((e.clientX - rect.left) / rect.width) * 100
    const pin_y = ((e.clientY - rect.top) / rect.height) * 100
    setSubmitError(null)
    setPendingPin({ pin_x, pin_y })
  }

  async function handleCreateMemory(formData) {
    try {
      const data = {
        ...formData,
        landmark_id: landmarkId,
        region: landmark.region,
        pin_x: pendingPin.pin_x,
        pin_y: pendingPin.pin_y,
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

      {/* Click-to-pin hint */}
      {user && !pendingPin && !selectedMemory && (
        <div style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 20,
          background: 'rgba(10,14,26,0.75)', border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '6px', padding: '6px 12px',
          fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9CA3AF',
          pointerEvents: 'none',
        }}>
          Tap anywhere to drop a memory
        </div>
      )}

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
            memory={memory}
            onClick={e => { e.stopPropagation(); setSelectedMemory(memory) }}
          />
        </div>
      ))}

      {/* Pending pin crosshair */}
      {pendingPin && (
        <div
          style={{
            position: 'absolute',
            left: `${pendingPin.pin_x}%`,
            top: `${pendingPin.pin_y}%`,
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

      {/* Create memory form — bottom sheet, no floating anchor */}
      {pendingPin && !selectedMemory && (
        <CreateMemoryForm
          onSubmit={handleCreateMemory}
          onCancel={() => {
            setPendingPin(null)
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
