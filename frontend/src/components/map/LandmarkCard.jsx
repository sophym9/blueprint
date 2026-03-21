export default function LandmarkCard({ landmark, memoryCount }) {
  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{ bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', minWidth: '180px' }}
    >
      <div
        style={{
          background: 'rgba(17,24,39,0.95)',
          border: '1px solid #C9A84C',
          borderRadius: '6px',
          padding: '10px 14px',
          boxShadow: '0 0 12px rgba(201,168,76,0.3)',
        }}
      >
        <p className="font-map text-sm" style={{ color: '#C9A84C' }}>{landmark.fictionalName}</p>
        <p className="font-body text-xs mt-1" style={{ color: '#9CA3AF' }}>{landmark.realName}</p>
        <p className="font-body text-xs mt-1" style={{ color: '#D1D5DB' }}>{landmark.description}</p>
        <p className="font-body text-xs mt-2" style={{ color: '#C9A84C' }}>
          📍 {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
        </p>
      </div>
      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #C9A84C',
        }}
      />
    </div>
  )
}
