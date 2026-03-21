import { useEffect } from 'react'

export default function PointsToast({ points, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1300)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="animate-points-float"
      style={{
        position: 'fixed',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      <div
        className="font-display"
        style={{
          background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
          color: '#0A0E1A',
          padding: '10px 24px',
          borderRadius: '999px',
          fontSize: '22px',
          letterSpacing: '0.08em',
          boxShadow: '0 0 24px rgba(201,168,76,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        +{points} MEMORY POINTS!
      </div>
    </div>
  )
}
