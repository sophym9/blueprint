import { useEffect, useRef, useState } from 'react'
import { LANDMARKS } from '../../lib/landmarks'
import { useMemories } from '../../hooks/useMemories'
import MapPin from './MapPin'
import MemoryModal from '../memory/MemoryModal'
import CreateMemoryForm from '../memory/CreateMemoryForm'

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

export default function LandmarkView({ landmarkId, user, onPointsEarned }) {
  const landmark = LANDMARKS[landmarkId]
  const { memories, loading, fetchMemories, createMemory, addReaction, removeReaction } = useMemories()
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [pendingPin, setPendingPin] = useState(null) // { pin_x, pin_y }
  const containerRef = useRef(null)

  useEffect(() => {
    fetchMemories({ landmarkId })
  }, [landmarkId])

  function handleContainerClick(e) {
    // Don't open form if clicking on a pin or modal
    if (e.target.closest('.map-pin') || e.target.closest('.memory-modal')) return
    if (!user) return

    const rect = containerRef.current.getBoundingClientRect()
    const pin_x = ((e.clientX - rect.left) / rect.width) * 100
    const pin_y = ((e.clientY - rect.top) / rect.height) * 100
    setPendingPin({ pin_x, pin_y })
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

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#F5E6C8',
        cursor: user ? 'crosshair' : 'default',
      }}
    >
      {/* Landmark illustration fills screen */}
      <img
        src={landmarkSvgs[landmarkId]}
        alt={landmark.realName}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Click hint if logged in */}
      {user && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(10,14,26,0.7)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            color: '#9CA3AF',
            fontFamily: "'DM Sans', sans-serif",
            pointerEvents: 'none',
          }}
        >
          Click anywhere to pin a memory
        </div>
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
