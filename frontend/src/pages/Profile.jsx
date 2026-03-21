import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import YearBadge from '../components/memory/YearBadge'
import { LANDMARKS } from '../lib/landmarks'
import { REGIONS } from '../lib/mapConfig'

const ZONES = [
  { key: 'west', label: 'Western Keep', color: '#003087' },
  { key: 'east', label: 'Eastern Grove', color: '#4ADE80' },
  { key: 'central', label: 'Central Crossing', color: '#FACC15' },
]

export default function Profile({ user }) {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
        minHeight: '100%',
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
            <div
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
                flexShrink: 0,
                boxShadow: '0 0 24px rgba(201,168,76,0.3)',
              }}
            >
              {user.name?.[0]?.toUpperCase() || '?'}
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
                    {(user.zones_unlocked || []).length}/3
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {memories.map(m => {
              const landmark = LANDMARKS[m.landmark_id]
              const yearBorderColor = {
                freshman: '#4ADE80', sophomore: '#FACC15', junior: '#FB923C', senior: '#003087'
              }[m.year_tag] || '#C9A84C'

              return (
                <div
                  key={m.id}
                  className="holographic-hover"
                  style={{
                    background: '#111827',
                    border: `1px solid ${yearBorderColor}40`,
                    borderLeft: `3px solid ${yearBorderColor}`,
                    borderRadius: '8px',
                    padding: '14px',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {m.photo_url && (
                    <img
                      src={`${apiBase}${m.photo_url}`}
                      alt="Memory"
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '10px',
                      }}
                    />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      className="font-map"
                      style={{ fontSize: '11px', color: '#9CA3AF' }}
                    >
                      {landmark?.fictionalName || m.landmark_id}
                    </span>
                    <YearBadge year={m.year_tag} />
                  </div>
                  {m.memory_text && (
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#D1D5DB',
                        fontFamily: "'DM Sans', sans-serif",
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {m.memory_text}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: '10px',
                      color: '#4B5563',
                      marginTop: '8px',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {new Date(m.created_at).toLocaleDateString()}
                    {m.reactions?.length > 0 && ` · ${m.reactions.length} reactions`}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
