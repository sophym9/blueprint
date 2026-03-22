import { useState, useRef } from 'react'
import api from '../../lib/api'
import AudioRecorder from './AudioRecorder'

const YEAR_OPTIONS = [
  { value: 'freshman', label: 'Freshman', color: '#4ADE80', textColor: '#052e16' },
  { value: 'sophomore', label: 'Sophomore', color: '#FACC15', textColor: '#1c1917' },
  { value: 'junior', label: 'Junior', color: '#FB923C', textColor: '#1c1917' },
  { value: 'senior', label: 'Senior', color: '#003087', textColor: '#ffffff' },
]

export default function CreateMemoryForm({
  onSubmit,
  onCancel,
  anchor = null,
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
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  async function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
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
      await onSubmit({
        memory_text: memoryText || null,
        year_tag: yearTag,
        photo_url: photoUrl || null,
        audio_url: audioUrl || null,
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
        position: anchor ? 'absolute' : 'fixed',
        inset: anchor ? 0 : 0,
        background: anchor ? 'transparent' : 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: anchor ? 'stretch' : 'flex-end',
        justifyContent: anchor ? 'stretch' : 'center',
        zIndex: 90,
        pointerEvents: anchor ? 'none' : 'auto',
      }}
      onClick={onCancel}
    >
      <form
        className="animate-slide-up"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          position: anchor ? 'absolute' : 'relative',
          left: anchor ? `${anchor.pin_x}%` : undefined,
          top: anchor ? `${anchor.pin_y}%` : undefined,
          transform: anchor ? 'translate(18px, -22px)' : undefined,
          background: '#111827',
          border: '1px solid rgba(201,168,76,0.3)',
          borderTop: '2px solid #C9A84C',
          borderRadius: anchor ? '12px' : '12px 12px 0 0',
          width: anchor ? '320px' : '100%',
          maxWidth: anchor ? '320px' : '560px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          pointerEvents: 'auto',
          boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
        }}
      >
        {!anchor ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '4px', background: '#C9A84C', borderRadius: '2px', opacity: 0.5 }} />
          </div>
        ) : null}

        <h3
          className="font-display"
          style={{ color: '#C9A84C', fontSize: '20px', letterSpacing: '0.08em', margin: 0 }}
        >
          DROP A MEMORY
        </h3>

        {requireLogin ? (
          <p
            style={{
              margin: 0,
              color: '#D1D5DB',
              fontSize: '13px',
              lineHeight: '1.5',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Log in first to save a memory at this spot.
          </p>
        ) : null}

        <div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif" }}>
            Who can see this?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { label: 'Public', value: true, color: '#C9A84C', help: 'Visible on the map to everyone.' },
              { label: 'Private', value: false, color: '#9CA3AF', help: 'Only visible to you.' },
            ].map(option => (
              <button
                key={option.label}
                type="button"
                onClick={() => setIsPublic(option.value)}
                disabled={requireLogin}
                title={option.help}
                style={{
                  background: isPublic === option.value ? option.color : 'transparent',
                  border: `1px solid ${option.color}`,
                  color: isPublic === option.value ? '#0A0E1A' : option.color,
                  borderRadius: '999px',
                  padding: '6px 14px',
                  cursor: requireLogin ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: requireLogin ? 0.55 : 1,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Memory text */}
        <textarea
          value={memoryText}
          onChange={e => setMemoryText(e.target.value)}
          placeholder="What happened here? Tell your story..."
          rows={3}
          disabled={requireLogin}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '12px',
            color: '#E5E7EB',
            fontSize: '14px',
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
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif" }}>
            When was this?
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {YEAR_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setYearTag(opt.value)}
                disabled={requireLogin}
                style={{
                  background: yearTag === opt.value ? opt.color : 'transparent',
                  border: `1px solid ${opt.color}`,
                  color: yearTag === opt.value ? opt.textColor : opt.color,
                  borderRadius: '999px',
                  padding: '4px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
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
        <div>
          <label style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '8px' }}>
            📸 Photo
          </label>
          {photoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#4ADE80', fontFamily: "'DM Sans', sans-serif" }}>✓ Photo uploaded</span>
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
              >✕</button>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || requireLogin}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: uploading ? 'wait' : 'pointer',
                  color: '#9CA3AF',
                  fontSize: '13px',
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

        {errorMessage ? (
          <p
            style={{
              margin: 0,
              color: '#FCA5A5',
              fontSize: '12px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {errorMessage}
          </p>
        ) : null}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid #374151',
              color: '#6B7280',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          {requireLogin ? (
            <button
              type="button"
              onClick={onLoginRequired}
              className="font-display"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                border: 'none',
                color: '#0A0E1A',
                borderRadius: '6px',
                padding: '10px 24px',
                cursor: 'pointer',
                fontSize: '16px',
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
                border: 'none',
                color: '#0A0E1A',
                borderRadius: '6px',
                padding: '10px 24px',
                cursor: submitting ? 'wait' : 'pointer',
                fontSize: '16px',
                letterSpacing: '0.08em',
                boxShadow: '0 0 12px rgba(201,168,76,0.3)',
                transition: 'all 0.15s',
              }}
            >
              {submitting ? 'PINNING...' : 'PIN IT'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
