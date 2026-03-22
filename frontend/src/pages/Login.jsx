import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTH0_DOMAIN = 'dev-oqsb7nkisppimu66.us.auth0.com'
const AUTH0_CLIENT_ID = 'osIQVsnIbjmaYqsoUlBUzIr3VMwCg6jT'
const REDIRECT_URI = window.location.origin

function randomString(len) {
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function pkceChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

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
          BLUEPRINT
        </h1>
        <p className="font-map" style={{
          color: '#6B7280', fontSize: '13px', fontStyle: 'italic',
          textAlign: 'center', marginBottom: '28px',
        }}>
          Duke University · Class of 2026
        </p>

        {/* Google / Auth0 button */}
        <button
          type="button"
          onClick={async () => {
            const verifier = randomString(64)
            const challenge = await pkceChallenge(verifier)
            sessionStorage.setItem('pkce_verifier', verifier)
            const params = new URLSearchParams({
              response_type: 'code',
              client_id: AUTH0_CLIENT_ID,
              redirect_uri: REDIRECT_URI,
              scope: 'openid profile email',
              code_challenge: challenge,
              code_challenge_method: 'S256',
            })
            window.location.href = `https://${AUTH0_DOMAIN}/authorize?${params}`
          }}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '11px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            color: '#1F2937',
            marginBottom: '16px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: '11px', color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

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
