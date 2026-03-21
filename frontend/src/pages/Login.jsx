import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GRAD_YEARS = [2026, 2027, 2028, 2029]

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [gradYear, setGradYear] = useState(2026)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onLogin(name.trim(), gradYear)
      navigate('/')
    } catch (err) {
      setError('Could not connect. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #0D1A3A 0%, #0A0E1A 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Decorative corner borders */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', width: '60px', height: '60px', borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '20px', right: '20px', width: '60px', height: '60px', borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '60px', height: '60px', borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '60px', height: '60px', borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', opacity: 0.5 }} />

      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            borderRadius: '50%',
            background: '#C9A84C',
            opacity: 0.2 + Math.random() * 0.4,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Card */}
      <div
        className="animate-fade-in"
        style={{
          background: 'rgba(17,24,39,0.95)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '16px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          boxShadow: '0 0 48px rgba(201,168,76,0.1), 0 32px 64px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        {/* Duke Blue top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #003087, #C9A84C, #003087)',
            borderRadius: '16px 16px 0 0',
          }}
        />

        {/* Title */}
        <h1
          className="font-display"
          style={{
            color: '#C9A84C',
            fontSize: '52px',
            letterSpacing: '0.1em',
            marginBottom: '4px',
            textShadow: '0 0 24px rgba(201,168,76,0.4)',
          }}
        >
          LAST CHAPTER
        </h1>
        <p
          className="font-map"
          style={{
            color: '#9CA3AF',
            fontSize: '16px',
            fontStyle: 'italic',
            marginBottom: '36px',
          }}
        >
          Duke University · Class of 2026
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                color: '#9CA3AF',
                marginBottom: '6px',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Your Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Adventurer name..."
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#F9FAFB',
                fontSize: '15px',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Class year */}
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                color: '#9CA3AF',
                marginBottom: '6px',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Class Year
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {GRAD_YEARS.map(year => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setGradYear(year)}
                  style={{
                    flex: 1,
                    background: gradYear === year ? '#003087' : 'transparent',
                    border: `1px solid ${gradYear === year ? '#003087' : 'rgba(255,255,255,0.1)'}`,
                    color: gradYear === year ? '#FFFFFF' : '#9CA3AF',
                    borderRadius: '6px',
                    padding: '10px 4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: gradYear === year ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ color: '#EF4444', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="font-display"
            style={{
              background: loading || !name.trim()
                ? '#374151'
                : 'linear-gradient(135deg, #C9A84C, #E8C56A)',
              border: 'none',
              color: loading || !name.trim() ? '#6B7280' : '#0A0E1A',
              borderRadius: '8px',
              padding: '14px',
              cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
              fontSize: '20px',
              letterSpacing: '0.1em',
              marginTop: '8px',
              boxShadow: loading || !name.trim() ? 'none' : '0 0 20px rgba(201,168,76,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'ENTERING REALM...' : 'ENTER THE REALM'}
          </button>
        </form>

        <p
          className="font-map"
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#4B5563',
            fontStyle: 'italic',
          }}
        >
          "Every story deserves to be remembered"
        </p>
      </div>
    </div>
  )
}
