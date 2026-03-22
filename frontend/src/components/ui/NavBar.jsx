import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function useCountdown(dateStr) {
  const target = new Date(dateStr || '2026-05-10')
  const now = new Date()
  const days = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return days
}

export default function NavBar({ user, onLogout }) {
  const navigate = useNavigate()
  const daysLeft = useCountdown(user?.graduation_date)

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          height: '52px',
          background: 'rgba(10,14,26,0.95)',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '16px',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ color: '#C9A84C', fontSize: '22px', letterSpacing: '0.08em' }}>
            LAST CHAPTER
          </span>
        </Link>

        <div style={{ flex: 1 }} />

        {user && (
          <div style={{
            fontSize: '12px', fontFamily: "'DM Sans', sans-serif",
            color: daysLeft > 0 ? '#C9A84C' : '#4ADE80',
            background: daysLeft > 0 ? 'rgba(201,168,76,0.1)' : 'rgba(74,222,128,0.1)',
            border: `1px solid ${daysLeft > 0 ? 'rgba(201,168,76,0.3)' : 'rgba(74,222,128,0.3)'}`,
            borderRadius: '999px', padding: '3px 10px',
            whiteSpace: 'nowrap',
          }}>
            {daysLeft > 0 ? `🎓 ${daysLeft} days` : '🎓 Congratulations, Grad!'}
          </div>
        )}

        {user ? (
          <>
            <Link to="/soundtrack" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: '#C9A84C',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                🎵 Soundtrack
              </button>
            </Link>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#C9A84C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: '#0A0E1A',
                    fontWeight: 700,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : user.name?.[0]?.toUpperCase() || '?'
                  }
                </div>
                <span style={{ fontSize: '13px', color: '#D1D5DB', fontFamily: "'DM Sans', sans-serif" }}>
                  {user.name}
                </span>
                <span
                  className="font-map"
                  style={{ fontSize: '11px', color: '#C9A84C' }}
                >
                  · {user.memory_points || 0} pts
                </span>
              </div>
            </Link>

            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#6B7280',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <Link to="/login">
            <button
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                border: 'none',
                color: '#0A0E1A',
                borderRadius: '6px',
                padding: '7px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Enter the Realm
            </button>
          </Link>
        )}
      </nav>

    </>
  )
}
