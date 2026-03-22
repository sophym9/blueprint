const YEAR_COLORS = {
  freshman: '#4ADE80',
  sophomore: '#FACC15',
  junior: '#FB923C',
  senior: '#003087',
}

export default function MapPin({ memory, onClick }) {
  const color = YEAR_COLORS[memory.year_tag] || '#C9A84C'

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Pin head */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50% 50% 50% 0',
            background: color,
            border: '2px solid rgba(255,255,255,0.6)',
            boxShadow: `0 0 8px ${color}80, 0 2px 6px rgba(0,0,0,0.4)`,
            transform: 'rotate(-45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ transform: 'rotate(45deg)', fontSize: '10px' }}>📍</span>
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
