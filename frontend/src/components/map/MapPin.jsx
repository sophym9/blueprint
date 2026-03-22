const YEAR_COLORS = {
  freshman: '#4ADE80',
  sophomore: '#FACC15',
  junior: '#FB923C',
  senior: '#003087',
}

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function MapPin({ memory, onClick }) {
  const color = YEAR_COLORS[memory.year_tag] || '#C9A84C'
  const avatarUrl = memory.author_avatar_url

  return (
    <div
      className="animate-pin-drop"
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${memory.pin_x}%`,
        top: `${memory.pin_y}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: 20,
        cursor: 'pointer',
      }}
      title={memory.author_name}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Pin head */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: avatarUrl ? '50%' : '50% 50% 50% 0',
            background: avatarUrl ? 'transparent' : color,
            border: `2px solid ${color}`,
            boxShadow: `0 0 8px ${color}80, 0 2px 6px rgba(0,0,0,0.4)`,
            transform: avatarUrl ? 'none' : 'rotate(-45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {avatarUrl
            ? <img src={`${apiBase}${avatarUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ transform: 'rotate(45deg)', fontSize: '10px' }}>📍</span>
          }
        </div>
        {/* Pin stem */}
        <div
          style={{
            width: '2px',
            height: '8px',
            background: color,
            borderRadius: '1px',
            marginTop: '-2px',
          }}
        />
      </div>
    </div>
  )
}
