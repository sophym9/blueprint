import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GRAD_YEARS = [2026, 2027, 2028, 2029]

const INPUT_STYLE = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '12px 14px',
  color: '#F9FAFB',
  fontSize: '15px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
}

const LABEL_STYLE = {
  display: 'block',
  fontSize: '11px',
  color: '#6B7280',
  marginBottom: '6px',
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

export default function Login({ onLogin, onRegister }) {
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gradYear, setGradYear] = useState(2026)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function focusBorder(e) { e.target.style.borderColor = '#C9A84C' }
  function blurBorder(e) { e.target.style.borderColor = 'rgba(255,255,255,0.12)' }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (tab === 'login') {
        await onLogin(email.trim(), password)
      } else {
        if (!name.trim()) { setError('Name is required.'); setLoading(false); return }
        await onRegister(name.trim(), email.trim(), password, gradYear)
      }
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 30% 40%, #0D1A3A 0%, #0A0E1A 65%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      {/* Gold corner accents */}
      {[
        { top: 20, left: 20, borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C' },
        { top: 20, right: 20, borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C' },
        { bottom: 20, left: 20, borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C' },
        { bottom: 20, right: 20, borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 50, height: 50, opacity: 0.4, ...s }} />
      ))}

      <div className="animate-fade-in" style={{
        background: 'rgba(17,24,39,0.97)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '16px',
        padding: '40px 36px 36px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 0 60px rgba(201,168,76,0.08), 0 32px 64px rgba(0,0,0,0.6)',
        position: 'relative',
      }}>
        {/* Top gradient bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #003087, #C9A84C, #003087)',
          borderRadius: '16px 16px 0 0',
        }} />

        {/* Title */}
        <h1 className="font-display" style={{
          color: '#C9A84C', fontSize: '44px', letterSpacing: '0.1em',
          textAlign: 'center', marginBottom: '2px',
          textShadow: '0 0 32px rgba(201,168,76,0.35)',
        }}>
          LAST CHAPTER
        </h1>
        <p className="font-map" style={{
          color: '#6B7280', fontSize: '13px', fontStyle: 'italic',
          textAlign: 'center', marginBottom: '28px',
        }}>
          Duke University · Class of 2026
        </p>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', marginBottom: '24px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px', padding: '3px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(null) }}
              style={{
                flex: 1, padding: '8px',
                background: tab === t ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: tab === t ? '1px solid rgba(201,168,76,0.35)' : '1px solid transparent',
                borderRadius: '6px',
                color: tab === t ? '#C9A84C' : '#6B7280',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px', fontWeight: tab === t ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Name (register only) */}
          {tab === 'register' && (
            <div>
              <label style={LABEL_STYLE}>Your Name</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Adventurer name..."
                style={INPUT_STYLE}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={LABEL_STYLE}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@duke.edu"
              required style={INPUT_STYLE}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          {/* Password */}
          <div>
            <label style={LABEL_STYLE}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'Choose a password...' : 'Your password...'}
              required style={INPUT_STYLE}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          {/* Class year (register only) */}
          {tab === 'register' && (
            <div>
              <label style={LABEL_STYLE}>Class Year</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {GRAD_YEARS.map(year => (
                  <button
                    key={year} type="button" onClick={() => setGradYear(year)}
                    style={{
                      flex: 1, padding: '10px 4px',
                      background: gradYear === year ? 'rgba(0,48,135,0.4)' : 'transparent',
                      border: `1px solid ${gradYear === year ? '#003087' : 'rgba(255,255,255,0.1)'}`,
                      color: gradYear === year ? '#93C5FD' : '#6B7280',
                      borderRadius: '6px', cursor: 'pointer',
                      fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
                      fontWeight: gradYear === year ? 700 : 400,
                      transition: 'all 0.15s',
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p style={{
              color: '#EF4444', fontSize: '12px',
              fontFamily: "'DM Sans', sans-serif",
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '6px', padding: '8px 12px',
              margin: 0,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-display"
            style={{
              background: loading
                ? '#374151'
                : 'linear-gradient(135deg, #C9A84C, #E8C56A)',
              border: 'none',
              color: loading ? '#6B7280' : '#0A0E1A',
              borderRadius: '8px', padding: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '18px', letterSpacing: '0.1em',
              marginTop: '4px',
              boxShadow: loading ? 'none' : '0 0 24px rgba(201,168,76,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? (tab === 'login' ? 'SIGNING IN...' : 'CREATING...')
              : (tab === 'login' ? 'ENTER THE REALM' : 'BEGIN YOUR STORY')}
          </button>
        </form>

        <p className="font-map" style={{
          marginTop: '20px', fontSize: '11px',
          color: '#374151', fontStyle: 'italic', textAlign: 'center',
        }}>
          "Every story deserves to be remembered"
        </p>
      </div>
    </div>
  )
}
