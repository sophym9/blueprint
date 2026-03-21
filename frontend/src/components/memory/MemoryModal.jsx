import YearBadge from './YearBadge'
import ReactionBar from './ReactionBar'
import { LANDMARKS } from '../../lib/landmarks'

const YEAR_BORDER_COLORS = {
  freshman: '#4ADE80',
  sophomore: '#FACC15',
  junior: '#FB923C',
  senior: '#003087',
}

export default function MemoryModal({ memory, user, onClose, onAddReaction, onRemoveReaction }) {
  const borderColor = YEAR_BORDER_COLORS[memory.year_tag] || '#C9A84C'
  const landmark = LANDMARKS[memory.landmark_id]
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  function formatDate(str) {
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      {/* Card */}
      <div
        className="animate-loot-open holographic-hover"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111827',
          border: `2px solid ${borderColor}`,
          borderRadius: '12px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: `0 0 32px ${borderColor}40, 0 24px 48px rgba(0,0,0,0.6)`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top strip in year color */}
        <div style={{ height: '4px', background: borderColor }} />

        {/* Card body */}
        <div style={{ padding: '20px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: borderColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#0A0E1A',
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  flexShrink: 0,
                }}
              >
                {memory.author_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#F9FAFB', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {memory.author_name}
                </p>
                <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {formatDate(memory.created_at)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <YearBadge year={memory.year_tag} />
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '2px',
                  lineHeight: 1,
                }}
              >×</button>
            </div>
          </div>

          {/* Location tag */}
          {landmark && (
            <p style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", marginBottom: '12px' }}>
              🗺 {landmark.fictionalName} · {landmark.realName}
            </p>
          )}

          {/* Photo */}
          {memory.photo_url && (
            <div
              style={{
                width: '100%',
                paddingTop: '56.25%', // 16:9
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '14px',
                background: '#1F2937',
              }}
            >
              <img
                src={`${apiBase}${memory.photo_url}`}
                alt="Memory photo"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Memory text */}
          {memory.memory_text && (
            <p
              style={{
                fontSize: '15px',
                color: '#E5E7EB',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: '1.6',
                marginBottom: '14px',
              }}
            >
              {memory.memory_text}
            </p>
          )}

          {/* Audio */}
          {memory.audio_url && (
            <div style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>
                🎙 Voice note
              </p>
              <audio
                src={`${apiBase}${memory.audio_url}`}
                controls
                style={{ width: '100%', height: '36px' }}
              />
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '14px' }} />

          {/* Reactions */}
          <ReactionBar
            memory={memory}
            user={user}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
          />
        </div>
      </div>
    </div>
  )
}
