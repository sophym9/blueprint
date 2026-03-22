import { forwardRef } from 'react'
import { LANDMARKS } from '../../lib/landmarks'

const YEAR_COLORS = {
  freshman: '#4ADE80',
  sophomore: '#FACC15',
  junior: '#FB923C',
  senior: '#003087',
}

const YEAR_LABELS = {
  freshman: 'Freshman', sophomore: 'Sophomore', junior: 'Junior', senior: 'Senior',
}

const ShareCard = forwardRef(function ShareCard({ memory, apiBase }, ref) {
  const borderColor = YEAR_COLORS[memory.year_tag] || '#C9A84C'
  const landmark = LANDMARKS[memory.landmark_id]

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '600px',
        height: '340px',
        background: '#0A0E1A',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `3px solid ${borderColor}`,
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: '6px', background: borderColor, flexShrink: 0 }} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Photo panel */}
        {memory.photo_url && (
          <div style={{ width: '240px', flexShrink: 0, position: 'relative' }}>
            <img
              src={`${apiBase}${memory.photo_url}`}
              alt="Memory"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, transparent 70%, #0A0E1A)',
            }} />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Location */}
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {landmark?.fictionalName || memory.landmark_id}
            </p>

            {/* Memory text */}
            {memory.memory_text && (
              <p style={{
                fontSize: '18px', color: '#F9FAFB', lineHeight: '1.5',
                margin: '0 0 16px',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
              }}>
                "{memory.memory_text}"
              </p>
            )}
          </div>

          <div>
            {/* Author + year */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: borderColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: '#0A0E1A', fontWeight: 700, flexShrink: 0,
              }}>
                {memory.author_name?.[0]?.toUpperCase() || '?'}
              </div>
              <span style={{ fontSize: '13px', color: '#D1D5DB', fontWeight: 600 }}>
                {memory.author_name}
              </span>
              <span style={{
                fontSize: '11px', background: `${borderColor}25`, border: `1px solid ${borderColor}60`,
                color: borderColor, borderRadius: '999px', padding: '2px 10px', fontWeight: 600,
              }}>
                {YEAR_LABELS[memory.year_tag] || memory.year_tag}
              </span>
            </div>

            {/* Branding */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#C9A84C', fontWeight: 700, letterSpacing: '0.08em' }}>
                LAST CHAPTER
              </span>
              <span style={{ fontSize: '12px', color: '#4B5563' }}>· Duke Class of 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ShareCard
