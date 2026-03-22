const YEARS = [
  { value: 'freshman', label: 'Freshman', color: '#4ADE80', icon: '🌱' },
  { value: 'sophomore', label: 'Sophomore', color: '#FACC15', icon: '🔥' },
  { value: 'junior', label: 'Junior', color: '#FB923C', icon: '⚡' },
  { value: 'senior', label: 'Senior', color: '#6B8CFF', icon: '🎓' },
]

const VISIBILITY = [
  { value: 'public', label: 'Public', icon: '👁', color: '#C9A84C' },
  { value: 'private', label: 'Private', icon: '🔒', color: '#9CA3AF' },
]

export default function YearFilter({ active, onChange, visibility, onVisibilityChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
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

      <div style={{
        width: '1px', height: '20px',
        background: 'rgba(255,255,255,0.1)',
        margin: '0 3px',
        flexShrink: 0,
      }} />

      {VISIBILITY.map(v => {
        const isActive = visibility === v.value
        return (
          <button
            key={v.value}
            onClick={e => {
              e.stopPropagation()
              onVisibilityChange(isActive ? null : v.value)
            }}
            onPointerDown={e => e.stopPropagation()}
            style={{
              background: isActive ? v.color + '22' : 'transparent',
              border: `1px solid ${isActive ? v.color + '80' : 'transparent'}`,
              borderRadius: '8px',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
              opacity: visibility && !isActive ? 0.35 : 1,
            }}
          >
            <span style={{ fontSize: '12px' }}>{v.icon}</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: isActive ? v.color : '#9CA3AF',
              letterSpacing: '0.02em',
            }}>
              {v.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
