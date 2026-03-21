import { useEffect, useRef, useState } from 'react'
import { LANDMARKS } from '../../lib/landmarks'
import { useMemories } from '../../hooks/useMemories'
import MapPin from './MapPin'
import MemoryModal from '../memory/MemoryModal'
import CreateMemoryForm from '../memory/CreateMemoryForm'

const ZOOM_SCALE = 2.35

export default function LandmarkView({ landmarkId, user, onPointsEarned }) {
  const landmark = LANDMARKS[landmarkId]
  const { memories, loading, fetchMemories, createMemory, addReaction, removeReaction } = useMemories()
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [pendingPin, setPendingPin] = useState(null) // { pin_x, pin_y }
  const [isDropMode, setIsDropMode] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchMemories({ landmarkId })
  }, [landmarkId])

  function handleContainerClick(e) {
    if (
      e.target.closest('.map-pin') ||
      e.target.closest('.memory-modal') ||
      e.target.closest('.drop-memory-btn')
    ) {
      return
    }
    if (!user || !isDropMode) return

    const rect = containerRef.current.getBoundingClientRect()
    const pin_x = ((e.clientX - rect.left) / rect.width) * 100
    const pin_y = ((e.clientY - rect.top) / rect.height) * 100
    setPendingPin({ pin_x, pin_y })
    setIsDropMode(false)
  }

  async function handleCreateMemory(formData) {
    const data = {
      ...formData,
      landmark_id: landmarkId,
      region: landmark.region,
      pin_x: pendingPin.pin_x,
      pin_y: pendingPin.pin_y,
    }
    const newMemory = await createMemory(data)
    setPendingPin(null)
    if (newMemory.points_earned && onPointsEarned) {
      onPointsEarned(newMemory.points_earned)
    }
  }

  if (!landmark) return null

  const imageLeft = `${50 - landmark.mapX * ZOOM_SCALE}%`
  const imageTop = `${50 - landmark.mapY * ZOOM_SCALE}%`

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
        cursor: user && isDropMode ? 'crosshair' : 'default',
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

      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {isDropMode && user && (
          <span
            style={{
              background: 'rgba(10,14,26,0.82)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              color: '#9CA3AF',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Click map to place
          </span>
        )}

        {user && (
          <button
            type="button"
            className="drop-memory-btn"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMemory(null)
              setPendingPin(null)
              setIsDropMode((current) => !current)
            }}
            style={{
              background: isDropMode
                ? 'linear-gradient(135deg, #E8C56A, #C9A84C)'
                : 'rgba(10,14,26,0.88)',
              border: '1px solid #C9A84C',
              color: isDropMode ? '#0A0E1A' : '#C9A84C',
              borderRadius: '8px',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isDropMode ? '0 0 14px rgba(201,168,76,0.4)' : 'none',
            }}
          >
            Drop memory
          </button>
        )}
      </div>

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

      {/* Drop memory hint if logged in */}
      {user && (
        <div />
      )}

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
            memory={selectedMemory}
            user={user}
            onClose={() => setSelectedMemory(null)}
            onAddReaction={addReaction}
            onRemoveReaction={removeReaction}
          />
        </div>
      )}

      {/* Create memory form */}
      {pendingPin && !selectedMemory && (
        <CreateMemoryForm
          onSubmit={handleCreateMemory}
          onCancel={() => setPendingPin(null)}
        />
      )}
    </div>
  )
}
