import { useState, useRef } from 'react'
import api from '../../lib/api'
import { compressImage } from '../../lib/compressImage'
import AudioRecorder from './AudioRecorder'

const YEAR_OPTIONS = [
  { value: 'freshman', label: 'Freshman', color: '#4ADE80', textColor: '#052e16', outline: '#4ADE80' },
  { value: 'sophomore', label: 'Sophomore', color: '#FACC15', textColor: '#1c1917', outline: '#FACC15' },
  { value: 'junior', label: 'Junior', color: '#FB923C', textColor: '#1c1917', outline: '#FB923C' },
  { value: 'senior', label: 'Senior', color: '#003087', textColor: '#ffffff', outline: '#6B8CFF' },
]

export default function CreateMemoryForm({
  onSubmit,
  onCancel,
  requireLogin = false,
  onLoginRequired,
  errorMessage = null,
  initialIsPublic = true,
}) {
  const [memoryText, setMemoryText] = useState('')
  const [yearTag, setYearTag] = useState('senior')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [songUrl, setSongUrl] = useState('')
  const [songUrlError, setSongUrlError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const fileInputRef = useRef(null)

  async function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append('file', compressed)
      const res = await api.post('/upload/photo', formData)
      setPhotoUrl(res.data.url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!memoryText && !photoUrl && !audioUrl) return
    setSubmitting(true)
    try {
      const cleanSong = songUrl.trim()
      if (cleanSong && !cleanSong.includes('youtube.com') && !cleanSong.includes('youtu.be')) {
        setSongUrlError(true)
        setSubmitting(false)
        return
      }
      await onSubmit({
        memory_text: memoryText || null,
        year_tag: yearTag,
        photo_url: photoUrl || null,
        audio_url: audioUrl || null,
        song_url: cleanSong || null,
        is_public: isPublic,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="create-memory-form"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 90,
        pointerEvents: 'none',
      }}
    >
      <form
        className="animate-slide-up"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: '#111827',
          border: '1px solid rgba(201,168,76,0.3)',
          borderTop: '2px solid #C9A84C',
          borderRadius: '12px 12px 0 0',
          width: '100%',
          maxWidth: '480px',
          pointerEvents: 'auto',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header — always visible, click to collapse/expand */}
        <div
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <h3
            className="font-display"
            style={{ color: '#C9A84C', fontSize: '16px', letterSpacing: '0.08em', margin: 0 }}
          >
            📍 DROP A MEMORY
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '18px', lineHeight: 1 }}>
              {collapsed ? '▲' : '▼'}
            </span>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onCancel() }}
              style={{
                background: 'none', border: 'none',
                color: '#6B7280', cursor: 'pointer',
                fontSize: '18px', lineHeight: 1, padding: '0 2px',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body — collapsable */}
        {!collapsed && (
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
            {requireLogin ? (
              <p style={{ margin: 0, color: '#D1D5DB', fontSize: '13px', lineHeight: '1.5', fontFamily: "'DM Sans', sans-serif" }}>
                Log in first to save a memory at this spot.
              </p>
            ) : null}

            {/* Public / Private */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>Visibility:</span>
              {[
                { label: 'Public', value: true, color: '#C9A84C' },
                { label: 'Private', value: false, color: '#9CA3AF' },
              ].map(option => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setIsPublic(option.value)}
                  disabled={requireLogin}
                  style={{
                    background: isPublic === option.value ? option.color : 'transparent',
                    border: `1px solid ${option.color}`,
                    color: isPublic === option.value ? '#0A0E1A' : option.color,
                    borderRadius: '999px',
                    padding: '3px 12px',
                    cursor: requireLogin ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    opacity: requireLogin ? 0.55 : 1,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Memory text */}
            <textarea
              value={memoryText}
              onChange={e => setMemoryText(e.target.value)}
              placeholder="What happened here?"
              rows={2}
              disabled={requireLogin}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#E5E7EB',
                fontSize: '13px',
                fontFamily: "'DM Sans', sans-serif",
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />

            {/* Year tag */}
            <div>
              <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>When was this?</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {YEAR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setYearTag(opt.value)}
                    disabled={requireLogin}
                    style={{
                      background: yearTag === opt.value ? opt.color : 'transparent',
                      border: `1px solid ${yearTag === opt.value ? opt.color : opt.outline}`,
                      color: yearTag === opt.value ? opt.textColor : opt.outline,
                      borderRadius: '999px',
                      padding: '3px 12px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>📸</span>
              {photoUrl ? (
                <>
                  <span style={{ fontSize: '12px', color: '#4ADE80', fontFamily: "'DM Sans', sans-serif" }}>✓ Photo uploaded</span>
                  <button type="button" onClick={() => setPhotoUrl(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                </>
              ) : (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || requireLogin}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      cursor: uploading ? 'wait' : 'pointer',
                      color: '#9CA3AF',
                      fontSize: '12px',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {uploading ? 'Uploading...' : '+ Add photo'}
                  </button>
                </>
              )}
            </div>

            {/* Audio recorder */}
            {!requireLogin ? <AudioRecorder onAudioUrl={url => setAudioUrl(url)} /> : null}

            {/* YouTube song */}
            {!requireLogin && (
              <div>
                <label style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '4px' }}>
                  🎵 Song (YouTube URL)
                </label>
                <input
                  type="text"
                  value={songUrl}
                  onChange={e => { setSongUrl(e.target.value); setSongUrlError(false) }}
                  placeholder="https://youtube.com/watch?v=..."
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${songUrlError ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '6px', padding: '7px 10px',
                    color: '#E5E7EB', fontSize: '12px',
                    fontFamily: "'DM Sans', sans-serif", outline: 'none',
                  }}
                />
                {songUrlError && <p style={{ fontSize: '11px', color: '#FCA5A5', margin: '3px 0 0', fontFamily: "'DM Sans', sans-serif" }}>Must be a YouTube link</p>}
              </div>
            )}

            {errorMessage ? (
              <p style={{ margin: 0, color: '#FCA5A5', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
                {errorMessage}
              </p>
            ) : null}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {requireLogin ? (
                <button
                  type="button"
                  onClick={onLoginRequired}
                  className="font-display"
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                    border: 'none', color: '#0A0E1A',
                    borderRadius: '6px', padding: '9px 20px',
                    cursor: 'pointer', fontSize: '14px',
                    letterSpacing: '0.08em',
                    boxShadow: '0 0 12px rgba(201,168,76,0.3)',
                  }}
                >
                  LOG IN
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || (!memoryText && !photoUrl && !audioUrl)}
                  className="font-display"
                  style={{
                    background: submitting ? '#4B5563' : 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                    border: 'none', color: '#0A0E1A',
                    borderRadius: '6px', padding: '9px 24px',
                    cursor: submitting ? 'wait' : 'pointer',
                    fontSize: '14px', letterSpacing: '0.08em',
                    boxShadow: '0 0 12px rgba(201,168,76,0.3)',
                    transition: 'all 0.15s',
                  }}
                >
                  {submitting ? 'PINNING...' : 'PIN IT'}
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
