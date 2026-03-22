import { useEffect, useState } from 'react'
import api from '../lib/api'
import { LANDMARKS } from '../lib/landmarks'
import YearBadge from '../components/memory/YearBadge'

function extractYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  return m ? m[1] : null
}

async function fetchOEmbed(url) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default function Soundtrack({ user }) {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await api.get('/memories/')
      const withSong = res.data.filter(m => m.song_url && extractYouTubeId(m.song_url))

      const enriched = await Promise.all(
        withSong.map(async m => {
          const oembed = await fetchOEmbed(m.song_url)
          return { ...m, oembed }
        })
      )
      setSongs(enriched)
      setLoading(false)
    }
    load()
  }, [])

  function handlePlayAll() {
    const ids = songs.map(m => extractYouTubeId(m.song_url)).filter(Boolean)
    if (!ids.length) return
    window.open(`https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`, '_blank')
  }

  return (
    <div style={{ height: '100%', paddingTop: '68px', paddingBottom: '48px', background: 'var(--bg-dark)', overflowY: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="font-display" style={{ color: '#C9A84C', fontSize: '28px', letterSpacing: '0.08em', margin: 0 }}>
              🎵 SOUNDTRACK
            </h1>
            <p style={{ color: '#6B7280', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>
              Songs pinned to memories across campus
            </p>
          </div>
          {songs.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="font-display"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                border: 'none', color: '#0A0E1A',
                borderRadius: '8px', padding: '10px 20px',
                cursor: 'pointer', fontSize: '14px',
                letterSpacing: '0.08em',
                boxShadow: '0 0 16px rgba(201,168,76,0.3)',
              }}
            >
              ▶ PLAY ALL ({songs.length})
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
        ) : songs.length === 0 ? (
          <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
            No songs yet. Add a YouTube URL when pinning a memory!
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {songs.map(m => {
              const videoId = extractYouTubeId(m.song_url)
              const landmark = LANDMARKS[m.landmark_id]
              const thumbnail = m.oembed?.thumbnail_url || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              const title = m.oembed?.title || 'Unknown title'

              return (
                <a
                  key={m.id}
                  href={m.song_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: '#111827',
                      border: '1px solid rgba(201,168,76,0.15)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'border-color 0.15s, transform 0.15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                      <img
                        src={thumbnail}
                        alt={title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.2)',
                      }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.7)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px',
                        }}>▶</div>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{
                        fontSize: '13px', color: '#E5E7EB',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600, lineHeight: '1.3',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        marginBottom: '6px',
                      }}>
                        {title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
                          {landmark?.fictionalName || m.landmark_id}
                        </span>
                        <YearBadge year={m.year_tag} />
                      </div>
                      {m.author_name && (
                        <p style={{ fontSize: '11px', color: '#4B5563', fontFamily: "'DM Sans', sans-serif", marginTop: '4px' }}>
                          by {m.author_name}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
