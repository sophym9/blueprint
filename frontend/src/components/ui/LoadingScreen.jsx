export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#F5E6C8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Decorative border */}
      <div
        style={{
          position: 'absolute',
          inset: '16px',
          border: '2px solid #C9A84C',
          borderRadius: '4px',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />

      <h1
        className="font-display animate-fade-in"
        style={{
          color: '#003087',
          fontSize: '64px',
          letterSpacing: '0.1em',
          textShadow: '0 2px 8px rgba(0,48,135,0.2)',
        }}
      >
        LAST CHAPTER
      </h1>

      <p
        className="font-map animate-fade-in"
        style={{
          color: '#8B6914',
          fontSize: '18px',
          fontStyle: 'italic',
          marginTop: '8px',
          animationDelay: '0.2s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        Duke Class of 2026
      </p>

      {/* Animated quill dots */}
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <p
          className="font-map"
          style={{
            color: '#5C3D11',
            fontSize: '14px',
            fontStyle: 'italic',
          }}
        >
          Unrolling the parchment
        </p>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#C9A84C',
              animation: `goldPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
