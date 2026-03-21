import { useLeaderboard } from '../../hooks/useLeaderboard'

const RANK_GLOW = ['#FFD700', '#C0C0C0', '#CD7F32'] // gold, silver, bronze

export default function Leaderboard({ isOpen, onClose }) {
  const { leaders, loading } = useLeaderboard()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 40,
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '300px',
          background: '#0D1525',
          borderLeft: '1px solid rgba(201,168,76,0.3)',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(201,168,76,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 className="font-display" style={{ color: '#C9A84C', fontSize: '22px', letterSpacing: '0.08em' }}>
            HALL OF LEGENDS
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >×</button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loading ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif" }}>
              Loading legends...
            </p>
          ) : leaders.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif" }}>
              No legends yet. Be the first!
            </p>
          ) : (
            leaders.map((leader, i) => {
              const glowColor = i < 3 ? RANK_GLOW[i] : null
              return (
                <div
                  key={leader.id}
                  className="animate-count-up"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    background: i < 3 ? `${RANK_GLOW[i]}08` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i < 3 ? RANK_GLOW[i] + '30' : 'rgba(255,255,255,0.05)'}`,
                    boxShadow: i < 3 ? `0 0 12px ${RANK_GLOW[i]}20` : 'none',
                    animationDelay: `${i * 0.08}s`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Rank number */}
                  <span
                    className="font-display"
                    style={{
                      color: glowColor || '#4B5563',
                      fontSize: '20px',
                      width: '28px',
                      textAlign: 'center',
                      flexShrink: 0,
                      textShadow: glowColor ? `0 0 8px ${glowColor}` : 'none',
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* Avatar */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: glowColor || '#374151',
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
                    {leader.name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Name + rank */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#F9FAFB',
                        fontFamily: "'DM Sans', sans-serif",
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {leader.name}
                    </p>
                    <p
                      className="font-map"
                      style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}
                    >
                      {leader.rank_title}
                    </p>
                  </div>

                  {/* Points */}
                  <span
                    className="font-display"
                    style={{
                      color: glowColor || '#C9A84C',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {leader.memory_points}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(201,168,76,0.2)',
            textAlign: 'center',
          }}
        >
          <p className="font-map" style={{ fontSize: '12px', color: '#6B7280', fontStyle: 'italic' }}>
            Drop pins to earn Memory Points
          </p>
        </div>
      </div>
    </>
  )
}
