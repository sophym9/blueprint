import type { MapNote, MapPoint, MapRegionDetail } from '../types/map'

interface InfoPanelProps {
  region: MapRegionDetail | null
  note: MapNote | null
  draftPin: MapPoint | null
  draftMessage: string
  onDraftMessageChange: (value: string) => void
  onSubmitDraft: () => void
  onCancelDraft: () => void
  isLoading: boolean
  isSubmittingNote: boolean
  error: string | null
  noteSubmitError: string | null
}

function formatTimestamp(isoValue: string) {
  return new Date(isoValue).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function InfoPanel({
  region,
  note,
  draftPin,
  draftMessage,
  onDraftMessageChange,
  onSubmitDraft,
  onCancelDraft,
  isLoading,
  isSubmittingNote,
  error,
  noteSubmitError,
}: InfoPanelProps) {
  if (error) {
    return (
      <aside className="info-panel glass-panel">
        <p className="eyebrow">Region details</p>
        <h2>Unable to load region</h2>
        <p>{error}</p>
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className="info-panel glass-panel">
        <p className="eyebrow">Region details</p>
        <h2>Loading selection</h2>
        <p>Fetching the selected Duke map region from the backend.</p>
      </aside>
    )
  }

  if (draftPin) {
    return (
      <aside className="info-panel glass-panel">
        <p className="eyebrow">New pinned note</p>
        <h2>Drop a note here</h2>
        <p className="info-summary">
          Posting at {draftPin.x.toFixed(1)}%, {draftPin.y.toFixed(1)}% on the map.
        </p>
        <textarea
          className="note-textarea"
          value={draftMessage}
          maxLength={280}
          placeholder="Share directions, event info, or a meetup note."
          onChange={(event) => onDraftMessageChange(event.target.value)}
        />
        <div className="note-actions">
          <button type="button" className="action-button primary" onClick={onSubmitDraft}>
            {isSubmittingNote ? 'Posting...' : 'Post note'}
          </button>
          <button type="button" className="action-button secondary" onClick={onCancelDraft}>
            Cancel
          </button>
        </div>
        {noteSubmitError ? <p className="inline-error">{noteSubmitError}</p> : null}
      </aside>
    )
  }

  if (note) {
    return (
      <aside className="info-panel glass-panel">
        <p className="eyebrow">Pinned note</p>
        <h2>Map note</h2>
        <p className="info-summary">{note.message}</p>

        <section className="panel-section">
          <h3>Pin location</h3>
          <p>
            {note.x.toFixed(1)}%, {note.y.toFixed(1)}%
          </p>
        </section>

        <section className="panel-section">
          <h3>Posted</h3>
          <p>{formatTimestamp(note.createdAt)}</p>
        </section>
      </aside>
    )
  }

  if (!region) {
    return (
      <aside className="info-panel glass-panel">
        <p className="eyebrow">Map details</p>
        <h2>Explore or pin the map</h2>
        <p>
          Click a highlighted Duke region to inspect it, or click anywhere else on the map
          to drop a pin and post a note.
        </p>
      </aside>
    )
  }

  return (
    <aside className="info-panel glass-panel">
      <p className="eyebrow">{region.category}</p>
      <h2>{region.name}</h2>
      <p className="info-summary">{region.longDescription}</p>

      <section className="panel-section">
        <h3>Highlights</h3>
        <ul className="panel-list">
          {region.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section className="panel-section">
        <h3>Tags</h3>
        <div className="tag-row">
          {region.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </aside>
  )
}
