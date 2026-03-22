import { useState, useRef } from 'react'
import YearBadge from './YearBadge'
import ReactionBar from './ReactionBar'
import AudioRecorder from './AudioRecorder'
import { LANDMARKS } from '../../lib/landmarks'
import api from '../../lib/api'
import { compressImage } from '../../lib/compressImage'

const YEAR_BORDER_COLORS = {
  freshman: '#4ADE80',
  sophomore: '#FACC15',
  junior: '#FB923C',
  senior: '#003087',
}

const YEAR_OPTIONS = [
  { value: 'freshman', label: 'Freshman', color: '#4ADE80', textColor: '#052e16' },
  { value: 'sophomore', label: 'Sophomore', color: '#FACC15', textColor: '#1c1917' },
  { value: 'junior', label: 'Junior', color: '#FB923C', textColor: '#1c1917' },
  { value: 'senior', label: 'Senior', color: '#003087', textColor: '#ffffff' },
]

export default function MemoryModal({ memory, user, onClose, onAddReaction, onRemoveReaction, onUpdate, onDelete }) {
  const isOwner = user && user.id === memory.user_id
  const [editing, setEditing] = useState(false)
  const [photoExpanded, setPhotoExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editText, setEditText] = useState(memory.memory_text || '')
  const [editYear, setEditYear] = useState(memory.year_tag || 'senior')
  const [editPhotoUrl, setEditPhotoUrl] = useState(memory.photo_url || null)
  const [editAudioUrl, setEditAudioUrl] = useState(memory.audio_url || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const borderColor = YEAR_BORDER_COLORS[editing ? editYear : memory.year_tag] || '#C9A84C'
  const landmark = LANDMARKS[memory.landmark_id]
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  function formatDate(str) {
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append('file', compressed)
      const res = await api.post('/upload/photo', formData)
      setEditPhotoUrl(res.data.url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onUpdate({
        memory_text: editText || null,
        year_tag: editYear,
        photo_url: editPhotoUrl || null,
        audio_url: editAudioUrl || null,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
    }
  }

  function handleCancelEdit() {
    setEditing(false)
    setEditText(memory.memory_text || '')
    setEditYear(memory.year_tag || 'senior')
    setEditPhotoUrl(memory.photo_url || null)
    setEditAudioUrl(memory.audio_url || null)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '16px',
      }}
    >
      <div
        className="animate-loot-open holographic-hover"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111827', border: `2px solid ${borderColor}`,
          borderRadius: '12px', width: '100%', maxWidth: '440px',
          boxShadow: `0 0 32px ${borderColor}40, 0 24px 48px rgba(0,0,0,0.6)`,
          overflow: 'hidden', position: 'relative',
        }}
      >
        <div style={{ height: '4px', background: borderColor }} />

        <div style={{ padding: '20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: borderColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', color: '#0A0E1A', fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
              }}>
                {memory.author_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#F9FAFB', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {memory.author_name}
                </p>
                <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {formatDate(memory.created_at)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!editing && <YearBadge year={memory.year_tag} />}
              {isOwner && !editing && (
                <>
                  <button onClick={() => setEditing(true)} style={{ background: 'none', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', borderRadius: '5px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                  <button onClick={() => setConfirmDelete(true)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', borderRadius: '5px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                </>
              )}
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px', padding: '2px', lineHeight: 1 }}>×</button>
            </div>
          </div>

          {landmark && (
            <p style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", marginBottom: '12px' }}>
              🗺 {landmark.fictionalName} · {landmark.realName}
            </p>
          )}

          {/* Delete confirm */}
          {confirmDelete && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '14px', marginBottom: '14px', textAlign: 'center' }}>
              <p style={{ color: '#FCA5A5', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", marginBottom: '12px' }}>
                Delete this memory? This can't be undone.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => setConfirmDelete(false)} style={{ background: 'none', border: '1px solid #374151', color: '#9CA3AF', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                <button onClick={handleDelete} disabled={deleting} style={{ background: '#EF4444', border: 'none', color: '#fff', borderRadius: '6px', padding: '6px 16px', cursor: deleting ? 'wait' : 'pointer', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{deleting ? 'Deleting...' : 'Yes, delete'}</button>
              </div>
            </div>
          )}

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Year picker */}
              <div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif" }}>When was this?</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {YEAR_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setEditYear(opt.value)} style={{ background: editYear === opt.value ? opt.color : 'transparent', border: `1px solid ${opt.color}`, color: editYear === opt.value ? opt.textColor : opt.color, borderRadius: '999px', padding: '4px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                placeholder="What happened here?"
                rows={3}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#E5E7EB', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", resize: 'none', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />

              {/* Photo */}
              <div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif" }}>📸 Photo</p>
                {editPhotoUrl ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div onClick={() => setPhotoExpanded(true)} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', width: '64px', height: '80px', flexShrink: 0, cursor: 'zoom-in' }}>
                      <img src={`${apiBase}${editPhotoUrl}`} alt="Memory photo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔍</div>
                    </div>
                    <button onClick={() => setEditPhotoUrl(null)} style={{ background: 'none', border: '1px solid #4B5563', color: '#6B7280', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '6px', padding: '8px 16px', cursor: uploading ? 'wait' : 'pointer', color: '#9CA3AF', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{uploading ? 'Uploading...' : '+ Add photo'}</button>
                  </>
                )}
              </div>

              <AudioRecorder
                onAudioUrl={url => setEditAudioUrl(url)}
                existingUrl={editAudioUrl ? `${apiBase}${editAudioUrl}` : null}
                onClear={() => setEditAudioUrl(null)}
              />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={handleCancelEdit} style={{ background: 'none', border: '1px solid #374151', color: '#6B7280', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="font-display" style={{ background: saving ? '#4B5563' : 'linear-gradient(135deg, #C9A84C, #E8C56A)', border: 'none', color: '#0A0E1A', borderRadius: '6px', padding: '8px 24px', cursor: saving ? 'wait' : 'pointer', fontSize: '15px', letterSpacing: '0.08em', boxShadow: '0 0 12px rgba(201,168,76,0.3)' }}>{saving ? 'SAVING...' : 'SAVE'}</button>
              </div>
            </div>
          ) : (
            <>
              {memory.photo_url && (
                <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', borderRadius: '6px', overflow: 'hidden', marginBottom: '14px', background: '#1F2937' }}>
                  <img src={`${apiBase}${memory.photo_url}`} alt="Memory photo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              {memory.memory_text && (
                <p style={{ fontSize: '15px', color: '#E5E7EB', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.6', marginBottom: '14px' }}>
                  {memory.memory_text}
                </p>
              )}
              {memory.audio_url && (
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>🎙 Voice note</p>
                  <audio src={`${apiBase}${memory.audio_url}`} controls style={{ width: '100%', height: '36px' }} />
                </div>
              )}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '14px' }} />
              <ReactionBar memory={memory} user={user} onAddReaction={onAddReaction} onRemoveReaction={onRemoveReaction} />
            </>
          )}
        </div>
      </div>

      {/* Photo lightbox */}
      {photoExpanded && (
        <div onClick={() => setPhotoExpanded(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, cursor: 'zoom-out', padding: '24px' }}>
          <img src={`${apiBase}${editPhotoUrl}`} alt="Memory photo" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  )
}
