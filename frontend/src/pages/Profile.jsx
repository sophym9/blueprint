import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { compressImage } from '../lib/compressImage'
import YearBadge from '../components/memory/YearBadge'
import MemoryModal from '../components/memory/MemoryModal'
import { LANDMARKS } from '../lib/landmarks'
import { REGIONS } from '../lib/mapConfig'

const ZONES = [
  { key: 'west', label: 'Western Keep', color: '#4A90E2' },
  { key: 'central', label: 'Central Crossing', color: '#C9A84C' },
]

export default function Profile({ user, onUserUpdate }) {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef(null)
  const navigate = useNavigate()

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append('file', compressed)
      const res = await api.post('/upload/photo', formData)
      await api.patch(`/users/${user.id}`, { avatar_url: res.data.url })
      onUserUpdate?.({ ...user, avatar_url: res.data.url })
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleGraduationDateChange(e) {
    const graduation_date = e.target.value
    try {
      await api.patch(`/users/${user.id}`, { graduation_date })
      onUserUpdate?.({ ...user, graduation_date })
    } catch {}
  }

  async function handleUpdate(data) {
    const res = await api.patch(`/memories/${selectedMemory.id}`, data)
    setMemories(prev => prev.map(m => m.id === selectedMemory.id ? { ...m, ...res.data } : m))
    setSelectedMemory(prev => ({ ...prev, ...res.data }))
  }

  async function handleDelete() {
    await api.delete(`/memories/${selectedMemory.id}`)
    setMemories(prev => prev.filter(m => m.id !== selectedMemory.id))
    setSelectedMemory(null)
  }

  async function handleAddReaction(memoryId, emoji) {
    const res = await api.post('/reactions/', { memory_id: memoryId, emoji })
    setMemories(prev => prev.map(m => m.id === memoryId ? { ...m, reactions: [...(m.reactions || []), res.data] } : m))
  }

  async function handleRemoveReaction(reactionId, memoryId) {
    await api.delete(`/reactions/${reactionId}`)
    setMemories(prev => prev.map(m => m.id === memoryId ? { ...m, reactions: (m.reactions || []).filter(r => r.id !== reactionId) } : m))
  }

  useEffect(() => {
    if (!user) return
    api.get('/memories/', { params: {} })
      .then(res => setMemories(res.data.filter(m => m.user_id === user.id)))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    navigate('/login')
    return null
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  return (
    <div
      style={{
        height: '100%',
        paddingTop: '68px',
        paddingBottom: '48px',
        background: 'var(--bg-dark)',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

        {/* RPG Character Sheet Header */}
        <div
          style={{
            background: '#111827',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '12px',
            padding: '28px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(0,48,135,0.15) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', position: 'relative' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              <div
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #003087, #C9A84C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 0 24px rgba(201,168,76,0.3)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.name?.[0]?.toUpperCase() || '?')
                }
                {/* Hover overlay */}
                <div
                  className="avatar-edit-overlay"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                    opacity: uploadingAvatar ? 1 : 0,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {uploadingAvatar ? '⏳' : '📷'}
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1
                  className="font-display"
                  style={{ color: '#F9FAFB', fontSize: '28px', letterSpacing: '0.05em' }}
                >
                  {user.name}
                </h1>
                {user.graduation_year && (
                  <span
                    style={{
                      background: 'rgba(0,48,135,0.3)',
                      border: '1px solid #003087',
                      color: '#93C5FD',
                      fontSize: '12px',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Class of {user.graduation_year}
                  </span>
                )}
              </div>

              <p
                className="font-map"
                style={{
                  color: '#C9A84C',
                  fontSize: '16px',
                  fontStyle: 'italic',
                  marginBottom: '16px',
                }}
              >
                {user.rank_title}
              </p>

              {/* Graduation date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>🎓 Graduation:</span>
                <input
                  type="date"
                  defaultValue={user.graduation_date || '2026-05-10'}
                  onChange={handleGraduationDateChange}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    color: '#C9A84C',
                    fontSize: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <span className="font-display" style={{ color: '#C9A84C', fontSize: '24px' }}>
                    {user.memory_points || 0}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B7280', display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
                    Memory Points
                  </span>
                </div>
                <div>
                  <span className="font-display" style={{ color: '#4ADE80', fontSize: '24px' }}>
                    {memories.length}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B7280', display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
                    Memories Pinned
                  </span>
                </div>
                <div>
                  <span className="font-display" style={{ color: '#FACC15', fontSize: '24px' }}>
                    {(user.zones_unlocked || []).length}/2
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B7280', display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
                    Zones Explored
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Zone badges */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            {ZONES.map(zone => {
              const unlocked = (user.zones_unlocked || []).includes(zone.key)
              return (
                <div
                  key={zone.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: unlocked ? `${zone.color}15` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${unlocked ? zone.color + '60' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '999px',
                    padding: '4px 12px',
                    opacity: unlocked ? 1 : 0.4,
                  }}
                >
                  <span style={{ fontSize: '12px' }}>{unlocked ? '⚔' : '🔒'}</span>
                  <span
                    className="font-map"
                    style={{ fontSize: '12px', color: unlocked ? zone.color : '#6B7280' }}
                  >
                    {zone.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Memories grid */}
        <h2
          className="font-display"
          style={{ color: '#C9A84C', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '16px' }}
        >
          MY MEMORIES
        </h2>

        {loading ? (
          <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
        ) : memories.length === 0 ? (
          <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
            No memories yet. Explore the map and pin your first!
          </p>
        ) : (
          <div style={{ columns: 2, columnGap: '20px' }}>
            {memories.map(m => {
              const landmark = LANDMARKS[m.landmark_id]
              const yearBorderColor = {
                freshman: '#4ADE80', sophomore: '#FACC15', junior: '#FB923C', senior: '#003087'
              }[m.year_tag] || '#C9A84C'
              // Deterministic rotation: ±3deg based on id
              const rot = (m.id.charCodeAt(0) % 7) - 3

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMemory(m)}
                  style={{
                    breakInside: 'avoid',
                    display: 'inline-block',
                    width: '100%',
                    marginBottom: '20px',
                    transform: `rotate(${rot}deg)`,
                    transformOrigin: 'center top',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = `rotate(0deg) scale(1.03)`
                    e.currentTarget.style.zIndex = '10'
                    e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${yearBorderColor}60`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = `rotate(${rot}deg) scale(1)`
                    e.currentTarget.style.zIndex = '1'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Tape strip */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-1deg)',
                    width: '48px',
                    height: '20px',
                    background: 'rgba(201,168,76,0.25)',
                    borderRadius: '2px',
                    zIndex: 2,
                    backdropFilter: 'blur(2px)',
                  }} />

                  <div style={{
                    background: m.photo_url ? 'transparent' : `rgba(245,230,200,0.04)`,
                    border: `1px solid ${yearBorderColor}50`,
                    borderTop: `3px solid ${yearBorderColor}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}>
                    {m.photo_url && (
                      <img
                        src={`${apiBase}${m.photo_url}`}
                        alt="Memory"
                        style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    <div style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span className="font-map" style={{ fontSize: '10px', color: '#9CA3AF' }}>
                          {landmark?.fictionalName || m.landmark_id}
                        </span>
                        <YearBadge year={m.year_tag} />
                      </div>
                      {m.memory_text && (
                        <p style={{
                          fontSize: '13px', color: '#D1D5DB',
                          fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5',
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                        }}>
                          {m.memory_text}
                        </p>
                      )}
                      <p style={{ fontSize: '10px', color: '#4B5563', marginTop: '8px', fontFamily: "'DM Sans', sans-serif" }}>
                        {new Date(m.created_at).toLocaleDateString()}
                        {m.reactions?.length > 0 && ` · ${m.reactions.length} ✦`}
                        {m.song_url && ' · 🎵'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedMemory && (
        <MemoryModal
          memory={memories.find(m => m.id === selectedMemory.id) || selectedMemory}
          user={user}
          onClose={() => setSelectedMemory(null)}
          onAddReaction={handleAddReaction}
          onRemoveReaction={handleRemoveReaction}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
