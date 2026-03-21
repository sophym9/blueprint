import { useState, useRef } from 'react'
import api from '../../lib/api'

export default function AudioRecorder({ onAudioUrl }) {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])

  async function startRecording() {
    chunks.current = []
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data)
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      setAudioBlob(blob)
      setAudioUrl(url)
      stream.getTracks().forEach(t => t.stop())
    }
    mediaRecorder.current.start()
    setRecording(true)
  }

  function stopRecording() {
    mediaRecorder.current?.stop()
    setRecording(false)
  }

  async function uploadAudio() {
    if (!audioBlob) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'voice-memory.webm')
      const res = await api.post('/upload/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onAudioUrl(res.data.url)
    } finally {
      setUploading(false)
    }
  }

  function clear() {
    setAudioBlob(null)
    setAudioUrl(null)
    onAudioUrl(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
        🎙 Voice Note
      </label>

      {!audioUrl ? (
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          style={{
            background: recording ? '#EF4444' : 'rgba(201,168,76,0.15)',
            border: `1px solid ${recording ? '#EF4444' : '#C9A84C'}`,
            color: recording ? '#FFFFFF' : '#C9A84C',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
        >
          {recording ? (
            <><span style={{ animation: 'goldPulse 1s infinite' }}>⏹</span> Stop Recording</>
          ) : (
            <><span>⏺</span> Start Recording</>
          )}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <audio src={audioUrl} controls style={{ height: '32px', flex: 1 }} />
          <button
            type="button"
            onClick={uploadAudio}
            disabled={uploading}
            style={{
              background: 'rgba(74,222,128,0.15)',
              border: '1px solid #4ADE80',
              color: '#4ADE80',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: uploading ? 'wait' : 'pointer',
              fontSize: '12px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {uploading ? '...' : '✓ Use'}
          </button>
          <button
            type="button"
            onClick={clear}
            style={{
              background: 'none',
              border: '1px solid #4B5563',
              color: '#6B7280',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
