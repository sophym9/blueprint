import { useState } from 'react'

const EMOJIS = ['❤️', '😂', '😭', '🔥', '💙', '🏀', '🎓', '⚔️']

export default function ReactionBar({ memory, user, onAddReaction, onRemoveReaction }) {
  const [showPicker, setShowPicker] = useState(false)

  // Group reactions by emoji
  const grouped = {}
  for (const r of memory.reactions || []) {
    if (!grouped[r.emoji]) grouped[r.emoji] = []
    grouped[r.emoji].push(r)
  }

  function getMyReaction(emoji) {
    return (memory.reactions || []).find(r => r.emoji === emoji && r.user_id === user?.id)
  }

  async function handleEmojiClick(emoji) {
    if (!user) return
    const mine = getMyReaction(emoji)
    if (mine) {
      await onRemoveReaction(mine.id, memory.id)
    } else {
      await onAddReaction(memory.id, emoji)
    }
    setShowPicker(false)
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {/* Existing reactions */}
      {Object.entries(grouped).map(([emoji, reactions]) => {
        const mine = reactions.some(r => r.user_id === user?.id)
        return (
          <button
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            style={{
              background: mine ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
              border: mine ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '4px 10px',
              cursor: user ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#D1D5DB',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              transition: 'all 0.15s',
            }}
          >
            {emoji} <span>{reactions.length}</span>
          </button>
        )
      })}

      {/* Add reaction button */}
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPicker(p => !p)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '4px 10px',
              cursor: 'pointer',
              color: '#9CA3AF',
              fontSize: '14px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.target.style.borderColor = '#C9A84C'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            +
          </button>
          {showPicker && (
            <div
              style={{
                position: 'absolute',
                bottom: '110%',
                left: '0',
                background: '#1F2937',
                border: '1px solid #C9A84C',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                width: '200px',
                zIndex: 50,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => handleEmojiClick(e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={el => el.target.style.transform = 'scale(1.3)'}
                  onMouseLeave={el => el.target.style.transform = 'scale(1)'}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* "I was there too" button */}
      {user && memory.user_id !== user.id && (
        <button
          onClick={() => handleEmojiClick('💙')}
          style={{
            background: getMyReaction('💙') ? 'rgba(0,48,135,0.3)' : 'transparent',
            border: '1px solid #003087',
            color: '#60A5FA',
            borderRadius: '999px',
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(0,48,135,0.3)'
            e.target.style.boxShadow = '0 0 8px rgba(0,48,135,0.5)'
          }}
          onMouseLeave={e => {
            if (!getMyReaction('💙')) e.target.style.background = 'transparent'
            e.target.style.boxShadow = 'none'
          }}
        >
          💙 I was there too
        </button>
      )}
    </div>
  )
}
