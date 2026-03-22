const YEARS = [
  { value: 'freshman', label: 'Freshman', color: '#4ADE80', icon: '🌱' },
  { value: 'sophomore', label: 'Sophomore', color: '#FACC15', icon: '🔥' },
  { value: 'junior', label: 'Junior', color: '#FB923C', icon: '⚡' },
  { value: 'senior', label: 'Senior', color: '#6B8CFF', icon: '🎓' },
]

export default function YearFilter({ active, onChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 30,
        display: 'flex',
        gap: '5px',
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        padding: '5px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {YEARS.map(yr => {
        const isActive = active === yr.value
        return (
          <button
            key={yr.value}
            onClick={e => {
              e.stopPropagation()
              onChange(isActive ? null : yr.value)
            }}
            onPointerDown={e => e.stopPropagation()}
            style={{
              background: isActive ? yr.color + '22' : 'transparent',
              border: `1px solid ${isActive ? yr.color + '80' : 'transparent'}`,
              borderRadius: '8px',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
              opacity: active && !isActive ? 0.35 : 1,
            }}
          >
            <span style={{ fontSize: '12px' }}>{yr.icon}</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: isActive ? yr.color : '#9CA3AF',
              letterSpacing: '0.02em',
            }}>
              {yr.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
